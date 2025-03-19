# Backend

## Passos para Rodar o Projeto

Para executar o projeto utilizando o podman, siga o tutorial contido [aqui](backend/README.md)

1. **Clone o Repositório**

   Primeiro, você precisará clonar o repositório do projeto. Execute o seguinte comando:
   ```bash
   git clone https://github.com/Vitoria-Maria0912/optativas-cc-ufcg.git
   ```
   **Entre no diretório backend:**

   ```sh
   cd backend/
   ```
   
2. **Instale as Dependências**

   ```bash
   npm install
   ```

3. **Configuração do Prisma**

   Certifique-se de que você tenha um arquivo `.env` configurado com as credenciais do banco de dados. Um exemplo de configuração pode ser:

   ```env
   DATABASE_URL="postgresql://postgres:cc_ufcg123@localhost:5432/optatives_cc_ufcg?schema=public"
   ```

4. **Migrate o Banco de Dados**

   Após a configuração, você precisa aplicar as migrações do Prisma. Execute o seguinte comando:

   ```bash
   npx prisma migrate dev --name init
   ```

   Isso criará as tabelas necessárias no banco de dados com base no seu esquema Prisma.

5. **Rodar a Aplicação**

   Agora, você pode iniciar a aplicação. Execute:

   ```bash
   npm run dev
   ```

   Isso iniciará o servidor em modo de desenvolvimento. Você poderá acessar a aplicação em `http://localhost:8080`.

## Executando o backend com o podman
Para executar o backend com podman siga as etapas contidas no seguinte arquivo: [podman](PODMAN.md)


## Executanto os testes

### Máquinas Linux
Primeiro rode o comando para fazer o setup dos testes:
```sh
make setup-tests
```

Depois execute os testes em si:
```sh
make test-all
```

### Máquinas Windows
Primeiro rode o comando para fazer o setup dos testes:
```sh
.\setup-tests.bat
```

Depois execute os testes em si:
```sh
.\run-tests.bat
```

### Execução dos Testes


```sh
make user-tests
```

```sh
make login-tests
```

```sh
make discipline-tests
```
