// Erzeugt build/begleitheft.docx aus build/begleitheft.json (von build.py erzeugt) und src/prof-geo.png.
// Wird von build.py aufgerufen, wenn Node.js und das npm-Paket "docx" vorhanden sind; build.py vergibt danach eindeutige Textmarken-IDs.
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, ExternalHyperlink, InternalHyperlink, Bookmark, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, AlignmentType, HeadingLevel, LevelFormat, Footer, PageNumber, ImageRun,
  SectionType, VerticalAlign, TableLayoutType, LineRuleType,
} = require('docx');

const BUILD = path.join(__dirname, 'build');
const blocks = JSON.parse(fs.readFileSync(path.join(BUILD, 'begleitheft.json'), 'utf8'));
const INK = '1B1B2F', RED = 'E0393B', MUTED = '4A5266', BLUE = '1E6FD0', FONT = 'Arial';
const PAGE_W = 11906, MARGIN = 1134, CONTENT_W = PAGE_W - 2 * MARGIN;
const BREAK_BEFORE = new Set(['mystery', 'spiel', 'basiskonzepte', 'schwierigkeiten', 'eltern']);
const bm = id => ('bm_' + String(id).replace(/[^A-Za-z0-9]/g, '_')).slice(0, 40);

// ---------- Textläufe ----------
function textRuns(runs, opts = {}) {
  const out = [];
  const rs = runs.map(r => ({ ...r }));
  // Leerraum an den Rändern entfernen
  const firstT = rs.find(r => r.t !== undefined); if (firstT) firstT.t = firstT.t.replace(/^\s+/, '');
  const lastT = [...rs].reverse().find(r => r.t !== undefined); if (lastT) lastT.t = lastT.t.replace(/\s+$/, '');
  for (const r of rs) {
    if (r.br) { out.push(new TextRun({ break: 1 })); continue; }
    if (!r.t) continue;
    const base = { text: r.t, bold: r.b || opts.bold, italics: r.i || opts.italics, size: opts.size, color: opts.color, font: FONT };
    if (r.link && /^https?:/.test(r.link)) out.push(new ExternalHyperlink({ link: r.link, children: [new TextRun({ ...base, style: 'Hyperlink' })] }));
    else if (r.link && r.link.startsWith('#')) out.push(new InternalHyperlink({ anchor: bm(r.link.slice(1)), children: [new TextRun({ ...base, style: 'Hyperlink' })] }));
    else out.push(new TextRun(base));
  }
  return out;
}
const plainLen = runs => runs.reduce((a, r) => a + (r.t ? r.t.length : 0), 0);

// ---------- Tabellen ----------
function colWidths(tb, size) {
  const n = Math.max(...[...tb.head, ...tb.rows].map(r => r.length));
  const w = new Array(n).fill(0), c = new Array(n).fill(0), longest = new Array(n).fill(0);
  for (const row of [...tb.head, ...tb.rows]) row.forEach((cell, i) => {
    w[i] += plainLen(cell); c[i]++;
    const txt = cell.map(r => r.t || ' ').join('');
    // Word bricht auch nach Bindestrichen um, daher zählt jeder Wortteil einzeln
    for (const word of txt.split(/(?<=-)|[\s\/]+/)) longest[i] = Math.max(longest[i], word.replace(/[­]/g, '').length);
  });
  const perChar = size * 6.2; // ungefähre Zeichenbreite in DXA (fett, Arial)
  const minW = longest.map(L => Math.min(L * perChar + 200, CONTENT_W * 0.4));
  let wt = w.map((x, i) => Math.pow(Math.min(Math.max(x / c[i], 5), 140), 0.75));
  const sum = wt.reduce((a, b) => a + b, 0);
  let px = wt.map((x, i) => Math.max((x / sum) * CONTENT_W, minW[i]));
  // überschüssige Breite proportional bei den breiten Spalten abziehen
  for (let k = 0; k < 6; k++) {
    const tot = px.reduce((a, b) => a + b, 0), extra = tot - CONTENT_W;
    if (Math.abs(extra) < 2) break;
    const flex = px.map((x, i) => Math.max(0, x - minW[i])), fs = flex.reduce((a, b) => a + b, 0) || 1;
    px = px.map((x, i) => extra > 0 ? x - extra * flex[i] / fs : x - extra * x / tot);
  }
  px = px.map(Math.floor);
  px[px.length - 1] += CONTENT_W - px.reduce((a, b) => a + b, 0);
  return px;
}
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: 'C9CED8' };
function table(tb) {
  const small = /\bel\b/.test(tb.cls);
  const size = small ? 15 : 17;
  const widths = colWidths(tb, size);
  const mkRow = (cells, header) => new TableRow({
    tableHeader: header, cantSplit: !small && !header ? false : header,
    children: widths.map((wd, i) => new TableCell({
      width: { size: wd, type: WidthType.DXA },
      margins: { top: 50, bottom: 50, left: 80, right: 80 },
      shading: header ? { type: ShadingType.CLEAR, color: 'auto', fill: 'FFE9A8' } : undefined,
      borders: { top: cellBorder, left: cellBorder, bottom: cellBorder, right: cellBorder },
      children: [new Paragraph({ spacing: { before: 0, after: 0, line: 252, lineRule: LineRuleType.AUTO }, children: textRuns(cells[i] || [], { size, bold: header }) })],
    })),
  });
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED,
    rows: [...tb.head.map(r => mkRow(r, true)), ...tb.rows.map(r => mkRow(r, false))],
  });
}
const spacer = (after = 120) => new Paragraph({ spacing: { before: 0, after }, children: [] });

