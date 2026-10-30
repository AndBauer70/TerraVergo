#!/usr/bin/env node
// Bereich für Lehrkräfte: Begleithefte, Wissensbasen und Lösungsblätter verschlüsseln
//
// Aufruf im Hauptordner des Erdlabors:
//   node lehrkraefte/werkzeug/verschluesseln.mjs
//   node lehrkraefte/werkzeug/verschluesseln.mjs --passwort "Neues Passwort"
//
// Ablauf
// 1. Einsammeln: Liegt in einem Anwendungsordner ein unverschlüsseltes Dokument
//    (begleitheft.html, wissensbasis.html, loesung-*.html, begleitheft.pdf/.docx),
//    wird es nach _lehrkraefte-originale/<anwendung>/ verschoben. Dieser Ordner
//    ist über .gitignore von der Veröffentlichung ausgeschlossen.
// 2. Verschlüsseln: Jedes Original wird mit AES-256-GCM verschlüsselt
//    (Schlüssel aus dem Passwort über PBKDF2-SHA-256, 600 000 Runden) und als
//    lehrkraefte/<anwendung>/<name>.html abgelegt. Erst im Browser wird es mit
//    dem Passwort wieder lesbar.
// 3. Weiterleitungen: An der alten Stelle bleibt eine kleine Seite, die auf das
//    verschlüsselte Dokument weiterleitet. So funktionieren alle Links aus den
//    Anwendungen weiter.
// 4. Übersicht: lehrkraefte/dokumente.js listet die Dokumente für die Seite
//    lehrkraefte/index.html.
//
// Bei jedem Lauf werden alle Dokumente neu verschlüsselt. Wer das Passwort
// ändern will, ruft das Werkzeug einfach mit dem neuen Passwort auf.
// Benötigt nur Node.js (ab Version 18), keine weiteren Pakete.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const LK = path.join(ROOT, 'lehrkraefte');
const ORIG = path.join(ROOT, '_lehrkraefte-originale');
const ITER = 600000;
const MARKE_STUB = 'tv-lehrkraefte-weiterleitung';
const MARKE_HUELLE = 'tv-lehrkraefte-verschluesselt';

// Reihenfolge und Namen wie auf der Startseite
const APPS = [
  { id: 'erdbeben', titel: 'Erdbeben-Globus', stufe: 'Klasse 5 und 6', start: '' },
  { id: 'klimazonen', titel: 'Klimazonen der Erde', stufe: 'Klasse 5 und 6', start: '' },
  { id: 'kompass-raetsel', titel: 'Das Kompass-Rätsel', stufe: 'Klasse 5 und 6', start: '' },
  { id: 'orientierung-breitenkreise', titel: 'Die Breitenkreise', stufe: 'Klasse 5 und 6', start: '' },
  { id: 'sensor-werkstatt', titel: 'Die Sensor-Werkstatt', stufe: 'Klasse 5 und 6', start: '' },
  { id: 'klimasimulation', titel: 'Terra Vergo: Das Rätsel vom Deich und Klimasimulation', stufe: 'Klasse 7 bis 10', start: 'mystery.html' },
  { id: 'christallers-land', titel: 'Christallers Land', stufe: 'Klasse 7 bis 10', start: '' },
  { id: 'rungholt', titel: 'Das Rätsel von Rungholt', stufe: 'Klasse 7 bis 10', start: 'rungholt.html' },
  { id: 'planspiel-kartoffelhof', titel: 'Planspiel Kartoffelhof', stufe: 'Klasse 7 bis 10', start: '' },
  { id: 'kaffee-lieferkette', titel: 'Die Kaffee-Spur', stufe: 'Klasse 7 bis 10', start: '' },
  { id: 'laendlicher_raum', titel: 'Rura Viva', stufe: 'Klasse 7 bis 10', start: '' },
  { id: 'schanze', titel: 'Wer macht die Schanze?', stufe: 'Oberstufe', start: '' },
];

// Welche Dateien geschützt werden
const SCHUTZ = /^(begleitheft\.html|wissensbasis\.html|loesung[^/]*\.html|begleitheft\.pdf|begleitheft\.docx)$/i;
const NUR_ARCHIV = ['docs/wissensbasis.md']; // wird nur aus der Veröffentlichung genommen
const OFFEN = [{ datei: 'materialien.html', art: 'Arbeitsblätter' }, { datei: 'LIESMICH.txt', art: 'Anleitung' }];

