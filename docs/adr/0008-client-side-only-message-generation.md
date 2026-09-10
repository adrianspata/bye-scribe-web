# 8. Personliga Uppsägningsmeddelanden Genereras Uteslutande i Webbläsaren

## Status
Godkänd

## Kontext
För att säga upp vissa tjänster behöver användaren skapa ett skriftligt uppsägningsmeddelande som innehåller känsliga personuppgifter såsom fullständigt namn, medlemsnummer, kundnummer eller personnummer. Om dessa uppgifter skickas till servern för textrendering uppstår compliance-krav enligt GDPR kring loggning, datalagring, kryptering och dataläckagerisker.

## Beslut
All sammanställning av personliga uppsägningsmeddelanden sker till 100 % lokalt i webbläsarens minne (Client Component):
- Inga Server Actions, API-anrop, URL-parametrar eller serverloggar tar emot användarens inmatade uppgifter.
- Textmallen renderas och redigeras direkt i minnet i webbläsaren.
- Inga personuppgifter sparas i `localStorage`, `sessionStorage` eller cookies.
- En tydlig integritetsförklaring visas direkt intill formuläret.

## Konsekvenser
- **Positivt**: Noll risk för dataläckage av personliga kunduppgifter på ByeScribes servrar.
- **Positivt**: Enkel och transparent efterlevnad av GDPR och dataminimeringsprincipen.
- **Negativt**: Användaren kan inte spara utkast på servern mellan sessioner.
