# Runbook: Databasmigreringar & Supabase Anslutningsarkitektur

Denna runbook beskriver hur PostgreSQL och Supabase hanteras för ByeScribe, skillnaden mellan anslutningssträngar, säkerhetsregler och hur migrationer appliceras i staging och produktion.

---

## 1. Anslutningssträngar & Arkitektur

ByeScribe skiljer strikt mellan **Runtime** och **Migrationer**:

| Variabel | Port & Typ | Protokoll & Läge | Syfte & Begränsningar |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Port `6543` | Supabase Transaction Pooler (Supavisor) | **Serverless runtime för Next.js Server Components / API routes.** Använder `max: 1`, `ssl: 'require'`, och `prepare: false`. Stöder ej DDL eller session-locks. |
| `DATABASE_MIGRATION_URL` | Port `5432` | Supabase Direct Connection / Session Pooler | **Endast för migreringar (`pnpm db:migrate`) och DDL.** Körs som `postgres.[PROJECT-REF]` på session pooler eller direktanslutning. |

### Varför Transaction Pooler i Runtime?
Next.js Serverless Functions skalar upp dynamiskt och skapar många kortlivade processer. Supabase Transaction Pooler delar en liten pool av faktiska databasanslutningar mellan tusentals funktioner. Transaction pooler stöder dock inte prepared statements på anslutningsnivå, vilket kräver `prepare: false` i `postgres.js`.

### Varför Direct Connection / Session Pooler vid Migrering?
DDL-operationer (`CREATE TABLE`, `CREATE INDEX`, `ALTER TABLE`, transaktionella migrationer) kräver sessionslås och fullständigt PostgreSQL-protokollstöd. Därför **måste** alla migrationer köras mot `DATABASE_MIGRATION_URL` på port 5432.

### IPv4-kompatibilitet via Session Pooler
Nya Supabase-projekt tilldelas enbart IPv6 för direktanslutningen (`db.[PROJECT-REF].supabase.co`). För klientmiljöer och nätverk utan lokal IPv6-defaultrutt används **Session Pooler på port 5432** (`aws-[0/1]-[region].pooler.supabase.com:5432`) med användarnamn `postgres.[PROJECT-REF]`.

---

## 2. SSL-krav
Samtliga anslutningar (både runtime och migration) **kräver SSL**:
- `ssl: 'require'` i `postgres.js` options.
- `?sslmode=require` i URL-parametrar.
- Anslutningar utan SSL avvisas av Supabase.

---

## 3. Hur nästa migration skapas och appliceras

ByeScribe tillämpar en strikt **framåtriktad migrationshistorik**:
* Ändra aldrig existerande migrationsfiler (`0000_clammy_lockheed.sql` eller `0001_thin_leader.sql`).
* Alla ändringar ska ske via nya framåtriktade migrationer.

### Steg för att skapa och applicera en ny migration:
1. **Uppdatera schemat**: Redigera `src/db/schema/index.ts`.
2. **Generera migration**:
   ```bash
   pnpm db:generate
   ```
   Detta skapar nästa migrationsfil (t.ex. `drizzle/0002_*.sql`) och uppdaterar `drizzle/meta/_journal.json`.
3. **Granska den genererade SQL-filen**: Kontrollera att DDL är korrekt, att foreign keys har rätt delete-regler, och att inga destruktiva `DROP`-satser genererats oavsiktligt.
4. **Kör migrationen mot staging**:
   ```bash
   pnpm db:migrate
   ```
5. **Kör integrationstesterna**:
   ```bash
   npx tsx --env-file=.env.local src/test/postgres-integration.test.ts
   npx tsx --env-file=.env.local src/test/smoke-verification.ts
   ```

---

## 4. Lösenordsrotation i Supabase

Om databaslösenordet behöver roteras:
1. Gå till **Supabase Dashboard -> Project Settings -> Database -> Database password -> Reset database password**.
2. Ange ett nytt starkt alfanumeriskt lösenord (undvik oenkodade specialtecken som `#`, `@`, `:`, `/`, `%`).
3. Uppdatera `.env.local` i utvecklingsmiljön (och motsvarande miljövariabler i Vercel/driftsmiljön):
   * `DATABASE_URL` (byt ut lösenordet i pooler-URL:en)
   * `DATABASE_MIGRATION_URL` (byt ut lösenordet i migrations-URL:en)
4. Verifiera med:
   ```bash
   npx tsx --env-file=.env.local src/test/smoke-verification.ts
   ```

---

## 5. Innehållsstatus & Miljögränser

- **Staging är tomt på verkliga tjänstedata**: Databasen innehåller efter Designfas 6 ett komplett, synkroniserat och verifierat schema (9 tabeller, 9 enums, svensk FTS, triggers och trigram-index), men **inga verkliga konsumenttjänster**.
- **Staging är ej Produktionsprovisionering**: Produktionsmiljön ska konfigureras i ett separat, isolerat Supabase-projekt med egna unika credentials och oberoende migrationskörning.
