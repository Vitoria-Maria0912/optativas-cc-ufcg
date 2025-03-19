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

### Executar o backend
Para executar o backend siga as etapas contidas no seguinte arquivo: [backend](backend/README.md)
