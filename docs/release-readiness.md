# Release Readiness & MVP Hardening Report

Detta dokument sammanfattar den tekniska MVP-statusen för ByeScribe inför databasprovisionering (Supabase), innehållsregistrering och den slutgiltiga designsystemfasen.

---

## 1. Teknisk Status

- **Framework**: Next.js 16.3.4 (App Router, React Server Components som standard)
- **UI & Runtime**: React 19.2.8, Tailwind CSS 4.3.3
- **Internationalisering**: next-intl 4.14.2 (Svenska som primär aktiv locale via `/sv`)
- **Databas & ORM**: Drizzle ORM 0.45.2, PostgreSQL med svensk Fulltext-sökning (FTS) och trigram-index
- **Testsvit**: Vitest 5.0 och Playwright 1.63 (E2E-tester)
- **Byggsystem**: Felfri produktionsbyggnation (`next build`) utan beroende av aktiv `DATABASE_URL`

---

## 2. Verifierade Kommandon

Samtliga följande kommandon körs och valideras utan fel:

```bash
pnpm db:generate       # Drizzle schema verifierat och synkroniserat (9 tabeller)
pnpm lint              # 0 ESLint-fel, 0 varningar
pnpm typecheck         # TypeScript strict compilation utan fel
pnpm test              # Vitest unit/component/brand-tester godkända
pnpm test:e2e          # Playwright E2E-tester godkända
pnpm build             # Next.js 16 production build felfri
pnpm test:smoke        # Produktions-smoke test godkänt
```

---

## 3. Implementerade Routes & HTTP-status

| Route | Typ | HTTP Status | Indexering | Syfte |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Server Redirect | `307` $\rightarrow$ `/sv` | — | Automatisk omdirigering till standardspråk |
| `/sv` | Server Component | `200` | `index, follow` | Startsida med sökfält, verktyg och Summa-CTA |
| `/sv/sok?q=...` | Server Component | `200` | `noindex, follow` | Serverrenderade sökresultat med ren canonical |
| `/sv/tjanster/[slug]` | Server Component | `200` / `404` | `index, follow`* / `noindex` | Tjänsteguide med steg, villkor och källor |
| `/sv/verktyg/besparingskalkylator` | Server + Client | `200` | `index, follow` | Interaktiv besparingskalkylator |
| `/sv/verktyg/uppsagningsmeddelande` | Server + Client | `200` | `index, follow` | In-memory textgenerator för uppsägning |
| `/robots.txt` | Static Route | `200` | — | Tillåter crawling av `/sv/sok` för noindex-upptäckt |
| `/sitemap.xml` | Static/Dynamic | `200` | — | Endast verifierade PostgreSQL-tjänster i prod |

*\* Endast när posten är verifierad PostgreSQL-data (ej demo).*

---

## 4. Datakällor & Fixture-regler

1. **Utveckling & Test (`development` / `test`)**:
   - `BYESCRIBE_DATA_SOURCE=fixtures` stöds och används lokalt.
   - Fixturtjänster märks alltid med visuell demobanner och tvingas till `robots: { index: false, follow: false }`.
2. **Produktion (`production`)**:
   - `BYESCRIBE_DATA_SOURCE=fixtures` är strikt blockerat och kastar `SecurityConfigurationError`.
   - Om `DATABASE_URL` saknas under build returnerar `sitemap.xml` och `FeaturedServices` säkra statiska tomlägen utan att baka in fixturer.

---

## 5. Integritetsgränser (Privacy by Design)

- **100% In-Memory Processing**: Personnamn, kund-/medlemsnummer, kompletterande fritext, önskat avslutsdatum och genererade/redigerade meddelanden stannar uteslutande i webbläsarens minne.
- **Noll Nätverksanrop**: Form-interaktioner och tangenttryckningar skickar inga POST/PUT/PATCH/DELETE-anrop och inga personliga parametrar i URL.
- **Sökfältshjälp**: Sökfältet innehåller tydlig hjälptext mot inmatning av personuppgifter samt automatisk rensning av kontrolltecken och längdbegränsning (max 100 tecken).

---

## 6. Indexerings- & SEO-regler

- `/sv/sok` har alltid `noindex, follow` och en ren canonical (`/sv/sok` utan query-parametrar).
- `robots.txt` disallowar inte `/sv/sok`, vilket säkerställer att sökmotorer kan crawla sidan och registrera dess `noindex`.
- Endast PostgreSQL-tjänster med `publicationStatus === 'published'` och `verificationStatus === 'verified'` inkluderas i sitemap.

---

## 7. URL- & Säkerhetshantering

- **Externa länkar**: Endast giltiga `https://` (och `http://` under dev/test) renderas som länkar. Protokoll som `javascript:`, `data:` och `file:` avvisas.
- **Flaggor**: Alla externa länkar som öppnas i ny flik använder `rel="noopener noreferrer"`.
- **Säkerhetshuvuden**: `next.config.ts` injicerar:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: DENY`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 8. Kända Begränsningar & Ej Verifierad Integration

- **PostgreSQL i Drift**: Databasschemat och migrationerna (0000–0001) är verifierade via Drizzle Kit och typkontroll, men har medvetet ännu inte applicerats mot en extern live Supabase/PostgreSQL-instans.
- **Innehåll**: Inga verkliga konsumentuppgifter finns inlagda; databasen förblir tom och väntar på verifierad datainmatning.

---

## 9. Design Freeze efter Designfas 5

Med Designfas 5 avslutad är gränssnittet, designsystemet, tokens, navigationsstrukturen och integritetsmönstren frysta.

### Vad kommande Supabase- och innehållsfaser FÅR ändra:
- Verkliga tjänsteguider, texter, steg och metadata i databasen.
- Verifierade källor, länkar, priser och villkor.
- Tjänstespecifika fält och slug-definitioner.
- Volym av publicerade tjänster.
- Den slutgiltiga logotypen (som ersätter det temporära typografiska ordmärket utan att ändra navigationsstrukturen).

### Vad kommande faser INTE får ändra utan ett nytt designbeslut:
- Globala design tokens (`src/styles/tokens.css`).
- Typografisk skala, grotesque-styling och casing-regler.
- Global navigation och layout-containrar.
- Formulärarkitektur och in-memory integritetsgarantier (inga nätverksanrop från textgeneratorn).
- Sökalgoritmens deterministiska ranking och säkerhetsfiltrering.
- Heltalsberäkningar för valuta i minor units (stöd för SEK, EUR, USD, GBP, NOK, DKK utan extern växelkurskonvertering).
- Signal Color- och grain-regler.
- Svartvit knapphierarki.
- Locale routing (`/sv` som primär svensk locale) och säker canonical/robots-hantering.

