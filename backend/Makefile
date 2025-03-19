install:
	npm install

run:
	docker-compose down --remove-orphans
	docker-compose up -d
	npm run dev

prisma:
	npx prisma generate 
	npx prisma migrate dev --name $(name)

test-all:
	npm run test

discipline-tests:
	npm run test tests/DisciplineTest.test.ts

user-tests:
	npm run test tests/UserTest.test.ts

login-tests:
	npm run test tests/LoginTest.test.ts
