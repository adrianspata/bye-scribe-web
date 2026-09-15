# ByeScribe Design System — Designfas 4.1: Visuell förenkling (Fuse × ElevenLabs)

Detta dokument beskriver det visuella designsystemet, tokensystemet, temahanteringen, materialiteten, Signal Color-arkitekturen, grundkomponenterna och informationsarkitekturen för ByeScribe efter genomförd visuell förenkling enligt Designfas 4.1.

**Produktnamn:** ByeScribe  
**Tagline:** The easier way to unsubscribe.  
**Designkoncept:** Guided Clarity with Signal Color (Fuse × ElevenLabs Calibration)  

---

## 1. Mål & Arkitektonisk Vision

ByeScribes gränssnitt är utformat så att användaren omedelbart förstår fyra kärnaspekter:
1. **ByeScribe hjälper mig säga upp abonnemang.**
2. **Jag kan söka efter en uppsägningsguide.**
3. **Jag kan skapa ett uppsägningsutkast.**
4. **Jag kan räkna på möjlig besparing.**

Designen är centrerad, enkel, minimalistisk och materiellt genomarbetad.

### Referensernas roller:
- **Från Fuse:** Centrerad hero, korta och konkreta budskap, tydlig primär handling, stora sammanhängande visuella ytor, begränsad navigation, generöst men kontrollerat tomrum.
- **Från ElevenLabs:** Varmvit och mörkgrå grund, svartvita knappar, grainy gradienter, mjuka färgövergångar, varierade kortkompositioner, diskreta borders och skuggor.

---

## 2. Layout, Centrering och Läsbredd

Gränssnittet tillämpar en disciplinerad centrerad layout utan att kompromissa med läsbarheten för strukturerad text:

- **Global container (`PageContainer`):** Cirka 1120–1152 px (`max-w-[var(--spacing-container-max)]` med `mx-auto`).
- **Hero-yta:** Centrerad komposition (maxbredd ~720–800 px).
- **Sökfält:** Centrerat placerat direkt efter ingressen (maxbredd ~560–680 px).
- **Läsande innehåll:** Cirka 60–65ch (`max-w-2xl` eller `max-w-[var(--spacing-reading-max)]`).

### Centreringsregler:
- **Centreras:** Startsidans hero, korta sektionsintroduktioner, avslutande sammanfattningar.
- **Vänsterställs:** Formulärfält, integritetshjälp, feltexter, uppsägningssteg, källhänvisningar, juridiska villkor och kortens beskrivningar.
- `text-center` appliceras aldrig globalt på `PageContainer`.

## 3. Typografi & Inga All-caps

- **Typsnitt:** `KMR Melange Grotesk` (sans-serif) och `General Grotesque Mono` (monospejs), laddade lokalt som WOFF2.
- **Rubriker (H1, H2, H3, etc.):** Använder `font-normal` (`font-weight: 400`) för en minimalistisk, elegant och ren grotesque-typografi.
- **H1 (Hero):** `text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-0.02em] leading-[1.1]`.
- **H2 & H3:** `font-normal tracking-tight`.
- **Formulärfält & Focus:** Inputfält, textarea och select har ingen blå ring/outline vid focus, utan visar samma rena mörkgrå linje som vid hover (`border-[var(--color-border-strong)] hover:border-[var(--color-text-muted)] focus:border-[var(--color-text-muted)]`).
- **Ingress:** `text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-xl`.
- **Ingen All-caps:** Användarsynlig uppercase-styling är strikt borttagen (`text-transform: none`). Alla rubriker, kategorier och badges använder normal svensk meningskapitalisering (undantaget etablerade förkortningar som SEK och API).
- **Tabular Numbers:** `.tabular-nums` (`font-variant-numeric: tabular-nums`) för alla belopp, datum och stegnummer.

---

## 4. Navigation & Informationshierarki

Huvudnavigationen är komprimerad till de mest centrala destinationerna:

1. **Ordmärket `ByeScribe`:** Länkar till startsidan (`/sv`). En separat "Start"-textlänk utelämnas för att undvika redundans.
2. **`Guider`:** Länkar till sök- och guidekatalogen (`/sv/sok`).
3. **`Skriv uppsägning`:** Länkar direkt till meddelandeverktyget (`/sv/verktyg/uppsagningsmeddelande`).
4. **`Räkna besparing`:** Länkar direkt till kalkylatorn (`/sv/verktyg/besparingskalkylator`).

