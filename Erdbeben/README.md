# Erdbeben-Globus

Ein Baustein von **Terra Vergo** für den Erdkundeunterricht: echte Erdbebendaten des USGS auf einer Weltkarte und einem drehbaren 3D-Globus, mit Plattengrenzen, Tiefseegräben, Gebirgen, Großstädten und einem maßstabsgetreuen Schnitt durch Erdkruste und Erdmantel bis 1.000 km Tiefe, in dem die Hypozentren ausgewählter Beben eingezeichnet sind.

Für die Klassen 7 bis 10 am Gymnasium, mit Erweiterungen für die Oberstufe.

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | Der Erdbeben-Globus. Läuft in jedem aktuellen Browser, auch offline. |
| `begleitheft.html` | Begleitheft für Lehrkräfte und Eltern: Ablauf, Bedienung, Fachhintergrund, Lehrplanbezug, Fehlvorstellungen, Aufgaben, Glossar |
| `wissensbasis.html` | Fachliche Wissensbasis mit allen Quellen und dem Quellenstatus |
| `impressum.html` | Impressum, Lizenzen und Datenschutz |
| `data/erdbeben.json` | Erdbebendaten (7 Tage ab M 2,5, 30 Tage ab M 4,5, 12 Monate ab M 5,0); wird jeden Morgen erneuert |
| `tools/daten_aktualisieren.py` | Skript, das die Daten vom USGS holt (nur Python 3, keine Zusatzpakete) |
| `.github/workflows/daten-aktualisieren.yml` | GitHub-Action, die das Skript täglich um 04:17 UTC startet |
| `LICENSE-SCHRIFTEN.txt`, `LICENSE-D3-WORLD-ATLAS.txt`, `LICENSE-DATEN.txt` | Lizenzen der eingebetteten Fremdinhalte |
| `.nojekyll` | sorgt dafür, dass GitHub Pages die Dateien unverändert ausliefert |

## Veröffentlichen mit GitHub Pages

1. Neues Repository anlegen, zum Beispiel `erdbeben-globus`, und alle Dateien dieses Ordners hochladen (auch die versteckten Ordner `.github` und die Datei `.nojekyll`).
2. **Settings → Pages:** unter „Build and deployment“ als Quelle „Deploy from a branch“, Branch `main`, Ordner `/ (root)` wählen.
3. **Settings → Actions → General:** unter „Workflow permissions“ „Read and write permissions“ wählen, damit die tägliche Aktualisierung die Daten speichern darf.
4. Einmal von Hand starten: Reiter **Actions → Erdbebendaten aktualisieren → Run workflow**.

Nach wenigen Minuten ist der Globus unter `https://<benutzername>.github.io/erdbeben-globus/` erreichbar.

Hinweis: GitHub pausiert zeitgesteuerte Actions in Repositorys, in denen 60 Tage lang nichts passiert ist. Falls die Aktualisierung einmal stoppt, genügt ein Klick auf „Enable workflow“ im Reiter Actions.

## Ohne GitHub

- **Schulserver:** den ganzen Ordner kopieren. Die Daten bleiben auf dem Stand der letzten Aktualisierung; mit `python3 tools/daten_aktualisieren.py` lassen sie sich jederzeit erneuern.
- **Lokal:** `index.html` doppelklicken. Die meisten Browser zeigen dann den eingebauten Schnappschuss (Stand 12. Oktober 2026), weil sie aus Sicherheitsgründen keine Nachbardateien laden. Neuere Daten lassen sich im Globus unter „Aktuelle Daten selbst laden“ per Datei öffnen.

## Datenschutz

Keine Anmeldung, keine Cookies, keine Statistik, keine Inhalte von fremden Servern. Schriften, Programmbibliothek und Kartendaten sind eingebettet. Die Daten des USGS holt die GitHub-Action ab, nicht der Browser der Schülerinnen und Schüler. Einzelheiten in `impressum.html`.

## Quellen und Lizenzen

- Erdbebendaten: U.S. Geological Survey (gemeinfrei)
- Plattengrenzen: Bird (2003), PB2002, aufbereitet von Hugo Ahlenius, Nordpil (ODC-BY 1.0)
- Land, Gebirge, Städte: Natural Earth (gemeinfrei)
- Schriften Bangers und Lexend: SIL Open Font License 1.1
- d3-array, d3-geo und world-atlas: ISC-Lizenz

## Urheberrecht

© 2026 Andreas Bauer. Idee, Konzept und Gestaltung. Technische Umsetzung mit Unterstützung von Claude.ai (Anthropic). Für Unterricht und andere nicht-kommerzielle Bildungszwecke frei nutzbar mit Quellenangabe. Alles Weitere im Impressum.
