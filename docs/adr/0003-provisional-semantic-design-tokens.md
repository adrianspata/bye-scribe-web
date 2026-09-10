# 3. Provisoriska Semantiska Tokens i Väntan på ByeScribes Designsystem

## Status
Ersatt av Designfas 1

## Kontext
ByeScribe befinner sig i arkitektur- och grundfasen innan den slutgiltiga grafiska profilen och det fullständiga designsystemet har fastställts. För att kunna bygga tillgängliga och konsekventa layoutskal utan att bygga in teknisk skuld eller hårdkodade färgvärden behövs en neutral token-struktur.

## Beslut
Vi skapar en uppsättning semantiska CSS-variabler i `src/styles/tokens.css` och mappar dem via Tailwind CSS 4 `@theme inline`:
- Variablerna representerar semantiska koncept: `--color-canvas`, `--color-surface`, `--color-surface-elevated`, `--color-text-primary`, `--color-text-muted`, `--color-border-subtle`, `--color-accent`, `--color-focus`, etc.
- Standardvärdena är neutrala, sobra och optimerade för hög kontrast (WCAG AA/AAA).
- Tydliga kommentarer markerar att värdena är provisoriska placeholders inför den kommande designfasen.
- Gradients, glassmorphism, dashboardkort och onödiga animationer undviks till förmån för god läsbarhet, tangentbordsnavigering och tydliga `:focus-visible`-tillstånd.

## Konsekvenser
- **Positivt**: När den slutgiltiga designen är klar kan färgpalett, typsnitt och radier uppdateras på ett enda ställe (`tokens.css`) utan att behöva refaktorisera komponentkod.
- **Positivt**: Garanterar full tillgänglighet och god kontrast redan från första steget.
- **Negativt**: Layouten har en neutral placeholder-karaktär tills det fullständiga varumärket implementeras.
