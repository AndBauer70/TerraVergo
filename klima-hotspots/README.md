# Hotspot-Expedition

Interaktive Entdeckungstour für den Erdkundeunterricht, Klasse 7–10 (etwa 2 × 45 Minuten). Teil von **Terra Vergo**.

**Leitfrage:** Wo zeigt sich der Klimawandel heute schon am deutlichsten – und wie hängen die Hotspots zusammen?

## Ablauf

| Baustein | Inhalt |
|---|---|
| Basislager Mauna Loa | Keeling-Kurve mit echten Monatswerten (März 1958 bis September 2026), Ablesen per Maus oder Finger, Lupe über drei Jahre für den Jahresgang („die Erde atmet“), Trendlinie, vorindustrieller Wert, Kennzahlen und Lesetipps |
| Expeditionskarte | 25 Hotspots in fünf Sphären auf Weltkarte (Welt- und Europa-Ausschnitt) und 3D-Globus; Sphären ein- und ausblendbar; Europa-Cluster |
| Stationen | je Hotspot: Leitfrage, Sachtext, Fakten mit Quelle (IPCC-Aussagen mit Vertrauensgrad blau markiert), Kipppunkt-Skala, Wechselwirkungen, Querverweise auf andere Terra-Vergo-Anwendungen |
| Wechselwirkungen | 38 Pfeile (verstärkend, bremsend, unklar) nach Wunderling u. a. 2021/2024, GTPR 2025 und IPCC AR6 |
| Kipp-Thermometer | Regler 1–4,5 °C mit Voreinstellungen (heute, Paris, 2 °C, heutige Politik, sehr hohe Emissionen); zeigt, welche Schwellen überschritten sind; Schalter „Amazonas zu einem Viertel abgeholzt“ |
| Forschungspass, Bericht | Stempel für jeden besuchten Hotspot; Expeditionsbericht mit eigener Wirkungskette zum Kopieren oder Drucken |

## Sphären und Hotspots

- **Atmosphäre:** Basislager Mauna Loa, Ahrtal (Hitze und Starkregen), Karibik (Hurrikane), Persischer Golf (feuchte Hitze), Sahel (Monsun)
- **Hydrosphäre:** Golfstrom-System (AMOC), Malediven, Nordseeküste, El Niño, Weddellmeer
- **Kryosphäre:** Grönland, Westantarktis, arktisches Meereis, Himalaya/Karakorum, Aletschgletscher
- **Biosphäre:** Great Barrier Reef, Amazonas, Sundarbans, boreale Wälder, Nebelwald Monteverde
- **Pedosphäre:** Permafrost (Batagaika), Südost-Spanien, Kongo-Torf, Great Plains, ostfriesische Marsch

## Dateien

```
index.html                  die Anwendung (eine Datei, Schriften, d3 und Daten eingebettet)
quellcode/template.html     Quelltext mit Platzhaltern
quellcode/build.py          setzt Schriften, d3, Landflächen (aus DeepDive1) und CO₂-Daten ein
quellcode/co2_mm_mlo.csv    Monatsmittel Mauna Loa (NOAA GML / Scripps), Spalten: Monat, Dezimaljahr, Mittel, saisonbereinigt, …
LICENSE-SCHRIFTEN.txt       Lizenzen der Schriften Bangers und Lexend (SIL Open Font License)
```

Neu bauen (z. B. mit aktuelleren CO₂-Daten):

```
cd klima-hotspots/quellcode
python3 build.py ../../DeepDive1/index.html co2_mm_mlo.csv ../index.html
```

## Fachgrundlage

Wissensbasis „Klimafolgen und Kipppunkte für Terra Vergo“ (Oktober 2026). IPCC AR6 (WGI, WGII, Synthesebericht), Sonderberichte SROCC, SRCCL und SR1.5. Kipp-Schwellen nach Armstrong McKay u. a. 2022 (Science) und Global Tipping Points Report 2025. Koordinaten sind geografische Näherungswerte. Die CO₂-Daten stammen vom NOAA Global Monitoring Laboratory und der Scripps Institution of Oceanography.

## Datenschutz

Keine externen Schriften, keine CDNs, keine Cookies, kein Tracking. Fortschritt und Bericht werden nur im lokalen Speicher des Browsers abgelegt.

## Urheberrecht

© 2026 Andreas Bauer. Idee, Konzept und Gestaltung. Technische Umsetzung mit Unterstützung von Claude.ai (Anthropic). Für Unterricht und andere nicht-kommerzielle Bildungszwecke frei nutzbar mit Quellenangabe.
