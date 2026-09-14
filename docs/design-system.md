# ByeScribe Design System — Designfas 2.2

Detta dokument beskriver det visuella designsystemet, tokensystemet, temahanteringen, materialiteten, Signal Color-arkitekturen, grundkomponenterna och informationsarkitekturen för ByeScribe.

**Produktnamn:** ByeScribe  
**Tagline:** The easier way to unsubscribe.  
**Designkoncept:** Guided Clarity with Signal Color  

---

## 1. Guided Clarity with Signal Color

ByeScribe hjälper människor att ta kontroll över sina återkommande abonnemangsutgifter genom att eliminera mental friktion och osäkerhet kring uppsägningar.

*Guided Clarity with Signal Color* vidareutvecklar designkonceptet genom att kombinera en lugn, varm och neutral redaktionell grund med disciplinerade "Signal Color"-ögonblick:
- **85–90 % Neutral yta och struktur:** Varm off-white canvas, rena kortytor, balanserade grafitgrå borders och skarp typografi. Vanliga instruktioner, källor, juridiska villkor och formulär förblir helt neutrala.
- **10–15 % Signal Color & Materialitet:** Signalfärg koncentreras till ett fåtal avsiktliga ytor (framför allt Hero-motivet "Så går du till väga", interaktiva verktyg och Summa-samarbetet) för att markera progression, riktning och redaktionell identitet.
- **Funktion före dekoration:** Status och viktig information förmedlas aldrig enbart genom färg; text och semantiska markörer bär alltid det primära budskapet.

---

## 2. ElevenLabs som principiell webbreferens

ElevenLabs webbplats har använts som en kvalitativ referens för gränssnittsdisciplin, materialitet och visuell hierarki.

### Vad ByeScribe lånar som princip:
1. **Färgdisciplin:** Återhållsam användning av starka accenter mot en dominerande neutral grund.
2. **Materialitet & Grain:** Subtil texturering och mjuka övergångar som ger djup och närvaro utan att störa textläsbarheten.
3. **Stora typografiska ytor & luft:** Balanserad spatiell rytm med generösa mellanrum och tydlig redaktionell hierarki.
4. **Återhållsam motion:** Lågmälda och långsamma ambienta loopar som skapar liv utan att distrahera användaren från uppgiften.

### Vad ByeScribe uttryckligen INTE kopierar:
- **Inga 3D-sfärer, svävande AI-objekt eller CGI-renderingar.**
- **Inga AI-buzzwords, generiska SaaS-dashboards eller flytande produktmockups.**
- **Inga kopierade typsnitt, texturer, gradientfiler eller färgkoder från referensen.**
- **Inga bento grids utan funktionellt innehåll.**
- **Inga förhastade mega-menyer eller tomma produktkategorier.**

---

## 3. Neutralitets- och färgfördelning

Gränssnittet upprätthåller en strikt fördelning baserad på visuell yta och användningsfrekvens:
- **Neutral bas (85–90 %):** Sökfält, formulär, kalkylator, instruktionstext, tabeller, källhänvisningar och layoutramar.
- **Signal Color (10–15 %):** Desktop-herons högra motivyta, subtila hörnövergångar på interaktiva verktyg och Summa-samarbetets kontextuella yta.

---

## 4. Signal Color-palett & Semantiska Tokens

Signal Color-paletten består uteslutande av tre harmoniska toner: **Cobalt**, **Cyan** och **Violet**. Funktionella statusfärger (t.ex. kritisk röd/korall eller positiv grön) hålls strikt åtskilda från dekorativa signalytor.

### Semantiska Tokens