const huelleName = (name) => name.replace(/\.pdf$/i, '-pdf.html').replace(/\.docx$/i, '-word.html');
const art = (name) =>
  /^begleitheft\.pdf$/i.test(name) ? 'Begleitheft als PDF' :
  /^begleitheft\.docx$/i.test(name) ? 'Begleitheft als Word-Datei' :
  /^begleitheft/i.test(name) ? 'Begleitheft' :
  /^wissensbasis/i.test(name) ? 'Wissensbasis' : 'Lösungsblatt für Lehrkräfte';
const rang = (name) => ['begleitheft.html', 'wissensbasis.html'].indexOf(name.toLowerCase()) + 1 || (/^loesung/i.test(name) ? 3 : 4);

// ---------- Hilfsfunktionen ----------
const log = (...a) => console.log(...a);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const posix = path.posix;

// Schreibweise der Ordner, wie sie im Repository (und damit auf GitHub Pages) heißt,
// z. B. "Erdbeben" statt "erdbeben"
function webNamen() {
  const map = {};
  try {
    const files = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split('\n');
    for (const f of files) {
      const top = f.split('/')[0];
      if (f.includes('/') && !map[top.toLowerCase()]) map[top.toLowerCase()] = top;
    }
  } catch { /* kein git: Ordnernamen von der Platte */ }
  return map;
}

// Ordner auf der Platte, unabhängig von Groß- und Kleinschreibung
function ordnerAufPlatte(id) {
  const hit = fs.readdirSync(ROOT).find((n) => n.toLowerCase() === id.toLowerCase());
  return hit ? path.join(ROOT, hit) : null;
}

async function passwortHolen() {
  const i = process.argv.indexOf('--passwort');
  if (i > -1 && process.argv[i + 1]) return process.argv[i + 1];
  if (process.env.TV_PASSWORT) return process.env.TV_PASSWORT;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const frage = (q) => new Promise((r) => rl.question(q, r));
  const a = await frage('Passwort für den Bereich für Lehrkräfte: ');
  const b = await frage('Passwort wiederholen: ');
  rl.close();
  if (a !== b) { console.error('Die Eingaben stimmen nicht überein.'); process.exit(1); }
  return a;
}

function verschluesseln(key, daten) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([c.update(daten), c.final(), c.getAuthTag()]);
  return { iv: iv.toString('base64'), ct: ct.toString('base64') };
}

