# Rettung auf Sogapalag

Funk-Abenteuer zur räumlichen Orientierung für **Klasse 5 und 6**, gespielt von **zwei Personen mit zwei Tablets**.

Der **abgestürzte Forscher im Dschungel** sieht nur einen gedrehten Ausschnitt der Insel ohne Nordpfeil und hat einen Kompass, den er auflegen und einnorden kann. Die **Expeditionsleiterin im Basiscamp** hat die nordausgerichtete topographische Karte mit Planquadraten, Signaturen und Maßstabsleiste. Sie lotst den Forscher per Funk, also nur mündlich, mit Himmelsrichtungen und Entfernungen um Berge, Schluchten, Seen, Flüsse und gefährliche Tiere herum ins Basiscamp.

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | die Anwendung (Startbildschirm, Forscher-Ansicht, Basiscamp-Karte) |
| `begleitheft.html` | Begleitheft für Lehrkräfte mit Kopiervorlagen; wird vom Werkzeug für den Bereich für Lehrkräfte eingesammelt und verschlüsselt |
| `README.md` | diese Beschreibung |

Die Schriften Bangers und Lexend kommen aus `../assets/fonts/` (SIL Open Font License). Die Anwendung lädt nichts von fremden Servern.

## So funktioniert es

- Beide Tablets geben **denselben Inselcode** ein und wählen **dieselbe Stufe**. Die Insel wird aus dem Code mit einem festen Zufallsverfahren erzeugt, deshalb entsteht auf beiden Geräten genau dieselbe Insel, ohne dass die Geräte Daten austauschen.
- Jede erzeugte Insel ist lösbar; der direkte Weg zwischen Absturzstelle und Basiscamp ist versperrt.
- Stufen: **Leicht** (N, O, S, W; 1 Feld = 100 m; 3 Peilungen), **Mittel** (8 Richtungen; 200 m; 2 Peilungen), **Schwer** (schräg gedrehte Ansicht; 250 m; 1 Peilung).
- Wer auf ein Feld mit einem gefährlichen Tier tritt, verliert ein Herz und geht ein Feld zurück. Nach drei Herzen steht der Forscher wieder an der Absturzstelle.
- Der Spielstand wird nur im lokalen Speicher des Browsers abgelegt (`rettung-sogapalag-v1`).

## Begleitheft verschlüsseln

Im Hauptordner des Erdlabors einmal aufrufen:

```
node lehrkraefte/werkzeug/verschluesseln.mjs
```

Das Werkzeug verschiebt `begleitheft.html` nach `_lehrkraefte-originale/rettung-auf-sogapalag/`, legt die verschlüsselte Fassung in `lehrkraefte/rettung-auf-sogapalag/` ab, setzt hier eine Weiterleitung und nimmt die Anwendung in die Übersicht für Lehrkräfte auf.

## Urheberrecht

© 2026 Andreas Bauer. Idee, Konzept und Gestaltung. Technische Umsetzung mit Unterstützung von Claude.ai (Anthropic). Für Unterricht und andere nicht-kommerzielle Bildungszwecke frei nutzbar mit Quellenangabe.
