SHELL := /bin/bash

create-docker-container:
	docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=cc_ufcg123 -e POSTGRES_USER=vitoria_maria -e POSTGRES_DB=optatives_cc_ufcg postgres

create-podman-container:
	podman run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=cc_ufcg123 -e POSTGRES_USER=vitoria_maria -e POSTGRES_DB=optatives_cc_ufcg postgres

install:
	npm install

run:
	docker-compose down --remove-orphans
	docker-compose up -d
	npm run dev

start-run-postgres:
	docker start postgres
	
prisma:
	npx prisma generate 
	npx prisma migrate dev --name $(name)

build-podman:
	podman build -t backend-code .
	podman run -d --name backend-container --privileged -p 8080:8080 -v $XDG_RUNTIME_DIR/podman/podman.sock:/run/podman/podman.sock backend-code
	podman exec -it backend-container sh

run-podman:
	podman volume create pgdata
	podman run -d \
			--name optatives_cc_ufcg \
			--restart always \
			-p 5432:5432 \
			-e POSTGRES_PASSWORD=cc_ufcg123 \
			-v pgdata:/var/lib/postgresql/data \
			docker.io/library/postgres:latest

access-database:
	psql -U postgres -d optatives_cc_ufcg -h localhost -p 5432
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