// Relative Links eines Dokuments an den neuen Ort anpassen
function linksUmschreiben(html, appWeb, appId, geschuetzt, webZuId) {
  const hier = `lehrkraefte/${appId}`;
  return html.replace(/(\s(?:href|src))=("|')([^"']*)\2/g, (m, attr, q, url) => {
    if (!url || url.startsWith('#') || url.startsWith('/') || /^[a-z][a-z0-9+.-]*:/i.test(url)) return m;
    const cut = url.search(/[?#]/);
    const p = cut < 0 ? url : url.slice(0, cut);
    const rest = cut < 0 ? '' : url.slice(cut);
    if (!p) return m;
    const ziel = posix.normalize(posix.join(appWeb, p));
    if (ziel.startsWith('..')) return m;
    const [kopf, ...tail] = ziel.split('/');
    const zielId = webZuId[kopf.toLowerCase()];
    const name = tail.join('/');
    let neu;
    if (zielId && geschuetzt.has(`${zielId}/${name.toLowerCase()}`)) {
      neu = posix.relative(hier, `lehrkraefte/${zielId}/${huelleName(name)}`);
    } else {
      neu = posix.relative(hier, ziel) + (p.endsWith('/') ? '/' : '');
    }
    return `${attr}=${q}${neu}${rest}${q}`;
  });
}

const SPRUNG = '<script>(function(){var h=location.hash.slice(1);if(!h)return;var e=document.getElementById(decodeURIComponent(h))||document.getElementsByName(decodeURIComponent(h))[0];if(e)setTimeout(function(){e.scrollIntoView()},40)})()</script>';

function htmlVorbereiten(html) {
  if (!/name="robots"/i.test(html)) html = html.replace(/<head([^>]*)>/i, '<head$1>\n<meta name="robots" content="noindex, nofollow">');
  const i = html.toLowerCase().lastIndexOf('</body>');
  return i < 0 ? html + SPRUNG : html.slice(0, i) + SPRUNG + html.slice(i);
}

function huelle({ titel, artName, appTitel, appLink, typ, datei, enc, cfg }) {
  const daten = JSON.stringify({ typ, datei, iv: enc.iv, ct: enc.ct });
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<!-- ${MARKE_HUELLE}: Dieses Dokument ist verschlüsselt. Es wird erst im Browser mit dem Passwort für Lehrkräfte lesbar. -->
<title>${esc(titel)} · Bereich für Lehrkräfte</title>
<link rel="stylesheet" href="../lehrkraefte.css">
</head>
<body class="lk-huelle">
<main class="lk-wrap lk-schmal">
  <section class="box lk-tor" aria-labelledby="lk-titel">
    <span class="tag">Bereich für Lehrkräfte</span>
    <h1 class="lk-h" id="lk-titel">${esc(artName)}</h1>
    <p class="lk-sub">${esc(appTitel)}</p>
    <p>Dieses Dokument ist verschlüsselt und nur für Lehrkräfte bestimmt. Mit dem Passwort wird es hier im Browser entschlüsselt; das Passwort verlässt Ihr Gerät nicht.</p>
    <form class="lk-form" data-lk-form>
      <label for="lk-pw">Passwort</label>
      <div class="lk-zeile"><input id="lk-pw" type="password" autocomplete="current-password" required><button type="submit" class="go">Öffnen</button></div>
    </form>
    <div class="lk-datei" data-lk-datei hidden></div>
    <p class="lk-meldung" data-lk-meldung role="status" aria-live="polite"></p>
    <p class="lk-nav"><a href="../index.html">Übersicht für Lehrkräfte</a> · <a href="${esc(appLink)}">Zur Anwendung</a></p>
  </section>
</main>
<script type="application/json" id="lk-daten">${daten}</script>
<script>window.TV_LK=${JSON.stringify(cfg)};</script>
<script src="../schloss.js"></script>
</body>
</html>
`;
}

function stub(ziel, titel) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<!-- ${MARKE_STUB}: Das Dokument liegt verschlüsselt im Bereich für Lehrkräfte. Diese Datei nicht von Hand ändern; sie wird von lehrkraefte/werkzeug/verschluesseln.mjs erzeugt. -->
<meta name="robots" content="noindex, nofollow">
<title>${esc(titel)}</title>
<script>location.replace(${JSON.stringify(ziel)}+location.hash)</script>
<meta http-equiv="refresh" content="0; url=${esc(ziel)}">
</head>
<body style="font-family:system-ui,sans-serif;padding:24px">
<p>Dieses Dokument liegt jetzt im <a href="${esc(ziel)}">Bereich für Lehrkräfte</a>.</p>
</body>
</html>
`;
}

// ---------- Hauptprogramm ----------
const web = webNamen();
const webZuId = {};
for (const a of APPS) { a.web = web[a.id.toLowerCase()] || a.id; webZuId[a.web.toLowerCase()] = a.id; }

// 1. Einsammeln
for (const a of APPS) {
  const dir = ordnerAufPlatte(a.id);
  if (!dir) continue;
  const kandidaten = fs.readdirSync(dir).filter((n) => SCHUTZ.test(n)).concat(NUR_ARCHIV.filter((n) => fs.existsSync(path.join(dir, n))));
  for (const n of kandidaten) {
    const quelle = path.join(dir, n);
    if (/\.html$/i.test(n) && fs.readFileSync(quelle, 'utf8').includes(MARKE_STUB)) continue;
    const zielDir = path.join(ORIG, a.id);
    fs.mkdirSync(zielDir, { recursive: true });
    const ziel = path.join(zielDir, n.replace('/', '-'));
    fs.renameSync(quelle, ziel);
    log(`eingesammelt: ${a.id}/${n} -> _lehrkraefte-originale/${a.id}/${path.basename(ziel)}`);
  }
}

// Welche Dokumente sind geschützt?
const liste = [];
const geschuetzt = new Set();
for (const a of APPS) {
  const dir = path.join(ORIG, a.id);
  const dateien = fs.existsSync(dir) ? fs.readdirSync(dir).filter((n) => SCHUTZ.test(n)).sort((x, y) => rang(x) - rang(y)) : [];
  for (const n of dateien) geschuetzt.add(`${a.id}/${n.toLowerCase()}`);
  liste.push({ a, dateien });
}
if (!geschuetzt.size) { console.error('Keine Dokumente gefunden.'); process.exit(1); }

const passwort = await passwortHolen();
if (!passwort || passwort.length < 8) { console.error('Bitte ein Passwort mit mindestens 8 Zeichen wählen.'); process.exit(1); }
const salz = crypto.randomBytes(16);
log(`Schlüssel wird abgeleitet (PBKDF2, ${ITER} Runden) …`);
const key = crypto.pbkdf2Sync(passwort, salz, ITER, 32, 'sha256');
const cfg = { salz: salz.toString('base64'), iter: ITER, id: crypto.createHash('sha256').update(salz).digest('hex').slice(0, 12) };

// 2./3. Verschlüsseln und Weiterleitungen
const erzeugt = new Set();
const uebersicht = [];
for (const { a, dateien } of liste) {
  const appDir = ordnerAufPlatte(a.id);
  const appLink = `../../${a.web}/${a.start}`;
  const eintrag = { id: a.id, titel: a.titel, stufe: a.stufe, start: `../${a.web}/${a.start}`, dokumente: [], offen: [] };
  for (const n of dateien) {
    const roh = fs.readFileSync(path.join(ORIG, a.id, n));
    let typ, daten, titel = art(n);
    if (/\.html$/i.test(n)) {
      typ = 'html';
      let html = roh.toString('utf8');
      const t = html.match(/<title>([^<]*)<\/title>/i);
      if (t) titel = t[1].trim();
      html = htmlVorbereiten(linksUmschreiben(html, a.web, a.id, geschuetzt, webZuId));
      daten = Buffer.from(html, 'utf8');
    } else {
      typ = /\.pdf$/i.test(n) ? 'pdf' : 'docx';
      daten = roh;
    }
    const hn = huelleName(n);
    const out = path.join(LK, a.id, hn);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, huelle({ titel, artName: art(n), appTitel: a.titel, appLink, typ, datei: n, enc: verschluesseln(key, daten), cfg }));
    erzeugt.add(path.resolve(out));
    if (typ === 'html' && appDir) fs.writeFileSync(path.join(appDir, n), stub(`../lehrkraefte/${a.id}/${hn}`, titel));
    eintrag.dokumente.push({ art: art(n), titel, href: `${a.id}/${hn}`, typ, kb: Math.round(roh.length / 1024) });
    log(`verschlüsselt: lehrkraefte/${a.id}/${hn}`);
  }
  for (const o of OFFEN) if (appDir && fs.existsSync(path.join(appDir, o.datei))) eintrag.offen.push({ art: o.art, href: `../${a.web}/${o.datei}` });
  if (eintrag.dokumente.length || eintrag.offen.length) uebersicht.push(eintrag);
}

// Alte, nicht mehr erzeugte Hüllen entfernen
for (const d of fs.readdirSync(LK, { withFileTypes: true })) {
  if (!d.isDirectory() || d.name === 'werkzeug') continue;
  for (const f of fs.readdirSync(path.join(LK, d.name))) {
    const p = path.resolve(LK, d.name, f);
    if (/\.html$/.test(f) && !erzeugt.has(p) && fs.readFileSync(p, 'utf8').includes(MARKE_HUELLE)) {
      try { fs.unlinkSync(p); log(`entfernt: lehrkraefte/${d.name}/${f}`); } catch { log(`veraltet, bitte löschen: lehrkraefte/${d.name}/${f}`); }
    }
  }
}

// 4. Übersicht
const pruef = verschluesseln(key, Buffer.from('TerraVergo-Lehrkraefte', 'utf8'));
fs.writeFileSync(path.join(LK, 'dokumente.js'),
  `// Automatisch erzeugt von lehrkraefte/werkzeug/verschluesseln.mjs am ${new Date().toISOString().slice(0, 10)}. Nicht von Hand ändern.\n` +
  `window.TV_LK=${JSON.stringify({ ...cfg, pruef })};\n` +
  `window.TV_DOKUMENTE=${JSON.stringify(uebersicht, null, 1)};\n`);
log(`\nFertig: ${erzeugt.size} Dokumente verschlüsselt, Übersicht in lehrkraefte/dokumente.js.`);
log('Die Originale liegen in _lehrkraefte-originale/ und werden nicht veröffentlicht (.gitignore).');
