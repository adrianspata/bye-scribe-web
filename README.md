## ByeScribe

### 1. Install dependencies
```bash
pnpm install
```

### 2. Environmental variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

In local development, `BYESCRIBE_DATA_SOURCE=fixtures` is used by default, meaning no local PostgreSQL database is required to run or build the app.

### 3. Start the development server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) (automatically redirected to `/sv`).

---

## Scripts & Commands

| Commands | Description |
| :--- | :--- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Building the production package (Next.js Turbopack) |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript-type verification (`tsc --noEmit`) |
| `pnpm test` | Run unit tests with Vitest |
| `pnpm test:watch` | Run Vitest in interactive watch mode |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm test:smoke` | Run a production smoke test against `next start` |
| `pnpm db:generate` | Generates SQL migrations from the Drizzle schema. |
| `pnpm db:migrate` | Applies migrations to the connected PostgreSQL database. |

---

## Database & Data Sources

The application uses a repository pattern (`ServiceRepository`) with two adapters:
1. **Fixture adapter** (`BYESCRIBE_DATA_SOURCE=fixtures`): In-memory mock services for local development and CI.
2. **PostgreSQL adapter** (`BYESCRIBE_DATA_SOURCE=postgres`): Drizzle ORM with PostgreSQL/Supabase.

For a detailed architectural description and design system, see:
- [docs/architecture.md](docs/architecture.md)
- [docs/runbook-migrations.md](docs/runbook-migrations.md)
- [docs/design-system.md](docs/design-system.md)
- [docs/release-readiness.md](docs/release-readiness.md)
- [docs/adr/](docs/adr/)
