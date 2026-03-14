.PHONY: env-ensure db-up db-down db-reset db-wait setup dev-full lint build

env-ensure:
	node scripts/ensure-env.mjs

db-up:
	node scripts/compose.mjs up -d

db-down:
	node scripts/compose.mjs down

db-reset:
	node scripts/compose.mjs down -v

db-wait:
	node scripts/wait-for-db.mjs

setup:
	node scripts/ensure-env.mjs
	node scripts/wait-for-db.mjs
	npm run prisma:generate
	npm run prisma:migrate:deploy
	npm run prisma:seed

dev-full:
	node scripts/ensure-env.mjs
	node scripts/compose.mjs up -d
	node scripts/wait-for-db.mjs
	npm run prisma:generate
	npm run prisma:migrate:deploy
	npm run prisma:seed
	npm run dev

lint:
	npm run lint

build:
	npm run build -- --webpack
