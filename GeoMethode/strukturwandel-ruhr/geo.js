/* GeoMethode Kartenkompetenz – gemeinsame Lernmechanik für alle Stationen.
   Aufbau je Station: Kopf mit Frau Prof. Geo, Treppe der vier Schritte (Ludwigsburger Modell),
   links die Karte mit Werkzeugen (Fenster, Lupe, Legende, stationseigene Werkzeuge),
   rechts die Aufgabenkarten des aktuellen Schritts, darunter die Stolpersteine. */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const STUFEN={1:{n:'Dekodieren',k:'Was zeigt die Karte?',c:'s1'},2:{n:'Beschreiben',k:'Was sehe ich wo?',c:'s2'},3:{n:'Erklären',k:'Warum ist das so?',c:'s3'},4:{n:'Beurteilen',k:'Was folgt daraus?',c:'s4'}};
const AVATAR=`<svg class="owl" viewBox="0 0 130 140" role="img" aria-label="Avatar Frau Professorin Geo"><defs><clipPath id="fpgclip"><rect x="0" y="0" width="130" height="140" rx="16"/></clipPath><pattern id="fpgdots" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#E0479A"/><circle cx="2" cy="2" r="1" fill="#7A3FC0"/><circle cx="5" cy="5" r=".8" fill="#FFFFFF"/></pattern></defs><g clip-path="url(#fpgclip)" stroke="#1B1B2F" stroke-linejoin="round" stroke-linecap="round"><rect width="130" height="140" fill="#E4F3DD" stroke="none"/><g fill="none" stroke="#8DBF7E" stroke-width="1.8"><path d="M-6 30c22-14 50-10 70 2s48 14 72 0"/><path d="M-6 16c24-12 52-8 72 4s46 12 70-2"/><ellipse cx="104" cy="50" rx="30" ry="18"/><ellipse cx="106" cy="50" rx="18" ry="10"/><ellipse cx="107" cy="50" rx="7" ry="4"/><path d="M-4 74c10-6 18-4 22 4"/></g><path d="M14 8l4 6M18 8l-4 6" stroke="#E0393B" stroke-width="2.4"/><g transform="translate(22,9) scale(.9)"><path d="M14 142c2-24 20-36 51-36s49 12 51 36Z" fill="#FFCB1F" stroke-width="3"/><path d="M36 112c-6-10 0-18 10-20h38c10 2 16 10 10 20" fill="#F2B705" stroke-width="2.6"/><path d="M65 23c-21 0-31 15-31 36 0 20-3 35-12 51 12 6 27 4 34-5l2-30h14l2 30c7 9 22 11 34 5-9-16-12-31-12-51 0-21-10-36-31-36Z" fill="#E9C77F" stroke-width="2.8"/><path d="M38 76c-1 14-4 24-9 32M92 76c1 14 4 24 9 32M44 86c-1 9-3 15-6 20M86 86c1 9 3 15 6 20" fill="none" stroke="#C9A055" stroke-width="1.6"/><rect x="58" y="84" width="14" height="22" fill="#EFC3A8" stroke-width="2.4"/><path d="M54 102q11 9 22 0l4 8q-15 11-30 0Z" fill="url(#fpgdots)" stroke-width="2.2"/><path d="M58 110l-3 14 8-4z" fill="url(#fpgdots)" stroke-width="2"/><path d="M48 104l-4 12 21 6 21-6-4-12-6 6q-11 6-22 0Z" fill="#FFCB1F" stroke-width="2.5"/><path d="M65 121V144" fill="none" stroke-width="2.2"/><circle cx="60" cy="130" r="1.8" fill="#FFFFFF" stroke-width="1.2"/><circle cx="60" cy="139" r="1.8" fill="#FFFFFF" stroke-width="1.2"/><circle cx="70" cy="130" r="1.8" fill="#FFFFFF" stroke-width="1.2"/><circle cx="70" cy="139" r="1.8" fill="#FFFFFF" stroke-width="1.2"/><path d="M30 124q6 4 10 14M100 124q-6 4-10 14" fill="none" stroke="#C99A00" stroke-width="1.6"/><path d="M44 57c0-17 9-27 21-27s21 10 21 27v7c0 15-9 26-21 28-12-2-21-13-21-28Z" fill="#F7D3BD" stroke-width="2.8"/><circle cx="44.5" cy="72" r="2.1" fill="#FFFFFF" stroke-width="1.1"/><circle cx="85.5" cy="72" r="2.1" fill="#FFFFFF" stroke-width="1.1"/><path d="M41 62c-2-24 9-37 25-37 15 0 26 11 24 33-5-10-12-16-21-18-6 7-15 11-23 12-2 3-4 6-5 10Z" fill="#E9C77F" stroke-width="2.8"/><path d="M42 60c-3 12-3 26 2 37-5-2-8-8-9-14-1-9 2-17 7-23ZM88 58c3 12 3 26-2 37 5-2 8-8 9-14 1-9-2-17-7-23Z" fill="#E9C77F" stroke-width="2.4"/><path d="M52 33c6-3 13-4 20-2M66 27c-6 6-13 10-21 12M76 32c5 3 9 8 11 14" fill="none" stroke="#F6E3B0" stroke-width="2.2"/><path d="M48 54q5-3 10-1M72 53q5-2 10 1" fill="none" stroke="#B48E4E" stroke-width="2"/><g class="blink"><ellipse cx="54" cy="62" rx="4.6" ry="3.2" fill="#FFFFFF" stroke="none"/><ellipse cx="76" cy="62" rx="4.6" ry="3.2" fill="#FFFFFF" stroke="none"/><circle cx="54.6" cy="62.2" r="2.6" fill="#6F97AE" stroke="none"/><circle cx="76.6" cy="62.2" r="2.6" fill="#6F97AE" stroke="none"/><circle cx="54.6" cy="62.2" r="1.2" fill="#1B1B2F" stroke="none"/><circle cx="76.6" cy="62.2" r="1.2" fill="#1B1B2F" stroke="none"/><circle cx="53.6" cy="61.2" r=".8" fill="#FFFFFF" stroke="none"/><circle cx="75.6" cy="61.2" r=".8" fill="#FFFFFF" stroke="none"/></g><path d="M49 61q5-4.5 10-.5l1.8-1.6M71 60.5q5-4 10 .5l1.8-1.4" fill="none" stroke-width="2.1"/><path d="M64.5 66q-1.8 5 .3 7.2q1.6.8 3-.2" fill="none" stroke="#B9806A" stroke-width="1.7"/><ellipse cx="50" cy="73" rx="4.2" ry="2.4" fill="#F2A3A0" fill-opacity=".55" stroke="none"/><ellipse cx="80" cy="73" rx="4.2" ry="2.4" fill="#F2A3A0" fill-opacity=".55" stroke="none"/><path d="M57 79q8 7.5 16 0q-8 2.5-16 0Z" fill="#FFFFFF" stroke="#B5485F" stroke-width="2"/><path d="M57 79q8 1.5 16 0" fill="none" stroke="#B5485F" stroke-width="1.4"/></g></g></svg>`;

