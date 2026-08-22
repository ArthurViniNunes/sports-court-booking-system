# 🏟️ QuadraFácil — Sistema de Agendamento de Quadras Esportivas

Projeto full stack desenvolvido pela **Squad 03** no desafio **DFS-2026.2** do programa **Avanti — Atlântico**.

O QuadraFácil centraliza jogadores, quadras, disponibilidade e reservas. O sistema possui autenticação, perfis de acesso, prevenção de conflitos de horário, agenda, perfil do usuário e dashboard administrativo.

## Funcionalidades

### Jogador

- Criar uma conta e autenticar-se.
- Consultar quadras e sua agenda por data.
- Criar e atualizar reservas.
- Consultar suas reservas com paginação e filtros.
- Consultar e atualizar o perfil e alterar a senha.

### Administrador

- Acessar indicadores do dashboard.
- Gerenciar jogadores e quadras.
- Consultar todas as reservas e excluí-las.

## Tecnologias

**Backend:** Node.js, Express 5, Prisma ORM, PostgreSQL, JWT, bcrypt, Helmet e CORS.

**Frontend:** React 19, Vite, Material UI, React Router, Axios, React Big Calendar, Recharts e React Toastify.

**Organização:** monorepo com npm Workspaces; backend em camadas; frontend organizado por páginas, componentes e módulos de domínio.

## Arquitetura

- **Routes:** endpoints, autenticação e autorização.
- **Controllers:** entrada HTTP e respostas.
- **Services:** validações e regras de negócio.
- **Prisma:** persistência no PostgreSQL.
- **Middlewares:** autenticação, autorização e tratamento de erros.

```text
React → API REST/Express → Routes → Controllers → Services → Prisma → PostgreSQL
```

## Modelo de dados

- **Jogador:** dados pessoais, credenciais e perfil administrativo.
- **Quadra:** nome, modalidade e localização.
- **Reserva:** data, início, fim, jogador e quadra.

Uma quadra e um jogador podem possuir várias reservas. A aplicação verifica qualquer interseção de horários antes de criar ou atualizar uma reserva. O banco também impede intervalos idênticos para a mesma quadra e data.

## Pré-requisitos

- Node.js compatível com as dependências do projeto
- npm
- PostgreSQL

## Instalação e configuração

```bash
git clone https://github.com/ArthurViniNunes/sports-court-booking-system.git
cd sports-court-booking-system
npm install
```

Crie `backend/.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/agendamento_quadras"
PORT=3000
BACKEND_URL=http://localhost
JWT_SECRET=substitua-por-uma-chave-segura
```

Opcionalmente, crie `frontend/.env` se a API não estiver em `http://localhost:3000`:

```env
VITE_API_URL=http://localhost:3000
```

Prepare o banco:

```bash
npm run db:migrate --workspace=backend
npm run db:seed --workspace=backend
```

O seed cria usuários, quadras e reservas fictícias. As contas usam a senha `senha123`, inclusive `admin@admin.com` e `admin2@admin.com`. Essas credenciais são apenas para desenvolvimento.

## Execução

Inicie os dois workspaces:

```bash
npm run dev
```

Ou execute-os separadamente:

```bash
npm run dev --workspace=backend
npm run dev --workspace=frontend
```

Por padrão, a API responde em `http://localhost:3000`. Verifique com `GET /health`.

## Autenticação e permissões

O login devolve um JWT válido por um dia. Nas rotas protegidas, envie:

```http
Authorization: Bearer SEU_TOKEN
```

- **Público:** sem token.
- **Autenticado:** token válido.
- **Administrador:** token válido com `isAdmin: true`.

## Rotas da API

### Saúde e autenticação

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/health` | Público | Verifica a API. |
| POST | `/auth/register` | Público | Cadastra um jogador comum. |
| POST | `/auth/login` | Público | Autentica e devolve token e jogador. |

Cadastro:

```json
{
  "nome": "Arthur Nunes",
  "email": "arthur@example.com",
  "telefone": "85999999999",
  "senha": "senha123"
}
```

### Jogadores

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/jogadores` | Administrador | Lista jogadores. |
| GET | `/jogadores/:id` | Autenticado | Busca um jogador. |
| POST | `/jogadores` | Administrador | Cria jogador com senha inicial `123456`. |
| PUT | `/jogadores/:id` | Autenticado | Atualiza nome, e-mail e telefone. |
| PUT | `/jogadores/:id/senha` | Autenticado | Altera a senha. |
| DELETE | `/jogadores/:id` | Autenticado | Exclui um jogador, conforme regras do service. |

