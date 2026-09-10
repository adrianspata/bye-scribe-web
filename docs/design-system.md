# ByeScribe Design System — Designfas 1 & 2

Detta dokument beskriver det visuella designsystemet, tokensystemet, temahanteringen, grundkomponenterna och startsidans informationsarkitektur för ByeScribe.

**Produktnamn:** ByeScribe  
**Tagline:** The easier way to unsubscribe.

---

## 1. Designidé: Guided Clarity

ByeScribe hjälper människor att ta kontroll över sina återkommande abonnemangsutgifter genom att eliminera mental friktion kring uppsägningar.

**Kärnprinciper:**
1. **Lugn & Trygg:** Inga påträngande popups, stressande timers, blinkande banners eller överlastade layouter. Användaren befinner sig ofta i en situation av irritation eller förvirring gentemot en tjänsteleverantör; ByeScribe förmedlar precision och lugn.
2. **Handlingsinriktad & Uppgiftsfokuserad:** Information presenteras i tydliga steg med direkt koppling till nästa åtgärd (sökning efter tjänst, beräkning av besparing eller generering av ett färdigt textutkast).
3. **Visuell orientering längs en väg:** Ett funktionellt motiv av noder, linjer och diskreta stegmarkörer ("Guided Clarity") används för att vägleda användaren från osäkerhet till genomförd uppsägning.

### Användning av Path-motivet
- **Tillåten användning:**
  - Numrerade processteg i uppsägningsguider (t.ex. steg 1, 2, 3 med ordningsindikatorer).
  - "Så fungerar det"-sektionen på startsidan.
  - Progressionsindikatorer och logiska flöden (övergång från tjänst till besparingskalkylator eller textutkast).
- **Förbjuden användning:**
  - Får inte läggas som generell bakgrundsdekoration eller slumpmässigt linjemönster.
  - Får inte användas på vanliga informationskort där det inte representerar en sekvens.
  - Får inte utformas som en tunnelbanekarta eller pseudo-logotyp.

---

## 2. Relationen till Summa

ByeScribe och Summa är relaterade produkter inom privatekonomisk kontroll, men utgör två olika plattformar:

| Kvalitet | ByeScribe (Webbapplikation) | Summa (Native iOS App) |
| :--- | :--- | :--- |
| **Plattform** | Responsiv webb (desktop, tablet, mobile) | Native SwiftUI / iOS |
| **Informationshierarki** | Lugn, luftig, läsbar webbtypografi | Native iOS-vyer och listor |
| **Fokus & Ytor** | Tydliga lager med subtila borders och skuggor | Native material, systembakgrunder |
| **Navigation** | Standardiserad webbheader, mobilmeny och brödsmulor | iOS Tab Bar och NavigationStack |
| **Färger** | Safirblå/cyan accent, harmoniska neutraler | Summa brand tokens |
| **Interaktioner** | Klick, tangentbordsfokus, touch targets (min 44px) | Haptik, iOS-gester |

**Vad som uttryckligen INTE kopieras till ByeScribe:**
- iOS Tab Bars och native modal-kort i webblayouten.
- Överdriven glassmorphism och suddiga bakgrunder.
- Monolitiska listceller som inte skalar på desktop.

---

## 3. Temahantering: Ren Systemtemastyrning

ByeScribe styrs uteslutande av användarens systempreferens via native CSS `prefers-color-scheme`:
- **Light Theme (Standard):** Aktiveras på `:root` med `color-scheme: light dark`.
- **Dark Theme:** Aktiveras automatiskt under `@media (prefers-color-scheme: dark)`.

### Egenskaper
1. **Noll JavaScript & Noll Hydration Flash:** Färgtemat appliceras omedelbart av webbläsarens CSS-motor innan rendering, helt utan inline-script eller localStorage-läsning.
2. **Realtidsanpassning:** Ändringar i operativsystemets tema slår igenom ögonblickligen under aktiv session.
3. **Inga Manuella Knappar:** Inga manuella knappar (System/Ljust/Mörkt) visas i gränssnittet.

---

## 4. Färgpaletter & Semantiska Tokens

### Light Theme
- **Sidbakgrund (`--color-page`):** `#f8fafc` (kall, pärlvit ton)
- **Subtil sidbakgrund (`--color-page-subtle`):** `#f1f5f9`
- **Kortyta (`--color-surface`):** `#ffffff`
- **Upphöjd yta (`--color-surface-raised`):** `#ffffff`
- **Interaktiv yta (`--color-surface-interactive`):** `#f8fafc` (hover: `#f1f5f9`)
- **Huvudtext (`--color-text`):** `#09131f` (djup blåsvart för maximal kontrast)
- **Dämpad text (`--color-text-muted`):** `#334155` (WCAG AAA mot vit bakgrund)
- **Subtil text (`--color-text-subtle`):** `#475569`
- **Borders (`--color-border`):** `#e2e8f0` (stark: `#cbd5e1`)
- **Primär accent (`--color-accent`):** `#0f62fe` (Safirblå, WCAG AAA mot vit/ljus bakgrund)
- **Accent hover (`--color-accent-hover`):** `#0043ce`
- **Mjuk accent (`--color-accent-soft`):** `#edf5ff`
- **Status Positiv:** `#15803d` / yta `#f0fdf4` / border `#bbf7d0`
- **Status Varning:** `#9a3412` / yta `#fffbeb` / border `#fde68a`
- **Status Kritisk:** `#b91c1c` / yta `#fef2f2` / border `#fecaca`
- **Status Information:** `#0369a1` / yta `#f0f9ff` / border `#bae6fd`
- **Fokusring (`--color-focus`):** `#0f62fe`

