# 4. PostgreSQL-sökning före Extern Sökmotor (Algolia/Typesense)

## Status
Godkänd

## Kontext
ByeScribe tillhandahåller sökning över svenska och internationella abonnemangstjänster och deras uppsägningsguider. Katalogen beräknas initialt omfatta hundratals till några tusen tjänster och alias. Att införa en extern söktjänst som Algolia, MeiliSearch eller Typesense i detta skede innebär extra infrastrukturkostnader, synkroniseringskomplexitet och fler felkällor.

## Beslut
Vi implementerar sökningen direkt i PostgreSQL med `pg_trgm`, `unaccent` och deterministisk applikationsranking:
- Tjänster indexeras med B-tree på normaliserade kolumner och GIN-trigram-index (`gin_trgm_ops`) på `name_normalized` och `alias_normalized`.
- Sökningen prioriterar:
  1. Exakt normaliserat tjänstenamn (vikt 100),
  2. Exakt normaliserat alias (vikt 80),
  3. Prefixmatch på tjänstenamn (vikt 60),
  4. Prefixmatch på alias (vikt 50),
  5. Fulltext / ordmatch (vikt 30),
  6. Trigram / fuzzy-likhet (vikt 10).
- All sökinput parameteriseras strikt via Drizzle ORM utan rå SQL-strängkonkatenering.

## Konsekvenser
- **Positivt**: Noll extern infrastruktur; databasen är "single source of truth" utan synkroniseringsfördröjning.
- **Positivt**: Sub-millisekunds svarstider för den förväntade datamängden.
- **Negativt**: Om katalogen expanderar till hundratusentals objekt med avancerad typo-tolerans kan en dedikerad sökmotor utvärderas i ett senare skede.
