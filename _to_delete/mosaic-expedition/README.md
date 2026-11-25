# MOSAiC – Ein Jahr im Eis

Lernanwendung für Erdkunde in der **Oberstufe** (Gymnasium). Teil von **Terra Vergo**. Themenfelder: Polarräume, Klimasystem und Klimawandel, Arbeit mit Forschungsdaten. Lehrplanbezug bitte vor dem Eintrag in die Lehrplanseiten prüfen (z. B. KC Niedersachsen Sek. II, Rahmenthema Klima/Mensch-Umwelt).

**Leitfrage:** Was verrät ein Jahr im Eis über die Arktis im Klimawandel, und warum geht uns das etwas an?

Die Lernenden erleben die MOSAiC-Expedition (Polarstern, 20.09.2019–12.10.2020) mit **Originaldaten**: 389 Tagespositionen aus den PANGAEA-Mastertracks und Tageswerte der Bordwetterwarte. Sie fahren die Route auf einem interaktiven Globus nach, werten Messreihen aus, erarbeiten die Erkenntnisse der fünf MOSAiC-Teams im Gruppenpuzzle, verknüpfen sie zu einem Wirkungsgefüge und beurteilen Aussagen. Die aktuelle Fahrt der Polarstern ist eingebaut und lässt sich live verfolgen.

| Phase | Inhalt |
|---|---|
| 0 Start | Auftrag, MOSAiC in Zahlen, FAIR-Datenregeln |
| 1 Kopfkino | Winter auf der Scholle, Eindrücke, Vermutung, Meinungsregler „Wie stark betrifft uns die Arktis?“ |
| 2 Expeditionsglobus | Globus (drehen, zoomen) mit gemessener Route nach Fahrtabschnitten, Zeitregler und Abspielen, Tageskarte (Position, Geschwindigkeit, Tagesetappe, Lufttemperatur mit Min/Max, Wasser, Druck, Wind, Globalstrahlung, Feuchte, berechneter Sonnenhöchststand mit Polarnacht/Polartag), Beleuchtungsschattierung, 15 Stationen mit Erkenntnissen und Denkfragen; **Polarstern heute**: aktuelle Fahrt, Live-Ansicht des AWI (nur auf Knopfdruck), eigenes Logbuch mit Positionseingabe und Vergleich (Entfernungen, Zone, Sonnenstand) |
| 3 Datenlabor | Liniendiagramme frei kombinierbarer Größen mit Polarnacht-Band, Zeitraumwahl und Kennwerten, Streudiagramm mit Korrelationskoeffizient, Driftrechner (Summe der Etappen, Luftlinie, Umwegfaktor) im Vergleich mit AWI-Angaben, Formulierungshilfen und Stolpersteine, Datenprotokolle |
| 4 Forschungsteams | Gruppenpuzzle: Atmosphäre, Meereis und Schnee, Ozean, Ökosystem, Biogeochemie; je 3–4 Erkenntnisse mit Quelle und „Datenspur“ in Globus oder Datenlabor; Expertenblatt |
| 5 Wirkungsgefüge | 15 Elemente in fünf Kategorien, Prüfung gegen 16 Kernverbindungen, erkannte Rückkopplungen (Eis-Albedo verstärkend, Eiswachstum ausgleichend), Hebel „Emissionen senken“ und „Offene Messdaten“ |
| 6 Beurteilen | Fakt, Schlussfolgerung oder Meinung (acht Aussagen, Beutelsbacher Konsens), Daten fair nutzen (fünf Aussagen zu den MOSAiC-Regeln), Antwort auf die Leitfrage, Regler vorher/nachher |
| Ergebnis | Bericht zum Kopieren und Drucken, Datennachweis, Quellen |

## Daten und Aufbereitung

