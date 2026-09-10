# 10. Tjänstesidor är Serverrenderade och Endast Verifierad PostgreSQL-data Indexeras

## Status
Godkänd

## Kontext
ByeScribe är en sökmotordriven guideportal där snabb laddtid, hög tillgänglighet och korrekt indexering är kritiska. Fiktiva demodata från lokal utveckling och automatiserade tester får under inga omständigheter exponeras för sökmotorer eller i produktionssitemaps som verklig konsumentinformation.

## Beslut
1. Tjänstesidor renderas som Server Components med fullständig HTML och JSON-LD structured data.
2. Metadata och robots-direktiv styrs av datakällan:
   - Sidor i fixture-läge (`BYESCRIBE_DATA_SOURCE=fixtures`) får alltid `robots: { index: false, follow: false }` och inkluderas aldrig i sitemap.
   - I PostgreSQL-läge indexeras endast tjänster med `publication_status = 'published'` och `verification_status = 'verified'`.
   - Sökresultatsidan (`/sv/sok`) har alltid `robots: { index: false, follow: true }`.

## Konsekvenser
- **Positivt**: Optimal sökmotoroptimering (SEO) för verifierade guider med fullständigt skydd mot indexering av testdata.
- **Positivt**: Blixtsnabb laddtid och full tillgänglighet på mobila enheter utan tunga klientbuntar.
- **Negativt**: Kräver strikt kontroll av miljövariabler vid driftsättning.
