# Interface para facilitar o planejamento de disciplinas optativas no curso de Ciência da Computação da UFCG

Este projeto visa facilitar o planejamento de disciplinas do curso de Ciência da Computação da UFCG, permitindo a visualização de disciplinas obrigatórias e optativas, incluindo informações como disponibilidade de professores e requisitos. Administradores podem gerenciar o catálogo de disciplinas por meio de funcionalidades de CRUD.

## Tecnologias utilizadas:

### Backend
- Typescript
- Node.js
- Docker
- Postgres
- Prisma
- JWT

### Frontend
- Express
- React

### Documentação
- Swagger

### Padrões de commit

Para manter um histórico claro e consistente, siga os padrões de commits abaixo baseados no Conventional Commits:

- `feat`: adicionar funcionalidade
- `wip`: funcionalidade em desenvolvimento
- `fix`: corrigir bug
- `refactor`: refatorar código
- `test`: adicionar teste
- `docs`: adicionar documentação
- `perf`: melhorar desempenho
- `style`: melhorar estilo de código
- `build`: alterações na estrutura do projeto
- `chore`: alterações em pacotes, dependências
- `ci`: alterações de integração contínua

## Funcionalidades disponíveis:
- Realizar login no sistema
- Realizar CRUD de disciplinas (restrito ao administrador)
- Visualizar disciplinas obrigatórias e optativas existentes (professor, disponibilidade, pré-requisitos, pós-requisitos)
- Criar planejamento de disciplinas

### Passos para Rodar o Projeto

Para executar o projeto utilizando o podman, siga o tutorial contido [aqui](backend/README.md)

1. **Clone o Repositório**

   Primeiro, você precisará clonar o repositório do projeto. Execute o seguinte comando:

   ```bash
   git clone https://github.com/Vitoria-Maria0912/optativas-cc-ufcg.git
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
