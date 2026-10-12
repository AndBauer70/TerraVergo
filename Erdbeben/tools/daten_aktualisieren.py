#!/usr/bin/env python3
"""Erdbeben-Globus: holt aktuelle Erdbebendaten vom USGS und schreibt data/erdbeben.json.

Aufruf (aus dem Hauptordner des Projekts):
    python3 tools/daten_aktualisieren.py

Benötigt nur Python 3.8 oder neuer, keine zusätzlichen Pakete.
Die GitHub-Action .github/workflows/daten-aktualisieren.yml ruft das Skript jeden Morgen auf.

Zeilenformat je Beben (wie im eingebauten Schnappschuss der index.html):
    [Minuten seit 1970 (UTC), Breite, Länge, Tiefe in km, Magnitude, Ort,
     Tsunami-Hinweis 0/1, PAGER-Stufe g/y/o/r oder "", USGS-ID]
"""
import datetime as dt
import json
import pathlib
import sys
import time
import urllib.request

FEEDS = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/"
FDSN = "https://earthquake.usgs.gov/fdsnws/event/1/query"
ZIEL = pathlib.Path(__file__).resolve().parent.parent / "data" / "erdbeben.json"
AGENT = "Erdbeben-Globus/1.0 (Unterrichtsprojekt Terra Vergo)"


def hole(url, versuche=3):
    for i in range(versuche):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": AGENT})
            with urllib.request.urlopen(req, timeout=90) as r:
                return json.load(r)
        except Exception as fehler:  # Netz oder Server kurz nicht erreichbar
            if i == versuche - 1:
                raise
            print(f"  Versuch {i + 1} fehlgeschlagen ({fehler}), neuer Versuch …", file=sys.stderr)
            time.sleep(10 * (i + 1))


def zeilen(geojson):
    out = []
    for f in geojson.get("features", []):
        p = f.get("properties") or {}
        g = f.get("geometry") or {}
        c = g.get("coordinates") or []
        if p.get("mag") is None or p.get("time") is None or len(c) < 2:
            continue
        tiefe = c[2] if len(c) > 2 and c[2] is not None else 0
        alert = p.get("alert") or ""
        out.append([
            round(p["time"] / 60000),
            round(c[1], 2),
            round(c[0], 2),
            round(tiefe),
            p["mag"],
            p.get("place") or "",
            1 if p.get("tsunami") else 0,
            alert[:1],
            f.get("id") or "",
        ])
    return out


def satz(geojson):
    meta = geojson.get("metadata") or {}
    gen = meta.get("generated") or int(time.time() * 1000)
    return {"gen": gen, "e": zeilen(geojson)}


def main():
    jetzt = dt.datetime.now(dt.timezone.utc)
    start = (jetzt - dt.timedelta(days=365)).strftime("%Y-%m-%dT%H:%M:%S")
    print("Lade USGS-Daten …")
    daten = {
        "week": satz(hole(FEEDS + "2.5_week.geojson")),
        "month": satz(hole(FEEDS + "4.5_month.geojson")),
        "year": satz(hole(f"{FDSN}?format=geojson&starttime={start}&minmagnitude=5&orderby=time")),
    }
    for k, v in daten.items():
        print(f"  {k}: {len(v['e'])} Beben")
    if len(daten["month"]["e"]) < 100 or len(daten["year"]["e"]) < 500:
        sys.exit("Zu wenige Beben geladen, die alte Datei bleibt unverändert.")

    # Eine Zeile je Beben: Git speichert dann nur die geänderten Zeilen.
    teile = ["{"]
    for i, (k, v) in enumerate(daten.items()):
        teile.append(f'"{k}":{{"gen":{v["gen"]},"e":[')
        teile.append(",\n".join(json.dumps(z, ensure_ascii=False, separators=(",", ":")) for z in v["e"]))
        teile.append("]}" + ("," if i < len(daten) - 1 else ""))
    teile.append("}")
    ZIEL.parent.mkdir(parents=True, exist_ok=True)
    ZIEL.write_text("\n".join(teile) + "\n", encoding="utf-8")
    json.loads(ZIEL.read_text(encoding="utf-8"))  # Selbstprüfung
    print(f"Geschrieben: {ZIEL}")


if __name__ == "__main__":
    main()
