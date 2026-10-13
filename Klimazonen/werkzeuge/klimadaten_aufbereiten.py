#!/usr/bin/env python3
"""Klimazonen der Erde – Klimadaten neu aufbereiten.

Lädt die Klimanormalwerte der Stationen aus werkzeuge/stationsauswahl.csv
vom Deutschen Wetterdienst (CLIMAT, multi-annual means) und, für die mit
"NOAA" gekennzeichneten Stationen, aus den WMO Climatological Standard
Normals der NOAA. Schreibt data/klimastationen.json und data/klimastationen.csv.

Aufruf (Python 3.9 oder neuer, keine Zusatzpakete):
    python3 werkzeuge/klimadaten_aufbereiten.py                # Periode 1991_2020
    python3 werkzeuge/klimadaten_aufbereiten.py --periode 2001_2030

Liegt die Karte auf GitHub Pages oder einem Schulserver, lädt sie die neue
JSON-Datei automatisch. Die in index.html eingebauten Daten bleiben als
Rückfall für den Offline-Betrieb bestehen.

Datenbasis: Deutscher Wetterdienst, eigene Bearbeitung (CC BY 4.0).
WMO Member Nations (2023): WMO Climatological Standard Normals for 1991-2020,
NOAA NCEI, doi:10.25921/800j-vn07.
"""
import argparse
import csv
import json
import sys
import urllib.request
from pathlib import Path

DWD = "https://opendata.dwd.de/climate_environment/CDC/"
NOAA = ("https://www.ncei.noaa.gov/data/oceans/archive/arc0216/0253808/3.3/data/0-data/"
        "data-composite-primary-parameters/wmo_normals_9120_{}.csv")
NOAA_FALLBACK = ("https://www.nodc.noaa.gov/archive/arc0216/0253808/3.3/data/0-data/"
                 "data-composite-primary-parameters/wmo_normals_9120_{}.csv")
ROOT = Path(__file__).resolve().parent.parent
MON = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]


def laden(url):
    print("lade", url)
    with urllib.request.urlopen(url, timeout=120) as r:
        return r.read().decode("utf-8", errors="replace")


def dwd_tabelle(text):
    """Station;Jan;...;Dez -> {id: [12 Werte oder None]}"""
    out = {}
    for zeile in text.splitlines()[1:]:
        v = zeile.split(";")
        if len(v) < 13:
            continue
        werte = []
        for x in v[1:13]:
            x = x.strip()
            try:
                werte.append(float(x) if x else None)
            except ValueError:
                werte.append(None)
        out[v[0].strip()] = werte
    return out


def dwd_stationen(text):
    """WMO-StationID;StationName;Latitude;Longitude;Height;Country"""
    out = {}
    for zeile in text.splitlines()[1:]:
        v = zeile.split(";")
        if len(v) < 6 or v[0] in out:
            continue
        try:
            out[v[0].strip()] = (float(v[2]), float(v[3]), int(float(v[4] or 0)))
        except ValueError:
            continue
    return out


def noaa_tabelle(text):
    """Komposit-CSV der WMO-Normalwerte -> {5-stellige WMO-ID: (lat, lon, höhe, [12 Werte])}"""
    out = {}
    for zeile in text.splitlines()[1:]:
        v = [x.strip() for x in zeile.split(",")]
        if len(v) < 22:
            continue
        wid = v[2][-5:]
        try:
            werte = [float(x) if x not in ("", "-9999", "-9999.0") else None for x in v[9:21]]
            out[wid] = (float(v[4]), float(v[5]), int(float(v[6])), werte)
        except ValueError:
            continue
    return out


def luecke_fuellen(werte):
    """Genau ein fehlender Monat wird aus den Nachbarmonaten ergänzt; sonst None."""
    if werte is None:
        return None
    fehlend = [i for i, x in enumerate(werte) if x is None]
    if len(fehlend) > 1:
        return None
    w = list(werte)
    if fehlend:
        i = fehlend[0]
        w[i] = round((w[i - 1] + w[(i + 1) % 12]) / 2, 1)
    return w


def jahresgang_plausibel(t):
    """Verwirft Reihen, in denen ein Monat um mehr als 9 °C vom Mittel der Nachbarmonate abweicht."""
    return all(abs(t[i] - (t[i - 1] + t[(i + 1) % 12]) / 2) <= 9 for i in range(12))


