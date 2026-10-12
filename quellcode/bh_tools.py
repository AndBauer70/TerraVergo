"""Hilfsfunktionen für das Begleitheft: Abschnittsnummern, Inhaltsverzeichnis, Glossar, Register
und eine strukturierte Fassung (JSON) für die Word-Datei. Benötigt beautifulsoup4."""
import re, json
from bs4 import BeautifulSoup, NavigableString, Tag

SKIP_REGISTER = {'glossar', 'quellen', 'register'}


def sortkey(s):
    s = s.lower()
    for a, b in (('ä', 'a'), ('ö', 'o'), ('ü', 'u'), ('ß', 'ss'), ('₂', '2')):
        s = s.replace(a, b)
    return re.sub(r'[^a-z0-9 ]', '', s)


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', sortkey(s)).strip('-')


def variant_regex(v):
    if v.startswith('='):
        return re.compile(r'(?<![\w-])' + re.escape(v[1:]) + r'(?![\w-])')
    return re.compile(r'(?<![\w])' + re.escape(v))


def process(html, begriffe):
    soup = BeautifulSoup(html, 'html.parser')
    doc = soup.select_one('div.doc')
    sections = [s for s in doc.find_all('section', recursive=False) if s.get('id')]
    toc, texts = [], []  # texts: (num, anchor, text)
    for n, sec in enumerate(sections, 1):
        h2 = sec.find('h2')
        title = h2.get_text(' ', strip=True)
        h2.insert(0, NavigableString(' '))
        num = soup.new_tag('span', attrs={'class': 'num'}); num.string = str(n)
        h2.insert(0, num)
        toc.append((str(n), sec['id'], title))
        cur_num, cur_anchor, sub = str(n), sec['id'], 0
        for child in list(sec.children):
            if not isinstance(child, Tag):
                continue
            if child.name == 'h3':
                sub += 1
                child['id'] = f"{sec['id']}-{sub}"
                cur_num, cur_anchor = f'{n}.{sub}', child['id']
                h3text = child.get_text(' ', strip=True)
                t = soup.new_tag('span', attrs={'class': 'num'}); t.string = cur_num
                child.insert(0, NavigableString(' ')); child.insert(0, t)
                if sec['id'] not in SKIP_REGISTER:
                    texts.append((cur_num, cur_anchor, h3text))
                continue
            if sec['id'] in SKIP_REGISTER:
                continue
            if child.name == 'h2':
                texts.append((cur_num, cur_anchor, title))
                continue
            texts.append((cur_num, cur_anchor, child.get_text(' ', strip=True)))
    # Inhaltsverzeichnis
    toc_html = '<nav class="toc" aria-label="Inhalt"><b>Inhalt</b><ol>' + ''.join(
        f'<li><a href="#{a}"><span class="num">{n}</span> {t}</a></li>' for n, a, t in toc) + '</ol></nav>'
    # Glossar
    gl = sorted(begriffe['glossar'], key=lambda g: sortkey(g['t']))
    gl_html = '<dl class="glossar">' + ''.join(
        f'<div class="gi"><dt id="g-{slug(g["t"])}">{g["t"]}</dt><dd>{g["d"]}</dd></div>' for g in gl) + '</dl>'
    # Register
    entries = []
    for g in begriffe['glossar']:
        entries.append({'t': g['t'], 'v': g['v'], 'g': 'g-' + slug(g['t'])})
    for r in begriffe['register']:
        entries.append({'t': r['t'], 'v': r['v'], 'g': None})
    missing = []
    order = {}
    for i, (num, _, _) in enumerate(texts):
        order.setdefault(num, i)
    for e in entries:
        rx = [variant_regex(v) for v in e['v']]
        refs = {}
        for num, anchor, text in texts:
            if any(r.search(text) for r in rx):
                refs.setdefault(num, anchor)
        e['refs'] = sorted(refs.items(), key=lambda kv: order[kv[0]])
        if not e['refs'] and not e['g']:
            missing.append(e['t'])
    entries = [e for e in entries if e['refs'] or e['g']]
    entries.sort(key=lambda e: sortkey(e['t']))
    groups = []
    for e in entries:
        letter = sortkey(e['t'])[:1].upper()
        if not groups or groups[-1][0] != letter:
            groups.append((letter, []))
        groups[-1][1].append(e)
    reg_html = '<div class="register">' + ''.join(
        f'<div class="rg"><h4>{L}</h4><ul>' + ''.join(
            '<li><span class="rt">' + e['t'] + '</span> ' +
            ', '.join(f'<a href="#{a}">{n}</a>' for n, a in e['refs']) +
            ((' ' if e['refs'] else '') + f'<a class="g" href="#{e["g"]}" title="Glossar">G</a>' if e['g'] else '') +
            '</li>' for e in es) + '</ul></div>' for L, es in groups) + '</div>'
    out = str(soup)
    out = out.replace('{{TOC}}', toc_html).replace('{{GLOSSAR}}', gl_html).replace('{{REGISTER}}', reg_html)
    stats = {'abschnitte': len(texts), 'glossar': len(gl), 'register': len(entries), 'ohne_treffer': missing}
    return out, stats


