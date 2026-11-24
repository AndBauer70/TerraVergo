# Volle Netze

Rollenspiel für Erdkunde Jahrgang 7 bis 10 (KC Niedersachsen Gymnasium: KT 5 „Zukunftsraum Weltmeere“; LehrplanPLUS Bayern: Geo 7 LB 6; Bildungsplan Hamburg: 3.2 „Geosphären“, Studienstufe V 5). Teil von **Terra Vergo**.

**Auftrag an die Klasse:** Macht eure Crew zum erfolgreichsten Fischereibetrieb im Hafen!
**Leitfrage (erst in der Auswertung):** Warum fischen Crews ein Meer leer, obwohl das keine von ihnen will?

Zwei bis sechs Crews führen Fischereibetriebe: Sie kaufen Boote, verteilen sie auf Hochsee, Küste und Hafen, handeln untereinander und ziehen Jahr für Jahr Bilanz. Der Fischbestand bleibt bis zur Auswertung verborgen. Die Einführung verrät bewusst nichts über Überfischung oder Nachhaltigkeit.

| Phase | Inhalt |
|---|---|
| 0 Start | Auftrag, Ziel Vermögen, Regeln in vier Comic-Bildern, Strategie notieren |
| 1 Crews | 2 bis 6 Crews mit Namen, 6 bis 15 Fangjahre; entweder alle an einem Gerät (mit Sichtschutz) oder jede Crew am eigenen Tablet im WLAN |
| 2 Auf See | Spielbrett mit verborgenem Bestand, Hafentafel (Fang je Boot), Crew-Karten mit + und −, Werft, Handel zwischen Crews, Fangbericht mit Schlagzeilen; Spielleitung mit Bestandsanzeige, Fangquote, Jahr zurücknehmen, Spielende |
| 3 Auswertung | Bestand und Flotte im Diagramm, Fang je Boot, Rangliste und Gesamtvermögen, Begriff Allmende, Wirkungsgefüge mit verstärkendem Kreislauf |
| 4 Nachdenken | fünf Aufgaben mit Operatoren (AFB I–III), Transfer auf das Klima, Grenzen des Modells |
| Ergebnis | Bericht zum Kopieren und Drucken |

**Spiel mit bis zu 6 Tablets:** Das Gerät der Spielleitung ist der Hafen (Beamer): Es rechnet das Spiel und lässt ausfahren. Jede Crew öffnet die Seite auf ihrem Tablet und wählt „Als Crew beitreten“ (`#crew`). Gekoppelt wird einmalig per QR-Code in beide Richtungen (Angebot vom Hafen, Antwort vom Tablet, ersatzweise als Text). Danach verbinden sich die Geräte direkt über WebRTC im selben WLAN: kein Server, kein STUN- oder Relay-Dienst, keine externen Anfragen. Übertragen werden nur Spielzahlen und Crew-Namen; die Kamera liest nur QR-Codes. Voraussetzungen: alle Geräte im selben WLAN, das die Geräte nicht voneinander abschottet (keine „Client-Isolation“), Kamerazugriff (nur über https, also GitHub Pages, oder lokal). Das Hafen-Gerät während des Spiels nicht neu laden; getrennte Tablets lassen sich mit „neu verbinden“ wieder koppeln, der Spielstand bleibt im Hafen.

**Modell:** eigene Modellannahmen (logistisches Wachstum, Fang je Boot sinkt erst unter 40 % des Höchstbestands, kaum Nachwuchs unter 15 %, Bauzeit ein Jahr, Wetter ±15 %). Alle Werte sind in der Anwendung unter „Spielleitung“ und im Begleitheft offengelegt; es sind keine Messwerte.

**Material für Lehrkräfte** (nur über den Bereich für Lehrkräfte verlinkt, nicht in der Anwendung): Begleitheft, verschlüsselt unter `lehrkraefte/volle-netze/`, Original in `_lehrkraefte-originale/volle-netze/`.

## Spielidee und Urheberrecht

Eigenständiges Spiel. Übernommen ist nur die allgemeine Spielidee einer Fischerei-Simulation, wie sie durch *Fish Banks, Ltd.* (Dennis L. Meadows, University of New Hampshire) und *Fishbanks: A Renewable Resource Management Simulation* (Meadows, Sterman und King, MIT Sloan) bekannt wurde. Name, Texte, Grafiken, Regeln im Einzelnen, Code und Modellwerte sind eigene Entwicklungen; keine Verbindung zu den genannten Urhebern, zur University of New Hampshire, zum MIT oder zu Forio. Alle Grafiken sind eigene SVG-Zeichnungen.

## Quellen

Meadows, Fiddaman & Shannon (1986/1993): Fish Banks, Ltd.; Meadows, Sterman & King: Fishbanks (MIT Sloan Teaching Resources Library); Hardin (1968): The tragedy of the commons; Ostrom (1990): Governing the commons. Im Begleitheft zusätzlich FAO (2026): The State of World Fisheries and Aquaculture 2026.

Schriften Bangers und Lexend eingebettet (SIL Open Font License, siehe `LICENSE-SCHRIFTEN.txt`). Eingebettete Bibliotheken: jsQR 1.4.0 (Apache License 2.0) und QR Code Generator for JavaScript 2.0.4 (MIT), siehe `LICENSE-BIBLIOTHEKEN.txt`. Keine externen Ressourcen, keine Cookies; Spielstand und Eingaben nur im `localStorage` des Browsers (Schlüssel `volle-netze-v1`).

Dateien: `index.html`, `README.md`, `LICENSE-SCHRIFTEN.txt`, `LICENSE-BIBLIOTHEKEN.txt`. © 2026 Andreas Bauer, technische Umsetzung mit Unterstützung von Claude (Anthropic).