def niederschlag_plausibel(p):
    """Verwirft Reihen mit einem einzelnen Monat über 80 mm, der mehr als fünfmal so hoch ist wie beide Nachbarn."""
    return not any(p[i] > 80 and p[i] > 5 * max(p[i - 1], p[(i + 1) % 12], 1) for i in range(12))


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--periode", default="1991_2020", help="Referenzperiode des DWD, z. B. 1991_2020")
    args = ap.parse_args()
    per = args.periode

    auswahl = list(csv.DictReader(open(ROOT / "werkzeuge" / "stationsauswahl.csv", encoding="utf-8"), delimiter=";"))
    basis = DWD + "observations_global/CLIMAT/multi_annual/"
    T = dwd_tabelle(laden(f"{basis}air_temperature_mean/{per}.txt"))
    P = dwd_tabelle(laden(f"{basis}precipitation_total/{per}.txt"))
    ST = dwd_stationen(laden(DWD + "help/stations_list_CLIMAT_data.txt"))

    noaa = {}
    if any(s["quelle"] == "NOAA" for s in auswahl):
        if per != "1991_2020":
            print("Hinweis: NOAA-Stationen gibt es nur für 1991–2020; sie werden übernommen wie bisher.")
        def noaa_laden(name):
            try:
                return noaa_tabelle(laden(NOAA.format(name)))
            except Exception:
                return noaa_tabelle(laden(NOAA_FALLBACK.format(name)))
        noaa = {k: noaa_laden(k) for k in ("TAVG", "TMAX", "TMIN", "PRCP")}

    laender, daten, fehlt = [], [], []
    for s in auswahl:
        wid, quelle = s["wmo_id"], s["quelle"]
        if quelle == "NOAA":
            tavg = noaa["TAVG"].get(wid)
            if tavg and all(x is not None for x in tavg[3]):
                t = tavg[3]
            else:
                mx, mn = noaa["TMAX"].get(wid), noaa["TMIN"].get(wid)
                if not (mx and mn) or None in mx[3] + mn[3]:
                    fehlt.append(wid + " " + s["name"]); continue
                t = [(a + b) / 2 for a, b in zip(mx[3], mn[3])]
            pr = noaa["PRCP"].get(wid)
            p = pr[3] if pr and all(x is not None for x in pr[3]) else None
            la, lo, h = float(s["breite_korrigiert"]), float(s["laenge_korrigiert"]), int(s["hoehe_m_noaa"])
        else:
            t = luecke_fuellen(T.get(wid))
            if not t or wid not in ST or not jahresgang_plausibel(t):
                fehlt.append(wid + " " + s["name"]); continue
            la, lo, h = ST[wid]
            if s["breite_korrigiert"]:
                la, lo = float(s["breite_korrigiert"]), float(s["laenge_korrigiert"])
            p = luecke_fuellen(P.get(wid))
            if p and (min(p) < 0 or not niederschlag_plausibel(p)):
                p = None
        if s["land"] not in laender:
            laender.append(s["land"])
        tz = [round(x * 10) for x in t]
        daten.append([s["name"], laender.index(s["land"]), round(la, 2), round(lo, 2), h,
                      round(sum(tz) / 120, 1), tz, [round(x) for x in p] if p else 0, wid]
                     + ([1] if quelle == "NOAA" else []))

    # Länder alphabetisch
    sortiert = sorted(laender)
    for r in daten:
        r[1] = sortiert.index(laender[r[1]])
    daten.sort(key=lambda r: r[5])
    jahre = per.replace("_", "–")
    out = {"per": jahre, "quelle": "Datenbasis: Deutscher Wetterdienst, eigene Bearbeitung",
           "c": sortiert, "s": daten}
    (ROOT / "data").mkdir(exist_ok=True)
    json.dump(out, open(ROOT / "data" / "klimastationen.json", "w", encoding="utf-8"),
              ensure_ascii=False, separators=(",", ":"))

    f = lambda v, d=1: f"{v:.{d}f}".replace(".", ",")
    with open(ROOT / "data" / "klimastationen.csv", "w", newline="", encoding="utf-8-sig") as fh:
        w = csv.writer(fh, delimiter=";")
        w.writerow(["Station", "Land", "Breite", "Länge", "Höhe (m)", "Jahresmittel (°C)"]
                   + [f"T {m} (°C)" for m in MON] + [f"N {m} (mm)" for m in MON]
                   + ["Jahresniederschlag (mm)", "WMO-ID", "Quelle"])
        for r in sorted(daten, key=lambda r: r[0]):
            p = r[7] or None
            w.writerow([r[0], sortiert[r[1]], f(r[2], 2), f(r[3], 2), r[4], f(r[5])]
                       + [f(x / 10) for x in r[6]] + ([str(x) for x in p] if p else [""] * 12)
                       + [sum(p) if p else "", r[8], "NOAA (WMO-Normalwerte)" if len(r) > 9 else "DWD (CLIMAT)"])

    print(f"{len(daten)} Stationen geschrieben ({jahre}).")
    if fehlt:
        print(f"{len(fehlt)} Stationen ohne vollständige Werte übersprungen:", ", ".join(fehlt[:20]),
              "…" if len(fehlt) > 20 else "")
    return 0


if __name__ == "__main__":
    sys.exit(main())