/* Werkzeugkasten nach „Strategien zum Verstehen von Karten“ (Uni Münster) */
const WERKZEUGE=[
 {i:'🖍️',n:'Aufgabe markieren',t:'Lest die Aufgabe genau. Markiert den Operator (was sollt ihr tun?), die Begriffe, die auch in der Legende stehen, und die Signalwörter für Räume oder Zeiten. So wisst ihr, welche Kartenzeichen ihr wirklich braucht.'},
 {i:'🪟',n:'Fenster-Strategie',t:'Schaut nur auf den Kartenausschnitt, um den es geht. Wählt dazu oben über der Karte ein Fenster. Alles außerhalb lenkt erst einmal nur ab.'},
 {i:'🔍',n:'Lupen-Strategie',t:'Schaut nur auf eine Art von Kartenzeichen. Blendet mit der Lupe alle anderen Ebenen aus. Auf Papier hilft es, die übrigen Zeichen in Gedanken „wegzudrücken“.'},
 {i:'🗂️',n:'Umordnen in eine Tabelle',t:'Schreibt Kartenzeichen, Bedeutung aus der Legende und den Fachbegriff nebeneinander, am besten mit einem Foto aus der Wirklichkeit. Was ihr neu ordnet, behaltet ihr länger.'},
 {i:'📏',n:'Maßstab Schritt für Schritt',t:'1. Strecke auf der Karte messen (cm). 2. Maßstab lesen: 1 : 100 000 heißt, 1 cm auf der Karte sind 100 000 cm in der Wirklichkeit. 3. Malnehmen. 4. In m oder km umrechnen (100 000 cm = 1 000 m = 1 km).'},
 {i:'⛰️',n:'Höhenlinien lesen',t:'1. Höhenzahlen suchen: Wo ist es hoch, wo tief? 2. Den Abstand der Linien prüfen: eng = steil, weit = flach. 3. Höhenunterschied zählen: Zahl der überquerten Linien mal Abstand der Linien (Äquidistanz).'}
];
/* Formulierungshilfen je Beschreibungsdimension und für Erklären/Beurteilen */
const FORMULIERUNG=[
 {d:'Lage',c:'s2',s:['… liegt im Norden / Süden / Osten / Westen von …','… liegt zwischen … und …','… befindet sich am Rand von … / in der Mitte von …','… liegt etwa … km nördlich von …']},
 {d:'Verteilung',c:'s2',s:['… kommt vor allem im … vor.','… ist gleichmäßig / ungleichmäßig verteilt.','… häuft sich in … , während … nur vereinzelt …','In … gibt es keine …']},
 {d:'Vergleich',c:'s2',s:['Im Vergleich zu … ist … größer / kleiner / steiler.','Während … , ist …','Sowohl … als auch …','Anders als … zeigt …']},
 {d:'Abfolge / Veränderung',c:'s2',s:['Zunächst … , danach … , schließlich …','Von … bis … hat sich … um … verändert.','Im Laufe der Zeit verlagert sich …','Von Süden nach Norden nimmt … ab / zu.']},
 {d:'Verlauf',c:'s2',s:['… verläuft von … nach …','… folgt dem Tal / der Höhenlinie …','… windet sich in Kurven um …','… kreuzt …']},
 {d:'Räumliche Beziehung',c:'s2',s:['Dort, wo … , liegt auch …','Je näher an … , desto …','… grenzt an …','In der Nähe von … gibt es …']},
 {d:'Erklären',c:'s3',s:['… , weil …','Ein Grund dafür ist …','Dadurch / Deshalb / Folglich …','Das hängt damit zusammen, dass …','Wenn … , dann …','Je … , desto …']},
 {d:'Beurteilen',c:'s4',s:['Ein Kriterium ist …','Dafür spricht … , dagegen spricht …','Einerseits … , andererseits …','Aus Sicht von … ist …','Insgesamt halte ich … für … , weil …','Die Karte stellt … übertrieben / angemessen dar, weil …']}
];

let C, S, KEY, mapObj, pickCb=null;
function load(){try{return JSON.parse(localStorage.getItem(KEY))||null}catch(e){return null}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function fresh(){return {step:0,done:{},txt:{},max:0}}

function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}
function say(html){const b=$('#bubble');if(b)b.innerHTML=`<b class="who">Frau Prof. Geo</b>${html}`}

