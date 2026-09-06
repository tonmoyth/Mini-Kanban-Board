# Mini Kanban Board

## Tech Stack
Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL
Frontend: Next.js, TypeScript, Tailwind CSS

## Run with Docker (recommended)

1. Clone the repo
2. Run: `docker compose up --build`
3. Frontend: http://localhost:3000
4. Backend API: http://localhost:5000/api/v1

## Environment Variables
See `.env.example` in both `Mini_Kanban_Board_Server/` and `mini_kanban_board_client/`.
Docker Compose already sets these automatically — no manual .env setup needed to run via Docker.

## Manual setup (without Docker)

### Prerequisites
- Node.js 20+
- PostgreSQL 16+ running locally (or a cloud instance like Neon/Supabase)

### 1. Backend setup

```bash
cd Mini_Kanban_Board_Server
npm install

# copy the example env file and fill in your own values
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/kanban_db?schema=public
JWT_SECRET_KEY=your-own-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

Run migrations and generate Prisma client:
```bash
npm run generate
npm run migrate
```

Start the backend:
```bash
npm run dev
```

Backend will be running at `http://localhost:5000/api/v1`.

### 2. Frontend setup

Open a new terminal:

```bash
cd mini_kanban_board_client
npm install

cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

Start the frontend:
```bash
npm run dev
```

Frontend will be running at `http://localhost:3000`.

### 3. Verify it's working

- Open `http://localhost:3000`
- Register a new account, log in
- Create a board, add tasks, and try drag-and-drop between columns

## Project Structure