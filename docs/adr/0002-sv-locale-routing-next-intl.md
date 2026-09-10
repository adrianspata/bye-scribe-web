# 2. Svensk Locale-routing (/sv) från Start via next-intl

## Status
Godkänd

## Kontext
ByeScribe lanseras initialt uteslutande för den svenska marknaden med svenskt innehåll. Samtidigt planeras framtida expansion till fler nordiska marknader (Norge `no`, Danmark `da`) och engelska (`en`). Att införa locale-prefix i efterhand skapar risk för trasiga URL:er och SEO-förluster.

## Beslut
Vi inför explicit locale-routing med `next-intl` från dag ett under `src/app/[locale]`:
- Svenska (`sv`) är den enda aktiva lokalen initialt.
- Rot-URL:en `/` omdirigerar automatiskt till `/sv` via `src/proxy.ts`.
- Okända språkkoder (t.ex. `/de`, `/fr`) och ogiltiga sökvägar valideras strikt och resulterar i en HTTP 404, utan tysta fallbacks eller redirect-loopar.
- Routing definieras i `src/i18n/routing.ts` och separeras från navigationshjälpare i `src/i18n/navigation.ts`.
- Framtida språkkoder hålls förberedda i dokumentation och arkitektur men aktiveras inte i TypeScript-typer förrän de stöds fullt ut.

## Konsekvenser
- **Positivt**: Konsekvent URL-struktur (`/sv/spotify` etc.) från start utan behov av framtida URL-migreringar eller 301-redirect-kedjor.
- **Positivt**: Enhetlig hantering av översättningar via `src/messages/sv.json`.
- **Negativt**: Kräver routing-middleware/proxy och parametrering i App Router.