### Mobilmeny:
- Stängs med Escape och återför fokus till hamburgarknappen.
- Har minst 44 px touch-targets (`min-h-[44px]`).
- Stängs automatiskt vid val av destination.
- Bevarar full tangentbords- och skärmläsartillgänglighet.

---

## 5. Färgade Ikoner & Svartvita Knappar

För att upprätthålla en tydlig hierarki utan visuell överlastning tillämpas följande regler:

### Ikonpalett & Färghierarki:
- **Guider & Sökning:** Cobalt / Cyan (`#0284c7` i light, `#38bdf8` i dark).
- **Uppsägningsutkast / Meddelande:** Violet / Lavendel (`#7c3aed` i light, `#a78bfa` i dark).
- **Besparing & Kalkylator:** Dämpad Teal / Grön (`#0d9488` i light, `#2dd4bf` i dark).

Färg appliceras uteslutande på ett fåtal utvalda funktionella symboler och illustrationer, aldrig på varje liten ikon.

### Svartvita Knappar:
- **Primärknapp:** Bg `#0c1117`, text `#ffffff` (light) / Bg `#f8fafc`, text `#0b0f17` (dark).
- **Sekundärknapp:** Neutral border och subtil interaktiv yta.
- **Stegnummer (1, 2, 3):** Alltid monokroma (svartvit cirkel med tabular-nums).

---

## 6. Grainy Gradienter & Materialitet

Signalytor använder kontrollerade grain-gradienter med en lokal, statisk SVG-textur (`/textures/signal-noise.svg`):

### Färgfamiljer:
- **Release:** Lavendel, rosa och varm orange (används i meddelandeverktygets visuella kort och processteg 2).
- **Guidance:** Isblå, cyan och violet (används i kalkylatorns visuella kort, sök och processteg 1).
- **Completion:** Dimgrå blå och dämpad grön/teal (används i processteg 3).
- **Summa:** Kontextuell signalgradientyta för privatekonomiskt samarbete.

### Regler för applicering:
- **Appliceras på:** Verktygskortens visuella ovandel, processteg och Summa-kortet.
- **Appliceras ALDRIG på:** Sökresultatlistan, formulärfält (`input`, `textarea`, `select`), källhänvisningar, juridiska villkor eller felmeddelanden.

---

## 7. Kort & Hörnradier

- **Stora visuella kort:** 20–24 px hörnradie (`rounded-[var(--radius-card-visual)]` = 22px / `1.375rem`), subtil border och lågmäld skugga (`shadow-subtle`).
- **Funktionella formulärkort:** Balanserade standardradier (`rounded-[var(--radius-lg)]` = 16px / 1rem).
- **Interaktiva kort vid hover:** Subtil kantaccent (`hover:border-[var(--color-border-strong)]`) och 1–2 px pilförflyttning (`group-hover:translate-x-1`). Ingen 3D-tilt, glow eller cursor-follow.

---

## 8. Demo-element & Transparens

- Inga "Lokal demo"-pills eller separata "Demo"-badges visas på startsidans kort.
- En enda neutral textrad bevaras för fixture-transparens på startsidan:
  `Tjänsterna nedan är exempeldata i den lokala utvecklingsmiljön.`
- På demotjänstesidan visas en tydlig neutral informationsbox:
  `Lokal demo – informationen är inte en verkligt verifierad tjänsteguide.`
- Fixture-namn bibehåller "Demo" i namnet (t.ex. *NordicPlay Demo*) så att exempeldata aldrig misstas för verkliga avtal.

---

## 9. Integritet & Nätverkssäkerhet

- **Noll nätverkstrafik för formulärdata:** Formulär interagerar aldrig med servern eller tredje part.
- **Noll webbläsarlagring:** Inga personuppgifter skrivs till cookies, localStorage eller sessionStorage.
- **Systemtema via CSS:** Temat styrs 100 % via CSS `prefers-color-scheme`.
- **Säker URL-validering:** Förifyllda parametrar valideras och rensas från kontrolltecken.
- **Externa länkar:** Har alltid `rel="noopener noreferrer"`.