Alteração de senha:

```json
{
  "senhaAtual": "senha123",
  "novaSenha": "novaSenhaSegura"
}
```

### Quadras

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/quadras` | Administrador | Cadastra uma quadra. |
| GET | `/quadras` | Autenticado | Lista as quadras. |
| GET | `/quadras/:id` | Autenticado | Busca uma quadra. |
| PUT | `/quadras/:id` | Administrador | Atualiza uma quadra. |
| DELETE | `/quadras/:id` | Administrador | Exclui uma quadra. |

```json
{
  "nome": "Quadra Central",
  "modalidade": "Tênis",
  "localizacao": "Setor A"
}
```

### Reservas

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/reservas` | Autenticado | Cria uma reserva e verifica conflitos. |
| GET | `/reservas` | Administrador | Lista todas as reservas. |
| GET | `/reservas/quadra/:quadraId` | Autenticado | Lista por quadra; aceita `data`. |
| GET | `/reservas/jogador/:jogadorId` | Autenticado | Lista por jogador com paginação e filtros. |
| GET | `/reservas/:id` | Autenticado | Busca uma reserva. |
| PUT | `/reservas/:id` | Autenticado | Atualiza e verifica conflitos. |
| DELETE | `/reservas/:id` | Administrador | Exclui uma reserva. |

```json
{
  "jogadorId": "uuid-do-jogador",
  "quadraId": "uuid-da-quadra",
  "data": "2026-08-25T00:00:00.000Z",
  "horarioInicio": "2026-08-25T18:00:00.000Z",
  "horarioFim": "2026-08-25T19:00:00.000Z"
}
```

Filtros de `GET /reservas/quadra/:quadraId`:

- `data`: data no formato `YYYY-MM-DD`.

Filtros de `GET /reservas/jogador/:jogadorId`:

| Parâmetro | Padrão | Descrição |
|---|---|---|
| `page` | `1` | Página. |
| `limit` | `5` | Registros por página. |
| `quadraId` | — | Quadra. |
| `modalidade` | — | Modalidade. |
| `search` | — | Nome ou modalidade da quadra. |
| `data` | — | Data em `YYYY-MM-DD`. |

Na consulta por quadra, os dados pessoais são mascarados quando o usuário não é dono da reserva nem administrador.

### Dashboard

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/dashboard/stats` | Administrador | Retorna indicadores e séries do dashboard. |

Os indicadores incluem totais, variação mensal, destaques e distribuições por quadra, modalidade, dia da semana e período.

## Estrutura

```text
├── backend
│   ├── prisma
│   └── src
│       ├── controllers
│       ├── database
│       ├── middlewares
│       ├── routes
│       ├── services
│       └── utils
├── frontend
│   ├── public
│   └── src
│       ├── components
│       ├── features
│       ├── pages
│       ├── services
│       └── theme
├── package.json
└── README.md
```

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia os dois workspaces. |
| `npm run lint` | Executa os lints disponíveis. |
| `npm run db:migrate --workspace=backend` | Executa migrations. |
| `npm run db:reset --workspace=backend` | Reinicia o banco. |
| `npm run db:seed --workspace=backend` | Popula dados de demonstração. |
| `npm run build --workspace=frontend` | Compila o frontend. |

## Limitações e próximos passos

- Adicionar testes automatizados e integração contínua.
- Publicar uma especificação OpenAPI.
- Restringir no backend a alteração/exclusão de jogadores ao próprio usuário ou a administradores.
- Restringir no backend a atualização de reservas ao proprietário ou a administradores.
- Não retornar hashes de senha nas consultas de jogadores.
- Aprimorar validação e normalização dos dados.

## Equipe

- [Arthur Vinicius Carneiro Nunes](https://github.com/ArthurViniNunes)
- [Augusto Cesar do Nascimento](https://github.com/SpawNCGK)
- [Francisco Rodrigo Rocha Mota](https://github.com/rodi38)
- [Ana Cecília de Oliveira](https://github.com/anaceciliaa)
- [Jusiê Barbosa da Silva](https://github.com/JusieBarbosa)

## Licença

O repositório não informa uma licença. Consulte a equipe antes de reutilizar o código fora do projeto.