| Token | Light Mode | Dark Mode | Syfte |
| :--- | :--- | :--- | :--- |
| `--signal-blue` | `#1d4ed8` (Kobolt) | `#38bdf8` (Ljus kobolt) | Huvudsignal & vägledningslinje |
| `--signal-cyan` | `#0284c7` | `#06b6d4` | Sekundär signalövertoning |
| `--signal-violet` | `#7c3aed` (Mjuk lavendel) | `#a78bfa` | Tertiär signalbrytning |
| `--signal-surface` | Radial gradient (8 % opacitet) | Radial gradient (12 % opacitet) | Sammansatt signalgradientyta |
| `--signal-surface-subtle` | `rgba(29, 78, 216, 0.035)` | `rgba(56, 189, 248, 0.05)` | Lågmäld kant- eller bakgrundsaccent |
| `--signal-grain-opacity` | `0.08` (8 %) | `0.06` (6 %) | Statisk texturoverlay |
| `--signal-overlay` | `rgba(250, 250, 249, 0.70)` | `rgba(11, 15, 23, 0.75)` | Kontrastoverlay för text |
| `--signal-text-contrast` | `#0c1117` | `#f8fafc` | Text ovanpå signalytor |

---

## 5. Grain och materialitet

ByeScribes grain är en **lokal, central och cachebar SVG-textur** placerad på:
`public/textures/signal-noise.svg`

### Tekniska egenskaper:
- **Statisk feTurbulence-filter:** `type="fractalNoise"`, `baseFrequency="0.8"`, `numOctaves="3"`, `stitchTiles="stitch"`.
- **Noll externa nätverksanrop:** Laddas lokalt från samma domän utan tredjepartstrackers eller externa CDN:er.
- **Filstorlek:** Under 350 bytes.
- **Prestanda:** Grainlagret är strikt statiskt och återskapas/animeras aldrig under körning.
- **Tillgänglighet:** Lagret är rent dekorativt (`aria-hidden="true"`, pointer-events-none) och försämrar inte textkontrasten.

---

## 6. SignalField-komponenten

Komponenten `SignalField` (`src/components/visual/signal-field.tsx`) kapslar in signalgradienter, statisk grain och kontrastkontroll.

### Varianter:
1. **`path`:** Används i Hero-motivet på startsidan (*Så går du till väga*). Integrerar mjuka radiala färgfält (kobolt/cyan/lavendel) med optimal kontrast mot processtegen.
2. **`tool`:** Används för interaktiva verktyg (Besparingskalkylator, Uppsägningsmeddelande) med en diskret accentuering.
3. **`editorial`:** Används för redaktionella läsytor och framtida guider.
4. **`summa`:** Används i Summa CTA för att markera det privatekonomiska samarbetet.

### Egenskaper:
- **Helt statisk som standard.**
- Stöd för valfri `ambientMotion` (se avsnitt 7).
- Dekorativa bakgrundslager har alltid `aria-hidden="true"` medan text och interaktiva element inuti förblir 100 % tillgängliga för skärmläsare.
- Stödjer Light och Dark mode helt automatiskt via CSS-variabler.

---

## 7. Regler för ambient motion & reduced-motion

1. **Maximalt en ambient rörelse på startsidan:** Rörelsen är strikt kopplad till Hero-motivet (`HeroPathMotif`).
2. **Endast transform och opacitet på överskalat lager:** Animationen använder `transform: translate3d(...) scale(...)` och `opacity` i en 18 sekunders långsam CSS-loop (`@keyframes ambient-signal-drift`).
3. **Förbud mot kontinuerligt animerad blur, filter eller background-position:** Inga tunga GPU- eller CPU-drivna filterloopar är tillåtna.
4. **Prefers-reduced-motion:** Vid användarinställning om minskad rörelse (`prefers-reduced-motion: reduce`) stängs den ambienta loopen av omedelbart (`animation: none !important; transform: none !important;`).
5. **Jämförelse statisk vs animerad:** Den animerade gradienten är utformad så subtil att den tillför taktilitet och djup utan att dra blicken från sidans primära handling (sökfältet).

---

## 8. Knappar & CTA-hierarki

Knappsystemet använder semantiska variabler (`--color-btn-*`) och prioriterar högkontrast och redaktionell elegans framför generisk SaaS-blå färg.

