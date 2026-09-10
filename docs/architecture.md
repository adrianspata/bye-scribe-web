# ByeScribe Arkitektur & Datalager

Detta dokument beskriver ByeScribes systemarkitektur, databasmodell, sökfunktionalitet, verktyg och ansvarsfördelning.

---

## 1. Övergripande Principer
1. **Server Components som standard**: Sidor och guider körs på servern för maximal SEO-prestanda, tillgänglighet och snabb sidladdning utan klient-JS.
2. **Explicit Locale Routing**: Svenska (`/sv`) är bas-locale via `next-intl`.
3. **Repository-mönster**: All dataåtkomst abstraheras bakom `ServiceRepository` med separata PostgreSQL- och Fixture-adaptrar.
4. **Klientintegritet för Personliga Verktyg**: Uppsägningsmeddelanden och kalkyler körs till 100 % i webbläsarens minne. Inga personuppgifter skickas till eller sparas på servern.
5. **Säker Databas- och Build-strategi**: `next build` fungerar utan aktiv databas genom kontrollerade neutrala tomlägen utan att baka in fiktiva testdata.

---

## 2. Applikationsrutter & Server/Client Boundaries

| Rutt | Typ | Beskrivning & Säkerhetsgräns |
| :--- | :--- | :--- |
| `/sv` | Server Component | Startsida med sökfält, demo/populära guider och verktygslänkar. |
| `/sv/sok?q=...` | Server Component | Sökresultatsida med deterministisk ranking. Alltid `noindex, follow`. |
| `/sv/tjanster/[slug]` | Server Component | Detaljerad tjänsteguide med verifierade steg, källor, villkor och Summa-CTA. Endast verifierad Postgres-data indexeras. |
| `/sv/verktyg/besparingskalkylator` | Hybrid (Server shell + Client calc) | Interaktiv kalkylator i heltalsöre med 1- och 5-årsbesparing. |
| `/sv/verktyg/uppsagningsmeddelande` | Hybrid (Server shell + Client form) | Personligt meddelandeutkast. **Noll nätverksanrop, 100 % i webbläsarens minne.** |

---

## 3. Databasmodell (Drizzle ORM & PostgreSQL)

Schemat omfattar 9 tabeller och 9 enums:

| Tabell | Primärnyckel | Beskrivning | Relationer / Delete-regler |
| :--- | :--- | :--- | :--- |
| `categories` | `varchar(64)` | Huvudkategorier med unik `slug`. | RESTRICT vid radering om tjänster finns. |
| `services` | `varchar(64)` | Tjänsteregister med `search_document tsvector`, status och villkor. | Refererar `categories(id)`. |
| `service_aliases` | `varchar(64)` | Alternativa söknamn och stavningar. | Refererar `services(id)` (CASCADE). |
| `source_references` | `varchar(64)` | Verifierade källor (allmänna villkor, hjälpsidor). | Refererar `services(id)` (CASCADE). |
| `cancellation_steps` | `varchar(64)` | Steg-för-steg-instruktioner länkade till källor. | Refererar `services(id)` (CASCADE) och `source_references(id)` (SET NULL). |
| `service_prices` | `varchar(64)` | Prisplaner i heltalsöre (`amount_minor >= 0`). | Refererar `services(id)` (CASCADE) och `source_references(id)` (SET NULL). |
| `message_templates` | `varchar(64)` | Mallar för meddelanden per kanal och språk. | Unik `(key, locale)`. Inga personuppgifter. |
| `feedback_submissions` | `varchar(64)` | Användarfeedback med modereringsstatus. | Refererar `services(id)` (CASCADE). |
| `service_requests` | `varchar(64)` | Förfrågningar om nya tjänster. | Fristående tabell för moderering. |

---

## 4. Sökarkitektur & Rankingalgoritm

Sökningen sker med deterministisk ranking i följande prioriteringsordning:
1. **Exakt normaliserat tjänstenamn** (`Score: 100`)
2. **Exakt normaliserat alias** (`Score: 80`)
3. **Prefixmatch på tjänstenamn** (`Score: 60`)
4. **Prefixmatch på alias** (`Score: 50`)
5. **Fulltext / delordsmatchning** (`Score: 30`): PostgreSQL `tsvector` med svensk ordbok (namn vikt A, sammanfattning vikt B).
6. **Fuzzy / trigram-matchning** (`Score: 10`): `pg_trgm` tolerans för stavfel och accentvariationer.

- **Tie-break**: `Score DESC` → `nameNormalized ASC` (binär kodpunktsordning) → `serviceId ASC`.

---

## 5. Sparande- & Datumlogik
- **Pengar**: Beräknas uteslutande i heltalsöre (`parseSEKToMinor`, `calculateSavings`, `formatMoneySEK`).
- **Uppsägningsdatum**: `calculateRecommendedNoticeDate` hanterar kalenderdagar, kalendermånader (inklusive månadsslut som 31 mars -> 28/29 februari och skottår) utan tidszonsdrift.

---

## 6. Summa-CTA Konfiguration
- Kontextuella varianter: `homepage`, `service_detail`, `savings_calculator`, `cancellation_message`.
- Läser och validerar `NEXT_PUBLIC_SUMMA_APP_STORE_URL`. Vid ogiltig/saknad URL renderas ett neutralt textblock utan trasiga länkar.
