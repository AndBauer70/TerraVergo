#!/usr/bin/env python3
"""Erzeugt die Spurenkarte für das Mystery „Das Rätsel von Rungholt“ (src/rungholt_map.svg).

Küstenlinie: OpenStreetMap-Landflächen, vereinfacht auf etwa 100 m (geo-maps, earth-lands-100m),
© OpenStreetMap-Mitwirkende, Lizenz ODbL. Watt und Priele sind von Hand schematisch eingezeichnet.
Aufruf: python3 gen_rungholt_map.py earth-lands-100m.geo.json
(Download: https://github.com/simonepri/geo-maps/releases/download/v0.6.0/earth-lands-100m.geo.json;
benötigt das Python-Paket shapely). Die Karte ist eingecheckt, das Skript braucht man nur für Änderungen.
Die Projektion muss zu RPROJ in rungholt.js passen."""
import json, math, sys, pathlib
from shapely.geometry import shape, box, Polygon, LineString
from shapely.ops import unary_union

LON0, LON1, LAT0, LAT1 = 8.25, 9.10, 54.33, 54.68
K = math.cos(math.radians(54.5))
W = 1200
S = W / ((LON1 - LON0) * K)
H = round((LAT1 - LAT0) * S)
KM = S / 111.2  # Pixel pro Kilometer

def P(lon, lat):
    return ((lon - LON0) * K * S, (LAT1 - lat) * S)

def chaikin(pts, n=2):
    for _ in range(n):
        out = []
        for i in range(len(pts)):
            a, b = pts[i], pts[(i + 1) % len(pts)]
            out += [(0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]), (0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1])]
        pts = out
    return pts

def d_ring(pts, smooth=True):
    if smooth:
        pts = chaikin(pts)
    return 'M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in pts) + 'Z'

def d_line(pts):
    return 'M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in pts)

# ---------- Land ----------
src = json.load(open(sys.argv[1]))
geom = src['geometries'][0] if 'geometries' in src else src['features'][0]['geometry']
B = box(LON0 - 0.05, LAT0 - 0.05, LON1 + 0.05, LAT1 + 0.05)
parts = []
for poly in geom['coordinates']:
    xs = [p[0] for p in poly[0]]; ys = [p[1] for p in poly[0]]
    if max(xs) < B.bounds[0] or min(xs) > B.bounds[2] or max(ys) < B.bounds[1] or min(ys) > B.bounds[3]:
        continue
    s = shape({'type': 'Polygon', 'coordinates': poly}).intersection(B)
    if not s.is_empty:
        parts.append(s)
land = unary_union(parts)
land_d, sand_d = [], []
for p in getattr(land, 'geoms', [land]):
    if p.area * 111.2 * 111.2 * K < 0.1:  # kleiner als 0,1 km² weglassen
        continue
    ring = [P(*c) for c in list(p.exterior.coords)[:-1]]
    c = p.representative_point()
    if c.x < 8.51 and 54.42 < c.y < 54.59:  # Außensände (Japsand, Norderoogsand, Süderoogsand): Sand, kein Marschland
        sand_d.append(d_ring(ring)); continue
    land_d.append(d_ring(ring))
    for hole in p.interiors:  # Seen an Land: nur größere behalten
        hp = Polygon(hole)
        if hp.area * 111.2 * 111.2 * K > 0.6:
            land_d.append(d_ring([P(*c) for c in list(hole.coords)[:-1]]))

# ---------- Watt (schematisch): alles östlich der Außensände ----------
OUTER = [(8.33, 54.69), (8.335, 54.64), (8.37, 54.603), (8.44, 54.592), (8.452, 54.575), (8.448, 54.54), (8.452, 54.50),
         (8.44, 54.47), (8.445, 54.432), (8.50, 54.412), (8.58, 54.402), (8.63, 54.387), (8.60, 54.36), (8.575, 54.32)]
watt = [P(*c) for c in OUTER] + [P(LON1 + .05, LAT0 - .05), P(LON1 + .05, LAT1 + .05)]

