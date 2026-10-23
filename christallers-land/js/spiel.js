/* Christallers Land – Spiellogik, Level und Musterlösungen */
(() => {
const SOLUTIONS = [[[[2,0],[0,-3],[2,-2],[-2,2],[0,-1],[0,2],[-2,0]]],[[[-3,2],[2,-2],[1,-3],[4,-1],[0,1],[4,-4],[2,1],[-3,0],[-1,-3],[0,-1],[-3,4],[0,3]],[[2,-2],[1,-3],[-3,2],[2,1],[-3,0],[0,3]]],[[[2,2],[-2,-2],[3,-3],[4,0],[-1,0],[2,-5],[-2,5],[-4,0],[-4,4],[4,-2],[1,0],[-4,2],[0,4],[5,-5],[0,-4],[1,-3],[-1,2]],[[-2,-2],[2,2],[3,-3],[4,0],[-1,0],[2,-5],[-2,5],[-4,0],[-4,4]],[[-2,-2],[2,2],[3,-3],[-4,4]]],[[[4,-2],[-2,-1],[-2,2],[1,2],[-1,4],[-4,1],[1,-4],[1,0],[4,0],[0,-1],[-4,4],[3,-3]],[[4,-2],[-2,-1],[-2,2],[1,2],[1,-4]],[[4,-2],[-2,-1],[-2,2]]],[[[-4,1],[1,3],[-1,-3],[3,-4],[3,0],[-3,4],[5,-3],[-1,0]],[[-4,1],[1,3],[-1,-3],[3,-4],[3,0],[-3,4]],[[-4,1],[1,3],[3,-4]]]];

const GOODS = {
  b: { name: 'Bäckerei', plural: 'Bäckereien', need: 'täglicher Bedarf', color: 'var(--g-b)' },
  a: { name: 'Arztpraxis', plural: 'Arztpraxen', need: 'häufiger Bedarf', color: 'var(--g-a)' },
  g: { name: 'Gymnasium', plural: 'Gymnasien', need: 'seltener Bedarf', color: 'var(--g-g)' },
};
const ORDER = ['b', 'a', 'g'];
const RANK = ['', 'Marktort', 'Amtsort', 'Kreisstadt'];

const LEVELS = [
  {
    name: 'Das tägliche Brot', R: 3, goods: { b: { reach: 1, thr: 30 } }, hier: false, minSupply: 1, flucht: false,
    story: 'Das Land ist eben, überall wohnen gleich viele Menschen. Jedes Feld hat 10 Haushalte. Alle kaufen Brot dort, wo es am nächsten ist.',
    mission: 'Versorge jeden Haushalt mit Brot. Jede Bäckerei braucht mindestens 30 Haushalte, sonst geht sie pleite.',
    hint: 'Eine Bäckerei erreicht ihr eigenes Feld und den Ring drumherum (7 Felder). Setze sie so, dass sich die Ringe kaum überlappen: zwei Felder Lücke zwischen zwei Bäckereien ist ein guter Abstand.',
    insight: (s) => `<p>Sieh dir die Grenzen der Einzugsgebiete an: Wo Bäckereien gleichmäßig verteilt sind, entstehen <span class="term">Sechsecke</span>. Kreise würden Lücken lassen oder sich überlappen, Sechsecke füllen die Fläche lückenlos. Das ist Christallers Grundfigur.</p><p>Die <span class="term">obere Grenze der Reichweite</span> (hier 1 Feld) legt fest, wie weit Kunden höchstens gehen. Die <span class="term">untere Grenze</span> (30 Haushalte) legt fest, wie dicht Bäckereien höchstens stehen dürfen. Du hast ${s.shops} Bäckereien gebraucht.</p>`,
  },
  {
    name: 'Der Landarzt', R: 4, goods: { b: { reach: 1, thr: 30 }, a: { reach: 2, thr: 80 } }, hier: true, minSupply: 1, flucht: false,
    story: 'Die Region ist größer geworden. Neben Brot brauchen die Menschen jetzt auch einen Arzt. Für den Arzt fahren sie weiter, aber eine Praxis braucht auch viel mehr Patienten.',
    mission: 'Versorge alle mit Brot und Arzt. Regel: Eine Arztpraxis darf nur in einen Ort, der schon eine Bäckerei hat.',
    hint: 'Plane die Arztpraxen zuerst: Jede braucht etwa 8 Felder für sich. Setze in jeden Arzt-Ort eine Bäckerei und fülle die Lücken dazwischen mit weiteren Bäckereien.',
    insight: (s) => `<p>Du hast zwei Arten von Orten geschaffen: ${s.r1} <span class="term">Marktorte</span> nur mit Bäckerei und ${s.r2} <span class="term">Amtsorte</span> mit Bäckerei und Arzt. Das ist die <span class="term">Hierarchie der zentralen Orte</span>: Orte höherer Ordnung bieten alles, was die kleineren bieten, und mehr.</p><p>Ein Gut mit hoher Schwelle und großer Reichweite (Arzt) trägt sich nur an wenigen Orten. Ein Gut mit kleiner Reichweite (Brot) muss es an vielen Orten geben.</p>`,
  },
  {
    name: 'Die Kreisstadt', R: 5, goods: { b: { reach: 1, thr: 30 }, a: { reach: 2, thr: 80 }, g: { reach: 3, thr: 150 } }, hier: true, minSupply: 1, flucht: false,
    story: 'Jetzt soll es auch weiterführende Schulen geben. Ein Gymnasium hat ein großes Einzugsgebiet, braucht aber 150 Haushalte.',
    mission: 'Versorge alle Haushalte mit Brot, Arzt und Gymnasium. Höhere Einrichtungen nur in Orten, die alle niedrigeren schon haben.',
    hint: 'Arbeite von oben nach unten: erst wenige Gymnasien weit auseinander, dort auch Arzt und Bäckerei. Dann Arztpraxen dazwischen, zuletzt Bäckereien in die Lücken.',
    insight: (s) => `<p>Dein Netz hat ${s.r3} <span class="term">Kreisstädte</span>, ${s.r2} Amtsorte und ${s.r1} Marktorte. Je höher die Stufe, desto weniger Orte, desto größer das Einzugsgebiet: eine <span class="term">Pyramide der Zentralität</span>.</p><p>Christaller nannte diese Ordnung das <span class="term">Versorgungsprinzip</span>: Alle Haushalte sollen mit möglichst wenigen zentralen Orten versorgt werden. Im Idealfall wächst das Einzugsgebiet von Stufe zu Stufe um den Faktor 3 (k = 3). Die heutige Raumordnung mit Grund-, Mittel- und Oberzentren beruht auf dieser Idee.</p>`,
  },
  {
    name: 'Landflucht', R: 5, goods: { b: { reach: 1, thr: 30 }, a: { reach: 2, thr: 80 }, g: { reach: 3, thr: 150 } }, hier: true, minSupply: 0.9, flucht: true, start: 2,
    story: 'Junge Leute ziehen in die Mitte der Region. Am Rand wohnen nur noch 6 oder 3 Haushalte pro Feld. Dein altes Netz ist geladen, doch viele Läden erreichen ihre Schwelle nicht mehr.',
    mission: 'Baue das Netz um: Jeder Laden muss sich wieder tragen, und mindestens 90 % der Haushalte müssen jedes Gut erreichen.',
    hint: 'Die roten Zahlen zeigen, welche Läden unter der Schwelle liegen. Lege benachbarte Läden am Rand zusammen. Ganz außen wirst du nicht alle versorgen können, das ist die Lehre dieses Levels.',
    insight: (s) => `<p>Sinkt die Bevölkerung, wird die <span class="term">untere Grenze der Reichweite</span> unterschritten: Läden, Praxen und Schulen am Rand tragen sich nicht mehr. Es bleiben weniger, weiter entfernte zentrale Orte, und ${s.unsupPct} % der Haushalte erreichen nicht alle Güter.</p><p>Das ist das reale Problem dünn besiedelter ländlicher Räume. Die Raumordnung reagiert mit Mindeststandards der <span class="term">Daseinsvorsorge</span>, Landarztprogrammen, Bürgerbussen und mobilen Diensten, die Christallers Modell nicht kennt.</p>`,
  },
  {
    name: 'Das Auto', R: 5, goods: { b: { reach: 2, thr: 60 }, a: { reach: 3, thr: 120 }, g: { reach: 4, thr: 200 } }, hier: true, minSupply: 1, flucht: false, start: 2,
    story: 'Fast jeder Haushalt hat jetzt ein Auto. Die Menschen fahren weiter (größere Reichweite), aber die Läden sind größer geworden und brauchen mehr Kunden (höhere Schwelle). Dein altes Netz ist geladen.',
    mission: 'Baue ein tragfähiges Netz für die neue Zeit: alle Haushalte versorgt, alle Läden über der Schwelle.',
    hint: 'Entferne Läden, bis die übrigen genug Kunden haben. Mit Reichweite 2 deckt eine Bäckerei 19 Felder ab. Prüfe danach, ob noch Lücken bleiben.',
    insight: (s) => `<p>Mit dem Auto genügen ${s.shops} Einrichtungen, wo vorher viel mehr nötig waren. Größere Reichweite und höhere Schwellen führen zur <span class="term">Konzentration</span>: Die Versorgung zieht sich in weniger, größere Orte zurück, kleine Orte verlieren Bäcker, Arzt und Schule.</p><p>So lässt sich mit Christaller erklären, warum in vielen Dörfern seit den 1960er-Jahren Läden schließen, während Supermärkte und Fachmarktzentren in den Mittelzentren wachsen.</p>`,
  },
];

const S = 20, SQ3 = Math.sqrt(3);
const DIRS = [[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]];
const key = (q, r) => q + ',' + r;
const dist = (a, b) => (Math.abs(a.q - b.q) + Math.abs(a.r - b.r) + Math.abs(a.q + a.r - b.q - b.r)) / 2;
const ringOf = (h) => Math.max(Math.abs(h.q), Math.abs(h.r), Math.abs(h.q + h.r));

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
};

let st = { lv: 0, tool: 'b', layer: 'b', places: new Map(), hover: null, focus: null, won: false, usedSolution: false };
let best = store.get('cl-stars', {});
let cells = [], byKey = new Map();
let saved = {};

function buildCells(lv) {
  cells = []; byKey = new Map();
  const R = lv.R;
  for (let q = -R; q <= R; q++) for (let r = -R; r <= R; r++) {
    if (Math.abs(q + r) > R) continue;
    const h = { q, r, k: key(q, r) };
    const ring = ringOf(h);
    h.hh = lv.flucht ? (ring <= R - 2 ? 10 : ring === R - 1 ? 6 : 3) : 10;
    h.x = S * SQ3 * (q + r / 2); h.y = S * 1.5 * r;
    cells.push(h); byKey.set(h.k, h);
  }
}
const goodsOf = () => ORDER.filter(g => LEVELS[st.lv].goods[g]);

function corners(h, s = S) {
  const out = [];
  for (let i = 0; i < 6; i++) { const a = Math.PI / 180 * (60 * i - 30); out.push([h.x + s * Math.cos(a), h.y + s * Math.sin(a)]); }
  return out;
}
const poly = (h, s) => corners(h, s).map(p => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' ');

function analyze() {
  const lv = LEVELS[st.lv];
  const res = {};
  const totalHH = cells.reduce((a, h) => a + h.hh, 0);
  for (const g of goodsOf()) {
    const { reach, thr } = lv.goods[g];
    const sites = cells.filter(h => (st.places.get(h.k) || 0) > ORDER.indexOf(g));
    const cust = new Map(sites.map(s => [s.k, 0]));
    const assign = new Map();
    let supHH = 0;
    for (const h of cells) {
      let m = Infinity;
      for (const s of sites) { const d = dist(h, s); if (d < m) m = d; }
      if (m > reach) { assign.set(h.k, null); continue; }
      const near = sites.filter(s => dist(h, s) === m).map(s => s.k);
      for (const k of near) cust.set(k, cust.get(k) + h.hh / near.length);
      assign.set(h.k, { d: m, near });
      supHH += h.hh;
    }
    const below = [...cust.entries()].filter(([, c]) => c < thr - 1e-9).length;
    res[g] = { reach, thr, sites, cust, assign, supHH, totalHH, below, share: supHH / totalHH };
  }
  return res;
}

function placeCounts() {
  const c = [0, 0, 0, 0]; let shops = 0;
  for (const v of st.places.values()) { c[v]++; shops += v; }
  return { r1: c[1], r2: c[2], r3: c[3], shops };
}

function evaluateGoals(A) {
  const lv = LEVELS[st.lv];
  const gs = goodsOf();
  const supplied = gs.every(g => A[g].share >= lv.minSupply - 1e-9);
  const viable = gs.every(g => A[g].below === 0) && placeCounts().shops > 0;
  const target = SOLUTIONS ? SOLUTIONS[st.lv].reduce((a, s) => a + s.length, 0) : null;
  const pc = placeCounts();
  const efficient = supplied && viable && target !== null && pc.shops <= target;
  return { supplied, viable, efficient, target, pc };
}

// ---------- Rendering ----------
// Map signatures: bread loaf, medical cross, graduation cap, drawn in a 24-unit box
const ICON = {
  b: () => `<path d="M3.5 15.6c0-5.2 3.8-8.8 8.5-8.8s8.5 3.6 8.5 8.8c0 1.1-.9 2-2 2h-13c-1.1 0-2-.9-2-2z" fill="var(--on-g)"/><path d="M8.4 10.4l-1.5 3.3M12.5 9.6l-1.5 3.8M16.6 10.4l-1.3 3.2" stroke="var(--g-b)" stroke-width="1.7" stroke-linecap="round" fill="none"/>`,
  a: () => `<path d="M9.8 4h4.4v5.8H20v4.4h-5.8V20H9.8v-5.8H4V9.8h5.8z" fill="var(--on-g)"/>`,
  g: () => `<path d="M12 4.6l10.4 4.8L12 14.2 1.6 9.4z" fill="var(--on-g)"/><path d="M6.2 11.9v3.8c0 2.2 11.6 2.2 11.6 0v-3.8L12 14.6z" fill="var(--on-g)"/><path d="M20.6 9.8v5.6" stroke="var(--on-g)" stroke-width="1.5"/><circle cx="20.6" cy="16.1" r="1.4" fill="var(--on-g)"/>`,
};
function badge(gid, cx, cy, r, bad, shadow = true) {
  const s = (r * 1.5) / 24;
  return `<g${shadow ? ' filter="url(#sh)"' : ''}>`
    + (bad ? `<circle cx="${cx}" cy="${cy}" r="${(r + 2.6).toFixed(2)}" fill="none" stroke="var(--warn)" stroke-width="1.7" stroke-dasharray="2.6 2"/>` : '')
    + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${bad ? 'var(--warn)' : GOODS[gid].color}" stroke="var(--sheet)" stroke-width="1.4"/>`
    + `<g transform="translate(${(cx - 12 * s).toFixed(2)} ${(cy - 12 * s).toFixed(2)}) scale(${s.toFixed(3)})">${ICON[gid]()}</g></g>`;
}
const house = (x, y) => `<path d="M${(x - 2.7).toFixed(1)} ${(y + 1.9).toFixed(1)}v-2.7l2.7-2.3 2.7 2.3v2.7z" fill="var(--house)"/>`;
// one signature per place: the badge of its highest function, smaller badges for the lower ones
function placeSig(cx, cy, lvl, badOf, shadow = true) {
  const main = ORDER[lvl - 1], r = [0, 8, 9.2, 10.6][lvl];
  const out = [badge(main, cx, cy, r, badOf(main), shadow)];
  const ang = [150, 30];
  for (let i = 0; i < lvl - 1; i++) {
    const a = ang[i] * Math.PI / 180, pr = 5.2;
    out.push(badge(ORDER[i], +(cx + (r + 1.2) * Math.cos(a)).toFixed(2), +(cy + (r + 1.2) * Math.sin(a)).toFixed(2), pr, badOf(ORDER[i]), shadow));
  }
  return out.join('');
}
const svg = document.getElementById('map');
function renderMap(A) {
  const lv = LEVELS[st.lv];
  const pad = S + 6;
  const minX = Math.min(...cells.map(h => h.x)) - pad, maxX = Math.max(...cells.map(h => h.x)) + pad;
  const minY = Math.min(...cells.map(h => h.y)) - pad, maxY = Math.max(...cells.map(h => h.y)) + pad;
  svg.setAttribute('viewBox', `${minX.toFixed(1)} ${minY.toFixed(1)} ${(maxX - minX).toFixed(1)} ${(maxY - minY).toFixed(1)}`);
  const L = st.layer, LA = A[L], col = GOODS[L].color;
  const parts = [];
  parts.push(`<defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="var(--land)"/><line x1="0" y1="0" x2="0" y2="6" stroke="var(--warn)" stroke-width="1.6" stroke-opacity="0.75"/></pattern><filter id="sh" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="1" stdDeviation="0.9" flood-color="#000" flood-opacity="0.35"/></filter></defs>`);
  // cells
  for (const h of cells) {
    const a = LA.assign.get(h.k);
    let fill = 'var(--land)', extra = '';
    if (!a) fill = 'url(#hatch)';
    parts.push(`<polygon class="cell" data-k="${h.k}" points="${poly(h, S)}" fill="${fill}" stroke="var(--sheet)" stroke-width="0.9" stroke-opacity="0.7"/>`);
    if (a) {
      const site = byKey.get(a.near[0]);
      const shade = a.near.length > 1 ? 0.09 : [0.15, 0.24, 0.33][(((site.q - site.r) % 3) + 3) % 3];
      parts.push(`<polygon points="${poly(h, S)}" fill="${col}" fill-opacity="${shade}" pointer-events="none"/>`);
    }
    // households as little houses
    const n = h.hh >= 10 ? 3 : h.hh >= 6 ? 2 : 1;
    const offs = n === 3 ? [[-7, -9], [7, -9], [0, -13]] : n === 2 ? [[-4, -11], [4, -11]] : [[0, -11]];
    if (!st.places.get(h.k)) parts.push(`<g pointer-events="none" opacity="0.8">${offs.map(([dx, dy]) => house(h.x + dx, h.y + dy + 6)).join('')}</g>`);
  }
  // boundaries between market areas of active layer
  // A line separates fields with different suppliers; fields shared by several suppliers form the border zone
  const sig = (k) => { const a = LA.assign.get(k); return a ? a.near.slice().sort().join('|') : '-'; };
  const differ = (k1, k2) => sig(k1) !== sig(k2);
  const edges = [];
  for (const h of cells) {
    const cs = corners(h);
    for (let d = 0; d < 6; d++) {
      const nb = byKey.get(key(h.q + DIRS[d][0], h.r + DIRS[d][1]));
      const p1 = cs[d], p2 = cs[(d + 1) % 6];
      if (!nb) { edges.push(`<line x1="${p1[0].toFixed(2)}" y1="${p1[1].toFixed(2)}" x2="${p2[0].toFixed(2)}" y2="${p2[1].toFixed(2)}" stroke="var(--ink)" stroke-width="1.6" stroke-linecap="round"/>`); continue; }
      if (d > 2) continue;
      if (differ(h.k, nb.k)) edges.push(`<line x1="${p1[0].toFixed(2)}" y1="${p1[1].toFixed(2)}" x2="${p2[0].toFixed(2)}" y2="${p2[1].toFixed(2)}" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/>`);
    }
  }
  parts.push(`<g pointer-events="none">${edges.join('')}</g>`);
  // reach preview
  const hv = st.hover && byKey.get(st.hover);
  if (hv && GOODS[st.tool] && lv.goods[st.tool]) {
    const reach = lv.goods[st.tool].reach;
    const inSet = (c) => c && dist(c, hv) <= reach;
    const pe = [];
    for (const h of cells) {
      if (!inSet(h)) continue;
      const cs = corners(h);
      for (let d = 0; d < 6; d++) {
        const nb = byKey.get(key(h.q + DIRS[d][0], h.r + DIRS[d][1]));
        if (inSet(nb)) continue;
        const p1 = cs[d], p2 = cs[(d + 1) % 6];
        pe.push(`M${p1[0].toFixed(2)} ${p1[1].toFixed(2)}L${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`);
      }
    }
    parts.push(`<path d="${pe.join('')}" fill="none" stroke="var(--ink)" stroke-width="1.4" stroke-dasharray="3 3" pointer-events="none"/>`);
    parts.push(`<polygon points="${poly(hv, S - 2)}" fill="none" stroke="var(--ink)" stroke-width="1.6" pointer-events="none"/>`);
  } else if (hv) {
    parts.push(`<polygon points="${poly(hv, S - 2)}" fill="none" stroke="var(--ink)" stroke-width="1.6" pointer-events="none"/>`);
  }
  // places
  for (const [k, lvl] of st.places) {
    const h = byKey.get(k); if (!h || !lvl) continue;
    const bad = (gid) => A[gid] && A[gid].cust.get(k) < A[gid].thr - 1e-9;
    const cy = h.y - 4;
    parts.push(`<g pointer-events="none">${placeSig(h.x, cy, lvl, bad)}</g>`);
    if (lvl > ORDER.indexOf(L)) {
      const c = LA.cust.get(k), ok = c >= LA.thr - 1e-9;
      const txt = `${fmt(c)}/${LA.thr}`;
      const w = txt.length * 4.6 + 7, ty = cy + [0, 8, 9.2, 10.6][lvl] + 3;
      parts.push(`<g pointer-events="none"><rect x="${(h.x - w / 2).toFixed(2)}" y="${ty.toFixed(2)}" width="${w.toFixed(2)}" height="10.5" rx="3.5" fill="var(--sheet)" stroke="${ok ? col : 'var(--warn)'}" stroke-width="0.9"/><text x="${h.x}" y="${(ty + 7.8).toFixed(2)}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="7.6" font-weight="600" fill="${ok ? 'var(--ink)' : 'var(--warn)'}">${txt}</text></g>`);
    }
  }
  // map furniture: north arrow and scale bar in the empty corners
  const nx = maxX - 14, ny = minY + 20;
  parts.push(`<g pointer-events="none" fill="var(--ink)"><path d="M${nx} ${ny - 11}l5 13-5-3.4-5 3.4z"/><text x="${nx}" y="${ny + 12}" text-anchor="middle" font-family="Barlow Condensed, Arial Narrow, sans-serif" font-weight="700" font-size="10">N</text></g>`);
  const sx = minX + 10, sy = maxY - 10, sw = S * SQ3;
  parts.push(`<g pointer-events="none"><rect x="${sx}" y="${sy - 4}" width="${sw / 2}" height="3.2" fill="var(--ink)"/><rect x="${sx + sw / 2}" y="${sy - 4}" width="${sw / 2}" height="3.2" fill="var(--sheet)" stroke="var(--ink)" stroke-width="0.8"/><text x="${sx}" y="${sy - 7}" font-family="Barlow Condensed, Arial Narrow, sans-serif" font-weight="600" font-size="8.5" fill="var(--muted)">1 Feld</text></g>`);
  svg.innerHTML = parts.join('');
  document.getElementById('lgArea').style.background = `color-mix(in srgb, ${col} 25%, var(--land))`;
  document.getElementById('lgArea').style.borderColor = col;
}
const fmt = (x) => Number.isInteger(Math.round(x * 10) / 10) ? String(Math.round(x)) : (Math.round(x * 10) / 10).toFixed(1).replace('.', ',');
const pct = (x) => Math.round(x * 100);

function placeIcon(lvl, gid) {
  const parts = [];
  if (lvl >= 1) parts.push(badge(ORDER[lvl - 1], 15, 15, 13, false, false));
  if (gid === 'x') parts.push(`<path d="M8 8L22 22M22 8L8 22" stroke="var(--warn)" stroke-width="2.6" stroke-linecap="round"/>`);
  if (gid === 'i') parts.push(`<circle cx="15" cy="15" r="11" fill="none" stroke="var(--ink)" stroke-width="1.6"/><path d="M15 13v8M15 9.2v.1" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round"/>`);
  return `<svg viewBox="0 0 30 30" aria-hidden="true">${parts.join('')}</svg>`;
}

function renderPanel(A) {
  const lv = LEVELS[st.lv];
  const gs = goodsOf();
  document.getElementById('lvEyebrow').textContent = `Level ${st.lv + 1} von ${LEVELS.length}`;
  document.getElementById('lvTitle').textContent = lv.name;
  document.getElementById('lvStory').textContent = lv.story;
  document.getElementById('lvMission').textContent = lv.mission;
  document.getElementById('mapTitle').textContent = `Region · ${cells.length} Felder · ${cells.reduce((a, h) => a + h.hh, 0)} Haushalte`;

  // tools
  const tools = [];
  gs.forEach((g, i) => {
    const { reach, thr } = lv.goods[g];
    tools.push(`<button class="tool" type="button" data-tool="${g}" aria-pressed="${st.tool === g}">${placeIcon(i + 1)}<span><span class="nm">${GOODS[g].name}</span><span class="sub">${GOODS[g].need}</span></span><span class="num">Reichweite ${reach}<br>Schwelle ${thr}</span></button>`);
  });
  tools.push(`<button class="tool" type="button" data-tool="x" aria-pressed="${st.tool === 'x'}">${placeIcon(0, 'x')}<span><span class="nm">Abreißen</span><span class="sub">entfernt die höchste Einrichtung</span></span><span class="num"></span></button>`);
  tools.push(`<button class="tool" type="button" data-tool="i" aria-pressed="${st.tool === 'i'}">${placeIcon(0, 'i')}<span><span class="nm">Ansehen</span><span class="sub">Feld antippen, nichts bauen</span></span><span class="num"></span></button>`);
  document.getElementById('tools').innerHTML = tools.join('');

  // layers
  document.getElementById('layers').innerHTML = gs.map(g => `<button type="button" data-layer="${g}" aria-pressed="${st.layer === g}"><svg class="chipicon" viewBox="0 0 18 18" aria-hidden="true">${badge(g, 9, 9, 8.4, false, false)}</svg>${GOODS[g].name}</button>`).join('');
  // rank legend
  const maxL = gs.length;
  document.getElementById('lgRanks').innerHTML = [1, 2, 3].filter(l => l <= maxL).map(l => `<span><svg width="34" height="28" viewBox="-17 -14 34 28" aria-hidden="true">${placeSig(0, -1, l, () => false, false)}</svg>${RANK[l]}</span>`).join('');

  // goals
  const E = evaluateGoals(A);
  const supTxt = gs.map(g => `${GOODS[g].name} ${pct(A[g].share)} %`).join(' · ');
  const belowTot = gs.reduce((a, g) => a + A[g].below, 0);
  const goalMin = lv.minSupply < 1 ? `Mindestens ${pct(lv.minSupply)} % der Haushalte erreichen jedes Gut` : 'Alle Haushalte erreichen jedes Gut';
  const effTxt = E.target === null ? '' : `${E.pc.shops} Einrichtungen · Musterlösung ${E.target}`;
  document.getElementById('goals').innerHTML = `
    <li class="${E.supplied ? 'ok' : ''}"><span class="mark">✓</span><span><span class="gt">${goalMin}</span><span class="gd">${supTxt}</span></span></li>
    <li class="${E.viable ? 'ok' : ''}"><span class="mark">✓</span><span><span class="gt">Jede Einrichtung erreicht ihre Schwelle</span><span class="gd">${E.pc.shops === 0 ? 'noch nichts gebaut' : belowTot === 0 ? 'alle tragen sich' : belowTot + ' unter der Schwelle'}</span></span></li>
    <li class="${E.efficient ? 'ok' : ''}"><span class="mark">★</span><span><span class="gt">Bonus: so wenige Einrichtungen wie die Musterlösung</span><span class="gd">${effTxt}</span></span></li>`;

  // balance
  const rows = gs.map(g => {
    const a = A[g];
    return `<tr><td><i class="swatch" style="background:${GOODS[g].color}"></i> ${GOODS[g].plural}</td><td>${a.sites.length}</td><td class="${a.share < lv.minSupply - 1e-9 ? 'bad' : ''}">${pct(a.share)} %</td><td class="${a.below ? 'bad' : ''}">${a.below}</td></tr>`;
  }).join('');
  const pc = E.pc;
  const r3txt = pc.r3 ? `${pc.r3} ${pc.r3 > 1 ? 'Kreisstädte' : 'Kreisstadt'}` : '';
  const rankLine = [pc.r1 ? `${pc.r1} ${pc.r1 > 1 ? 'Marktorte' : 'Marktort'}` : '', pc.r2 ? `${pc.r2} ${pc.r2 > 1 ? 'Amtsorte' : 'Amtsort'}` : '', r3txt].filter(Boolean).join(' · ');
  document.getElementById('bil').innerHTML = `<thead><tr><th>Einrichtung</th><th>Anzahl</th><th>versorgt</th><th>unter Schwelle</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td colspan="4" style="font-family:var(--f-body);font-size:13px;color:var(--muted);text-align:left;border-bottom:0;font-weight:400">${rankLine ? 'Zentrale Orte: ' + rankLine : 'Noch keine zentralen Orte'}</td></tr></tfoot>`;

  renderInfo(A);
  renderLevels();
  return E;
}

function renderInfo(A) {
  const lv = LEVELS[st.lv];
  const k = st.hover || st.focus;
  const el = document.getElementById('info');
  const h = k && byKey.get(k);
  if (!h) { el.innerHTML = 'Fahre über die Karte oder tippe ein Feld an.'; return; }
  const lvl = st.places.get(k) || 0;
  const lines = [];
  for (const g of goodsOf()) {
    const a = A[g], as = a.assign.get(k);
    if (lvl > ORDER.indexOf(g)) {
      const c = a.cust.get(k);
      lines.push(`<li><b>${GOODS[g].name} hier:</b> ${fmt(c)} von ${a.thr} nötigen Haushalten ${c >= a.thr - 1e-9 ? '– trägt sich' : '– <span style="color:var(--warn);font-weight:600">macht Verlust</span>'}</li>`);
    } else if (as) {
      lines.push(`<li>${GOODS[g].name}: ${as.d === 0 ? 'im Ort' : as.d + ' Feld' + (as.d > 1 ? 'er' : '') + ' entfernt'}${as.near.length > 1 ? `, Kunden teilen sich auf ${as.near.length} Orte auf` : ''}</li>`);
    } else {
      lines.push(`<li style="color:var(--warn)">${GOODS[g].name}: nicht erreichbar (mehr als ${a.reach} Feld${a.reach > 1 ? 'er' : ''})</li>`);
    }
  }
  el.innerHTML = `<span class="k">Feld ${h.q}|${h.r} · ${h.hh} Haushalte${lvl ? ' · ' + RANK[lvl] : ''}</span><ul>${lines.join('')}</ul>`;
}

function renderLevels() {
  document.getElementById('levels').innerHTML = LEVELS.map((l, i) => {
    const s = best[i] || 0;
    return `<button class="lvbtn" type="button" data-lv="${i}" aria-current="${i === st.lv}" title="${l.name}"><span class="ln">${i + 1}</span> ${l.name} <span class="st" aria-label="${s} Sterne">${'★'.repeat(s)}<i>${'★'.repeat(3 - s)}</i></span></button>`;
  }).join('');
}

function renderInsight(E) {
  const slot = document.getElementById('insightSlot');
  if (!st.won) { slot.innerHTML = ''; return; }
  const lv = LEVELS[st.lv];
  const stars = 1 + (E.viable && E.supplied ? 1 : 0) + (E.efficient ? 1 : 0);
  const A = analyze();
  const gs = goodsOf();
  const unsup = Math.max(...gs.map(g => 1 - A[g].share));
  const s = { ...E.pc, unsupPct: pct(unsup) };
  const better = E.target !== null && E.pc.shops < E.target;
  const next = st.lv < LEVELS.length - 1 ? `<button class="btn primary" type="button" data-act="next">Weiter zu Level ${st.lv + 2}</button>` : '';
  const extra = E.efficient ? (better ? '<p><b>Sogar besser als die Musterlösung!</b></p>' : '') : `<p>Für den dritten Stern: Schaffst du es mit ${E.target} Einrichtungen?</p>`;
  slot.innerHTML = `<section class="insight" aria-live="polite">
    <div class="stars" aria-label="${stars} von 3 Sternen">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
    <h2>${st.usedSolution ? 'Musterlösung: ' : 'Geschafft: '}${lv.name}</h2>
    ${lv.insight(s)}
    ${extra}
    <div class="row">${next}<button class="btn" type="button" data-act="close">Weiter optimieren</button></div>
  </section>`;
}

let toastT;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 3600);
}

