# Repository Guidelines

## Project Structure & Module Organization
`src/index.ts` boots the Fastify server, Swagger/Scalar docs, CORS, and Better Auth. Keep HTTP handlers in `src/routes`, business logic in `src/usecases`, validation schemas in `src/schemas`, shared infrastructure in `src/lib`, and custom errors in `src/errors`. Prisma schema changes belong in `prisma/schema.prisma`; generated client files in `src/generated/prisma` are build artifacts and should not be edited by hand. Local PostgreSQL lives in `docker-compose.yml`.

## Build, Test, and Development Commands
Use `docker compose up -d postgres` to start the local Postgres 16 instance on `localhost:5432`. Run `pnpm dev` for the API with live reload on port `3000`. After changing the Prisma schema, run `pnpm exec prisma generate`, then `pnpm exec prisma migrate dev` to create and apply a local migration. Before opening a PR, run `pnpm exec tsc --noEmit` for strict type-checking and `pnpm exec eslint .` for linting and import ordering.

## Coding Style & Naming Conventions
This repository uses strict TypeScript with ESM (`"type": "module"`) and NodeNext resolution. Follow the existing 2-space indentation and keep local imports using `.js` extensions inside `.ts` files. Use `camelCase` for variables and functions, `PascalCase` for classes and use cases such as `CreateWorkoutPlan`, and kebab-case for route filenames such as `workout-plan.ts`. ESLint enforces `simple-import-sort`; Prettier compatibility is handled through `eslint-config-prettier`.

## Testing Guidelines
No automated test runner or coverage gate is committed yet. Until one is added, treat `pnpm exec tsc --noEmit`, `pnpm exec eslint .`, and manual API verification as the minimum check set. Exercise changed endpoints through `/docs`, `/swagger.json`, or direct requests such as `POST /workout-plans`. When adding tests, keep names aligned with the target module, for example `CreateWorkoutPlan.test.ts`, and place them near the feature or under a dedicated `tests/` directory.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commit prefixes like `feat:` and `chore:`. Keep commits focused and imperative, for example `feat: add workout plan validation`. Pull requests should summarize behavior changes, note schema or environment updates, and list the commands you ran. For API changes, include sample requests/responses or screenshots from `/docs`.

## Security & Configuration Tips
Configuration is loaded through `dotenv`. Set `DATABASE_URL` for Prisma and `PORT` when you need something other than `3000`. Keep local frontend origin settings aligned with the hard-coded `http://localhost:3000` values used by CORS and Better Auth.
