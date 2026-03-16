Core commands for this repo:
- docker compose up -d postgres: start local PostgreSQL 16
- pnpm dev: run the Fastify API with tsx watch mode
- pnpm exec prisma generate: regenerate Prisma client after schema edits
- pnpm exec prisma migrate dev: create/apply local migrations
- pnpm exec tsc --noEmit: strict typecheck
- pnpm exec eslint .: lint the repo and enforce import sorting