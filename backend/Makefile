install:
	npm install

run:
	docker-compose down --remove-orphans
	docker-compose up -d
	npm run dev

migrate:
	npx prisma migrate dev --name $(name)

