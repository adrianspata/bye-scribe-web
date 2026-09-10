# 1. Next.js App Router och Serverkomponenter som Standard

## Status
Godkänd

## Kontext & Problemställning

ByeScribe är en innehållstung webbplats fokuserad på organisk söktrafik (SEO) och tydliga instruktioner för uppsägning av abonnemang i Sverige. Snabb sidladdning, låg Time to Interactive (TTI) och god indexerbarhet är avgörande för produktens framgång.

## Beslut
Vi använder Next.js App Router (`src/app`) och bygger alla sidor och komponenter som React Server Components (RSC) som standard:
- Endast komponenter som kräver webbläsar-API:er eller interaktivt klienttillstånd (t.ex. sökfält med live-input eller interaktiva kalkylatorer) märks med `'use client'`.
- All databashantering och meddelandeladdning sker på servern.
- Metadata (titel, beskrivning, Open Graph, canonicals) renderas på servern via Next.js metadata API.

## Konsekvenser
- **Positivt**: Minimal JavaScript-bunt levereras till klienten, vilket ger maximal SEO-prestanda och snabb laddtid.
- **Positivt**: Känsliga operationer och databasuppgifter hålls strikt på servern utan risk för dataläckage till webbläsaren.
- **Negativt**: Kräver strikt disciplin kring separation mellan server- och klientkod samt tydliga mönster för tillståndshantering.
