import { NotFoundError } from "../errors/index.js";
import { Prisma } from "../generated/prisma/client.js";
import { WeekDay } from "../generated/prisma/enums.js";
import { prisma } from "../lib/db.js";

// Data Transfer Object
export interface CreateWorkoutPlanInputDto {
  userId: string;
  name: string;
  workoutDays: Array<{
    name: string;
    weekDay: WeekDay;
    isRest: boolean;
    estimatedDurationInSeconds: number;
    coverImageUrl?: string;
    exercises: Array<{
      order: number;
      name: string;
      sets: number;
      reps: number;
      restTimeInSeconds: number;
    }>;
  }>;
}

export interface CreateWorkoutPlanOutputDto {
  id: string;
  name: string;
  workoutDays: Array<{
    name: string;
    weekDay: WeekDay;
    isRest: boolean;
    estimatedDurationInSeconds: number;
    coverImageUrl?: string;
    exercises: Array<{
      order: number;
      name: string;
      sets: number;
      reps: number;
      restTimeInSeconds: number;
    }>;
  }>;
}

export class CreateWorkoutPlan {
  async execute(
    dto: CreateWorkoutPlanInputDto,
  ): Promise<CreateWorkoutPlanOutputDto> {
    // Transaction - Atomicidade
    return prisma.$transaction(
      async (tx) => {
        await tx.workoutPlan.updateMany({
          where: {
            userId: dto.userId,
            isActive: true,
          },
          data: {
            isActive: false,
          },
        });

        const workoutPlan = await tx.workoutPlan.create({
          data: {
            id: crypto.randomUUID(),
            name: dto.name,
            userId: dto.userId,
            isActive: true,
            workoutDays: {
              create: dto.workoutDays.map((workoutDay) => ({
                name: workoutDay.name,
                weekDay: workoutDay.weekDay,
                isRest: workoutDay.isRest,
                estimatedDurationInSeconds: workoutDay.estimatedDurationInSeconds,
                coverImageUrl: workoutDay.coverImageUrl,
                exercises: {
                  create: workoutDay.exercises.map((exercise) => ({
                    name: exercise.name,
                    order: exercise.order,
                    sets: exercise.sets,
                    reps: exercise.reps,
                    restTimeInSeconds: exercise.restTimeInSeconds,
                  })),
                },
              })),
            },
          },
        });

        const result = await tx.workoutPlan.findUnique({
          where: { id: workoutPlan.id },
          include: {
            workoutDays: {
              include: {
                exercises: true,
              },
            },
          },
        });

        if (!result) {
          throw new NotFoundError("Workout plan not found");
        }

        return {
          id: result.id,
          name: result.name,
          workoutDays: result.workoutDays.map((workoutDay) => ({
            name: workoutDay.name,
            weekDay: workoutDay.weekDay,
            isRest: workoutDay.isRest,
            estimatedDurationInSeconds: workoutDay.estimatedDurationInSeconds,
            coverImageUrl: workoutDay.coverImageUrl ?? undefined,
            exercises: workoutDay.exercises.map((exercise) => ({
              order: exercise.order,
              name: exercise.name,
              sets: exercise.sets,
              reps: exercise.reps,
              restTimeInSeconds: exercise.restTimeInSeconds,
            })),
          })),
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }
}
