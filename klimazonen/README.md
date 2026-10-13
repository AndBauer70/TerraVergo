# Klimazonen der Erde

Ein Baustein von **Terra Vergo** für den Erdkundeunterricht. 1.332 Klimastationen mit den Klimanormalwerten 1991–2020 auf Weltkarte und 3D-Globus. Die Schülerinnen und Schüler schalten Temperaturzonen ein und entdecken, welche Stationen aufleuchten. Ausreißer wie Bogotá, die Zugspitze oder der Kilimandscharo führen zu Höhenstufen, Kontinentalität und der Frage, was eine Klimazone ausmacht.

Idee, Konzept und Gestaltung: Andreas Bauer, 2026.

## Inhalt des Ordners

| Datei | Zweck |
|---|---|
| `index.html` | Die Klimazonen-Karte. Läuft in jedem aktuellen Browser, auch offline. |
| `begleitheft.html` | Begleitheft für Lehrkräfte und Eltern: Ablauf, fachlicher Hintergrund, Lehrplanbezug, Aufgaben, Glossar. |
| `wissensbasis.html` | Fachliche Grundlagen mit allen Quellen und eigenen Auswertungen des Datensatzes. |
| `impressum.html` | Impressum, Urheberrecht, Lizenzen, Datenschutz. |
| `data/klimastationen.json` | Klimadaten aller Stationen. Auf einem Webserver lädt `index.html` diese Datei. |
| `data/klimastationen.csv` | Dieselben Daten als Tabelle für Excel oder LibreOffice (Semikolon, Dezimalkomma). |
| `werkzeuge/klimadaten_aufbereiten.py` | Lädt die Werte neu vom Deutschen Wetterdienst und schreibt die beiden Dateien in `data/`. |
| `werkzeuge/stationsauswahl.csv` | Liste der Stationen mit WMO-Nummer, deutschem Namen, Land und Quelle. |
| `LICENSE-DATEN.txt`, `LICENSE-SCHRIFTEN.txt`, `LICENSE-D3-WORLD-ATLAS.txt` | Lizenzen der eingebetteten Daten, Schriften und Programmbibliotheken. |
| `.nojekyll` | Sorgt dafür, dass GitHub Pages die Dateien unverändert ausliefert. |

## Auf GitHub Pages veröffentlichen

1. Auf GitHub ein neues, öffentliches Repository anlegen, zum Beispiel `klimazonen-der-erde`.
2. Den **Inhalt** dieses Ordners hochladen (Schaltfläche „Add file“ → „Upload files“, alle Dateien und die Ordner `data` und `werkzeuge` hineinziehen). `index.html` muss oben im Repository liegen.
3. Unter **Settings → Pages** bei „Build and deployment“ die Quelle „Deploy from a branch“, den Branch `main` und den Ordner `/ (root)` wählen und speichern.
4. Nach ein bis zwei Minuten ist die Karte unter `https://<benutzername>.github.io/klimazonen-der-erde/` erreichbar.

Hinweis: Die Datei `.nojekyll` beginnt mit einem Punkt und wird auf manchen Rechnern ausgeblendet. Fehlt sie, funktioniert die Seite trotzdem.

## Ohne GitHub nutzen

- **Lokal:** `index.html` doppelt anklicken. Die Daten sind eingebaut; es wird keine Internetverbindung gebraucht.
- **Schulserver oder Lernplattform:** den ganzen Ordner hochladen und `index.html` verlinken.

## Daten aktualisieren

Klimanormalwerte ändern sich nur alle zehn Jahre. Die nächste Referenzperiode 2001–2030 veröffentlicht der Deutsche Wetterdienst nach 2030. Dann:

```bash
python3 werkzeuge/klimadaten_aufbereiten.py --periode 2001_2030
```

Das Skript braucht Python 3.9 oder neuer und keine Zusatzpakete. Es schreibt `data/klimastationen.json` und `data/klimastationen.csv` neu. Auf GitHub Pages oder dem Schulserver nutzt die Karte die neue Datei automatisch. Stationen ohne vollständige Werte überspringt das Skript und nennt sie. Weitere Stationen lassen sich in `werkzeuge/stationsauswahl.csv` mit ihrer WMO-Nummer ergänzen.

## Datenschutz

Keine Anmeldung, keine Cookies, keine Statistik, keine Inhalte von fremden Servern. Im Browser wird nur die gewählte Darstellung (Weltkarte oder Globus) gespeichert. Beim Aufruf über GitHub Pages sieht GitHub technisch die IP-Adresse der Besucher. Einzelheiten im Impressum.

## Quellen und Lizenzen

- Klimadaten: Datenbasis: Deutscher Wetterdienst, eigene Bearbeitung (CC BY 4.0).
- Kilimandscharo (Flughafen) und Jungfraujoch: WMO Member Nations (2023), WMO Climatological Standard Normals for 1991–2020, NOAA NCEI, doi:10.25921/800j-vn07.
- Land und Gebirge: Natural Earth (gemeinfrei); Landflächen in der Aufbereitung world-atlas (ISC).
- Schriften Bangers und Lexend: SIL Open Font License 1.1.
- d3-array und d3-geo: ISC-Lizenz; GeographicLib: MIT-Lizenz.

## Urheberrecht

© 2026 Andreas Bauer. Für Unterricht und andere nicht-kommerzielle Bildungszwecke frei nutzbar mit Quellenangabe:

> Klimazonen der Erde – ein Baustein von Terra Vergo. Idee, Konzept und Gestaltung: Andreas Bauer, 2026. Datenbasis: Deutscher Wetterdienst, eigene Bearbeitung.

Technische Umsetzung mit Unterstützung von Claude.ai (Anthropic).
