# Prof. Geos Erdlabor

Startseite für die interaktiven Lernanwendungen von **Terra Vergo** im Erdkundeunterricht:

| Ordner | Anwendung |
|---|---|
| `klimasimulation/` | **Terra Vergo**: zwei eigenständige Anwendungen, das Mystery „Das Rätsel vom Deich“ (`mystery.html`) und die Klimasimulation „Der Kontrollraum“ 2025–2075 (`klimasimulation.html`), dazu eine eigene Startseite, Begleitheft und Wissensbasis |
| `erdbeben/` | **Erdbeben-Globus**: echte USGS-Erdbebendaten auf Weltkarte und 3D-Globus, mit Begleitheft und Wissensbasis |
| `orientierung-breitenkreise/` | **Orientierung auf unserer Erde: Die Breitenkreise**: Globus, Gradnetz und Kartenentwürfe (Zylinder, Kegel, Ebene) für Klasse 5–7, mit Begleitheft und Wissensbasis |
| `christallers-land/` | **Christallers Land**: Planspiel zur Theorie der zentralen Orte in fünf Leveln, mit Anleitung in `LIESMICH.txt` |

Die einzelnen Geo-Anwendungen liegen in ihren jeweiligen Ordnern; ihre eigenen README-Dateien beschreiben Inhalt und Quellen.

## Inhalt des Pakets

```
index.html                     Startseite mit drehendem Globus und den Links zu den Anwendungen
assets/fonts/                  Schriften Bangers und Lexend (lokal, SIL Open Font License)
assets/vendor/                 d3-array und d3-geo (ISC-Lizenz) für den Globus
assets/land110.js              Landflächen (Natural Earth, gemeinfrei)
klimasimulation/               Terra Vergo
erdbeben/                      Erdbeben-Globus
christallers-land/             Christallers Land
orientierung-breitenkreise/    Orientierung auf unserer Erde: Die Breitenkreise
.github/workflows/             tägliche Aktualisierung der Erdbebendaten
.nojekyll                      GitHub Pages liefert alle Dateien unverändert aus
.gitattributes                 einheitliche Zeilenenden
```

## Auf GitHub hochladen (ohne Git)

1. Auf github.com ein neues, **öffentliches** Repository anlegen, zum Beispiel `erdlabor`.
2. **Add file → Upload files**: den *Inhalt* dieses Ordners (nicht den Ordner selbst) in das Fenster ziehen und mit **Commit changes** bestätigen.
   - Auf dem Mac sind die Dateien `.nojekyll`, `.gitattributes` und der Ordner `.github` versteckt. Im Finder mit **⌘ + ⇧ + .** einblenden, dann mit hochziehen.
   - Falls `.github` beim Hochladen fehlt: **Add file → Create new file**, als Namen `.github/workflows/erdbebendaten-aktualisieren.yml` eintippen und den Inhalt der gleichnamigen Datei aus dem Paket hineinkopieren.
3. **Settings → Pages**: unter „Build and deployment“ als Quelle **Deploy from a branch**, Branch `main`, Ordner `/ (root)` wählen und speichern.
4. **Settings → Actions → General**: unter „Workflow permissions“ **Read and write permissions** wählen und speichern. Damit darf die tägliche Aktualisierung die Erdbebendaten speichern.
5. Einmal von Hand starten: Reiter **Actions → Erdbebendaten aktualisieren → Run workflow**.

Nach wenigen Minuten ist alles erreichbar:

- Startseite: `https://<benutzername>.github.io/erdlabor/`
- Terra Vergo: `https://<benutzername>.github.io/erdlabor/klimasimulation/`
  - Mystery: `…/klimasimulation/mystery.html`
  - Klimasimulation: `…/klimasimulation/klimasimulation.html`
- Erdbeben-Globus: `https://<benutzername>.github.io/erdlabor/erdbeben/`

Hinweis: GitHub pausiert zeitgesteuerte Actions in Repositorys, in denen 60 Tage lang nichts passiert ist. Falls die Aktualisierung einmal stoppt, genügt im Reiter Actions ein Klick auf „Enable workflow“.

## Weitere Anwendungen ergänzen

1. Die neue Anwendung in einen eigenen Ordner legen, z. B. `vulkane/`, mit einer `index.html` darin.
2. In der Startseite `index.html` sind die Anwendungen nach Klassenstufen gegliedert (Klasse 5 und 6, Klasse 7 bis 10). Eine der Karten (`<a class="app" …>…</a>`) kopieren und `href`, Bild, Etikett, Titel und Text anpassen. Die Stelle ist mit einem Kommentar markiert. Die Karten ordnen sich von selbst in Spalten an.

## Datenschutz

Die Startseite lädt ausschließlich eigene Dateien: keine fremden Schriften, keine CDNs, keine Cookies, kein Tracking. Das gilt auch für beide Anwendungen. Die Erdbebendaten holt die GitHub-Action ab, nicht der Browser der Schülerinnen und Schüler. Beim Aufruf über GitHub Pages protokolliert GitHub die IP-Adresse der Besucher; Einzelheiten im Impressum (`klimasimulation/impressum.html`, `erdbeben/impressum.html`).

## Urheberrecht

© 2026 Andreas Bauer. Idee, Konzept und Gestaltung. Technische Umsetzung mit Unterstützung von Claude.ai (Anthropic). Für Unterricht und andere nicht-kommerzielle Bildungszwecke frei nutzbar mit Quellenangabe; Näheres in `klimasimulation/LICENSE.md` und in den Impressen. Eingebettete Fremdinhalte behalten ihre eigenen freien Lizenzen (siehe `assets/fonts/LICENSE-SCHRIFTEN.txt`, `assets/vendor/LICENSE-D3-WORLD-ATLAS.txt`).
