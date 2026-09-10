# 5. Repository-interface med PostgreSQL- och Fixture-adapter

## Status
Godkänd

## Kontext
För lokal utveckling, CI-byggen och enhetstester är det avgörande att applikationen kan köras och byggas deterministiskt utan krav på en aktiv PostgreSQL-databasanslutning. Samtidigt får produktion aldrig tyst falla tillbaka på testdata och presentera fiktiv information för användare.

## Beslut
Vi definierar ett formellt `ServiceRepository`-interface och två konkreta implementationer:
1. `PostgresServiceRepository`: Använder Drizzle ORM och PostgreSQL via en lazy anslutning.
2. `FixtureServiceRepository`: Använder fiktiva, typade in-memory testfixtures för lokal utveckling och automatiserade tester.

Adaptervalet styrs explicit via miljövariabeln `BYESCRIBE_DATA_SOURCE` (`fixtures` eller `postgres`):
- I lokal utveckling och automatiserade tester används in-memory-fixturer för snabb exekvering utan extern databas.
- I produktion (`NODE_ENV=production`) är `fixtures` strikt förbjudet. Om `BYESCRIBE_DATA_SOURCE=fixtures` eller om databasen inte är konfigurerad kastas ett kontrollerat säkerhetsfel vid runtime.
- Byggsteget (`next build`) kan köras fristående utan aktiv databas.

## Konsekvenser
- **Positivt**: Snabb lokal utveckling och pålitliga enhetstester oberoende av nätverk och databasservrar.
- **Positivt**: Strikt säkerhetsspärr mot att testdata exponeras i produktionsmiljö.
- **Negativt**: Kräver att eventuella nya metoder i repository-kontraktet implementeras och underhålls i båda adaptrarna.