### Dark Theme
- **Sidbakgrund (`--color-page`):** `#090d16` (djup midnattsblå bas, inte kolsvart)
- **Subtil sidbakgrund (`--color-page-subtle`):** `#0d131f`
- **Kortyta (`--color-surface`):** `#111827`
- **Upphöjd yta (`--color-surface-raised`):** `#182234`
- **Interaktiv yta (`--color-surface-interactive`):** `#1a263a` (hover: `#213048`)
- **Huvudtext (`--color-text`):** `#f8fafc` (mjuk off-white)
- **Dämpad text (`--color-text-muted`):** `#cbd5e1`
- **Subtil text (`--color-text-subtle`):** `#94a3b8`
- **Borders (`--color-border`):** `#1e293b` (stark: `#334155`)
- **Primär accent (`--color-accent`):** `#38bdf8` (Ljusare cyanblå för optimal läsbarhet i mörkt läge)
- **Accent hover (`--color-accent-hover`):** `#7dd3fc`
- **Mjuk accent (`--color-accent-soft`):** `#082f49`
- **Status Positiv:** `#4ade80` / yta `#052e16` / border `#166534`
- **Status Varning:** `#fbbf24` / yta `#451a03` / border `#92400e`
- **Status Kritisk:** `#f87171` / yta `#450a0a` / border `#991b1b`
- **Status Information:** `#38bdf8` / yta `#082f49` / border `#0369a1`
- **Fokusring (`--color-focus`):** `#38bdf8`

---

## 5. Typografi, Spacing & Former

### Typografisk hierarki
- **Display / Hero:** 3rem - 3.75rem (48px - 60px), font-weight 800-900, leading 1.15.
- **Heading 1:** 2rem - 2.5rem (32px - 40px), font-weight 800, tracking-tight.
- **Heading 2:** 1.25rem - 1.5rem (20px - 24px), font-weight 700.
- **Heading 3:** 1rem - 1.125rem (16px - 18px), font-weight 600.
- **Body:** 0.875rem - 1rem (14px - 16px), font-weight 400, leading-relaxed.
- **Body Small / Captions:** 0.75rem - 0.8125rem (12px - 13px), font-weight 400-500.
- **Ekonomiska siffror (`.tabular-nums`):** `font-variant-numeric: tabular-nums` för belopp, besparingsprognoser och datum.

### Spacing & Radie
- **Container Max:** `72rem` (1152px) med responsiva page gutters (`px-4 sm:px-6`).
- **Reading Max:** `42rem` (672px / ca 65 tecken per rad) för långa texter och instruktioner.
- **Header Height:** `4rem` (64px).
- **Touch Targets:** Minst `44x44px` (`min-h-[44px]` eller `min-w-[44px]`) för alla primära interaktiva kontroller.
- **Radier:**
  - Små kontroller / knappar: `--radius-sm: 0.375rem` (6px)
  - Formulärfält / inputs: `--radius-md: 0.625rem` (10px)
  - Kort och sektioner: `--radius-lg: 1rem` (16px)
  - Status och piller: `--radius-pill: 9999px`

---

## 6. Grundkomponenter

| Komponent | Sökväg | Varianter & Egenskaper |
| :--- | :--- | :--- |
| **Button** | `src/components/ui/button.tsx` | `primary`, `secondary`, `quiet`, `destructive`. Storlekar: `sm`, `md`, `lg`, `icon-only`. Stöd för `isLoading` och `disabled`. |
| **FieldLabel, FieldHint, FieldError** | `src/components/ui/field.tsx` | Komponerbara primitiva byggstenar för formulär med tillgängliga `role="alert"`, `id`, `aria-describedby`. |
| **Input** | `src/components/ui/input.tsx` | Semantisk input med `hasError`-tillstånd, fokusring och min 44px träffyta. |
| **Textarea** | `src/components/ui/textarea.tsx` | Textarea med konsekvent typografi och `hasError`-stöd. |
| **Select** | `src/components/ui/select.tsx` | Tillgänglig native select med anpassad Chevron-ikon och fokusring. |
| **Badge / StatusBadge** | `src/components/ui/badge.tsx` | `neutral`, `success`, `warning`, `critical`, `info` med anpassade borders och textkontrast. |
| **InlineNotice** | `src/components/ui/inline-notice.tsx` | Callout/Alert med `information`, `success`, `warning`, `critical` och Lucide-ikoner. |
| **Card** | `src/components/ui/card.tsx` | `default`, `raised`, `interactive`, `highlight`. |
| **TextLink & ExternalLink** | `src/components/ui/text-link.tsx`, `external-link.tsx` | Interna respektive externa länkar med diskret fokus, ikon och `(öppnas i ny flik)` för skärmläsare. |
| **SkipLink** | `src/components/layout/skip-link.tsx` | Tangentbordsfokuserbar länk som hoppar direkt till `#main-content`. |
| **Layout-primitiver** | `src/components/ui/layout-primitives.tsx` | `PageContainer`, `ReadingContainer`, `Section`, `Divider`, `EmptyState`. |