### Semantiska Knapp-tokens:

| Variant | Light Mode | Dark Mode | Egenskap |
| :--- | :--- | :--- | :--- |
| **Primary** | Bg: `#0c1117`, Text: `#ffffff` | Bg: `#f8fafc`, Text: `#0b0f17` | Högkontrast monokrom redaktionell yta, använd på Sökknapp och huvudsakliga åtgärder |
| **Secondary** | Bg: `#ffffff`, Text: `#0c1117`, Border: `#cfceca` | Bg: `#141c2a`, Text: `#f8fafc`, Border: `#334155` | Neutral kort- eller kontrollerad border-knapp |
| **Quiet** | Bg: Transparent, Text: `#404854` | Bg: Transparent, Text: `#cbd5e1` | Lågmäld textknapp för sekundära val |
| **Destructive** | Bg: `#b91c1c`, Text: `#ffffff` | Bg: `#dc2626`, Text: `#ffffff` | Funktionell röd yta för borttagning / avbrytande |

- **Touch target:** Alla knappar har minst 44px träffyta (`min-h-[44px]`).
- **Fokusring:** Tydlig 2px fokusring med 2px offset (`:focus-visible`).

---

## 9. Typografisk kalibrering

- **H1 (Hero-rubrik):** `text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]`. Ger redaktionell auktoritet och lugn med optimal radbrytning på svenska sammansatta ord.
- **Ingress:** `text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-2xl`.
- **Varumärkestagline:** `The easier way to unsubscribe.` behålls som en lågmäld rad med en diskret signalprick (`bg-[var(--color-accent)]`), inte en skrikande uppercase-eyebrow.
- **Tabular Numbers:** `.tabular-nums` (`font-variant-numeric: tabular-nums`) för alla belopp, datum och besparingssiffror.

---

## 10. Regler för redaktionella ytor och formulär

- **Ingen grain på:**
  - Vanlig brödtext och läsartiklar.
  - Formulärfält (`Input`, `Textarea`, `Select`).
  - Felmeddelanden och valideringsrutor.
  - Juridiska villkor och integritetsmeddelanden.
  - Källistor och steg-för-steg-instruktioner.
- **Kort vid hover:** Endast 1–2 px vertikal förflyttning (`hover:translate-x-0.5` eller `hover:shadow-raised`), 150–250 ms mjuk transition. Ingen 3D-tilt, glow eller överdriven skalning.

---

## 11. När dropdown eller mega-menu får introduceras

ByeScribe behåller en minimalistisk och direkt navigation (Start, Sök, Kalkylator, Uppsägningsmeddelande).

En större dropdown eller mega-menu **får först introduceras** när det finns faktiska, funktionella destinationer och redaktionellt innehåll inom minst två av följande områden:
1. **`ByeScribe Guides`** (kategoriserade guider inom Streaming, Gym, Försäkring, Telekom etc.).
2. **`ByeScribe Assistant`** (interaktiva verktyg och guidade ärendehanterare).
3. **`ByeScribe for Business`** (företagsabonnemang och SaaS-avtal).
4. **`ByeScribe × Summa`** (integrerade privatekonomiska funktioner).

Att införa tomma menyer eller inaktiva platshållare enbart för att efterlikna komplexa SaaS-webbplatser är strikt förbjudet.

---

## 12. Tillgänglighet & Kontrastredovisning

Alla färgpar har kontrollerats och uppfyller eller överträffar WCAG 2.1 AA (minst 4.5:1 för normaltext, 3:1 för storgrafik och kontroller) och flertalet når WCAG AAA (minst 7:1):

### Faktiskt uppmätta färgpar:

