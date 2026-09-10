# 9. Heltalsöre för Ekonomiska Beräkningar i Kalkylatorn

## Status
Godkänd

## Kontext
Binära flyttal (IEEE-754) i JavaScript kan orsaka avrundningsfel vid multiplikation och addition av valutabelopp (t.ex. `19.99 * 100 = 1998.9999999999998`). I en sparandekalkylator och prismall måste beräkningar på månads-, års- och femårsbasis vara deterministiska och öreskorrekta.

## Beslut
Vi använder heltalsöre (`amountMinor` i integer) för all intern representation och beräkning:
- Inmatade strängar parsas säkert via `parseSEKToMinor()` som separerar heltal och decimaler utan flyttalsmultiplikation.
- Både punkt (`.`) och komma (`,`) stöds som decimalavgränsare.
- Beräkningar för 1 år (`* 12`) och 5 år (`* 60`) utförs med heltalsaritmetik.
- Formatering till svenskt valutaformat sker via `formatMoneySEK()` med `Intl.NumberFormat('sv-SE')`.

## Konsekvenser
- **Positivt**: Helt deterministiska beräkningar utan flyttalsavvikelser.
- **Positivt**: Enhetlighet mellan databasens lagringsmodell (`amount_minor integer`) och applikationslagret.
- **Negativt**: Kräver explicit konvertering till och från heltalsöre i in- och utdata.
