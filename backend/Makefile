SHELL := /bin/bash

install:
	npm install

run:
	docker-compose down --remove-orphans
	docker-compose up -d
	npm run dev

prisma:
	npx prisma generate 
	npx prisma migrate dev --name $(name)

# TEST COMMANDS
setup-tests:
	set -o allexport; source .env.test; set +o allexport; \
	docker compose down db_tests --remove-orphans; \
	docker compose up -d db_tests; \
	npx prisma generate; \
	npx prisma migrate dev

test-all:
	set -o allexport; source .env.test; set +o allexport; \
	npm run test

discipline-tests:
	set -o allexport; source .env.test; set +o allexport; \
	npm run test tests/DisciplineTest.test.ts

user-tests:
	set -o allexport; source .env.test; set +o allexport; \
	npm run test tests/UserTest.test.ts

login-tests:
	set -o allexport; source .env.test; set +o allexport; \
	npm run test tests/LoginTest.test.ts