// ---------- Fußzeile ----------
const footer = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
  new TextRun({ font: FONT, size: 16, color: MUTED, children: ['Begleitheft Terra Vergo · © 2026 Andreas Bauer · Seite ', PageNumber.CURRENT, ' von ', PageNumber.TOTAL_PAGES] })] })] });
const pageProps = (extra = {}) => ({ page: { size: { width: PAGE_W, height: 16838 }, margin: { top: 1134, bottom: 1134, left: MARGIN, right: MARGIN, footer: 567 } }, ...extra });

// ---------- Inhalt ----------
let olInstance = 0;
const sections = [];
let cur = [], curProps = { type: undefined, cols: 1 };
function newSection(type, cols) {
  if (cur.length) sections.push({ properties: pageProps({ type: curProps.type, column: curProps.cols > 1 ? { count: curProps.cols, space: 397 } : undefined }), footers: { default: footer() }, children: cur });
  cur = []; curProps = { type, cols };
}

for (const b of blocks) {
  if (b.type === 'cover') {
    const GEO = path.join(__dirname, 'src', 'prof-geo.png');
    const img = fs.existsSync(GEO) ? new ImageRun({ type: 'png', data: fs.readFileSync(GEO), transformation: { width: 118, height: 127 }, altText: { title: 'Prof. Geo', description: 'Comicfigur Prof. Geo', name: 'Prof. Geo' } }) : null;
    const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
    const noB = { top: none, left: none, bottom: none, right: none };
    cur.push(new Table({
      width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W - 2300, 2300], layout: TableLayoutType.FIXED,
      borders: { ...noB, insideHorizontal: none, insideVertical: none },
      rows: [new TableRow({ children: [
        new TableCell({ width: { size: CONTENT_W - 2300, type: WidthType.DXA }, borders: noB, children: [
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: b.logo, font: FONT, size: 64, bold: true, color: 'FF5A3C' })] }),
          new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: b.title, font: FONT, size: 36, bold: true, color: INK })] }),
          new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: b.lead, font: FONT, size: 23, bold: true, color: INK })] }),
          new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: b.meta, font: FONT, size: 17, color: MUTED })] }),
        ] }),
        new TableCell({ width: { size: 2300, type: WidthType.DXA }, borders: noB, verticalAlign: VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: img ? [img] : [] })] }),
      ] })],
    }));
    cur.push(new Paragraph({ spacing: { before: 120, after: 160 }, border: { bottom: { style: BorderStyle.DASHED, size: 12, color: INK, space: 4 } }, children: [] }));
  } else if (b.type === 'glance') {
    const w = Math.floor(CONTENT_W / 2);
    const cell = it => new TableCell({ width: { size: w, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'FFF3A6' },
      margins: { top: 80, bottom: 80, left: 120, right: 120 }, borders: { top: cellBorder, left: cellBorder, bottom: cellBorder, right: cellBorder },
      children: [new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: it[0], bold: true, size: 17, font: FONT })] }), new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: it[1], size: 18, font: FONT })] })] });
    const rows = [];
    for (let i = 0; i < b.items.length; i += 2) rows.push(new TableRow({ children: [cell(b.items[i]), cell(b.items[i + 1] || ['', ''])] }));
    cur.push(new Table({ width: { size: w * 2, type: WidthType.DXA }, columnWidths: [w, w], rows }));
    cur.push(spacer(200));
  } else if (b.type === 'toc') {
    cur.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: 'Inhalt', bold: true, size: 24, font: FONT })] }));
    for (const [num, id, title] of b.items) {
      cur.push(new Paragraph({ spacing: { after: 30 }, indent: { left: 454, hanging: 454 }, children: [
        new InternalHyperlink({ anchor: bm(id), children: [new TextRun({ text: num + '\t', bold: true, color: MUTED, font: FONT, size: 20 }), new TextRun({ text: title, font: FONT, size: 20, color: INK })] })],
        tabStops: [{ type: 'left', position: 454 }] }));
    }
    cur.push(spacer(240));
  } else if (b.type === 'h2') {
    const own = ['glossar', 'quellen', 'register'].includes(b.id);
    if (own) newSection(SectionType.NEXT_PAGE, 1);
    cur.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: BREAK_BEFORE.has(b.id), keepNext: true,
      children: [new Bookmark({ id: bm(b.id), children: [new TextRun({ text: b.num + '  ', color: RED }), new TextRun({ text: b.text })] })] }));
  } else if (b.type === 'h3') {
    cur.push(new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true,
      children: [new Bookmark({ id: bm(b.id), children: [new TextRun({ text: b.num + '  ', color: RED }), new TextRun({ text: b.text })] })] }));
  } else if (b.type === 'p') {
    if (/foot/.test(b.cls)) continue; // Urheberhinweis steht in der Fußzeile
    const small = /small|foot/.test(b.cls);
    cur.push(new Paragraph({ alignment: /foot/.test(b.cls) ? AlignmentType.CENTER : undefined, spacing: { after: 120 },
      children: textRuns(b.runs, small ? { size: 16, color: MUTED } : {}) }));
  } else if (b.type === 'list') {
    const inst = ++olInstance;
    const small = /src/.test(b.cls);
    for (const it of b.items) cur.push(new Paragraph({ numbering: b.ordered ? { reference: 'num', level: 0, instance: inst } : { reference: 'bul', level: 0 },
      spacing: { after: 60 }, children: textRuns(it, small ? { size: 17 } : {}) }));
    cur.push(spacer(80));
  } else if (b.type === 'note') {
    // nur linker Rand: docx-js schreibt vierseitige Absatzränder in einer vom Schema abweichenden Reihenfolge
    cur.push(new Paragraph({ spacing: { before: 120, after: 200 }, indent: { left: 200, right: 140 }, shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'FFF6D6' },
      border: { left: { style: BorderStyle.SINGLE, size: 36, color: 'F2A900', space: 8 } }, children: textRuns(b.runs) }));
  } else if (b.type === 'table') {
    cur.push(table(b));
    cur.push(spacer(160));
  } else if (b.type === 'glossary') {
    newSection(SectionType.CONTINUOUS, 2);
    for (const g of b.items) cur.push(new Paragraph({ spacing: { after: 100 }, keepLines: true, children: [
      new Bookmark({ id: bm(g.id), children: [new TextRun({ text: g.t, bold: true, font: FONT, size: 19 })] }),
      new TextRun({ break: 1 }), new TextRun({ text: g.d, font: FONT, size: 18 })] }));
  } else if (b.type === 'register') {
    newSection(SectionType.CONTINUOUS, 3);
    for (const g of b.groups) {
      cur.push(new Paragraph({ keepNext: true, spacing: { before: 120, after: 40 }, children: [new TextRun({ text: g.letter, bold: true, color: RED, size: 24, font: FONT })] }));
      for (const e of g.items) {
        const kids = [new TextRun({ text: e.t, bold: true, font: FONT, size: 17 }), new TextRun({ text: ' ', size: 17 })];
        e.refs.forEach(([num, id], i) => {
          if (i) kids.push(new TextRun({ text: ', ', font: FONT, size: 17 }));
          kids.push(new InternalHyperlink({ anchor: bm(id), children: [new TextRun({ text: num, style: 'RegisterLink', font: FONT, size: 17 })] }));
        });
        if (e.g) kids.push(new TextRun({ text: e.refs.length ? '  ' : '', size: 17 }), new InternalHyperlink({ anchor: bm(e.g), children: [new TextRun({ text: 'G', bold: true, style: 'RegisterLink', font: FONT, size: 15, color: RED })] }));
        cur.push(new Paragraph({ spacing: { after: 30 }, indent: { left: 227, hanging: 227 }, children: kids }));
      }
    }
  }
}
newSection();

