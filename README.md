# ByeScribe

**The easier way to unsubscribe.**

ByeScribe hjälper svenska konsumenter att hitta verifierade instruktioner, mallar och kontaktvägar för att säga upp abonnemang och spara pengar. Webbplatsen utför aldrig uppsägningar automatiskt.

## Teknisk Stack
- **Framework**: Next.js 16 (App Router med React Server Components)
- **UI & Styling**: Tailwind CSS 4 med semantiska design tokens (`Guided Clarity`)
- **Internationalisering**: `next-intl` (svenska `/sv` aktiv)
- **Databas & ORM**: PostgreSQL via Drizzle ORM och `postgres.js`
- **Validering**: Zod
- **Tester**: Vitest (jsdom + Testing Library) och Playwright (E2E)

---

## Snabbstart

### 1. Installera beroenden
```bash
pnpm install
```

### 2. Miljövariabler
Kopiera `.env.example` till `.env.local`:
```bash
cp .env.example .env.local
```

I lokal utveckling används `BYESCRIBE_DATA_SOURCE=fixtures` som standard, vilket innebär att ingen lokal PostgreSQL-databas krävs för att köra eller bygga appen.

### 3. Starta utvecklingsservern
```bash
pnpm dev
```
Öppna [http://localhost:3000](http://localhost:3000) (omdirigeras automatiskt till `/sv`).

---

## Skript & Kommandon

| Kommando | Beskrivning |
| :--- | :--- |
| `pnpm dev` | Startar utvecklingsservern |
| `pnpm build` | Bygger produktionspaketet (Next.js Turbopack) |
| `pnpm lint` | Kör ESLint |
| `pnpm typecheck` | Kör TypeScript-typkontroll (`tsc --noEmit`) |
| `pnpm test` | Kör enhetstester med Vitest |
| `pnpm test:watch` | Kör Vitest i interaktivt watch-läge |
| `pnpm test:e2e` | Kör Playwright E2E-tester |
| `pnpm test:smoke` | Kör produktions-smoke test mot `next start` |
| `pnpm db:generate` | Genererar SQL-migrationer från Drizzle-schemat |
| `pnpm db:migrate` | Applicerar migrationer mot ansluten PostgreSQL-databas |

---

## Databas & Datakällor

Applikationen använder ett repository-mönster (`ServiceRepository`) med två adaptrar:
1. **Fixture-adapter** (`BYESCRIBE_DATA_SOURCE=fixtures`): In-memory fiktiva tjänster för lokal utveckling och CI.
2. **PostgreSQL-adapter** (`BYESCRIBE_DATA_SOURCE=postgres`): Drizzle ORM mot PostgreSQL/Supabase.

För detaljerad arkitekturbeskrivning och designsystem, se:
- [docs/architecture.md](docs/architecture.md)
- [docs/runbook-migrations.md](docs/runbook-migrations.md)
- [docs/design-system.md](docs/design-system.md)
- [docs/release-readiness.md](docs/release-readiness.md)
- [docs/adr/](docs/adr/)