function dialog(title,html){const d=document.createElement('div');d.className='dlg';d.innerHTML=`<div class="box" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="maphead"><h2 class="comic-h">${esc(title)}</h2><button class="ghost" type="button" data-x>Schließen ✕</button></div>${html}</div>`;
 document.body.appendChild(d);const close=()=>d.remove();d.addEventListener('click',e=>{if(e.target===d||e.target.closest('[data-x]'))close()});
 document.addEventListener('keydown',function k(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',k)}});$('[data-x]',d).focus();return d}
function showWerkzeuge(){dialog('Werkzeugkasten',`<p class="sub">Diese Strategien helfen beim Entschlüsseln jeder Karte. Ihr findet sie auch über der Karte.</p><div class="stack">${WERKZEUGE.map(w=>`<div class="card"><h3>${w.i} ${esc(w.n)}</h3><p class="sm">${esc(w.t)}</p></div>`).join('')}</div>`)}
function showFormulierung(){dialog('Formulierungshilfen',`<p class="sub">Beschreiben heißt: genau sagen, <b>was wo</b> ist. Wählt zuerst die passende Dimension. Beginnt mit dem Überblick, dann folgen die Einzelheiten. Erklären heißt: Gründe nennen. Beurteilen heißt: mit Kriterien abwägen und zu einem Urteil kommen.</p><div class="legend" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">${FORMULIERUNG.map(f=>`<div class="card" style="display:block"><span class="chip ${f.c}">${esc(f.d)}</span><ul class="sm" style="margin:6px 0 0;padding-left:1.1em">${f.s.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</div>`)}
function showModell(){dialog('Die vier Schritte der Kartenauswertung',`<p class="sub">Die Treppe folgt dem Ludwigsburger Modell der Kartenauswertungskompetenz (Hemmer, Hemmer, Hüttermann &amp; Ullrich 2010/2012). Jede Stufe baut auf der vorigen auf: Wer erklärt, muss vorher dekodiert und beschrieben haben.</p>
 <table class="t"><tr><th>Stufe</th><th>Was ihr tut</th><th>Typische Frage</th></tr>
 <tr><td><span class="chip s1">1 Dekodieren</span></td><td><b>a</b> Kartenzeichen mit der Legende entschlüsseln. <b>b</b> Maßstab und Höhenlinien lesen. <b>c</b> Verstehen, dass die Karte vereinfacht (Generalisierung).</td><td>Was bedeutet dieses Zeichen? Wie weit, wie hoch?</td></tr>
 <tr><td><span class="chip s2">2 Beschreiben</span></td><td>Einzelnes und Raummuster in Fachsprache wiedergeben: Lage, Verteilung, Vergleich, Abfolge, Verlauf, räumliche Beziehung.</td><td>Was liegt wo, wie ist es verteilt?</td></tr>
 <tr><td><span class="chip s3">3 Erklären</span></td><td>Das Beschriebene mit Vorwissen und weiteren Materialien verknüpfen: Ursachen, Prozesse, Folgen.</td><td>Warum ist es so?</td></tr>
 <tr><td><span class="chip s4">4 Beurteilen</span></td><td>Die Aussage der Karte und ihre Gestaltung prüfen: Ist sie richtig, passend, vielleicht manipulativ? Folgen für Mensch und Natur abwägen.</td><td>Stimmt das so? Was folgt daraus?</td></tr></table>`)}

/* ---------- Kopf ---------- */
function renderHead(){
 const st=C.steps;
 $('#app').innerHTML=`
 <div class="top">
  <section class="box hero" aria-label="${esc(C.title)}">
   ${AVATAR}
   <div><span class="chip">${esc(C.jg)}</span> <span class="chip">${esc(C.raum)}</span><h1 class="logo">${esc(C.title)}</h1><span class="kicker">${esc(C.kicker)}</span><div class="tagline">${C.story}</div></div>
   <div class="bubble" id="bubble" aria-live="polite"></div>
   <div class="hbtns">${C.solo?'':'<a class="ghost" href="index.html">← Alle Stationen</a>'}<button class="ghost" type="button" id="bWz">🧰 Werkzeugkasten</button><button class="ghost" type="button" id="bFh">💬 Formulierungshilfen</button><button class="ghost" type="button" id="bMo">🪜 Die vier Schritte</button><button class="ghost" type="button" id="bTeach">Für Lehrkräfte</button></div>
   ${C.home?`<style>/* tv-earthlab: Knopf zurück zum Earth-Lab, unten rechts im einleitenden Block */.tv-el-row{display:flex;justify-content:flex-end;align-items:flex-end;grid-column:1/-1;flex:1 0 100%;width:100%;margin-top:10px;position:relative;z-index:1;box-sizing:border-box}.tv-el{display:inline-flex;align-items:center;gap:7px;border:2.5px solid #1B1B2F;border-radius:10px;background:#fff;color:#1B1B2F;padding:6px 12px;font:700 .92rem/1.2 "Lexend","Segoe UI",system-ui,sans-serif;letter-spacing:0;text-transform:none;text-decoration:none;box-shadow:2px 2px 0 #1B1B2F;white-space:nowrap;cursor:pointer}.tv-el:hover{background:#FFF3A6}.tv-el:active{transform:translate(2px,2px);box-shadow:none}.tv-el:focus-visible{outline:3px solid #FF6B3D;outline-offset:3px}.tv-el svg{width:1.3em;height:1.3em;flex:none;display:block}.tv-el .tv-el-spin{animation:tv-el-spin 6s linear infinite}@keyframes tv-el-spin{from{transform:translateX(0)}to{transform:translateX(-20px)}}@media (prefers-reduced-motion:reduce){.tv-el .tv-el-spin{animation:none}}@media print{.tv-el-row{display:none}}</style><div class="tv-el-row"><a class="tv-el" href="${C.home}"><svg viewBox="0 0 20 20" aria-hidden="true"><defs><clipPath id="tv-el-clip"><circle cx="10" cy="10" r="8"/></clipPath></defs><circle cx="10" cy="10" r="8" fill="#7FC4EE"/><g clip-path="url(#tv-el-clip)"><g class="tv-el-spin" fill="#4FB24C" stroke="#1B1B2F" stroke-width=".8" stroke-linejoin="round"><path d="M3 5c2-1 4 0 4 2s-2 2-1 4-2 3-3 1-1-6 0-7z"/><path d="M11 3c2 0 3 1 3 2s-2 1-1 3 0 3-1 2-2-3-2-4 0-3 1-3z"/><path d="M15 11c2 0 3 2 2 4s-3 1-3-1 0-3 1-3z"/><path d="M23 5c2-1 4 0 4 2s-2 2-1 4-2 3-3 1-1-6 0-7z"/><path d="M31 3c2 0 3 1 3 2s-2 1-1 3 0 3-1 2-2-3-2-4 0-3 1-3z"/><path d="M35 11c2 0 3 2 2 4s-3 1-3-1 0-3 1-3z"/></g></g><circle cx="10" cy="10" r="8" fill="none" stroke="#1B1B2F" stroke-width="1.6"/><path d="M5 6.5q2-2.5 5-3" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".7"/></svg>Zum Earth-Lab</a></div>`:''}
  </section>
  <section class="box akte" aria-label="Forschungsauftrag">
   <div class="lq"><small>${C.solo?'Leitfrage':'Leitfrage der Station'}</small><b>${esc(C.leitfrage)}</b></div>
   <div class="ladder" id="ladder">${st.map((s,i)=>`<button type="button" data-s="${s.s}" data-i="${i}"><b>${i+1} ${STUFEN[s.s].n}</b><small>${esc(s.short||STUFEN[s.s].k)}</small></button>`).join('')}</div>
   <p class="cap" style="margin:0">Die Stufen bauen aufeinander auf. Die nächste Stufe öffnet sich, wenn ihr alle Aufgaben der vorigen gelöst habt.</p>
  </section>
 </div>
 <div class="work">
  <section class="box mapbox" id="mapbox" aria-label="Karte"></section>
  <section class="tasks" id="tasks" aria-live="polite"></section>
 </div>
 <details class="box teach" id="teach"><summary>Für Lehrkräfte: Aufbau, Erwartungshorizont und Stolpersteine</summary>${C.teach||''}<p class="sm"><a href="begleitheft.html">Begleitheft</a> · <a href="wissensbasis.html">Wissensbasis</a> · <a href="impressum.html">Impressum</a></p><p class="ctrls"><button class="ghost sm" type="button" id="bReset">Fortschritt dieser Station löschen</button><button class="ghost sm" type="button" id="bUnlock">Alle Stufen freischalten (Lehrkraft)</button></p></details>
 <nav class="foot">${C.solo?'':'<a href="index.html">Start</a>'}<a href="begleitheft.html">Begleitheft</a><a href="wissensbasis.html">Wissensbasis</a><a href="impressum.html">Impressum</a></nav>`;
 $('#bWz').onclick=showWerkzeuge;$('#bFh').onclick=showFormulierung;$('#bMo').onclick=showModell;
 $('#bTeach').onclick=()=>{const t=$('#teach');t.open=true;t.scrollIntoView({behavior:'smooth'})};
 $('#bReset').onclick=()=>{if(confirmReset()){S=fresh();save();location.hash='';location.reload()}};
 $('#bUnlock').onclick=()=>{S.max=C.steps.length-1;save();ladder();toast('Alle Stufen sind frei.')};
 $$('#ladder button').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(i<=S.max)goStep(i)});
}
function confirmReset(){const b=$('#bReset');if(b.dataset.sure){return true}b.dataset.sure='1';b.textContent='Wirklich löschen? Noch einmal tippen';setTimeout(()=>{b.dataset.sure='';b.textContent='Fortschritt dieser Station löschen'},4000);return false}
function ladder(){$$('#ladder button').forEach((b,i)=>{b.classList.toggle('now',i===S.step);b.classList.toggle('done',stepDone(i));b.disabled=i>S.max})}

/* ---------- Karte ---------- */
function renderMap(){
 const box=$('#mapbox');const M=C.map;
 box.innerHTML=`<div class="maphead"><h2 class="comic-h">${esc(M.title)}</h2><span class="chip">${esc(M.massstab||'')}</span></div>
  <div class="toolbar" id="tb"><span class="lbl">Werkzeuge</span>
   <button class="ghost sm" type="button" data-tool="leg" aria-pressed="true">📖 Legende</button>
   <button class="ghost sm" type="button" data-tool="lupe" aria-pressed="false">🔍 Lupe</button>
   <button class="ghost sm" type="button" data-tool="fen" aria-pressed="false">🪟 Fenster</button>
   <span id="tbx" class="toolbar"></span></div>
  <div class="toolpanel" id="pLupe" hidden><h3>🔍 Lupe: Welche Ebenen wollt ihr sehen?</h3><div class="layers" id="layers"></div></div>
  <div class="toolpanel" id="pFen" hidden><h3>🪟 Fenster: Welchen Ausschnitt wollt ihr ansehen?</h3><div class="ctrls" id="wins"></div></div>
  <div class="mapframe" id="mapframe"></div>
  <div id="mapextra" class="stack"></div>
  <div class="toolpanel" id="pLeg"><h3>📖 Legende</h3><div class="legend" id="legend"></div></div>
  <p class="mapnote">${M.note||''}</p>`;
 const api={emit,setPickHandler:(fn)=>{pickCb=fn},extra:$('#mapextra',box),toolbar:$('#tbx',box),say};
 mapObj=M.render($('#mapframe',box),api);
 const layers=mapObj.layers||[];
 $('#layers').innerHTML=layers.map(l=>`<label><input type="checkbox" data-l="${l.id}" ${l.on?'checked':''}> ${esc(l.name)}</label>`).join('');
 $$('#layers input').forEach(i=>i.onchange=()=>{mapObj.setLayer(i.dataset.l,i.checked);emit('lupe',{id:i.dataset.l,on:i.checked})});
 const wins=mapObj.windows||[];
 $('#wins').innerHTML=wins.map(w=>`<button class="ghost sm" type="button" data-w="${w.id}">${esc(w.name)}</button>`).join('');
 $$('#wins button').forEach(b=>b.onclick=()=>{setWin(b.dataset.w);emit('fenster',b.dataset.w)});
 $('#legend').innerHTML=(mapObj.legend||[]).map(it=>it.h?`<span class="lh">${esc(it.h)}</span>`:`<div data-leg="${it.id||''}"><svg viewBox="0 0 34 22" aria-hidden="true">${it.sym}</svg><span>${it.t}</span></div>`).join('');
 $$('#tb [data-tool]').forEach(b=>b.onclick=()=>{const t=b.dataset.tool;const p={leg:'#pLeg',lupe:'#pLupe',fen:'#pFen'}[t];const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);$(p).hidden=!on;emit('tool-'+t,on)});
 if(!wins.length)$('[data-tool="fen"]').hidden=true;
 if(!layers.length)$('[data-tool="lupe"]').hidden=true;
}
function setWin(id){mapObj.setWindow&&mapObj.setWindow(id);$$('#wins button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.w===id))}
function syncLayers(){$$('#layers input').forEach(i=>{const l=(mapObj.layers||[]).find(x=>x.id===i.dataset.l);if(l)i.checked=!!l.on})}
function applyMapState(ms){if(!ms||!mapObj)return;
 if(ms.layers){for(const [id,on] of Object.entries(ms.layers))mapObj.setLayer(id,on);syncLayers()}
 if(ms.win)setWin(ms.win);
 if(ms.call&&mapObj[ms.call])mapObj[ms.call](...(ms.args||[]));
 if(ms.legend){$$('#legend [data-leg]').forEach(d=>d.classList.toggle('hl',ms.legend.includes(d.dataset.leg)))}else $$('#legend [data-leg]').forEach(d=>d.classList.remove('hl'));
}
/* Ereignisse aus der Karte (z. B. Profil gezeichnet, Regler bewegt) */
const listeners=[];
function emit(ev,data){listeners.slice().forEach(l=>{if(l.ev===ev)l.fn(data)})}
function on(ev,fn){const l={ev,fn};listeners.push(l);return ()=>{const i=listeners.indexOf(l);if(i>=0)listeners.splice(i,1)}}
function enablePick(fn){const f=$('#mapframe');f.classList.add('pickmode');pickCb=(id,d)=>fn(id,d);mapObj.pickMode&&mapObj.pickMode(true)}
function disablePick(){const f=$('#mapframe');if(f)f.classList.remove('pickmode');pickCb=null;mapObj&&mapObj.pickMode&&mapObj.pickMode(false)}
window.GMpick=(id,d)=>{if(pickCb)pickCb(id,d)};

/* ---------- Schritte und Aufgaben ---------- */
const tkey=(si,ti)=>`${si}.${ti}`;
function stepDone(si){const s=C.steps[si];return s.tasks.every((t,ti)=>S.done[tkey(si,ti)])}
let offs=[];
function goStep(i){
 S.step=i;save();ladder();offs.forEach(f=>f());offs=[];disablePick();
 const s=C.steps[i],St=STUFEN[s.s];
 const T=$('#tasks');
 T.innerHTML=`<section class="box stephead"><div class="kind"><span class="chip ${St.c}">Stufe ${s.s} · ${St.n}${s.sub?' · '+esc(s.sub):''}</span></div><h2 class="comic-h">${esc(s.title)}</h2><p class="sub" style="margin:0">${s.intro||''}</p></section>
  <div id="tlist" class="tasks"></div>
  ${s.steine&&s.steine.length?`<section class="steine" aria-label="Stolpersteine"><h3>🪨 Stolpersteine auf dieser Stufe</h3><p class="sm" style="margin:0">Diese Fehler passieren vielen. Wer sie kennt, umgeht sie leichter.</p>${s.steine.map(x=>`<details><summary>${esc(x.t)}</summary><p>${x.p}</p>${x.str?`<p class="str"><b>Strategie:</b> ${x.str}</p>`:''}</details>`).join('')}</section>`:''}
  <div class="next" id="next"></div>`;
 say(s.bubble||'');
 applyMapState(s.map);
 renderTasks(i);
 if(location.hash!=='#s'+(i+1))history.replaceState(null,'','#s'+(i+1));
}
function renderTasks(si){
 offs.forEach(f=>f());offs=[];disablePick();
 const s=C.steps[si],L=$('#tlist');L.innerHTML='';
 let firstOpen=-1;
 s.tasks.forEach((t,ti)=>{
  const done=!!S.done[tkey(si,ti)];
  const locked=!done&&firstOpen>=0;
  if(!done&&firstOpen<0)firstOpen=ti;
  const card=document.createElement('article');card.className='card'+(done?' done':'')+(locked?' lock':'');card.id='t'+si+'_'+ti;
  card.innerHTML=`<h3><span class="n">${done?'✓':ti+1}</span>${esc(t.title||'Aufgabe')}${t.tag?` <span class="chip">${esc(t.tag)}</span>`:''}</h3>`;
  L.appendChild(card);
  if(locked){card.insertAdjacentHTML('beforeend',`<p class="cap">Wird frei, wenn ihr die Aufgabe davor gelöst habt.</p>`);return}
  const body=document.createElement('div');body.className='stack';card.appendChild(body);
  const finish=(msg)=>{if(!S.done[tkey(si,ti)]){S.done[tkey(si,ti)]=1;save();if(msg)say(msg);setTimeout(()=>{renderTasks(si);const nx=$('#t'+si+'_'+(ti+1));if(nx)nx.scrollIntoView({behavior:'smooth',block:'nearest'})},900)}};
  if(!done&&t.map)applyMapState(t.map);
  TYPES[t.type](t,body,done,finish,si,ti);
 });
 const all=stepDone(si),N=$('#next');
 if(all){
  if(si+1>S.max){S.max=Math.min(C.steps.length-1,si+1);save()}
  ladder();
  N.innerHTML=si<C.steps.length-1?`<span class="chip good">Stufe geschafft</span><button class="go" type="button" id="goN">Weiter: ${STUFEN[C.steps[si+1].s].n} ➜</button>`:(C.solo?`<span class="chip good">Alle vier Stufen geschafft</span><button class="go" type="button" onclick="window.scrollTo({top:0,behavior:'smooth'})">Nach oben ↑</button>`:`<span class="chip good">Station geschafft</span><a class="go" href="index.html">Zur nächsten Station ➜</a>`);
  const g=$('#goN');if(g)g.onclick=()=>{goStep(si+1);window.scrollTo({top:$('#ladder').getBoundingClientRect().top+scrollY-20,behavior:'smooth'})};
  if(s.doneBubble)say(s.doneBubble);
  if(si===C.steps.length-1){if(!S.fin){S.fin=1;save()}if(C.final)say(C.final)}
 }else N.innerHTML='';
}

/* ---------- Aufgabentypen ---------- */
function fbBox(el,kind,html,stein){el.innerHTML=`<div class="fb ${kind}">${html}${stein?`<span class="stein">${stein}</span>`:''}</div>`}
const TYPES={
 info(t,b,done,finish){b.innerHTML=`<div class="sm">${t.html}</div>${done?'':`<div class="ctrls"><button class="ghost" type="button">${esc(t.btn||'Verstanden')}</button></div>`}`;if(!done)$('button',b).onclick=()=>finish(t.ok)},
 mc(t,b,done,finish){
  const multi=!!t.multi;
  b.innerHTML=`<p class="q">${t.q}</p>${t.hint?`<p class="cap">${t.hint}</p>`:''}<div class="opts${multi?' multi':''}">${t.opts.map((o,i)=>`<button class="opt" type="button" data-i="${i}" aria-pressed="false">${o.t}</button>`).join('')}</div>${multi?`<div class="ctrls"><button class="ghost" type="button" data-chk>Prüfen</button></div>`:''}<div class="out"></div>`;
  const out=$('.out',b),btns=$$('.opt',b);
  if(done){t.opts.forEach((o,i)=>{if(o.ok){btns[i].classList.add('right');btns[i].setAttribute('aria-pressed','true')}btns[i].disabled=true});if(t.why)fbBox(out,'ok',t.why);return}
  if(!multi){btns.forEach(bt=>bt.onclick=()=>{const o=t.opts[+bt.dataset.i];btns.forEach(x=>x.setAttribute('aria-pressed','false'));bt.setAttribute('aria-pressed','true');
    if(o.ok){bt.classList.add('right');btns.forEach(x=>x.disabled=true);fbBox(out,'ok',(o.fb?o.fb+' ':'')+(t.why||''));finish(t.ok)}
    else{bt.classList.add('wrong');fbBox(out,'no',o.fb||'Das stimmt noch nicht. Schaut noch einmal genau in die Karte.',o.stein)}})}
  else{btns.forEach(bt=>bt.onclick=()=>{bt.setAttribute('aria-pressed',bt.getAttribute('aria-pressed')!=='true');bt.classList.remove('right','wrong')});
   $('[data-chk]',b).onclick=()=>{const sel=btns.map(x=>x.getAttribute('aria-pressed')==='true');let wrong=[],miss=0;
    t.opts.forEach((o,i)=>{if(sel[i]&&!o.ok){wrong.push(o);btns[i].classList.add('wrong')}if(!sel[i]&&o.ok)miss++;if(sel[i]&&o.ok)btns[i].classList.add('right')});
    if(!wrong.length&&!miss){btns.forEach(x=>x.disabled=true);fbBox(out,'ok',t.why||'Richtig!');finish(t.ok)}
    else if(wrong.length){fbBox(out,'no',wrong.map(o=>o.fb||'').filter(Boolean).join(' ')||'Mindestens eine Auswahl passt nicht.',wrong.map(o=>o.stein).filter(Boolean)[0])}
    else fbBox(out,'tip',`Gut, aber es fehlt noch ${miss===1?'eine richtige Antwort':miss+' richtige Antworten'}.`)}}
 },
 num(t,b,done,finish){
  b.innerHTML=`<p class="q">${t.q}</p>${t.scheme?`<details class="scheme"${t.openScheme?' open':''}><summary><b>${esc(t.schemeTitle||'Rechenschema')}</b></summary><ol>${t.scheme.map(x=>`<li>${x}</li>`).join('')}</ol></details>`:''}<div class="numrow"><input type="text" inputmode="decimal" aria-label="Ergebnis" ${done?`value="${esc(t.ans)}" disabled`:''}><span class="unit">${esc(t.unit||'')}</span>${done?'':'<button class="ghost" type="button">Prüfen</button>'}</div><div class="out"></div>`;
  const out=$('.out',b);if(done){fbBox(out,'ok',t.why||'Richtig!');return}
  let tries=0;const inp=$('input',b);
  const chk=()=>{const v=parseFloat(String(inp.value).replace(',','.').replace(/[^0-9.\-]/g,''));tries++;
   if(isNaN(v)){fbBox(out,'tip','Gebt bitte eine Zahl ein.');return}
   if(Math.abs(v-t.ans)<=(t.tol||0)){fbBox(out,'ok',t.why||'Richtig!');inp.disabled=true;$('button',b).disabled=true;finish(t.ok);return}
   const f=(t.traps||[]).find(x=>Math.abs(v-x.v)<=(x.tol??(t.tol||0)));
   if(f)fbBox(out,'no',f.fb,f.stein);else fbBox(out,'no',(v<t.ans?t.low:t.high)||'Das passt noch nicht. Nutzt das Rechenschema.',t.stein);
   if(tries>=2&&t.scheme){const d=$('details.scheme',b);if(d)d.open=true}
   if(tries>=3&&t.solution)out.insertAdjacentHTML('beforeend',`<div class="fb tip" style="margin-top:6px"><b>Lösungsweg:</b> ${t.solution}</div>`)};
  $('button',b).onclick=chk;inp.onkeydown=e=>{if(e.key==='Enter')chk()}
 },
 match(t,b,done,finish){
  const ch=t.choices;
  b.innerHTML=`<p class="q">${t.q}</p><div class="match">${t.rows.map((r,i)=>`<div class="row" data-i="${i}"><svg viewBox="0 0 44 30" aria-hidden="true">${r.sym}</svg><select aria-label="Bedeutung von Zeichen ${i+1}"><option value="">– Bedeutung wählen –</option>${ch.map(c=>`<option ${done&&c===r.ans?'selected':''}>${esc(c)}</option>`).join('')}</select></div>`).join('')}</div>${done?'':'<div class="ctrls"><button class="ghost" type="button">Prüfen</button></div>'}<div class="out"></div>`;
  const out=$('.out',b);if(done){$$('select',b).forEach(s=>s.disabled=true);$$('.row',b).forEach(r=>r.classList.add('ok'));if(t.why)fbBox(out,'ok',t.why);return}
  $('button',b).onclick=()=>{let bad=[];$$('.row',b).forEach(r=>{const i=+r.dataset.i,v=$('select',r).value;const ok=v===t.rows[i].ans;r.classList.toggle('ok',ok);r.classList.toggle('no',!ok&&!!v);if(!ok)bad.push({i,v})});
   if(!bad.length){$$('select',b).forEach(s=>s.disabled=true);fbBox(out,'ok',t.why||'Alle Zeichen stimmen!');finish(t.ok);return}
   const trap=bad.map(x=>(t.traps||{})[x.v]).find(Boolean);
   fbBox(out,'no',`${bad.length===1?'Ein Zeichen ist':bad.length+' Zeichen sind'} noch nicht richtig zugeordnet. Vergleicht Farbe, Form und Linienart genau mit der Legende.`,trap)}
 },
 order(t,b,done,finish){
  let cur=done?t.items.map((_,i)=>i):(t.start||shuffle(t.items.map((_,i)=>i)));
  const draw=()=>{b.innerHTML=`<p class="q">${t.q}</p><ol class="order">${cur.map((k,p)=>`<li class="${done?'ok':''}"><span class="i">${p+1}</span><span>${t.items[k]}</span>${done?'':`<span class="mv"><button type="button" data-u="${p}" aria-label="nach oben">▲</button><button type="button" data-d="${p}" aria-label="nach unten">▼</button></span>`}</li>`).join('')}</ol>${done?'':'<div class="ctrls"><button class="ghost" type="button" data-chk>Reihenfolge prüfen</button></div>'}<div class="out"></div>`;
   if(done){if(t.why)fbBox($('.out',b),'ok',t.why);return}
   $$('[data-u]',b).forEach(x=>x.onclick=()=>{const p=+x.dataset.u;if(p>0){[cur[p-1],cur[p]]=[cur[p],cur[p-1]];draw()}});
   $$('[data-d]',b).forEach(x=>x.onclick=()=>{const p=+x.dataset.d;if(p<cur.length-1){[cur[p+1],cur[p]]=[cur[p],cur[p+1]];draw()}});
   $('[data-chk]',b).onclick=()=>{const ok=cur.every((k,p)=>k===p);const right=cur.filter((k,p)=>k===p).length;
    if(ok){done=true;draw();finish(t.ok)}else fbBox($('.out',b),'no',`${right} von ${cur.length} stehen schon an der richtigen Stelle. ${t.tip||''}`,t.stein)}};
  draw();
 },
 mark(t,b,done,finish){
  const toks=[];t.text.replace(/\[([^\]|]+)\|(\w+)\]|([^\[\s]+)|(\s+)/g,(m,a,c,w,sp)=>{if(a)toks.push({w:a,c});else if(w)toks.push({w});else toks.push({sp:sp});return m});
  let pen='op';const st=toks.map(x=>done&&x.c?x.c:'');
  const draw=()=>{b.innerHTML=`<p class="q">${t.q}</p><div class="pens" role="group" aria-label="Textmarker"><button type="button" data-c="op">Operator</button><button type="button" data-c="leg">Legendenbegriff</button><button type="button" data-c="raum">Raum / Zeit</button><button type="button" data-c="x">Radierer</button></div>
   <p class="mark">${toks.map((x,i)=>x.sp?' ':(!x.c&&/^[.,;:!?]+$/.test(x.w))?esc(x.w):`<span class="w${st[i]?' c-'+st[i]:''}" data-i="${i}" role="button" tabindex="0">${esc(x.w)}</span>`).join('')}</p>${done?'':'<div class="ctrls"><button class="ghost" type="button" data-chk>Markierung prüfen</button></div>'}<div class="out"></div>`;
   $$('.pens button',b).forEach(p=>{p.setAttribute('aria-pressed',p.dataset.c===pen);p.onclick=()=>{pen=p.dataset.c;draw()}});
   if(done){if(t.why)fbBox($('.out',b),'ok',t.why);return}
   $$('.mark .w',b).forEach(s=>{const act=()=>{const i=+s.dataset.i;st[i]=pen==='x'?'':(st[i]===pen?'':pen);draw()};s.onclick=act;s.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act()}}});
   $('[data-chk]',b).onclick=()=>{let miss=0,wrong=0,cls=0;toks.forEach((x,i)=>{if(x.sp)return;if(x.c&&st[i]!==x.c){miss++;if(st[i])cls++}if(!x.c&&st[i]&&!/^[.,;:!?]+$/.test(x.w))wrong++});
    const out=$('.out',b);
    if(!miss&&!wrong){done=true;draw();finish(t.ok);return}
    let msg=[];if(miss)msg.push(`${miss} wichtige ${miss===1?'Stelle fehlt':'Stellen fehlen'} oder ${miss===1?'hat':'haben'} die falsche Farbe.`);if(wrong)msg.push(`${wrong} markierte ${wrong===1?'Wort ist':'Wörter sind'} nicht nötig. Markiert sparsam!`);
    fbBox(out,'no',msg.join(' ')+' '+(t.tip||''),cls?'Operator und Legendenbegriff verwechselt? Der Operator sagt, was ihr tun sollt; Legendenbegriffe findet ihr wörtlich in der Legende.':'')}};
  draw();
 },
 pick(t,b,done,finish){
  b.innerHTML=`<p class="q">${t.q}</p>${t.hint?`<p class="cap">${t.hint}</p>`:''}${done?'':'<div class="ctrls"><button class="ghost" type="button" data-p>🎯 Auf der Karte tippen</button></div>'}<div class="out"></div>`;
  const out=$('.out',b);if(done){fbBox(out,'ok',t.why||'Richtig!');return}
  const act=()=>{enablePick((id,d)=>{const okk=(t.ok||[]).includes(id)||(t.test&&t.test(id,d));
   if(okk){disablePick();fbBox(out,'ok',(t.okfb&&t.okfb[id])||t.why||'Richtig!');finish(t.okBubble);mapObj.flash&&mapObj.flash(id,true)}
   else{const f=(t.fb||{})[id]||t.fbAny||'Das ist nicht die gesuchte Stelle. Prüft noch einmal Legende und Höhenzahlen.';fbBox(out,'no',f,(t.stein||{})[id]||t.steinAny);mapObj.flash&&mapObj.flash(id,false)}});
   toast('Tippt jetzt auf die Karte.');$('#mapframe').scrollIntoView({behavior:'smooth',block:'nearest'})};
  $('[data-p]',b).onclick=act;act();
 },
 do(t,b,done,finish){
  b.innerHTML=`<p class="q">${t.q}</p>${t.hint?`<p class="cap">${t.hint}</p>`:''}<div class="out"></div>`;
  const out=$('.out',b);if(done){fbBox(out,'ok',t.why||'Erledigt!');return}
  let n=0;const off=on(t.ev,(d)=>{if(t.test&&!t.test(d))return;n++;if(n>=(t.n||1)){off();fbBox(out,'ok',t.why||'Erledigt!');finish(t.ok)}});offs.push(off);
  if(t.start)t.start(mapObj);
 },
 write(t,b,done,finish,si,ti){
  const k='w'+si+'_'+ti;const lvl=C.scaffold||'mittel';
  let mode='own';
  const tests=(t.tests||[]).map(r=>new RegExp(r,'i'));
  const draw=()=>{
   const val=S.txt[k]||'';
   if(done){b.innerHTML=`<p class="q">${t.q}</p><div class="own">„${esc(val)}“</div>${S.txt[k+'src']==='geo'?'<p class="cap">Ihr habt den Vorschlag von Frau Prof. Geo übernommen.</p>':`<div class="model"><b>Zum Vergleich, Frau Prof. Geo:</b> ${t.model}</div>`}<div class="ctrls"><button class="ghost sm" type="button" data-ed>Text ändern</button></div>`;
    $('[data-ed]',b).onclick=()=>{done=false;draw()};return}
   b.innerHTML=`<p class="q">${t.q}</p>${t.dim?`<p class="cap">Beschreibungsdimension: <span class="chip s2">${esc(t.dim)}</span></p>`:''}
    <div class="seg" role="group" aria-label="Art der Formulierung"><button type="button" data-m="own" aria-pressed="${mode==='own'}">Selbst formulieren</button><button type="button" data-m="geo" aria-pressed="${mode==='geo'}">Vorschlag von Frau Prof. Geo</button></div>
    <div data-own class="stack" ${mode==='own'?'':'hidden'}>
     ${t.parts?`<details class="bau" ${lvl==='gering'?'':'open'}><summary>${esc(t.sum||'So baut ihr den Text')}</summary><div class="bauplan">${t.parts.map((p,i)=>`${i?'<span class="plus">+</span>':''}<span class="bp p${i+1}">${esc(p)}</span>`).join('')}</div>${t.ex?`<p class="bsp"><small>Beispiel aus einem anderen Raum</small>${t.ex.map((x,i)=>`<span class="u u${i+1}">${esc(x)}</span>`).join(' ')}</p>`:''}</details>`:''}
     ${t.starts&&lvl!=='gering'?`<div class="ws"><small>Satzanfänge</small><div class="wchips">${t.starts.map(x=>`<button type="button" class="wc st" data-t="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>`:''}
     ${t.words?`<div class="ws"><small>Wortspeicher${t.words.length>8?' (nicht alle Wörter passen)':''}</small><div class="wchips">${t.words.map(x=>`<button type="button" class="wc" data-t="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>`:''}
     <label class="cap" for="${k}" style="font-weight:800">${esc(t.lbl||'Euer Text')}</label><textarea id="${k}" placeholder="${esc(t.ph||'')}">${esc(val)}</textarea>
     <div class="bpcheck" data-chk aria-live="polite"></div>
     <div class="ctrls"><button class="ghost" type="button" data-save>${esc(t.save||'Text festhalten')}</button><button class="ghost" type="button" data-clr>Text löschen</button></div><div class="out"></div>
    </div>
    <div data-geo class="stack" ${mode==='geo'?'':'hidden'}><div class="model"><b>Vorschlag von Frau Prof. Geo:</b> ${t.model}</div>${t.modelNote?`<p class="cap">${t.modelNote}</p>`:''}<div class="ctrls"><button class="ghost" type="button" data-take>Vorschlag übernehmen</button></div></div>`;
   $$('.seg button',b).forEach(x=>x.onclick=()=>{mode=x.dataset.m;S.txt[k]=($('textarea',b)||{}).value||S.txt[k]||'';draw()});
   const ta=$('textarea',b);
   const upd=()=>{const v=ta.value;$('[data-chk]',b).innerHTML=`<small>Bauplan-Check</small>`+(t.labels||[]).map((l,i)=>{const okk=tests[i]&&tests[i].test(v);return `<span class="bpi q${(i%4)+1}${okk?' on':''}">${okk?'✓':'○'} ${esc(l)}</span>`}).join('')};
   ta.addEventListener('input',()=>{S.txt[k]=ta.value;upd()});upd();
   $$('.wc',b).forEach(c=>c.onclick=()=>ins(ta,c.dataset.t));
   $('[data-clr]',b).onclick=()=>{ta.value='';S.txt[k]='';ta.focus();upd()};
   $('[data-save]',b).onclick=()=>{const v=ta.value.trim();const missing=(t.labels||[]).filter((l,i)=>!(tests[i]&&tests[i].test(v)));
    if(v.length<(t.min||40)){fbBox($('.out',b),'tip','Euer Text ist noch sehr kurz. Schreibt mindestens einen ganzen Satz mit den Bausteinen aus dem Bauplan.');return}
    if(missing.length){fbBox($('.out',b),'tip',`Es fehlt noch: <b>${missing.map(esc).join(', ')}</b>. ${t.missTip||''}`,t.stein);return}
    S.txt[k]=v;S.txt[k+'src']='own';save();done=true;draw();finish(t.ok)};
   const tk=$('[data-take]',b);if(tk)tk.onclick=()=>{S.txt[k]=t.modelPlain||t.model.replace(/<[^>]+>/g,'');S.txt[k+'src']='geo';save();done=true;draw();finish(t.ok)};
  };
  draw();
 },
 scale(t,b,done,finish,si,ti){
  const k='s'+si+'_'+ti;const v=S.txt[k]??null;
  b.innerHTML=`<p class="q">${t.q}</p><div class="slider"><span>${esc(t.left)}</span><input type="range" min="0" max="4" step="1" value="${v??2}" aria-label="Eure Einschätzung"><span>${esc(t.right)}</span></div><div class="yearticks">${(t.ticks||['','','','','']).map(x=>`<span>${esc(x)}</span>`).join('')}</div>
   ${t.crit?`<p class="cap" style="margin-top:6px"><b>Auf welche Kriterien stützt ihr euch?</b> (mindestens ${t.minCrit||2})</p><div class="layers">${t.crit.map((c,i)=>`<label><input type="checkbox" data-c="${i}" ${(S.txt[k+'c']||[]).includes(i)?'checked':''} ${done?'disabled':''}> ${esc(c)}</label>`).join('')}</div>`:''}
   ${done?'':'<div class="ctrls"><button class="ghost" type="button">Einschätzung festhalten</button></div>'}<div class="out"></div>`;
  const r=$('input[type=range]',b);if(done){r.disabled=true;if(t.why)fbBox($('.out',b),'ok',t.why);return}
  let moved=v!=null;r.oninput=()=>{moved=true};
  $('.ctrls button',b).onclick=()=>{const cs=$$('[data-c]',b).filter(x=>x.checked).map(x=>+x.dataset.c);
   if(!moved){fbBox($('.out',b),'tip','Verschiebt zuerst den Regler.');return}
   if(t.crit&&cs.length<(t.minCrit||2)){fbBox($('.out',b),'tip',`Wählt mindestens ${t.minCrit||2} Kriterien. Ein Urteil ohne Kriterien ist nur eine Meinung.`,'Beim Beurteilen nur das eigene Bauchgefühl nennen, statt Belege aus Karte und Material.');return}
   S.txt[k]=+r.value;S.txt[k+'c']=cs;save();finish(t.ok)}
 }
};
function ins(ta,t){const s0=ta.selectionStart??ta.value.length,e0=ta.selectionEnd??s0,v=ta.value,pre=v.slice(0,s0),post=v.slice(e0);const sp=(pre&&!/\s$/.test(pre)&&!/^[?.,!]/.test(t))?' ':'';ta.value=pre+sp+t+post;const p=(pre+sp+t).length;ta.focus();try{ta.setSelectionRange(p,p)}catch(e){}ta.dispatchEvent(new Event('input'))}
function shuffle(a){const r=a.slice();let s=7;for(let i=r.length-1;i>0;i--){s=(s*9301+49297)%233280;const j=Math.floor(s/233280*(i+1));[r[i],r[j]]=[r[j],r[i]]}if(r.every((k,i)=>k===i)&&r.length>1)[r[0],r[1]]=[r[1],r[0]];return r}

/* ---------- Start ---------- */
window.GM={AVATAR,WERKZEUGE,FORMULIERUNG,esc,toast,say,emit,dialog,showWerkzeuge,showFormulierung,showModell,
 get cfg(){return C},get state(){return S},
 init(cfg){C=cfg;if(C.solo&&C.home===undefined)C.home='../../index.html';KEY='gm-karte-'+cfg.id;S=load()||fresh();
  renderHead();renderMap();
  const m=/^#s(\d)$/.exec(location.hash);let i=m?Math.min(+m[1]-1,S.max):S.step;goStep(Math.max(0,Math.min(i,S.max)));
  say(C.steps[S.step].bubble||C.hello);
  if(!S.seen){say(C.hello);S.seen=1;save()}
 }};
})();
