# Mangroven – sensible Ökosysteme

Interaktive Lernanwendung für den Erdkundeunterricht, Jahrgang 7 (Gymnasium), etwa 90 Minuten. Teil von **Terra Vergo**.

**Leitfrage:** Was passiert mit der Küste, wenn Mangrovenwälder für Garnelenteiche gerodet werden?

## Ablauf

| Phase | Inhalt |
|---|---|
| 1 Entdecken | Querschnitt einer Mangrovenküste mit Regler für Ebbe und Flut, sieben Ökosystemleistungen zum Entdecken, Faktenkacheln mit Quellen |
| 2 Vermuten | Vermutung zu Mangrovenfläche, Fischbestand, Küstenschutz und Kohlenstoffspeicher; Hypothese mit „Wenn …, dann …, weil …“ |
| 3 Modellieren | Wirkungsgefüge mit 9 oder 14 Karten, Pfeile mit + oder −, Prüfung je Pfeil, automatische Erkennung von Rückkopplungen, drei Hilfestufen |
| 4 Simulieren | 30 Jahre einer Küste: Umwandlungsanteil, Rückkopplung (Neurodung) und Renaturierung schaltbar; Kipppunkt; Abgleich mit der Hypothese |
| 5 Bewerten | Fünf Lösungen nach vier ökologischen Kriterien, begründetes Urteil, Hinweis auf die fehlende soziale und wirtschaftliche Sicht |
| Ergebnis | Forschungsbericht als Text zum Kopieren |

Perspektive: Im Mittelpunkt steht die ökologische Dimension der Nachhaltigkeit. Soziale und wirtschaftliche Dimension sind bewusst reduziert und in der Anwendung als Lücke markiert.

## Dateien

```
index.html             die Anwendung (eine Datei, Schriften eingebettet)
begleitheft.html       Begleitheft für Lehrkräfte (wird verschlüsselt, siehe unten)
wissensbasis.html      Zahlen, Fakten und Quellen mit Belegstatus (wird verschlüsselt)
LICENSE-SCHRIFTEN.txt  Lizenzen der Schriften Bangers und Lexend (SIL Open Font License)
```

Begleitheft und Wissensbasis gehören in den Bereich für Lehrkräfte. Nach dem Ablegen im Hauptordner `node lehrkraefte/werkzeug/verschluesseln.mjs` aufrufen; das Werkzeug verschiebt die Originale nach `_lehrkraefte-originale/mangroven/`, verschlüsselt sie und setzt Weiterleitungen.

## Datenschutz

Keine externen Schriften, keine CDNs, keine Cookies, kein Tracking. Eingaben werden nur im lokalen Speicher des Browsers abgelegt.

## Quellen

Alle Fachquellen mit Belegstatus stehen in der Wissensbasis. Die wichtigsten: UNDRR/PreventionWeb „Loss of Mangroves“ (mit Daten von Bunting u. a. 2022 und Goldberg u. a. 2020), Donato u. a. 2011 (Nature Geoscience), Tran & Bui 2018 (Polish Journal of Soil Science), Frontiers in Ecology and Evolution 2025.

## Urheberrecht

© 2026 Andreas Bauer. Idee, Konzept und Gestaltung. Technische Umsetzung mit Unterstützung von Claude.ai (Anthropic). Für Unterricht und andere nicht-kommerzielle Bildungszwecke frei nutzbar mit Quellenangabe.