| Färgpar | Light Mode Värden | Light Kontrast | Dark Mode Värden | Dark Kontrast | WCAG Nivå |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Huvudtext mot Page** | `#0c1117` mot `#fafaf9` | **18.0:1** | `#f8fafc` mot `#0b0f17` | **18.1:1** | WCAG AAA |
| **Dämpad text mot Page** | `#404854` mot `#fafaf9` | **8.6:1** | `#cbd5e1` mot `#0b0f17` | **12.7:1** | WCAG AAA |
| **Subtil text mot Surface** | `#5c6573` mot `#ffffff` | **5.7:1** | `#94a3b8` mot `#141c2a` | **6.7:1** | WCAG AA |
| **Primärknapp text mot bg** | `#ffffff` mot `#0c1117` | **18.7:1** | `#0b0f17` mot `#f8fafc` | **18.1:1** | WCAG AAA |
| **Sekundärknapp text mot bg**| `#0c1117` mot `#ffffff` | **18.7:1** | `#f8fafc` mot `#141c2a` | **16.4:1** | WCAG AAA |
| **Destruktiv text mot bg** | `#ffffff` mot `#b91c1c` | **5.9:1** | `#ffffff` mot `#dc2626` | **5.0:1** | WCAG AA |
| **Text mot SignalField (ljus)**| `#0c1117` mot `#f0f4fe` | **16.5:1** | `#f8fafc` mot `#1a2b42` | **12.2:1** | WCAG AAA |
| **Text mot SignalField (mörk)**| `#0c1117` mot `#e8effe` | **15.8:1** | `#f8fafc` mot `#131f33` | **14.9:1** | WCAG AAA |

---

## 13. Sökresultatsidans arkitektur (`/sv/sok`)

Sökresultatsidan fungerar som en fokuserad och snabb arbetsyta.

### Informationsstruktur:
1. **Kompakt sidhuvud:** H1: `Sök efter en uppsägningsguide` och saklig ingress. Ingen stor marknadsföringshero eller dekorativ gradient.
2. **Sökfält:** Samma `SearchBar` och valideringsregler som startsidan (`max 100` tecken, trimning, avvisning av kontrolltecken, `aria-describedby` kopplat till integritetsvägledning).
3. **Validering och felhantering:**
   - Ogiltig eller överlång query avvisas innan repository-anrop och visar hjälpsamt tomläge (`invalid_query`).
   - Oväntade fel (SQL-, schema-, mappningsfel) fångas **inte** upp som neutrala tomma resultat utan bubblar upp till Next.js error boundary.
   - Tekniska fel och databasuppgifter exponeras aldrig för slutanvändaren.
4. **Resultaträknare:** Saklig text (`1 guide hittades för “...”`, `X guider hittades för “...”`, `Inga guider hittades`). Inga överdrivna badges.
5. **Resultatlista (`SearchResultItem`):**
   - Öppen redaktionell lista med diskreta ytor och linjeavgränsningar.
   - Visar: tjänstenamn, kategori, kort sammanfattning, eventuellt matchat alias (endast om `result.matchedAlias` uttryckligen finns i kontraktet), länk `Visa uppsägningsguiden`.
   - Inga rankingpoäng, inga färgade statusbadges per rad, inga gradienter per kort.
   - Hover: maximalt 1–2 px pilförflyttning (`group-hover:translate-x-0.5`) och mjuk kantaccent.
6. **Tomlägen (`SearchEmptyState`):**
   - *Tom sökfras:* Uppmaning att ange tjänstens namn.
   - *Inga träffar:* Konstruktiva råd (kontrollera stavning, prova kortare namn) samt diskreta genvägar till ByeScribes verktyg (Kalkylator, Uppsägningsmeddelande).
7. **Kommersiell återhållsamhet:** Ingen full `ContextualSummaCta` på söksidan för att hålla sidans fokus 100 % på sökning och val av guide.

---

## 14. Tjänsteguidens arkitektur (`/sv/tjanster/[slug]`)

Tjänsteguiden presenterar verifierade eller demonstrativa uppsägningsvillkor på ett sakligt och läsbart sätt.