# ---------- Priele (schematisch), Breite in km ----------
CHANNELS = {
    'hever': ([(8.27, 54.404), (8.40, 54.407), (8.50, 54.406), (8.58, 54.418), (8.64, 54.43), (8.69, 54.44), (8.75, 54.44),
               (8.82, 54.437), (8.88, 54.441), (8.95, 54.453), (9.015, 54.472)], 1.7, 0.45),
    'norderhever': ([(8.69, 54.44), (8.70, 54.47), (8.735, 54.495), (8.76, 54.52), (8.778, 54.55), (8.79, 54.585)], 1.0, 0.35),
    'suederaue': ([(8.36, 54.486), (8.45, 54.487), (8.50, 54.489), (8.552, 54.51), (8.575, 54.545), (8.60, 54.575), (8.66, 54.59), (8.72, 54.605)], 1.1, 0.35),
    'norderaue': ([(8.36, 54.598), (8.42, 54.603), (8.50, 54.612), (8.57, 54.618), (8.64, 54.622)], 0.9, 0.3),
}
def chaikin_open(pts, n=3):
    for _ in range(n):
        out = [pts[0]]
        for a, b in zip(pts, pts[1:]):
            out += [(0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]), (0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1])]
        out.append(pts[-1])
        pts = out
    return pts

chan_svg = []
for name, (pts, w0, w1) in CHANNELS.items():
    px = chaikin_open([P(*c) for c in pts])
    n = len(px) - 1
    for i in range(n):  # viele kurze Stücke mit runden Enden ergeben einen sich verjüngenden Priel
        w = (w0 + (w1 - w0) * (i / max(1, n - 1))) * KM
        chan_svg.append(f'<path d="{d_line(px[i:i + 2])}" stroke-width="{w:.1f}"/>')
# kleine Seitenpriele als Schmuck
TWIGS = [[(8.75, 54.44), (8.77, 54.425), (8.80, 54.418)], [(8.70, 54.47), (8.672, 54.483)], [(8.82, 54.437), (8.83, 54.452), (8.85, 54.459)],
         [(8.58, 54.418), (8.60, 54.44), (8.62, 54.462)], [(8.552, 54.51), (8.53, 54.53)], [(8.76, 54.52), (8.785, 54.515)],
         [(8.64, 54.43), (8.66, 54.415), (8.70, 54.405)], [(8.50, 54.489), (8.51, 54.47), (8.53, 54.45)]]
twig_svg = ''.join(f'<path d="{d_line(chaikin_open([P(*c) for c in t]))}"/>' for t in TWIGS)

def lbl(lon, lat, text, cls, anchor='middle', rot=0):
    x, y = P(lon, lat)
    r = f' transform="rotate({rot} {x:.0f} {y:.0f})"' if rot else ''
    return f'<text x="{x:.0f}" y="{y:.0f}" class="{cls}" text-anchor="{anchor}"{r}>{text}</text>'

labels = [
    lbl(8.30, 54.50, 'NORDSEE', 'ml-sea', rot=-90),
    lbl(8.645, 54.527, 'Pellworm', 'ml-isl'), lbl(8.86, 54.488, 'Nordstrand', 'ml-isl'),
    lbl(8.545, 54.568, 'Hooge', 'ml-sm'), lbl(8.487, 54.447, 'Süderoogsand', 'ml-xs', rot=-62), lbl(8.478, 54.528, 'Norderoogsand', 'ml-xs', rot=-80), lbl(8.462, 54.572, 'Japsand', 'ml-xs', rot=-75),
    lbl(8.553, 54.455, 'Süderoog', 'ml-xs', 'start'), lbl(8.84, 54.556, 'Nordstrandischmoor', 'ml-xs', 'start'),
    lbl(8.735, 54.462, 'Hallig Südfall', 'ml-hl', 'start'),
    lbl(8.39, 54.648, 'Amrum', 'ml-sm', rot=-58), lbl(8.47, 54.657, 'Föhr ↑', 'ml-sm'), lbl(8.56, 54.636, 'Langeneß', 'ml-xs'),
    lbl(8.73, 54.37, 'Eiderstedt', 'ml-isl'), lbl(9.0, 54.60, 'Festland', 'ml-isl'),
    lbl(9.06, 54.486, 'Husum', 'ml-town', 'end'),
    lbl(8.40, 54.399, 'Hever', 'ml-ch'), lbl(8.905, 54.437, 'Heverstrom', 'ml-ch', rot=12),
    lbl(8.788, 54.575, 'Norderhever', 'ml-ch', rot=-62), lbl(8.43, 54.48, 'Süderaue', 'ml-ch'),
    lbl(8.62, 54.462, 'Watt', 'ml-watt'), lbl(8.95, 54.52, 'Watt', 'ml-watt'), lbl(8.70, 54.585, 'Watt', 'ml-watt'),
]
dots = ''
for lon, lat, r in [(9.045, 54.48, 6), (8.7264, 54.4653, 3.5)]:
    x, y = P(lon, lat)
    dots += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" class="ml-dot"/>'