- **Route:** Mastertracks in 10-Minuten-Auflösung (PANGAEA, CC BY 4.0); je Tag die Position nächst 12:00 UTC.
  Rex (2020) doi:10.1594/PANGAEA.924668 · Haas (2020) doi:10.1594/PANGAEA.924674 · Kanzow (2020) doi:10.1594/PANGAEA.924681 · Rex (2021) doi:10.1594/PANGAEA.926829 · Rex (2021) doi:10.1594/PANGAEA.926910
- **Wetter:** Schmithüsen (2021): Continuous meteorological surface measurement during POLARSTERN cruise PS122/1–5, doi:10.1594/PANGAEA.935221 bis .935225 (1-Minuten-Werte, daraus Tagesmittel, -minimum, -maximum). Keine Lufttemperatur am 12.08.2020.
- **Berechnet in der Anwendung (gekennzeichnet):** Sonnenhöchststand (Deklinationsnäherung, Sonne sichtbar ab −0,833°), Beleuchtungsschattierung, Tagesetappen und Entfernungen (Großkreis, Erdradius 6.371 km), Korrelationskoeffizient.
- **Polarstern heute:** Fahrt „Antarktis 2026/2027“ (PS157–PS160), Positionen alle sechs Stunden vom 14.11.2026 bis zur letzten eingebauten Position am **24.11.2026, 09:03 UTC** (32,12° N, 14,82° W), Quelle: AWI, onexpedition.awi.de. Ein automatischer Abruf aus dem Browser ist nicht möglich (keine CORS-Freigabe des AWI). Deshalb: eingebaute Momentaufnahme, Live-Ansicht des AWI als eingebettete Seite **nur auf Knopfdruck** (einzige externe Verbindung der Anwendung, mit Hinweis), Logbuch zum Eintragen abgelesener Positionen. Für eine neue Momentaufnahme die Daten in `MD.live` ersetzen.
- **Erkenntnisse:** in eigenen Worten nach Nicolaus u. a. (2022), Shupe u. a. (2022), Rabe u. a. (2022) (Elementa), Krumpen u. a. (2020, 2021), Itkin u. a. (2023), Svensson u. a. (2023), Dada u. a. (2022), Hoppe u. a. (2024), Snoeijs-Leijonmalm u. a. (2022) sowie AWI-Pressemitteilungen vom 07.02.2022, 18.02.2022, 04.09.2024 und der AWI-Themenseite mit Factsheet „Die Expedition in Zahlen“.

## MOSAiC-Datenregeln (FAIR)

Die Anwendung folgt den Regeln von https://mosaic-expedition.org/mosaic-data/: Datensätze mit DOI im Quellenverzeichnis, Nennung von MOSAiC mit dem Kennzeichen MOSAiC20192020 und der Projekt-ID AWI_PS122_00, erweiterte Danksagung nach Nixdorf u. a. (2021), doi:10.5281/zenodo.5179738. Verwendet sind nur veröffentlichte Datensätze, keine Rohdaten aus dem MOSAiC Central Storage. Die Aufbereitung (Tagesauswahl, Tagesmittel) ist hier und in der Anwendung offengelegt.

## Technik

Eine selbstständige HTML-Datei. Schriften Bangers und Lexend eingebettet (SIL Open Font License, siehe `LICENSE-SCHRIFTEN.txt`). Eingebettet: d3-geo 3.1.2 und d3-array 3.2.5 (ISC) für die Globusprojektion, Küstenlinien von Natural Earth (gemeinfrei) über world-atlas 2.0 (ISC), siehe `LICENSE-BIBLIOTHEKEN.txt`. Keine Cookies, kein Tracking; Eingaben nur im `localStorage` (Schlüssel `mosaic-expedition-v1`). Externe Verbindung nur, wenn die Live-Ansicht des AWI ausdrücklich geladen wird; Fotos und Grafiken des AWI werden nicht übernommen.

Dateien: `index.html`, `README.md`, `LICENSE-SCHRIFTEN.txt`, `LICENSE-BIBLIOTHEKEN.txt`. © 2026 Andreas Bauer, technische Umsetzung mit Unterstützung von Claude (Anthropic).