### Informationsstruktur:
1. **Kontextuell länk:** `Tillbaka till sökning` i toppen.
2. **Guidehuvud (`ServiceGuideHeader`):**
   - Sidans enda H1: `Säg upp [tjänstens namn]`.
   - Kategori och eventuellt juridiskt bolagsnamn.
   - Tydlig upplysning: `Uppsägningen genomförs hos leverantören.`
   - Max ett diskret SignalField-moment (`variant="editorial"`).
   - *Demomarkering:* Fixture-tjänster visar alltid `Lokal demo – informationen är inte en verkligt verifierad tjänsteguide.`. Fixture-statusen `verified` presenteras aldrig som en extern verifiering.
   - *Stale-status:* Om `verificationStatus: stale` visas en tydlig varning om att guiden är i behov av ny granskning utan gröna verifieringsstämplar.
3. **Snabböversikt (`ServiceFacts`):**
   - Visar primär uppsägningskanal och uppsägningstid.
   - Saknade värden visar `Uppgift saknas` eller utelämnas.
   - Priser placeras inte i snabbfakta för att undvika missvisande komprimering av flerdimensionella villkor.
4. **Officiell uppsägningsåtgärd (`OfficialCancellationAction`):**
   - `officialCancellationUrl` ger en neutral primärknapp `Gå till [tjänstens namn]` med säkerhetsnotis (`Du lämnar ByeScribe och genomför uppsägningen hos leverantören.`).
   - `websiteUrl` (om cancellation URL saknas) ger en sekundär länk märkt `Besök [tjänstens namn]s webbplats`.
   - Öppnas i ny flik med `noopener noreferrer` och tillgänglig informationstext.
5. **Uppsägningssteg (`CancellationSteps`):**
   - Semantisk `<ol>`, strikt sorterad efter `position`.
   - Guided Clarity-motiv: sammanhängande vertikal linje, numrerade noder, stegrubrik, instruktionstext och validerad källänk.
   - Inga checkboxar eller progress state i denna fas.
6. **Villkor och bekräftelse (`ServiceTermsSection`):**
   - Redaktionell presentation av bindningstider och bekräftelsekrav.
7. **Kända prisplaner (`ServicePricesSection`):**
   - Separat sektion som återger faktiska prisplaner med heltalsöre (`formatMoneySEK`), intervall och giltighetsdatum (`validFrom`, `validTo`).
8. **Källor (`SourceList`):**
   - Öppen lista: källtitel, källtyp, åtkomstdatum (`retrievedAt`), verifieringsdatum (`verifiedAt` om satt), säker extern länk.
   - Inga påhittade organisationer eller domänhärledningar.
9. **Relaterade verktyg (`ServiceToolsSection`):**
   - Säkert förifyllt `?service=[tjänstens namn]` till Uppsägningsmeddelande och länk till Besparingskalkylator.
10. **Summa-samarbete (`ContextualSummaCta context="service_detail"`):**
    - Placerad efter guiden och verktygen.
11. **In-page navigation (`ServiceInPageNav`):**
    - Renderas endast på desktop (`hidden lg:block`) om minst 3 icke-tomma sektioner faktiskt existerar.
    - Byggd direkt på sidans filtrerade sektionsmodell utan klient-JavaScript eller scrollspy.
12. **Ansvarsbegränsning:**
    - Saklig redaktionell fotnot om oberoende och användarens eget avtal med leverantören.

---

## 15. SEO, Indexering & Metadata

- **Sökresultatsidan (`/sv/sok`):**
  - Alltid `robots: { index: false, follow: true }`.
  - Ren canonical `/sv/sok` utan query-parametrar.
  - Sökfraser läcker inte till canonical.
  - Sidan ingår inte i sitemap.
- **Tjänsteguider (`/sv/tjanster/[slug]`):**
  - Fixtures och demoguider har alltid `robots: { index: false, follow: false }`.
  - Endast `published + verified + PostgreSQL`-tjänster blir indexerbara.
  - Ren canonical `/sv/tjanster/[slug]`.
  - Okänd slug ger strikt 404 (`notFound()`).

