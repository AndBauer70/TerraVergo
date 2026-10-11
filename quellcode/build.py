#!/usr/bin/env python3
"""Baut Terra Vergo aus den Quelldateien in src/ zu index.html, begleitheft.html und wissensbasis.html (Ordner build/).
Aufruf: python3 build.py   (benötigt Python 3 und das Paket markdown)"""
import base64, re, pathlib
ROOT = pathlib.Path(__file__).parent
SRC = ROOT / 'src'
OUT = ROOT / 'build'
FONTS = ROOT / 'schriften'
OUT.mkdir(exist_ok=True)

def b64(p):
    return base64.b64encode(p.read_bytes()).decode()

fontcss = "@font-face{font-family:'Bangers';font-style:normal;font-weight:400;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}\n" % b64(FONTS / 'bangers-latin-400-normal.woff2')
for w in (400, 600, 700, 800):
    fontcss += "@font-face{font-family:'Lexend';font-style:normal;font-weight:%d;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}\n" % (w, b64(FONTS / f'lexend-latin-{w}-normal.woff2'))

css = (SRC / 'orig.css').read_text() + '\n' + (SRC / 'new.css').read_text()
owl = (SRC / 'owl.svg').read_text()
# Muster für das Hemd von Prof. Geo wandert in die globale Symbol-Datei, damit es nur einmal definiert ist
pat = re.search(r'<pattern id="shirtdots".*?</pattern>', owl, re.S).group(0)
owl = owl.replace(pat, '')
person = re.search(r'(<g transform="translate\(22,8\) scale\(\.9\)">.*?</g>\s*)</g>\s*</svg>', owl, re.S).group(1)
geo_symbol = ('<symbol id="i-geo" viewBox="0 0 130 140"><g stroke="#1B1B2F" stroke-linejoin="round" stroke-linecap="round">'
              + person.replace('class="blink"', '') + '</g></symbol>')
symbols = (SRC / 'orig_symbols.svg').read_text() + (SRC / 'symbols_new.svg').read_text() + '\n  ' + pat + '\n  ' + geo_symbol
sprite = f'<svg width="0" height="0" style="position:absolute" aria-hidden="true">\n <defs>\n{symbols}\n </defs>\n</svg>'

body = (SRC / 'body.html').read_text().replace('{{OWL}}', owl.strip()).replace('{{MAPBASE}}', (SRC / 'mapbase.svg').read_text().strip())
# 3D-Globus: d3-array und d3-geo (ISC-Lizenz, siehe src/vendor/LICENSE-D3-WORLD-ATLAS.txt) und Landflächen von Natural Earth (gemeinfrei)
vendor = '\n'.join((SRC / 'vendor' / f).read_text().strip() for f in ('d3-array.min.js', 'd3-geo.min.js'))
land = 'const LAND=' + (SRC / 'land110.json').read_text().strip() + ';'
js = '\n'.join([(SRC / 'data.js').read_text(), (SRC / 'ui.js').read_text(), land, (SRC / 'globe.js').read_text(), (SRC / 'mystery.js').read_text()])

title = '<title>Terra Vergo</title>'
style = f'<style>\n{fontcss}</style>\n<style>\n{css}\n</style>'
content = f'{title}\n{style}\n{sprite}\n{body}\n<script>\n{vendor}\n</script>\n<script>\n{js}\n</script>\n'

head = ('<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '<meta name="description" content="Terra Vergo: ein kybernetisches Klimaspiel mit Mystery-Einstieg zu Kipppunkten, Vulnerabilität und Resilienz für die Klassen 7 bis 10.">\n'
        '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n')
