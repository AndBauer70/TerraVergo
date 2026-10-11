# Terra Vergo

Ein kybernetisches Klimaspiel mit Mystery-Einstieg für die Klassen 7 bis 10 am Gymnasium, mit Erweiterungen für die Oberstufe.

**Spielen:** `index.html` im Browser öffnen oder über GitHub Pages aufrufen. Es wird nichts installiert, und das Spiel läuft auch offline.

## Ablauf

1. **Mystery „Das Rätsel vom Deich“.** Prof. Geo, Jannes aus Ostfriesland und Aputsiaq aus Grönland stellen die Leitfrage: *Warum muss der Deich an der Nordseeküste wachsen, wenn in Grönland das Eis schmilzt?* Die Gruppen verbinden 21 Karten zu einem Wirkungsgefüge. Jede gefundene Kernidee verrät einen Buchstaben des Codeworts für den Kontrollraum.
2. **Spiel im Kontrollraum.** Die Gruppen steuern die Erde von 2025 bis 2075 in zehn Runden zu je fünf Jahren. Ziel: Kein weiteres Element des Erdsystems kippt, und die Menschen bleiben unter den Grenzen der Anpassung. Ohne Klimaschutz folgt das Spiel dem Stresstest SSP5-8.5 (früher RCP8.5) und erreicht 2075 rund 3,7 °C.

## Inhalte

24 verwundbare Elemente, vier je Sphäre, an ihrem realen Ort auf einer Weltkarte:

| Sphäre | Elemente |
|---|---|
| Kryosphäre | Grönländischer Eisschild, Westantarktischer Eisschild, Arktisches Sommermeereis, Gebirgsgletscher im Himalaya |
| Pedosphäre | Permafrost in Jakutien, Böden im Mittelmeerraum, Torfmoore im Kongobecken, Ackerböden der Great Plains |
| Hydrosphäre | Atlantische Umwälzströmung (AMOC), Meeresspiegel (Malediven), El Niño, Umwälzung im Südpolarmeer |
| Atmosphäre | Westafrikanischer Monsun, Hitzewellen in Europa, Indischer Monsun und Starkregen, Tropische Wirbelstürme |
| Biosphäre | Amazonas-Regenwald, Korallenriffe, Boreale Wälder, Nebelwälder in Costa Rica |
| Mensch | Hitze am Persischen Golf, Ernährung im Sahel, Wasser im Indus-Tal, Küstenschutz an der Nordsee |

Dazu: Fieberkurve mit Thermometer und Folgekosten, 25 Dominoeffekte, Klimafonds mit Einnahmen und Förderprogrammen, Klimaschutz, Naturschutz und Anpassung, ein Comic nach jeder Runde und ein Bereich für Lehrkräfte.

## Material

- `begleitheft.html` und `begleitheft.pdf`: Begleitheft für Lehrkräfte und Eltern (Ablauf, Didaktik, Kerncurriculum, Klimagefühle, Datenschutz)
- `wissensbasis.html` und `docs/wissensbasis.md`: die Recherche hinter dem Spiel mit allen Zahlen, Spannen, Vertrauensgraden und Quellen
- Das Lösungsblatt mit Lösungsskizze und Codes ist bewusst nicht veröffentlicht, damit das Mystery ein Rätsel bleibt.

## Fachliche Grundlage

IPCC-Synthesebericht 2023 (AR6), Berichte der Arbeitsgruppen I und II, Sonderbericht Ozean und Kryosphäre; Armstrong McKay u. a. (2022), Science 377; Global Tipping Points Report 2025; Forster u. a. (2026), Indicators of Global Climate Change. Stand: Oktober 2026. Das Spiel ist ein vereinfachtes Lernmodell: Es zeigt Richtungen und Größenordnungen, keine Vorhersagen.

## Datenschutz

Das Spiel stellt keine Anfragen an fremde Server, setzt keine Cookies und sammelt keine Daten. Nur der Fortschritt im Mystery wird lokal im Browser gespeichert.

## Weiterentwickeln

Der Ordner `quellcode/` enthält die Quelldateien. `python3 build.py` (Python 3 mit dem Paket `markdown`) baut daraus `index.html`, `begleitheft.html` und `wissensbasis.html` im Unterordner `build/`. `node test/model_test.js` rechnet das Spielmodell mit verschiedenen Strategien durch.

## Lizenzen

Schriften Bangers und Lexend: SIL Open Font License 1.1, siehe `LICENSE-SCHRIFTEN.txt`. Kartendaten: Natural Earth (gemeinfrei).