---

## 16. Integritet & Nätverkssäkerhet

- Inga personuppgifter efterfrågas på sök- eller tjänstesidorna.
- Inga formulär interagerar med servern via POST/PUT/PATCH/DELETE eller Server Actions.
- Tjänstenamn i URL:er (`?service=...`) valideras, trimmas och längdbegränsas till 100 tecken och rensas från kontrolltecken.
- Externa länkar har alltid `rel="noopener noreferrer"`.

---

## 17. Designsystemets Anti-Patterns för Guider

1. **Inga falska garantier:** Inga gröna stämplar som påstår att en uppsägning är "garanterad", "omedelbar" eller "automatisk".
2. **Inga syntetiska data:** Inga påhittade granskningsdatum, organisationer eller priser för att fylla ut layouten.
3. **Ingen färgöverdos:** Max 1 större SignalField-ögonblick per guide. Inga färgade gradienter bakom varje steg eller källa.
4. **Inga falska uppsägnings-CTA:er:** En generell webbplats-URL får aldrig presenteras som en direkt uppsägningslänk.
5. **Inga tomma ankarlänkar:** Innehållsnavigationen får aldrig länka till tomma eller dolda sektioner.

---

## 18. Verktygssidornas arkitektur & Gemensamma mönster

Verktygen är utformade som lugna, precisa och redaktionella arbetsytor – inte som generiska SaaS-formulärkort eller tunga fler-stegs-guider.

### Gemensam struktur:
1. **`ToolPageHeader` (`src/features/tools/components/tool-page-header.tsx`):**
   - Konsekvent navigationslänk `Tillbaka till start` (`/sv`).
   - Kategori-eyebrow (`VERKTYG & KALKYLATORER` / `VERKTYG & MALLAR`).
   - Sidans enda `<h1>`.
   - Ingress med tydligt uppgiftsfokus.
2. **Interaktiv arbetsyta:**
   - Klientstyrd via React-state.
   - Ingen session lagras på servern.
3. **Vägledande nästa steg:**
   - Två tydliga kort för vidare navigation till relaterade guider eller verktyg.
4. **Kontextuell Summa CTA (`ContextualSummaCta`):**
   - Strukturellt placerad efter verktyget, helt frikopplad från personformulärets klientträd.
   - Tar aldrig emot personuppgifter eller kalkylerade belopp.
5. **Ansvarsbegränsning:**
   - Tydlig redaktionell fotnot om oberoende och användarens eget avtal med leverantören.

---

## 19. Besparingskalkylatorns interaktionsmodell (`/sv/verktyg/besparingskalkylator`)

Besparingskalkylatorn beräknar uppskattade ackumulerade kostnader vid avslutade abonnemang.

### Principer & Disciplin:
- **Transparensnotis:** `InlineNotice variant="information"` informerar om att beräkningen är en uppskattning baserad på det angivna beloppet.
- **Formulärinmatning:**
  - `inputMode="decimal"` och `autoComplete="off"`.
  - Högerställd `kr`-suffix i fältet.
  - Stöd för både punkt (`.`) och komma (`,`) som decimaltecken via `parseSEKToMinor`.
  - Exakt heltalsmatematik i ören via `calculateSavings`.
- **Resultatvisning (`SavingsResult`):**
  - Text och siffror placerade på en opak kortyta (`bg-[var(--color-surface-raised)]`) med bevarad WCAG AAA-kontrast.
  - SignalField (`variant="tool"`) ligger som ett separat dekorativt bakgrundslager (`aria-hidden="true"`).
  - Typsnittsinställning `tabular-nums` för alla belopp.
  - Tydliga benämningar: `Möjlig besparing per månad`, `Uppskattning på 1 år`, `Uppskattning på 5 år`.
  - Ingen felaktig garanti: "Beräkningen baseras på oförändrat pris och avser en uppskattad potentiell besparing, inte ett garanterat resultat."
