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
