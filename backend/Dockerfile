FROM node:18

RUN apt-get update && apt-get install -y podman python3-pip pipx && \
	pipx install podman-compose

CMD ["sh", "-c", "export PATH=$PATH:/root/.local/bin && podman-compose up -d && until nc -z db 5432; do sleep 1; done && npm run dev"]

WORKDIR /app

COPY . .

RUN npm install

RUN chmod +x /app/docker-compose.yml

CMD ["sleep", "infinity"]