- **Formulär-submit:**
  - `onSubmit` kör `preventDefault` och uppdaterar det lokala tillståndet.
  - Primärknapp har `type="submit"`.

---

## 20. Uppsägningsmeddelandets lokala integritetsarkitektur (`/sv/verktyg/uppsagningsmeddelande`)

Uppsägningsmeddelandet genererar ett redigerbart textutkast helt i användarens webbläsare.

### Integritetsgarantier & Dataskydd:
- **Noll nätverkstrafik:** Inga `fetch`, `XMLHttpRequest`, `navigator.sendBeacon`, WebSocket eller Server Actions kopplas till formuläret.
- **Noll webbläsarlagring:** Inga personuppgifter skrivs till `localStorage`, `sessionStorage`, `IndexedDB` eller cookies.
- **Autocomplete-strategi:** `autoComplete="off"` applicerat på samtliga fält (`customerName`, `customerId`, `customNote`, `serviceName`).
- **Integritetsbanner:** Informerar användaren innan fälten om att data stannar i webbläsaren och raderas när fliken stängs.

### Formulärfält & Mallkontrakt:
Endast befintliga fält grupperas semantiskt med `<fieldset>` och `<legend>`:
1. `<fieldset>` 1. Om tjänsten: Tjänstens namn (`serviceName`), Meddelandetyp (`templateType`), Önskat avslutsdatum (`endDate`).
2. `<fieldset>` 2. Dina uppgifter: För- och efternamn (`customerName`), Kund-/medlemsnummer (`customerId`).
3. `<fieldset>` 3. Kompletterande information: Övriga önskemål (`customNote` med teckenräknare).

---

## 21. Kopiering, Urklippsfallback & Statusåterkoppling

Kopieringsfunktionen är robust, säker och tillgänglig:

1. **Clipboard API i första hand:**
   - Använder `navigator.clipboard.writeText(...)` om tillgängligt.
2. **Tillgänglig och säker fallback:**
   - Skapar **inga** temporära dolda DOM-element (inga osynliga textareas eller kloner av personuppgifter).
   - Vid nekad eller saknad Clipboard API behålls texten i den redan synliga utkast-textarean `#generated-output`.
   - Textarean fokuseras och markeras (`select()`) endast efter användarens avsiktliga klick.
   - Visar tydlig instruktion: `Markera texten och kopiera manuellt (Ctrl+C / Cmd+C)`.
3. **Statusåterkoppling:**
   - Differentiell status (`copied`, `manual`, `idle`).
   - Textuell status och ikon, annonserad via `aria-live="polite"` (`#copy-status-live`).
   - Färg används inte som enda signal.
   - Timeout-timers (4 sekunder) städas upp vid unmount för att undvika minnesläckor.

---

## 22. Designsystemets Anti-Patterns för Verktyg

1. **Inga icke-existerande formulärfält:** Lägg inte till fält (t.ex. telefonnummer, adress, e-post till mottagare) som inte ingår i mallkontraktet.
2. **Ingen klienthärledning av slugs:** Härled aldrig slug från tjänstens namn och gör inget klientanrop till repositoryt. Vid återlänkning från meddelandeverktyget länkas alltid till `/sv/sok?q=[validerat namn]` eller ren söksida.
3. **Ingen återställningsknapp med hög risk:** Lägg inte till en reset-knapp om den inte finns, och låt den aldrig aktiveras oavsiktligt eller ligga nära kopieringsknappen.
4. **Ingen personuppgiftsöverföring till tredjepart:** Skicka aldrig personuppgifter, genererade utkast eller kalkylbelopp till Summa CTA eller URL-parametrar.
5. **Ingen SignalField bakom oskyddad text:** SignalField får inte ligga direkt bakom resultattext utan ett stabilt, opak kontrastlager.

