# 🏟️ Sistema de Agendamento de Quadras Esportivas

Projeto desenvolvido como parte do desafio **DFS-2026.2** do programa Avanti (Atlântico). O objetivo do sistema é facilitar o gerenciamento de agendas de quadras esportivas em bairros, condomínios ou escolas, evitando conflitos de horários e simplificando o processo de reserva.

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** com **Express**
- **Prisma ORM**
- **PostgreSQL** (Banco de dados relacional)

### Frontend
- **ReactJS**

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
Antes de começar, você precisará ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [PostgreSQL](https://www.postgresql.org/) ativo e rodando localmente[cite: 1]

### 1. Configurando o Backend

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz da pasta `backend` e configure as variáveis de ambiente:

   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/agendamento_quadras"
   PORT=3000
   BACKEND_URL=http://localhost
   ```

4. Execute as migrações do banco de dados:

   ```bash
   npx prisma migrate dev
   ```
5. (Opcional) Execute o seed para popular dados fictícios no banco de dados:

   ```bash
   npx prisma migrate dev
   ```
   

6. (Opcional) Abra o Prisma Studio para visualizar o banco:

   ```bash
   npx prisma studio
   ```

7. Inicie o servidor:

   ```bash
   npm run dev
   ```

O backend estará disponível em:

```text
http://localhost:3000
```

---

### 2. Configurando o Frontend

**TO-DO**

---

## 📂 Estrutura do Projeto

```text
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── database
│   │   ├── middlewares
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   ├── prisma
│   └── package.json
└── README.md
```

---

## 🏗️ Arquitetura

O backend segue uma arquitetura em camadas:

- **Routes**: definem os endpoints da API.
- **Controllers**: recebem as requisições HTTP e retornam as respostas.
- **Services**: concentram as regras de negócio da aplicação.
- **Prisma ORM**: responsável pela comunicação com o banco de dados PostgreSQL.
- **Middlewares**: tratamento centralizado de erros e funcionalidades compartilhadas.

Essa separação facilita a manutenção, os testes e a evolução do projeto.

---

## 📡 API

A API segue o padrão REST.

### Usuários

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| POST | `/usuarios` | Cadastra um usuário |
| GET | `/usuarios` | Lista usuários |
| GET | `/usuarios/:id` | Busca um usuário |
| PUT | `/usuarios/:id` | Atualiza um usuário |
| DELETE | `/usuarios/:id` | Remove um usuário |

### Quadras

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | `/quadras` | Lista todas as quadras |
| GET | `/quadras/:id` | Busca uma quadra por ID |



### Reservas

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| POST | `/reservas` | Cadastra uma reserva |
| GET | `/reservas` | Lista todas reservas |
| GET | `/reservas/:quadraId` | Busca todas reservas de uma quadra |
| GET | `/reservas/:id` | Busca uma reserva |
| PUT | `/reservas/:id` | Atualiza uma reserva |
| DELETE | `/reservas/:id` | Remove uma reserva |


**TO-DO**



**TO-DO**

---

## 🧪 Testando a API

Você pode utilizar ferramentas como:

- Postman
- Insomnia
- Thunder Client (VS Code)

---

## 👥 Equipe

Projeto desenvolvido durante o programa **Avanti – Atlântico**, como parte do desafio **DFS-2026.2**.

**Squad 03**:
- [Arthur Vinicius Carneiro Nunes](https://github.com/arthurvininunes)
- [Augusto Cesar do Nascimento](https://github.com/SpawNCGK)
- [Francisco Rodrigo Rocha Mota](https://github.com/rodi38)
- [Ana Cecília de Oliveira](https://github.com/anaceciliaa)
- Alana Silva Sales
- Alice Ralime dos Santos
- Jusiê Barbosa da Silva