# ---------- strukturierte Fassung für Word ----------
def runs(el, b=False, i=False, link=None):
    out = []
    for c in el.children:
        if isinstance(c, NavigableString):
            t = str(c)
            if t:
                out.append({'t': t, 'b': b, 'i': i, 'link': link})
        elif isinstance(c, Tag):
            if c.name == 'br':
                out.append({'br': True})
            elif c.name == 'span' and 'num' in (c.get('class') or []):
                continue
            else:
                out += runs(c, b or c.name in ('b', 'strong', 'dt', 'th'), i or c.name in ('i', 'em'),
                            c.get('href') if c.name == 'a' else link)
    # Leerraum glätten
    for r in out:
        if 't' in r:
            r['t'] = re.sub(r'\s+', ' ', r['t'])
    return out


def to_blocks(html):
    soup = BeautifulSoup(html, 'html.parser')
    doc = soup.select_one('div.doc')
    blocks = []
    for top in doc.children:
        if not isinstance(top, Tag):
            continue
        cls = top.get('class') or []
        if top.name == 'header':
            blocks.append({'type': 'cover', 'logo': top.select_one('.logo').get_text(strip=True), 'title': top.find('h1').get_text(strip=True),
                           'lead': top.select_one('.lead').get_text(' ', strip=True), 'meta': top.select_one('.meta').get_text(' ', strip=True)})
        elif top.name == 'section' and 'glance' in cls:
            blocks.append({'type': 'glance', 'items': [[d.find('b').get_text(strip=True), d.find('span').get_text(' ', strip=True)] for d in top.find_all('div')]})
        elif top.name == 'nav':
            blocks.append({'type': 'toc', 'items': [[a.select_one('.num').get_text(), a['href'][1:], a.get_text(' ', strip=True).split(' ', 1)[1]] for a in top.find_all('a')]})
        elif top.name == 'section':
            for c in top.children:
                if isinstance(c, Tag):
                    blocks += block(c, top.get('id'))
        elif top.name == 'p':
            blocks.append({'type': 'p', 'cls': 'foot', 'runs': runs(top)})
    return blocks


def block(c, secid):
    cls = c.get('class') or []
    if c.name == 'h2':
        return [{'type': 'h2', 'num': c.select_one('.num').get_text(), 'id': secid, 'text': c.get_text(' ', strip=True).split(' ', 1)[1], 'parents': secid == 'eltern'}]
    if c.name == 'h3':
        return [{'type': 'h3', 'num': c.select_one('.num').get_text(), 'id': c.get('id'), 'text': c.get_text(' ', strip=True).split(' ', 1)[1]}]
    if c.name == 'p':
        return [{'type': 'p', 'cls': ' '.join(cls), 'runs': runs(c)}]
    if c.name in ('ul', 'ol'):
        return [{'type': 'list', 'ordered': c.name == 'ol', 'cls': ' '.join(cls), 'items': [runs(li) for li in c.find_all('li', recursive=False)]}]
    if c.name == 'div' and 'note' in cls:
        return [{'type': 'note', 'runs': runs(c)}]
    if c.name == 'div' and 'tblw' in cls:
        t = c.find('table')
        head = [[runs(th) for th in tr.find_all(['th', 'td'])] for tr in t.select('thead tr')]
        rows = [[runs(td) for td in tr.find_all(['td', 'th'])] for tr in t.select('tbody tr')]
        return [{'type': 'table', 'cls': ' '.join(t.get('class') or []), 'head': head, 'rows': rows}]
    if c.name == 'dl' and 'glossar' in cls:
        return [{'type': 'glossary', 'items': [{'t': gi.find('dt').get_text(strip=True), 'id': gi.find('dt')['id'], 'd': gi.find('dd').get_text(' ', strip=True)} for gi in c.find_all('div', class_='gi')]}]
    if c.name == 'div' and 'register' in cls:
        groups = []
        for rg in c.find_all('div', class_='rg'):
            items = []
            for li in rg.find_all('li'):
                refs = [[a.get_text(), a['href'][1:]] for a in li.find_all('a') if 'g' not in (a.get('class') or [])]
                g = li.find('a', class_='g')
                items.append({'t': li.select_one('.rt').get_text(strip=True), 'refs': refs, 'g': g['href'][1:] if g else None})
            groups.append({'letter': rg.find('h4').get_text(), 'items': items})
        return [{'type': 'register', 'groups': groups}]
    return []


def fix_docx_bookmarks(docx_path):
    """docx-js vergibt allen Textmarken dieselbe ID; Word erwartet eindeutige IDs. Nummeriert sie fortlaufend neu."""
    import zipfile, shutil, tempfile, os
    tmp = tempfile.mktemp(suffix='.docx')
    with zipfile.ZipFile(docx_path) as zin, zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == 'word/document.xml':
                xml = data.decode('utf-8')
                counter = [0]
                def sub(m):
                    if m.group(1) == 'Start':
                        counter[0] += 1
                    return m.group(0).replace(f'w:id="{m.group(2)}"', f'w:id="{counter[0]}"')
                xml = re.sub(r'<w:bookmark(Start|End)\b[^>]*?w:id="(\d+)"[^>]*/>', sub, xml)
                data = xml.encode('utf-8')
            zout.writestr(item, data)
    shutil.move(tmp, docx_path)