function update() {
  const A = analyze();
  renderMap(A);
  const E = renderPanel(A);
  if (E.supplied && E.viable) {
    const stars = 2 + (E.efficient ? 1 : 0);
    if (!st.usedSolution && (best[st.lv] || 0) < stars) { best[st.lv] = stars; store.set('cl-stars', best); renderLevels(); }
    if (!st.won && !st.dismissed) { st.won = true; renderInsight(E); }
    else if (st.won) renderInsight(E);
  } else if (st.won) { st.won = false; renderInsight(E); }
  saved[st.lv] = [...st.places];
  store.set('cl-saved', saved);
}

// ---------- Actions ----------
function act(k) {
  const lv = LEVELS[st.lv];
  const cur = st.places.get(k) || 0;
  if (st.tool === 'i') { st.focus = k; renderInfo(analyze()); return; }
  st.usedSolution = false;
  if (st.tool === 'x') {
    if (!cur) { toast('Hier steht nichts zum Abreißen.'); return; }
    setLvl(k, cur - 1);
  } else {
    const gi = ORDER.indexOf(st.tool) + 1;
    if (cur >= gi) {
      if (cur > gi) { toast(`Erst die höhere Einrichtung abreißen: Ein ${RANK[cur]} braucht seine ${GOODS[st.tool].name}.`); return; }
      setLvl(k, gi - 1);
    } else if (lv.hier && cur < gi - 1) {
      const need = GOODS[ORDER[cur]];
      toast(`Regel der zentralen Orte: Hier fehlt zuerst ${need.name === 'Gymnasium' ? 'ein' : 'eine'} ${need.name}. Höhere Einrichtungen gibt es nur, wo alle niedrigeren schon sind.`);
      return;
    } else if (!lv.hier && cur < gi - 1) {
      setLvl(k, gi);
    } else setLvl(k, gi);
  }
  st.focus = k;
  st.dismissed = false;
  update();
}
function setLvl(k, v) { if (v <= 0) st.places.delete(k); else st.places.set(k, v); }

