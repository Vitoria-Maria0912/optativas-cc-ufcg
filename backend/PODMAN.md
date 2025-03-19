# Backend Development with Podman and Prisma

Este projeto utiliza Podman para gerenciar containers e Prisma para interagir com o banco de dados PostgreSQL.

## Configuração e Execução

### Construção da Imagem

**Execute o comando abaixo para construir a imagem do backend:**

```sh
podman build -t backend-code .
```

### Execução do Container Backend

```sh
podman run -d --name backend-container --privileged -p 8080:8080 -v $XDG_RUNTIME_DIR/podman/podman.sock:/run/podman/podman.sock backend-code
```

**Para acessar o container em execução:**

```sh
podman exec -it backend-container sh
```

### Configuração do Banco de Dados PostgreSQL

**Criação do volume para persistência de dados:**

```sh
podman volume create pgdata
```

**Execução do container PostgreSQL:**

```sh
podman run -d \
  --name optatives_cc_ufcg \
  --restart always \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=cc_ufcg123 \
  -v pgdata:/var/lib/postgresql/data \
  docker.io/library/postgres:latest
```

### Configuração do Prisma

**Geração dos artefatos do Prisma:**

```sh
npx prisma generate
```

**Aplicação das migrações ao banco de dados:**

```sh
npx prisma migrate dev
```

Agora o ambiente está configurado e pronto para uso!

**Execute o projeto:**

```sh
npm run start
```

**Execute todos os testes:**

```sh
npm run test
```

**Execute os testes por entidade:**

- ### *User*
```sh
make discipline-tests 
```
- ### *Login*
```sh
make login-tests
```
- ### *Discipline*
```sh
make discipline-tests
```

