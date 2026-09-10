# 7. Ingen Personlig Uppsägningsinformation Lagras i Tjänstedatabasen

## Status
Godkänd

## Kontext
ByeScribe är en öppen informationsresurs som hjälper konsumenter att själva avsluta sina abonnemang. Webbplatsen utför aldrig uppsägningar åt användaren och kräver inte användarkonton eller registrering för att läsa instruktioner.

## Beslut
Tjänstedatabasen utformas strikt enligt principen om dataminimering (GDPR):
- Tabellerna `services`, `cancellation_steps`, `service_prices` och `message_templates` innehåller uteslutande publik verifierad information och generiska textmallar.
- Mallarna (`message_templates`) använder platshållare (`[Förnamn Efternamn]`, `[Personnummer / Kundnummer]`) som fylls i lokalt i användarens webbläsare vid kopiering.
- Inga personnummer, kontouppgifter, namn eller ifyllda uppsägningsmeddelanden sparas på servern eller i databasen.
- `feedback_submissions` och `service_requests` samlar endast generiska utfall och tjänstenamn, inte personuppgifter.

## Konsekvenser
- **Positivt**: Drastiskt minskad säkerhetsrisk och förenklad GDPR-efterlevnad.
- **Positivt**: Bygger maximalt förtroende hos konsumenter och tillsynsmyndigheter.
- **Negativt**: Användare kan inte spara personliga uppsägningshistoriker på webbplatsen (vilket hanteras i Summa-appen istället).
