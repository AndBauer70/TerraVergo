// Ermittelt für jede Anwendungskarte der Startseite, wann sie ins Repository kam
// (Datum des ersten Commits, der den Ordner bzw. die Datei hinzugefügt hat), und
// schreibt die Liste – neueste zuerst – nach assets/neueste.js. Der Ticker auf der
// Startseite zeigt daraus die neuesten Anwendungen.
//
// Aufruf im Hauptordner des Repositorys:  node .github/scripts/neueste-anwendungen.mjs
// Auf GitHub läuft das Skript bei jedem Push automatisch (.github/workflows/neueste-anwendungen.yml).
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const html = readFileSync('index.html', 'utf8');
const hrefs = [...html.matchAll(/<a class="app[^"]*" href="([^"]+)"/g)].map(m => m[1]);

function ersterCommit(pfad) {
  // pfad: Ordner ("mosaic/") oder Datei ("klimasimulation/mystery.html")
  const out = execFileSync('git', ['log', '--diff-filter=A', '--format=%aI', '--', pfad], { encoding: 'utf8' }).trim();
  const zeilen = out.split('\n').filter(Boolean);
  return zeilen.length ? zeilen[zeilen.length - 1] : null;   // älteste Zeile = erstes Hinzufügen
}

const liste = hrefs.map((href, i) => ({ href, datum: ersterCommit(href.replace(/\/$/, '')), i }))
  .filter(e => e.datum)
  // neueste zuerst; bei gleichem Commit gilt die weiter unten stehende Karte als neuer
  .sort((a, b) => (b.datum.localeCompare(a.datum)) || (b.i - a.i))
  .map(({ href, datum }) => ({ href, datum: datum.slice(0, 10) }));

const fehlend = hrefs.filter(h => !liste.some(e => e.href === h));
if (fehlend.length) console.warn('Kein Git-Eintrag gefunden für:', fehlend.join(', '));

const js = '// Automatisch erzeugt von .github/scripts/neueste-anwendungen.mjs – nicht von Hand bearbeiten.\n'
  + '// Anwendungen der Startseite nach dem Datum, an dem sie ins Repository kamen (neueste zuerst).\n'
  + 'window.ERDLABOR_NEU=' + JSON.stringify(liste, null, 1).replace(/\n\s*/g, ' ') + ';\n';
writeFileSync('assets/neueste.js', js);
console.log('assets/neueste.js geschrieben:', liste.slice(0, 5).map(e => e.href + ' (' + e.datum + ')').join(', '));