function loadLevel(i, opts = {}) {
  st.lv = i; const lv = LEVELS[i];
  buildCells(lv);
  st.places = new Map(); st.won = false; st.dismissed = false; st.usedSolution = false; st.hover = null; st.focus = null;
  const gs = goodsOf();
  st.tool = gs[0]; st.layer = gs[0];
  const sv = saved[i];
  if (!opts.fresh && sv && sv.length) { for (const [k, v] of sv) if (byKey.has(k)) st.places.set(k, v); }
  else if (lv.start !== undefined && SOLUTIONS) loadSolution(lv.start, false);
  update();
}

function loadSolution(from, mark = true) {
  const sol = SOLUTIONS[from];
  st.places = new Map();
  sol.forEach((sites, gi) => { for (const [q, r] of sites) { const k = key(q, r); if (byKey.has(k)) st.places.set(k, Math.max(st.places.get(k) || 0, gi + 1)); } });
  if (mark) st.usedSolution = true;
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-tool],[data-layer],[data-lv],[data-act]');
  if (!t) return;
  if (t.dataset.tool) { st.tool = t.dataset.tool; if (GOODS[st.tool]) st.layer = st.tool; update(); }
  else if (t.dataset.layer) { st.layer = t.dataset.layer; update(); }
  else if (t.dataset.lv) { loadLevel(+t.dataset.lv); }
  else if (t.dataset.act === 'next') { loadLevel(st.lv + 1); try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (err) {} }
  else if (t.dataset.act === 'close') { st.won = false; st.dismissed = true; renderInsight({}); }
});
svg.addEventListener('click', (e) => { const c = e.target.closest('.cell'); if (c) act(c.dataset.k); });
svg.addEventListener('pointermove', (e) => {
  if (e.pointerType === 'touch') return;
  const c = e.target.closest('.cell'); const k = c ? c.dataset.k : null;
  if (k !== st.hover) { st.hover = k; const A = analyze(); renderMap(A); renderInfo(A); }
});
svg.addEventListener('pointerleave', () => { if (st.hover) { st.hover = null; const A = analyze(); renderMap(A); renderInfo(A); } });
document.getElementById('btnHint').addEventListener('click', () => toast(LEVELS[st.lv].hint));
document.getElementById('btnReset').addEventListener('click', () => {
  saved[st.lv] = []; loadLevel(st.lv, { fresh: true });
  toast(LEVELS[st.lv].start !== undefined ? 'Das alte Netz ist wieder geladen.' : 'Die Karte ist leer.');
});
document.getElementById('btnSolution').addEventListener('click', () => {
  if (!SOLUTIONS) return;
  loadSolution(st.lv); st.won = false; st.dismissed = false; update();
  toast('Musterlösung geladen. Für Sterne zählt nur dein eigenes Netz.');
});

saved = store.get('cl-saved', {});
loadLevel(0);
})();