---

## 7. Responsiva Principer & Viewports

Webbplatsen är strikt responsiv och byggd Mobile-First:
- **320px – 375px (Small Mobile):** Inga horisontella överflöden, fullbredd på sökfält och verktygskort, tillgänglig mobilnavigation i header.
- **430px – 768px (Large Mobile & Tablet):** Flexibel rutnätsindelning, bevarade läsavstånd och touch targets.
- **1024px – 1440px (Desktop):** Horisontell primärnavigation, centrerad maxbredd, balanserad informationshierarki.

---

## 8. Motion & Tillgänglighet

- **Subtila mikrorörelser:** Endast mjuka färgövergångar (`transition-colors`) och kontrollerade hover-förskjutningar (`hover:translate-x-1`).
- **Prefers-reduced-motion:** När användaren valt minskad rörelse stängs alla CSS-övergångar och animationer av omedelbart.
- **Fokusmarkering:** Synlig `focus-visible` med 2px ring och 2px offset i både ljust och mörkt läge.
- **Kontrast:** Alla textfärger och interaktiva element uppfyller WCAG 2.1 AA / AAA.

---

## 9. Vad designen uttryckligen undviker (Anti-patterns)

- Inga generiska SaaS-heroes med flytande dashboard-mockups och "AI-powered"-badges.
- Inga påhittade kundlogotyper, användarsiffror eller testimonials.
- Inga tunga, suddiga gradientblobbar i bakgrunden.
- Inga slumpmässiga "bento grids" utan funktionellt innehåll.
- Inga emojis som gränssnittsikoner (endast enhetliga SVG-ikoner från `lucide-react`).
- Inga "kort inuti kort inuti kort".
- Inga obestyrkta påståenden om att uppsägningar utförs automatiskt eller att verifierade guider alltid finns för alla tjänster.

---

## 10. Temporärt Ordmärke & Framtida Namnarkitektur

### Typografiskt Placeholder-Ordmärke
Det nuvarande ordmärket **ByeScribe** är ett **rent typografiskt placeholder-ordmärke** (`font-black tracking-tight`). Det används i navigationsheadern och gränssnittet utan dekorativa symboler eller pseudo-logotyper. Det representerar inte en slutgiltig grafisk logotyp eller permanent varumärkessymbol, vilket anstår en separat framtida varumärkesfas.

### Framtida Namnarkitektur
- **`ByeScribe Guides`**
- **`ByeScribe Assistant`**
- **`ByeScribe for Business`**
- **`ByeScribe × Summa`**

---

## 11. Startsidan: Informationsarkitektur & UX (Designfas 2)

Startsidan (`/sv`) är utformad som en uppgiftsorienterad konsumentresurs uppdelad i 6 funktionella sektioner:

1. **Hero & Primär sökning:**
   - Varumärkestagline: `The easier way to unsubscribe.`
   - H1: `Säg upp abonnemang utan onödigt krångel.`
   - Subtitle: Beskriver att ByeScribe ger tydliga steg, villkor, källor och rätt kontaktväg.
   - Sökfält (`SearchBar`): Primär handling med neutral placeholder `Sök efter en tjänst` och integritetsvägledning.
   - Begränsningslinje: Klargör att ByeScribe vägleder men aldrig genomför uppsägningen automatiskt.
2. **Vad du får (Värde & Förtroende):**
   - 3 konkreta kort: *Tydliga steg*, *Villkor och uppsägningstid*, *Källor och kontaktvägar*.
3. **Så fungerar det (Guided Clarity Path):**
   - Trestegsflöde (`GuidedPathFlow`): *1. Sök efter tjänsten*, *2. Följ uppsägningsguiden*, *3. Genomför hos leverantören*.
   - Semantisk `<ol>` med diskret dekorativt sammanlänkande linjelager på desktop.
4. **Tillgängliga tjänsteguider (`FeaturedServices`):**
   - Visar publicerade guider eller ett sakligt tomläge utan överdrivna löften.
5. **Verktyg för abonnemang & sparande:**
   - Två distinkta kort för *Besparingskalkylator* och *Uppsägningsmeddelande* med beskrivande länkar (`Räkna på din besparing`, `Skapa ett uppsägningsutkast`).
6. **Kontextuell Summa-sektion (`ContextualSummaCta`):**
   - Presenterar relationen `ByeScribe × Summa` som ett naturligt nästa steg för fasta utgifter med säker URL-validering.