full = head + f'{title}\n{style}\n</head>\n<body>\n{sprite}\n{body}\n<script>\n{vendor}\n</script>\n<script>\n{js}\n</script>\n</body>\n</html>\n'
(OUT / 'index.html').write_text(full)
(OUT / 'artifact.html').write_text(content)
print('index.html', len(full) // 1024, 'KB')

# ---------- Begleitheft ----------
bh_body = (SRC / 'begleitheft_body.html').read_text().replace('{{ELEMENTS}}', (SRC / 'bh_elements.html').read_text())
bh_sprite = f'<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>{pat}{geo_symbol}</defs></svg>'
bh_css = (SRC / 'bh.css').read_text()
bh = (head.replace('Terra Vergo: ein kybernetisches Klimaspiel', 'Begleitheft zu Terra Vergo, einem kybernetischen Klimaspiel')
      + f'<title>Begleitheft Terra Vergo</title>\n<style>\n{fontcss}</style>\n<style>\n{bh_css}\n</style>\n</head>\n<body>\n{bh_sprite}\n{bh_body}\n</body>\n</html>\n')
(OUT / 'begleitheft.html').write_text(bh)
print('begleitheft.html', len(bh) // 1024, 'KB')

# ---------- Wissensbasis als lesbare Seite ----------
import markdown
md = (SRC / 'wissensbasis.md').read_text()
wb_html = markdown.markdown(md, extensions=['tables'])
wb_html = re.sub(r'<table>', '<div class="tblw"><table>', wb_html).replace('</table>', '</table></div>')
wb_html = wb_html.replace('<a href="http', '<a target="_blank" rel="noopener" href="http')
wb_css = bh_css + '\n.doc h1{font-size:clamp(1.8rem,4.5vw,2.6rem)} .doc table{min-width:640px} .doc td,.doc th{font-size:.8rem} .wbhead{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center;border-bottom:3px dashed var(--ink);padding-bottom:10px;margin-bottom:10px}\n'
wb = (head.replace('Terra Vergo: ein kybernetisches Klimaspiel', 'Wissensbasis zu Terra Vergo, einem kybernetischen Klimaspiel')
      + f'<title>Wissensbasis Terra Vergo</title>\n<style>\n{fontcss}</style>\n<style>\n{wb_css}\n</style>\n</head>\n<body>\n<div class="doc"><div class="wbhead"><p class="logo" style="font-size:2.4rem;margin:0">Terra Vergo</p><span class="meta">Wissensbasis, Stand Oktober 2026. <a href="index.html">Zum Spiel</a>, <a href="begleitheft.html">Begleitheft</a>, <a href="impressum.html">Impressum</a></span></div>\n{wb_html}\n</div>\n</body>\n</html>\n')
(OUT / 'wissensbasis.html').write_text(wb)
print('wissensbasis.html', len(wb) // 1024, 'KB')

# ---------- Impressum ----------
imp_css = wb_css + '\n.imp h1{margin-top:18px} .imp h2{font-size:1.45rem;margin:24px 0 6px} .imp .addr{font-weight:600;line-height:1.5} .foot{margin-top:18px;text-align:center}\n'
imp = (head.replace('<meta name="description" content="Terra Vergo: ein kybernetisches Klimaspiel mit Mystery-Einstieg zu Kipppunkten, Vulnerabilität und Resilienz für die Klassen 7 bis 10.">', '<meta name="description" content="Impressum von Terra Vergo, einem kybernetischen Klimaspiel.">')
       + f'<title>Impressum Terra Vergo</title>\n<style>\n{fontcss}</style>\n<style>\n{imp_css}\n</style>\n</head>\n<body>\n' + (SRC / 'impressum_body.html').read_text() + '\n</body>\n</html>\n')
(OUT / 'impressum.html').write_text(imp)
print('impressum.html', len(imp) // 1024, 'KB')

# ---------- Lösungsblatt (nur für Lehrkräfte, nicht veröffentlichen) ----------
if not (SRC / 'loesung_body.html').exists():
    print('Lösungsblatt übersprungen (loesung_body.html liegt nur im Lehrkräfte-Ordner).'); import sys; sys.exit(0)
lo_body = (SRC / 'loesung_body.html').read_text()
lo = (head.replace('Terra Vergo: ein kybernetisches Klimaspiel mit Mystery-Einstieg zu Kipppunkten, Vulnerabilität und Resilienz für die Klassen 7 bis 10.', 'Lösungsblatt für Lehrkräfte zu Terra Vergo.').replace('<meta name="description"', '<meta name="robots" content="noindex">\n<meta name="description"')
      + f'<title>Lösungsblatt Terra Vergo</title>\n<style>\n{fontcss}</style>\n<style>\n{bh_css}\n</style>\n</head>\n<body>\n{bh_sprite}\n{lo_body}\n</body>\n</html>\n')
(OUT / 'loesung-lehrkraefte.html').write_text(lo)
print('loesung-lehrkraefte.html', len(lo) // 1024, 'KB')