# Planquadrate A–H, 1–6
cols, rows = 8, 6
cw, rh = W / cols, H / rows
grid = ''.join(f'<line x1="{i * cw:.1f}" y1="0" x2="{i * cw:.1f}" y2="{H}"/>' for i in range(1, cols))
grid += ''.join(f'<line x1="0" y1="{j * rh:.1f}" x2="{W}" y2="{j * rh:.1f}"/>' for j in range(1, rows))
glab = ''.join(f'<g transform="translate({(i + .5) * cw:.1f},14)"><rect x="-11" y="-11" width="22" height="20" rx="5"/><text y="4">{"ABCDEFGH"[i]}</text></g>' for i in range(cols))
glab += ''.join(f'<g transform="translate(15,{(j + .5) * rh:.1f})"><rect x="-11" y="-10" width="22" height="20" rx="5"/><text y="5">{j + 1}</text></g>' for j in range(rows))

# Maßstab und Nordpfeil
sx, sy = W - 330, H - 40
scale = (f'<g class="ml-scale" transform="translate({sx},{sy})"><rect x="-10" y="-22" width="{5 * KM * 2 + 20:.0f}" height="40" rx="8"/>'
         f'<rect x="0" y="-4" width="{10 * KM:.1f}" height="8" fill="#fff" stroke="#1B1B2F" stroke-width="1.5"/><rect x="0" y="-4" width="{5 * KM:.1f}" height="8" fill="#1B1B2F"/>'
         f'<path d="M0 -4v8M{5 * KM:.1f} -4v8M{10 * KM:.1f} -4v8" stroke="#1B1B2F" stroke-width="2"/>'
         f'<text x="0" y="-9">0</text><text x="{5 * KM:.1f}" y="-9">5</text><text x="{10 * KM:.1f}" y="-9">10 km</text></g>')
north = (f'<g class="ml-north" transform="translate({W - 52},{H - 110})"><circle r="26"/><path d="M0 -20 8 8 0 3 -8 8Z" fill="#1B1B2F"/>'
         f'<text y="-29">N</text></g>')
attrib = f'<text x="{W - 8}" y="{H - 8}" class="ml-attr" text-anchor="end">Küste: © OpenStreetMap-Mitwirkende (ODbL), vereinfacht · Watt und Priele schematisch</text>'

svg = f'''<svg id="rmap" viewBox="0 0 {W} {H}" role="img" aria-labelledby="rmapt" xmlns="http://www.w3.org/2000/svg">
<title id="rmapt">Karte des nordfriesischen Wattenmeers heute, von Amrum und Föhr im Norden bis Eiderstedt im Süden, mit Planquadraten A bis H und 1 bis 6</title>
<defs><pattern id="wattdots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="#B89A5B" opacity=".55"/><circle cx="6.5" cy="6.5" r=".9" fill="#B89A5B" opacity=".4"/></pattern>
<pattern id="waves" width="46" height="26" patternUnits="userSpaceOnUse"><path d="M4 14c4-4 8-4 12 0s8 4 12 0" fill="none" stroke="#fff" stroke-width="2" opacity=".45" stroke-linecap="round"/></pattern></defs>
<rect width="{W}" height="{H}" fill="#5AA9E6"/><rect width="{W}" height="{H}" fill="url(#waves)"/>
<path d="{d_ring(watt, False)}" fill="#EAD9A8"/><path d="{d_ring(watt, False)}" fill="url(#wattdots)"/>
<g class="ml-twig" fill="none" stroke="#5AA9E6" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">{twig_svg}</g>
<g fill="none" stroke="#5AA9E6" stroke-linecap="round" stroke-linejoin="round">{''.join(chan_svg)}</g>
<path d="{' '.join(land_d)}" fill="#9ED28B" stroke="#1B1B2F" stroke-width="2.5" stroke-linejoin="round" fill-rule="evenodd"/>
<path d="{' '.join(sand_d)}" fill="#F6E7B8" stroke="#1B1B2F" stroke-width="2" stroke-dasharray="6 4"/>
<g class="ml-grid">{grid}</g>
<g class="ml-labels">{''.join(labels)}{dots}</g>
<g class="ml-glab">{glab}</g>
{scale}{north}{attrib}
<g id="rzones"></g><g id="rpins"></g>
</svg>'''
out = pathlib.Path(__file__).parent / 'src' / 'rungholt_map.svg'
out.write_text(svg)
print('rungholt_map.svg', W, 'x', H, 'px,', round(KM, 2), 'px/km,', len(svg) // 1024, 'KB')
