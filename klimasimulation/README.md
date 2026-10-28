# Terra Vergo

Ein kybernetisches Klimaspiel mit Mystery-Einstieg für die Klassen 7 bis 10 am Gymnasium, mit Erweiterungen für die Oberstufe.

Idee, Konzept und Spieldesign: Andreas Bauer. Technische Umsetzung mit Unterstützung von Claude.ai (Anthropic).

Terra Vergo besteht aus **zwei eigenständigen Anwendungen**, die aufeinander aufbauen, aber auch einzeln funktionieren:

- `mystery.html`: Mystery „Das Rätsel vom Deich“
- `klimasimulation.html`: Klimasimulation „Der Kontrollraum“

`index.html` ist die Startseite mit Links zu beiden. Jede Datei läuft für sich im Browser, über GitHub Pages oder offline. Es wird nichts installiert.

## Ablauf

1. **Mystery „Das Rätsel vom Deich“.** Prof. Geo, Jannes aus Ostfriesland und Aputsiaq aus Grönland stellen die Leitfrage: *Warum muss der Deich an der Nordseeküste wachsen, wenn in Grönland das Eis schmilzt?* Die Gruppen verbinden 21 Karten zu einem Wirkungsgefüge. Jede gefundene Kernidee verrät einen Buchstaben des Codeworts für den Kontrollraum. Mit „Neu beginnen“ startet die nächste Gruppe mit leerem Brett.
2. **Klimasimulation im Kontrollraum.** Der Tür-Comic am Ende des Mysterys verlinkt sie, sie lässt sich aber auch direkt öffnen. Die Gruppen steuern die Erde von 2025 bis 2075 in zehn Runden zu je fünf Jahren. Ziel: Kein weiteres Element des Erdsystems kippt, und die Menschen bleiben unter den Grenzen der Anpassung. Ohne Klimaschutz folgt das Spiel dem Stresstest SSP5-8.5 (früher RCP8.5) und erreicht 2075 rund 3,7 °C.

## Inhalte

24 verwundbare Elemente, vier je Sphäre, an ihrem realen Ort auf einer Weltkarte oder wahlweise auf einem drehbaren 3D-Globus:

| Sphäre | Elemente |
|---|---|
| Kryosphäre | Grönländischer Eisschild, Westantarktischer Eisschild, Arktisches Sommermeereis, Gebirgsgletscher im Himalaya |
| Pedosphäre | Permafrost in Jakutien, Böden im Mittelmeerraum, Torfmoore im Kongobecken, Ackerböden der Great Plains |
| Hydrosphäre | Atlantische Umwälzströmung (AMOC), Meeresspiegel (Malediven), El Niño, Umwälzung im Südpolarmeer |
| Atmosphäre | Westafrikanischer Monsun, Hitzewellen in Europa, Indischer Monsun und Starkregen, Tropische Wirbelstürme |
| Biosphäre | Amazonas-Regenwald, Korallenriffe, Boreale Wälder, Nebelwälder in Costa Rica |
| Mensch | Hitze am Persischen Golf, Ernährung im Sahel, Wasser im Indus-Tal, Küstenschutz an der Nordsee |

Der 3D-Globus lässt sich mit Maus, Finger oder Pfeiltasten drehen und per Knopf auf Kontinente, Arktis oder Antarktis ausrichten. Dort sind die Polargebiete ohne die Verzerrung der flachen Karte zu sehen.

Dazu: Kurve „Globale Temperaturerhöhung“ mit Thermometer und Folgekosten, 46 Wechselwirkungen (verstärkend, bremsend oder unklar, mit Kettenreaktionen und Rückkopplungen), Klimafonds mit Einnahmen und Förderprogrammen, Klimaschutz, Naturschutz und Anpassung, ein Comic nach jeder Runde und ein Bereich für Lehrkräfte.

## Material

- `begleitheft.html`, `begleitheft.pdf` und `begleitheft.docx` (Word): Begleitheft für Lehrkräfte und Eltern mit Ablauf, Basiskonzepten der Geographie, Bezug zu Bildungsstandards und Lehrplänen, Schülerschwierigkeiten und Hilfen, Aufgaben, Klimagefühlen, Datenschutz, Glossar und Register
- `wissensbasis.html` und `docs/wissensbasis.md`: die Recherche hinter dem Spiel mit allen Zahlen, Spannen, Vertrauensgraden und Quellen
- `impressum.html`: Impressum, Urheberrecht und Datenschutzhinweise
- Das Lösungsblatt mit Lösungsskizze und Codes ist bewusst nicht veröffentlicht, damit das Mystery ein Rätsel bleibt.

## Fachliche Grundlage

IPCC-Synthesebericht 2023 (AR6), Berichte der Arbeitsgruppen I und II, Sonderbericht Ozean und Kryosphäre; Armstrong McKay u. a. (2022), Science 377; Global Tipping Points Report 2025; Forster u. a. (2026), Indicators of Global Climate Change. Stand: Oktober 2026. Das Spiel ist ein vereinfachtes Lernmodell: Es zeigt Richtungen und Größenordnungen, keine Vorhersagen.

## Datenschutz

Das Spiel stellt keine Anfragen an fremde Server, setzt keine Cookies und sammelt keine Daten. Das Mystery speichert seinen Fortschritt, die Klimasimulation die gewählte Kartenansicht, beides nur lokal im Browser. Beim Aufruf über GitHub Pages protokolliert GitHub die IP-Adresse der Besucher; Einzelheiten im Impressum.

## Quellcode

Der Ordner `quellcode/` enthält die Quelldateien, damit sich das Spiel nachvollziehen lässt. Eigene Bearbeitungen und Weitergabe sind nur mit Zustimmung erlaubt (siehe unten). `python3 build.py` (Python 3 mit den Paketen `markdown` und `beautifulsoup4`; für die Word-Datei zusätzlich Node.js mit dem npm-Paket `docx`) baut daraus `index.html`, `mystery.html`, `klimasimulation.html`, `begleitheft.html`, `begleitheft.docx`, `wissensbasis.html` und `impressum.html` im Unterordner `build/`. `node test/model_test.js` rechnet das Spielmodell mit verschiedenen Strategien durch.

## Urheberrecht

© 2026 Andreas Bauer. Für Unterricht und andere nicht-kommerzielle Bildungszwecke darf Terra Vergo mit Quellenangabe frei genutzt werden. Für Vervielfältigung, Bearbeitung, Verbreitung oder kommerzielle Nutzung außerhalb der Grenzen des Urheberrechts ist die vorherige schriftliche Zustimmung nötig. Den vollständigen Wortlaut und einen Vorschlag für die Quellenangabe enthält `LICENSE.md`, die Anschrift `impressum.html`.

Eingebettete Fremdinhalte behalten ihre eigenen, freien Lizenzen: Schriften Bangers und Lexend (SIL Open Font License 1.1, `LICENSE-SCHRIFTEN.txt`), d3-array 3.2.4, d3-geo 3.1.1 und world-atlas 2.0.2 (ISC-Lizenz, `LICENSE-D3-WORLD-ATLAS.txt`), Kartendaten von Natural Earth (gemeinfrei).