const doc = new Document({
  creator: 'Andreas Bauer', title: 'Begleitheft Terra Vergo', description: 'Begleitheft für Lehrkräfte und Eltern zum Klimaspiel Terra Vergo',
  styles: {
    default: { document: { run: { font: FONT, size: 20, color: INK, language: { value: 'de-DE' } }, paragraph: { spacing: { line: 276, lineRule: LineRuleType.AUTO, after: 120 } } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 32, bold: true, color: INK }, paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 24, bold: true, color: INK }, paragraph: { spacing: { before: 240, after: 100 }, outlineLevel: 1 } },
    ],
    characterStyles: [{ id: 'Hyperlink', name: 'Hyperlink', basedOn: 'DefaultParagraphFont', run: { color: BLUE, underline: { type: 'single', color: BLUE } } },
      { id: 'RegisterLink', name: 'Registerverweis', basedOn: 'DefaultParagraphFont', run: { color: BLUE } }],
  },
  numbering: { config: [
    { reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 260 } } } }] },
    { reference: 'num', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 300 } } } }] },
  ] },
  sections,
});
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(path.join(BUILD, 'begleitheft.docx'), buf); console.log('begleitheft.docx', Math.round(buf.length / 1024), 'KB,', sections.length, 'Abschnitte'); });
