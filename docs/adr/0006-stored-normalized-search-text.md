# 6. Lagrad Normaliserad Söktext i Explicita Kolumner

## Status
Godkänd

## Kontext
Svensk text innehåller specialtecken (å, ä, ö) samt skiftande skiftläge och mellanslag. Indexering på databasfunktioner eller uttryck som inte är garanterat `IMMUTABLE` i PostgreSQL (t.ex. konfigurationsberoende `unaccent`) kan leda till indexkorruption eller opålitliga sökresultat vid versionsuppgraderingar.

## Beslut
Vi lagrar normaliserade versioner av sökbara strängar i explicita kolumner (`name_normalized` och `alias_normalized`):
- Normaliseringen beräknas deterministiskt i applikationslagret vid datalagring via `normalizeSearchText()`.
- Texten trimmas, multipla blanksteg slås ihop, kontrolltecken rensas och strängen konverteras till gemener.
- Standard-B-tree- och GIN-trigramindex appliceras direkt på dessa normaliserade lagrade kolumner.
- Originaltexten bevaras intakt i `name` och `alias` för korrekt presentation.

## Konsekvenser
- **Positivt**: Helt deterministisk indexering utan osäkerhet kring PostgreSQL-uttrycks immutabilitet.
- **Positivt**: Enkel och förutsägbar testbarhet i både PostgreSQL- och Fixture-adaptern.
- **Negativt**: Kräver marginellt mer lagringsutrymme (en extra textkolumn per namn/alias).
