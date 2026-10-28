/* ===================== Mystery: Das Rätsel vom Deich ===================== */
const MSPH={atmo:['Atmosphäre','var(--atmo)',1],hydro:['Hydrosphäre','var(--hydro)',1],kryo:['Kryosphäre','var(--kryo)',0],pedo:['Pedosphäre','var(--pedo)',1],bio:['Biosphäre','var(--bio)',0],mensch:['Mensch','var(--mensch)',0],litho:['Lithosphäre','#8C93A3',1]};
const MCARDS=[
 {id:'oma',s:'mensch',who:'Person',t:'Oma Hilke erinnert sich',x:'„1962 brachen an der Nordsee Deiche, 347 Menschen starben.“ 1976 lief das Wasser noch höher auf, aber es starben viel weniger: Die Deiche waren verstärkt worden.'},
 {id:'meereis',s:'kryo',t:'Arktisches Meereis',x:'Das Meereis der Arktis schrumpft. Wahrscheinlich ist der Arktische Ozean noch vor 2050 erstmals im September praktisch eisfrei. Meereis schwimmt auf dem Wasser.'},
 {id:'ausdehnung',s:'hydro',t:'Warmes Wasser braucht mehr Platz',x:'Wasser dehnt sich aus, wenn es wärmer wird. Von 1901 bis 2018 kam knapp 40 % des weltweiten Anstiegs daher. An der Nordsee wirkt die Erwärmung des Meeres zusammen mit Strömungen sogar stärker als im weltweiten Mittel.'},
 {id:'klimadeich',s:'mensch',t:'Der Klimadeich',x:'Niedersachsen baut neue Deiche seit 2021 mit 1 m Zuschlag für den steigenden Meeresspiegel. Später sollen sie um einen weiteren Meter erhöht werden können. 1 km Deicherhöhung kostet 3–5 Mio. €.'},
 {id:'co2',s:'atmo',t:'CO₂ in der Luft',x:'Seit Beginn der Industrialisierung ist der CO₂-Gehalt der Luft um über 50 % gestiegen. CO₂ hält Wärme in der Atmosphäre fest.'},
 {id:'hafen',s:'kryo',who:'Person',t:'Aputsiaq aus Ilulissat',x:'„Das Eis schmilzt, aber an unserer Küste sinkt das Meer!“ Grönlands Eis zieht das Meer mit seiner Schwerkraft an. Schmilzt es, lässt der Zug nach, und das Land hebt sich. Bei sehr hohem Ausstoß könnte das Meer dort bis 2100 um etwa 2,5 m sinken.'},
 {id:'salz',s:'pedo',t:'Salz im Marschboden',x:'Unter der Marsch ist das Grundwasser vielerorts schon salzig. Steigt das Meer, drückt mehr Salzwasser ins Land. Die Siele können seltener ablaufen, Pumpen müssen mehr arbeiten.'},
 {id:'stuerme',s:'atmo',who:'Person',t:'Nachbar Gerd ist sicher',x:'„Die Stürme werden immer schlimmer, darum der hohe Deich!“ Forschende finden für die Deutsche Bucht bisher keine sicheren Belege, dass Stürme häufiger oder stärker werden.'},
 {id:'gletscher',s:'kryo',t:'Gletscher schrumpfen',x:'Gebirgsgletscher verlieren weltweit Eis, das Schmelzwasser fließt ins Meer. Von 1901 bis 2018 lieferten sie rund 40 % des Meeresspiegelanstiegs.'},
 {id:'fuenftel',s:'hydro',t:'Nur ein Fünftel kommt an',x:'Grönlands Schmelzwasser verteilt sich ungleich über die Erde. An der südlichen Nordsee kommt nur etwa ein Fünftel davon an. Schmelzwasser aus der Antarktis kommt dagegen voll an.'},
 {id:'elbe',s:'mensch',t:'Fluten in Hamburg',x:'In Hamburg laufen Sturmfluten heute höher auf als früher. Ein wichtiger Grund: Die Elbe wurde vertieft und mit Deichen eingeengt.'},
 {id:'sturmflut',s:'atmo',t:'Sturmflut auf höherem Wasser',x:'Nordsee-Sturmfluten laufen bisher nicht nachweisbar höher über das mittlere Hochwasser auf. Aber jede Flut startet vom höheren Meeresspiegel aus. Bei hohem Ausstoß könnte eine Flut wie 1962 bis 2100 alle 5–10 Jahre kommen.'},
 {id:'fieber',s:'atmo',t:'Die Erde hat Fieber',x:'2025 war es im langjährigen Mittel etwa 1,4 °C wärmer als 1850–1900. Zurzeit kommen pro Jahrzehnt rund 0,27 °C dazu.'},
 {id:'watt',s:'bio',t:'Das Watt muss mitwachsen',x:'Wattflächen wachsen mit Sand und Schlick mit, wenn das Meer um höchstens etwa 3–6 mm pro Jahr steigt. Steigt es schneller, „ertrinkt“ das Watt. Dann schlagen stärkere Wellen an den Deich.'},
 {id:'skandinavien',s:'litho',t:'Skandinavien hebt sich',x:'Seit der Eiszeit hebt sich Skandinavien, weil das schwere Eis weg ist. An der deutschen Nordseeküste spielt diese Landhebung für den Meeresspiegel kaum eine Rolle.'},
 {id:'spiegel',s:'hydro',t:'Der Meeresspiegel steigt',x:'Von 1901 bis 2018 ist das Meer weltweit um rund 20 cm gestiegen, heute steigt es fast 5 mm pro Jahr. Bei sehr hohem Ausstoß könnten es bis 2100 noch 63–101 cm werden.'},
 {id:'amoc',s:'hydro',who:'Expertenkarte',t:'Das Golfstrom-System',x:'Wird die Atlantische Umwälzströmung deutlich schwächer, könnte das Meer an Europas Küsten zusätzlich steigen, in einem Modell um bis zu 4 mm pro Jahr. Süßes Schmelzwasser aus Grönland kann sie bremsen.'},
 {id:'groenland',s:'kryo',t:'Grönland taut',x:'Grönlands Eisschild verliert jedes Jahr Eis. Würde er ganz schmelzen, stiege der Meeresspiegel weltweit um etwa 7 m. Das würde aber Jahrtausende dauern.'},
 {id:'hinterdeich',s:'mensch',t:'Hinter dem Deich',x:'Rund 600 km Hauptdeich schützen in Niedersachsen etwa 1,1 Mio. Menschen auf rund 6.500 km²: Häuser, Höfe, Schulen und Straßen.'},
 {id:'ozon',s:'atmo',who:'Person',t:'Ben aus der 8b meint',x:'„Durch das Ozonloch kommt mehr Wärme rein. Daran liegt das alles!“'},
 {id:'meerwarm',s:'hydro',t:'Das Meer speichert Wärme',x:'Über 90 % der zusätzlichen Wärme steckt im Ozean. Die Nordsee wird seit 1969 pro Jahrzehnt um etwa 0,26 °C wärmer.'},
];
const MC=Object.fromEntries(MCARDS.map(c=>[c.id,c]));
const CODE='KLIMADEICH';
const TEACHER=1172307947; // Lehrkraft-Code nur als Prüfsumme (siehe Lösungsblatt)
function hash(t){let h=0x811c9dc5;for(const c of t){h^=c.codePointAt(0);h=Math.imul(h,0x01000193)>>>0;}return h;}
const IDEAS=[
 {n:'Treibhausgase erwärmen die Erde',e:[['co2','fieber']],h:'Was macht das CO₂ in der Luft mit der Temperatur?'},
 {n:'Das Meer nimmt die Wärme auf',e:[['fieber','meerwarm'],['co2','meerwarm']],h:'Wohin geht der größte Teil der zusätzlichen Wärme?'},
 {n:'Warmes Wasser dehnt sich aus',e:[['meerwarm','ausdehnung'],['fieber','ausdehnung']],h:'Was macht Wasser, wenn es wärmer wird?'},
 {n:'Die Ausdehnung hebt den Meeresspiegel',e:[['ausdehnung','spiegel']],h:'Mehr Platz für das Wasser: Was passiert dann mit dem Wasserstand?'},
 {n:'Wärme lässt Eis an Land schmelzen',e:[['fieber','gletscher'],['fieber','groenland'],['meerwarm','groenland']],h:'Welches Eis liegt an Land und schmilzt, wenn es wärmer wird?'},
 {n:'Schmelzwasser vom Land hebt den Meeresspiegel',e:[['gletscher','spiegel'],['groenland','spiegel'],['fuenftel','spiegel']],h:'Wo landet das Schmelzwasser von Gletschern und Eisschilden?'},
 {n:'Grönlands Fingerabdruck',e:[['groenland','hafen'],['groenland','fuenftel'],['hafen','fuenftel']],h:'Lest Aputsiaqs Karte noch einmal: Warum sinkt dort das Meer, und was heißt das für die Nordsee?'},
 {n:'Sturmfluten starten höher',e:[['spiegel','sturmflut']],h:'Was hat der Meeresspiegel mit Sturmfluten zu tun?'},
 {n:'Darum wächst der Deich',e:[['sturmflut','klimadeich'],['spiegel','klimadeich'],['oma','klimadeich'],['watt','klimadeich']],h:'Warum plant Niedersachsen einen Meter Zuschlag?'},
 {n:'Folgen vor und hinter dem Deich',e:[['spiegel','watt'],['spiegel','salz'],['klimadeich','hinterdeich'],['hinterdeich','klimadeich'],['salz','hinterdeich'],['sturmflut','hinterdeich'],['watt','hinterdeich']],h:'Was passiert vor und hinter dem Deich, wenn das Meer steigt?'},
];
const SHAKY=[
 {t:(a,b)=>a==='meereis'&&['spiegel','sturmflut','klimadeich','hinterdeich','fuenftel','watt'].includes(b),h:'Was passiert mit dem Wasserstand in einem Glas, wenn ein Eiswürfel darin schmilzt?'},
 {t:(a,b)=>a==='stuerme',h:'Prüft Gerds Behauptung mit der Karte zu den Sturmfluten. Was ist wirklich belegt?'},
 {t:(a,b)=>a==='ozon'||b==='ozon',h:'Das Ozonloch ist nicht die Ursache der Erwärmung. Welche Karte erklärt, warum es wärmer wird?'},
 {t:(a,b)=>a==='skandinavien'&&b!=='hafen',h:'Hebt sich die Nordseeküste? Lest die Karte zu Skandinavien genau.'},
 {t:(a,b)=>a==='elbe'&&['klimadeich','hinterdeich','sturmflut','spiegel'].includes(b),h:'Die Elbe fließt durch Hamburg. Erklärt sie den Deich in Ostfriesland?'},
];
const SENT=[
 {id:'s1',ok:'b',o:[['a','sich durch schmelzendes Meereis füllt'],['b','sich erwärmt und ausdehnt'],['c','durch stärkere Stürme aufgestaut wird']]},
 {id:'s2',ok:'a',o:[['a','Gletscher und Eisschilde schmelzen'],['b','die Küsten absinken'],['c','die Flüsse vertieft werden']]},
 {id:'s3',ok:'c',o:[['a','fließt direkt in die Nordsee'],['b','hebt das Meer überall gleich hoch'],['c','kommt hier nur zu etwa einem Fünftel an']]},
];
const MKEY='terravergo-v2';
const M={pos:{},edges:[],sent:{},solved:false,found:[],src:null,BW:1200,BH:700,s:1};
function mLoad(){try{const d=JSON.parse(localStorage.getItem(MKEY)||'{}');if(d&&typeof d==='object'){M.pos=d.pos||{};M.edges=(d.edges||[]).filter(e=>MC[e[0]]&&MC[e[1]]);M.sent=d.sent||{};M.solved=!!d.solved;}}catch(e){}}
function mSave(){try{localStorage.setItem(MKEY,JSON.stringify({pos:M.pos,edges:M.edges,sent:M.sent,solved:M.solved}));}catch(e){}}
const hasEdge=(a,b)=>M.edges.some(e=>e[0]===a&&e[1]===b);
function evalNet(){const found=IDEAS.map(I=>I.e.some(([a,b])=>hasEdge(a,b)));const shaky=M.edges.filter(([a,b])=>SHAKY.some(S=>S.t(a,b)));return {found,n:found.filter(Boolean).length,shaky};}

/* --- Geschichte von Prof. Geo --- */
const STORY=[
 {who:'Prof. Geo',svg:`<svg viewBox="0 0 320 170" aria-hidden="true"><rect width="320" height="170" fill="#EAF4FF"/><rect y="140" width="320" height="30" fill="#D4DCEA"/>
   <rect x="168" y="16" width="136" height="84" rx="8" fill="#1B1B2F"/><text x="236" y="38" text-anchor="middle" fill="#fff" class="tiny">ERDFIEBER</text><text x="236" y="76" text-anchor="middle" fill="#FFD23F" class="big">1,4 °C</text>
   <rect x="150" y="116" width="164" height="12" fill="#A0673A" stroke="#1B1B2F" stroke-width="2.5"/><path d="M160 128v24M304 128v24" stroke="#1B1B2F" stroke-width="3"/>
   <g stroke="#1B1B2F" stroke-width="2.5" stroke-linejoin="round"><rect x="214" y="98" width="34" height="20" fill="#fff" transform="rotate(-8 231 108)"/><path d="M216 99l15 10 15-12" fill="none" transform="rotate(-8 231 108)"/>
   <rect x="258" y="100" width="34" height="20" fill="#FFF3A6" transform="rotate(6 275 110)"/><path d="M260 101l15 10 15-10" fill="none" transform="rotate(6 275 110)"/>
   <circle cx="252" cy="96" r="8" fill="#E0393B"/><circle cx="296" cy="98" r="8" fill="#E0393B"/></g><text x="252" y="100" text-anchor="middle" fill="#fff" class="tiny">!</text><text x="296" y="102" text-anchor="middle" fill="#fff" class="tiny">!</text>
   <use href="#i-geo" x="0" y="20" width="140" height="150"/></svg>`,
  x:'Moin! Ich bin Prof. Geo. In meinem Kontrollraum Terra Vergo kann man die Erde 50 Jahre in die Zukunft steuern. Heute früh lagen zwei Nachrichten auf meinem Tisch.'},
 {who:'Jannes, 13, Ostfriesland',svg:`<svg viewBox="0 0 320 170" aria-hidden="true"><rect width="320" height="170" fill="#CDEBFF"/>
   <path d="M0 112c12-6 24-6 36 0s24 6 36 0 24-6 36 0V170H0Z" fill="#3D8FD6" stroke="#1B1B2F" stroke-width="2.5"/>
   <path d="M60 170 132 92h44l70 78Z" fill="#8FD18B" stroke="#1B1B2F" stroke-width="3" stroke-linejoin="round"/>
   <g stroke="#1B1B2F" stroke-width="2.5" stroke-linejoin="round"><rect x="138" y="86" width="40" height="7" rx="3.5" fill="#1B1B2F"/><rect x="142" y="68" width="28" height="18" rx="3" fill="#FFD23F"/><rect x="146" y="72" width="11" height="9" fill="#CDEBFF"/>
   <path d="M170 74l18-16 12 8" fill="none" stroke-width="4"/><path d="M196 64l10 4-4 10-9-3Z" fill="#FFD23F"/>
   <ellipse cx="108" cy="128" rx="9" ry="6" fill="#fff"/><circle cx="99" cy="125" r="3.5" fill="#1B1B2F"/><ellipse cx="128" cy="140" rx="9" ry="6" fill="#fff"/><circle cx="119" cy="137" r="3.5" fill="#1B1B2F"/></g>
   <g><rect x="190" y="30" width="50" height="24" rx="12" fill="#E0393B" stroke="#1B1B2F" stroke-width="2.5"/><text x="215" y="47" text-anchor="middle" fill="#fff" class="mid">+1 m</text></g>
   <use href="#i-jannes" x="228" y="60" width="92" height="110"/></svg>`,
  x:'„Bei uns am Deich rollen schon wieder die Bagger. Der Deich soll einen Meter höher werden! Oma Hilke sagt: Das liegt am Eis in Grönland.“'},
 {who:'Aputsiaq, 14, Ilulissat (Grönland)',svg:`<svg viewBox="0 0 320 170" aria-hidden="true"><rect width="320" height="170" fill="#E6F4FF"/><rect y="112" width="320" height="58" fill="#3D8FD6"/>
   <g stroke="#1B1B2F" stroke-width="2.5" stroke-linejoin="round"><path d="M8 122 28 80l18 14 12-10 16 38Z" fill="#F2FAFF"/><path d="M46 94l12-10 16 38H52Z" fill="#BFE6FF"/><path d="M84 124l10-20 14 6 8 14Z" fill="#F2FAFF"/>
   <path d="M150 170V112l40-14 40 6 90-8V170Z" fill="#9AA3B2"/>
   <path d="M176 104V88l9-7 9 7v16Z" fill="#E0393B"/><path d="M198 106V92l8-6 8 6v14Z" fill="#FFD23F"/><path d="M160 108V96l7-5 7 5v12Z" fill="#1E6FD0"/>
   <rect x="120" y="66" width="9" height="74" fill="#fff"/><path d="M120 78h5M120 90h5M120 102h5M120 114h5" stroke-width="2"/></g>
   <path d="M140 74v30M133 98l7 9 7-9" fill="none" stroke="#E0393B" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
   <use href="#i-aputsiaq" x="222" y="56" width="96" height="114"/></svg>`,
  x:'„Komisch! Bei uns schmilzt das Eis, aber Forschende sagen, dass das Meer an unserer Küste sogar sinkt. Wieso soll dann bei euch der Deich wachsen?“'},
 {who:'Prof. Geo',svg:`<svg viewBox="0 0 320 170" aria-hidden="true"><rect width="320" height="170" fill="#E9EEF5"/>
   <g stroke="#1B1B2F" stroke-width="3" stroke-linejoin="round"><rect x="150" y="14" width="140" height="156" rx="6" fill="#B8C2D3"/><rect x="160" y="24" width="120" height="24" rx="4" fill="#1B1B2F"/>
   ${Array.from({length:10},(_,i)=>`<rect x="${163+(i%5)*23}" y="${66+Math.floor(i/5)*28}" width="18" height="22" rx="3" fill="#fff" stroke-width="2.5"/>`).join('')}
   <circle cx="220" cy="140" r="11" fill="#FFD23F"/><path d="M216 142h8v7h-8Z" fill="#1B1B2F" stroke-width="1"/><path d="M217 142v-3a3 3 0 0 1 6 0v3" fill="none" stroke-width="2"/></g>
   <text x="220" y="41" text-anchor="middle" fill="#fff" class="tiny">KONTROLLRAUM</text>
   ${Array.from({length:10},(_,i)=>`<text x="${172+(i%5)*23}" y="${82+Math.floor(i/5)*28}" text-anchor="middle" class="mid">?</text>`).join('')}
   <use href="#i-geo" x="0" y="20" width="140" height="150"/></svg>`,
  x:'„Die Tür zum Kontrollraum ist verriegelt. Das Codewort hat zehn Buchstaben. Jede Kernidee, die ihr im Mystery findet, verrät einen davon. Löst das Rätsel, dann geht die Tür auf!“'},
];
function buildMystery(){
  document.getElementById('story').innerHTML=STORY.map((p,i)=>`<div class="pnl" style="--i:${i}"><span class="ptag">${p.who}</span>${p.svg}<div class="cap">${p.x}</div></div>`).join('');
  const board=document.getElementById('board');
  board.insertAdjacentHTML('beforeend',MCARDS.map(c=>{const [sn,col,dark]=MSPH[c.s];return `<div class="mcard" id="mc-${c.id}" data-id="${c.id}" tabindex="0" role="group" aria-label="Karte: ${c.t}">
    <div class="band ${dark?'dark':''}" style="background:${col}"><span>${sn}</span>${c.who?`<span>${c.who}</span>`:''}</div><h4>${c.t}</h4><p>${c.x}</p>
    <button class="cbtn" type="button" aria-label="Pfeil von „${c.t}“ ziehen" title="Pfeil zu einer anderen Karte ziehen">➜</button></div>`;}).join(''));
  const opts=MCARDS.map(c=>`<option value="${c.id}">${c.t}</option>`).join('');
  document.getElementById('mfrom').innerHTML='<option value="">Ursache …</option>'+opts;
  document.getElementById('mto').innerHTML='<option value="">Wirkung …</option>'+opts;
  for(const S of SENT){const sel=document.getElementById(S.id);sel.innerHTML='<option value="">… bitte wählen …</option>'+S.o.map(([v,t])=>`<option value="${v}">${t}</option>`).join('');
    sel.value=M.sent[S.id]||'';sel.addEventListener('change',()=>{M.sent[S.id]=sel.value;mSave();});}
  document.getElementById('mslots').innerHTML=CODE.split('').map((_,i)=>`<i data-i="${i}">?</i>`).join('');
  layoutCards();wireEvents();renderWires();renderEdgeList();
  const ev=evalNet();showSlots(ev.found);
  addEventListener('resize',fitBoard);
}
function layoutCards(){
  const board=document.getElementById('board');const cols=6,cw=180,gx=196,x0=16,y0=16,gy=18;
  let y=y0,rowH=0;const rows=[];
  MCARDS.forEach((c,i)=>{const col=i%cols;if(col===0&&i){y+=rowH+gy;rowH=0;}const elc=document.getElementById('mc-'+c.id);rowH=Math.max(rowH,elc.offsetHeight);rows.push([c.id,x0+col*gx,y]);});
  if(!rowH)return; // noch unsichtbar, später erneut
  M.laid=true;M.BH=Math.max(560,y+rowH+y0);
  for(const [id,x,yy] of rows){if(!M.pos[id])M.pos[id]=[x,yy];const p=M.pos[id];p[0]=clamp(p[0],0,M.BW-cw);p[1]=clamp(p[1],0,M.BH-40);place(id);}
  board.style.width=M.BW+'px';board.style.height=M.BH+'px';
  const w=document.getElementById('wires');w.setAttribute('viewBox',`0 0 ${M.BW} ${M.BH}`);w.setAttribute('width',M.BW);w.setAttribute('height',M.BH);
  fitBoard();
}
function place(id){const e=document.getElementById('mc-'+id),p=M.pos[id];e.style.left=p[0]+'px';e.style.top=p[1]+'px';}
function fitBoard(){const wrap=document.getElementById('boardwrap');const board=document.getElementById('board');if(!wrap.clientWidth)return;
  M.s=Math.min(1,wrap.clientWidth/M.BW);if(M.s<0.62)M.s=0.62;board.style.transform=`scale(${M.s})`;wrap.style.height=Math.ceil(M.BH*M.s)+'px';wrap.classList.toggle('scroll',M.s===0.62&&wrap.clientWidth<M.BW*0.62);}
function setSrc(id){M.src=id;document.querySelectorAll('.mcard').forEach(c=>c.classList.toggle('src',c.dataset.id===id));document.getElementById('board').classList.toggle('connecting',!!id);
  document.getElementById('mmode').textContent=id?`Pfeil von „${MC[id].t}“: Tippt jetzt auf die Karte, auf die sie wirkt. (Esc bricht ab)`:'';}
function addEdge(a,b){if(!a||!b||a===b)return;const i=M.edges.findIndex(e=>e[0]===a&&e[1]===b);if(i>=0)return;M.edges.push([a,b]);mSave();renderWires();renderEdgeList();}
function delEdge(a,b){M.edges=M.edges.filter(e=>!(e[0]===a&&e[1]===b));mSave();renderWires();renderEdgeList();}
function wireEvents(){
  const board=document.getElementById('board');let drag=null;
  board.addEventListener('pointerdown',ev=>{const card=ev.target.closest('.mcard');
    if(ev.target.closest('.cbtn')||ev.target.closest('.wdel'))return;
    if(!card){if(M.src)setSrc(null);return;}
    const id=card.dataset.id;
    if(M.src&&M.src!==id){addEdge(M.src,id);setSrc(null);ev.preventDefault();return;}
    drag={id,sx:ev.clientX,sy:ev.clientY,ox:M.pos[id][0],oy:M.pos[id][1],moved:false,pid:ev.pointerId};card.setPointerCapture(ev.pointerId);card.classList.add('drag');});
  board.addEventListener('pointermove',ev=>{if(!drag||ev.pointerId!==drag.pid)return;const dx=(ev.clientX-drag.sx)/M.s,dy=(ev.clientY-drag.sy)/M.s;if(Math.abs(dx)+Math.abs(dy)>3)drag.moved=true;
    const e=document.getElementById('mc-'+drag.id);M.pos[drag.id]=[clamp(drag.ox+dx,0,M.BW-e.offsetWidth),clamp(drag.oy+dy,0,M.BH-e.offsetHeight)];place(drag.id);renderWires();});
  const end=ev=>{if(!drag)return;document.getElementById('mc-'+drag.id).classList.remove('drag');if(drag.moved)mSave();drag=null;};
  board.addEventListener('pointerup',end);board.addEventListener('pointercancel',end);
  board.addEventListener('click',ev=>{const b=ev.target.closest('.cbtn');if(b){const id=b.closest('.mcard').dataset.id;if(M.src===id)setSrc(null);else if(M.src){addEdge(M.src,id);setSrc(null);}else setSrc(id);return;}
    const d=ev.target.closest('.wdel');if(d)delEdge(d.dataset.a,d.dataset.b);});
  board.addEventListener('keydown',ev=>{const card=ev.target.closest('.mcard');if(!card||ev.target.closest('.cbtn'))return;const id=card.dataset.id;
    if((ev.key==='Enter'||ev.key===' ')&&M.src&&M.src!==id){ev.preventDefault();addEdge(M.src,id);setSrc(null);return;}
    const mv={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]}[ev.key];
    if(mv){ev.preventDefault();M.pos[id]=[clamp(M.pos[id][0]+mv[0],0,M.BW-card.offsetWidth),clamp(M.pos[id][1]+mv[1],0,M.BH-card.offsetHeight)];place(id);renderWires();mSave();}});
  addEventListener('keydown',ev=>{if(ev.key==='Escape'&&M.src)setSrc(null);});
  document.getElementById('madd').addEventListener('click',()=>{const a=document.getElementById('mfrom').value,b=document.getElementById('mto').value;addEdge(a,b);});
  document.getElementById('mlist').addEventListener('click',ev=>{const b=ev.target.closest('button[data-a]');if(b)delEdge(b.dataset.a,b.dataset.b);});
  document.getElementById('mcheck').addEventListener('click',checkNet);
  document.getElementById('mopen').addEventListener('click',tryOpen);
  document.getElementById('mcode').addEventListener('keydown',ev=>{if(ev.key==='Enter'){ev.preventDefault();tryOpen();}});
  document.getElementById('mreset').addEventListener('click',()=>{M.pos={};layoutCards();mSave();renderWires();});
}
function cardBox(id){const e=document.getElementById('mc-'+id),p=M.pos[id];return {x:p[0],y:p[1],w:e.offsetWidth,h:e.offsetHeight};}
function edgePt(b,dx,dy,pad){const cx=b.x+b.w/2,cy=b.y+b.h/2;const t=Math.min(dx?(b.w/2+pad)/Math.abs(dx):1e9,dy?(b.h/2+pad)/Math.abs(dy):1e9);return [cx+dx*t,cy+dy*t];}
let wireRaf=0;
function renderWires(){cancelAnimationFrame(wireRaf);wireRaf=requestAnimationFrame(()=>{
  const svg=document.getElementById('wires');let h='<defs><marker id="mw-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1B1B2F"/></marker></defs>';
  for(const [a,b] of M.edges){const A=cardBox(a),B=cardBox(b);let dx=(B.x+B.w/2)-(A.x+A.w/2),dy=(B.y+B.h/2)-(A.y+A.h/2);const len=Math.hypot(dx,dy)||1;
    const both=hasEdge(b,a),off=both?7:0,nx=-dy/len*off,ny=dx/len*off;
    const [x1,y1]=edgePt(A,dx,dy,2),[x2,y2]=edgePt(B,-dx,-dy,6);const p1=[x1+nx,y1+ny],p2=[x2+nx,y2+ny];
    const mx=(p1[0]+p2[0])/2,my=(p1[1]+p2[1])/2;
    h+=`<line class="wire" x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" marker-end="url(#mw-arrow)"/>
      <g class="wdel" data-a="${a}" data-b="${b}" transform="translate(${mx},${my})"><title>Pfeil löschen</title><circle r="10"/><path d="M-4,-4 4,4M4,-4 -4,4"/></g>`;}
  svg.innerHTML=h;});}
function renderEdgeList(){
  const ul=document.getElementById('mlist');
  ul.innerHTML=M.edges.length?M.edges.map(([a,b])=>`<li><span>${MC[a].t} <b>→</b> ${MC[b].t}</span><button type="button" class="ghost sm" data-a="${a}" data-b="${b}" aria-label="Pfeil von ${MC[a].t} nach ${MC[b].t} löschen">Löschen</button></li>`).join(''):'<li class="muted">Noch keine Pfeile. Fangt mit einer Ursache an, die ihr sicher kennt.</li>';
  document.getElementById('mcount').textContent=M.edges.length;
}
function showSlots(found){document.querySelectorAll('#mslots i').forEach((s,i)=>{s.textContent=found[i]?CODE[i]:'?';s.classList.toggle('on',!!found[i]);});}
function checkNet(){
  const ev=evalNet();showSlots(ev.found);
  const fb=[];fb.push(`<b>${ev.n} von 10 Kernideen</b> stecken in eurem Netz.`);
  if(ev.shaky.length){const S=SHAKY.find(S=>ev.shaky.some(([a,b])=>S.t(a,b)));fb.push(`${ev.shaky.length} ${ev.shaky.length===1?'Pfeil steht':'Pfeile stehen'} auf wackeligen Füßen. Prof. Geo fragt: ${S.h}`);}
  else if(ev.n<10){const i=ev.found.indexOf(false);fb.push(`Prof. Geo fragt: ${IDEAS[i].h}`);}
  if(ev.n===10)fb.push('Alle zehn Kernideen! Ihr denkt wie echte Systemforscher.');
  else if(ev.n>=6)fb.push('Das reicht schon, um den Lösungssatz zu bauen. Fehlende Buchstaben könnt ihr auch erraten.');
  document.getElementById('mfb').innerHTML=fb.map(x=>`<p>${x}</p>`).join('');
}
function tryOpen(){
  const raw=document.getElementById('mcode').value.toUpperCase().replace(/[^A-ZÄÖÜ0-9]/g,'');const msg=document.getElementById('mmsg');
  if(hash(raw)===TEACHER){openDoor(true);return;}
  if(raw!==CODE){msg.textContent=raw?'Das Codewort passt nicht. Prüft euer Netz: Jede Kernidee verrät einen Buchstaben.':'Gebt zuerst das Codewort ein.';msg.className='mmsg bad';return;}
  const ev=evalNet();showSlots(ev.found);
  if(ev.n<6){msg.textContent=`Das Codewort stimmt! Prof. Geo möchte aber mindestens 6 Kernideen in eurem Netz sehen (bisher ${ev.n}). Lasst es prüfen.`;msg.className='mmsg bad';return;}
  const wrong=SENT.filter(S=>document.getElementById(S.id).value!==S.ok).length;
  if(wrong){msg.textContent=`Das Codewort stimmt! Im Lösungssatz ${wrong===1?'passt eine Lücke':'passen '+wrong+' Lücken'} noch nicht. Lest die Karten noch einmal.`;msg.className='mmsg bad';return;}
  openDoor(false);
}
function openDoor(teacher){
  M.solved=true;mSave();updateSolved();const mm=document.getElementById('mmsg');mm.textContent='';mm.className='mmsg';
  const ov=document.getElementById('ov');
  ov.innerHTML=`<div class="comic door"><div class="ctitle"><h2 id="ovt">Tür offen!</h2><div class="narr">${teacher?'Lehrkraft-Zugang':'Rätsel gelöst'}</div></div>
    <div class="dwrap"><svg viewBox="0 0 220 200" class="dsvg" aria-hidden="true"><g class="burst" style="--i:0"><polygon points="${star(110,100,96,62,16)}" fill="#FFD23F" stroke="#1B1B2F" stroke-width="3"/></g><use href="#i-geo" x="40" y="30" width="140" height="150"/></svg>
    <div class="dtext">${teacher?'<p>Die Tür wurde mit dem Lehrkraft-Code geöffnet. Tipp: Spielt das Mystery gemeinsam, es führt direkt zu den Dominoeffekten in der Klimasimulation.</p>':'<p><b>Stark gelöst!</b> Der Deich wächst vor allem, weil das Meer wärmer wird und sich ausdehnt und weil weltweit Gletscher und Eisschilde schmelzen. Grönland ist ein sichtbares Zeichen dafür. Sein Schmelzwasser kommt an der Nordsee aber nur zu etwa einem Fünftel an, an Grönlands Küste sinkt das Meer sogar.</p><p>Alles hängt mit allem zusammen, nur oft anders, als man zuerst denkt.</p>'}
    <p>Hinter der Tür wartet der Kontrollraum, die Klimasimulation: sechs Sphären, 24 verwundbare Orte, 50 Jahre. Eure Aufgabe dort: bis 2075 kein weiterer Kipppunkt, und die Menschen schützen.</p></div></div>
    <div class="csum" style="--n:1"><div class="m"><div>Codewort: <span>KLIMADEICH</span></div></div><div class="cbtns"><button class="ghost" id="ovclose" type="button">Zurück zum Wirkungsgefüge</button><a class="go" id="ovgo" href="klimasimulation.html">In den Kontrollraum!</a></div></div></div>`;
  ov.hidden=false;document.body.style.overflow='hidden';
  const close=()=>{ov.hidden=true;ov.innerHTML='';document.body.style.overflow='';document.getElementById('mopen').focus({preventScroll:true});};
  document.getElementById('ovclose').addEventListener('click',close);ov.onkeydown=e=>{if(e.key==='Escape')close();};
  setTimeout(()=>document.getElementById('ovgo')?.focus({preventScroll:true}),50);
}
function updateSolved(){document.getElementById('mtosim').hidden=!M.solved;}
/* „Neu beginnen“: zweistufig, damit niemand aus Versehen das Netz einer Gruppe löscht */
let resetArm=0;
function resetMystery(ev){const b=ev.currentTarget;
  const disarm=()=>{clearTimeout(resetArm);resetArm=0;b.textContent='Neu beginnen';b.classList.remove('warn');};
  if(!resetArm){b.textContent='Wirklich alles löschen?';b.classList.add('warn');resetArm=setTimeout(disarm,5000);return;}
  disarm();
  M.pos={};M.edges=[];M.sent={};M.solved=false;mSave();
  for(const S of SENT)document.getElementById(S.id).value='';
  document.getElementById('mcode').value='';const mm=document.getElementById('mmsg');mm.textContent='';mm.className='mmsg';
  document.getElementById('mfb').innerHTML='';document.getElementById('mfrom').value='';document.getElementById('mto').value='';
  setSrc(null);layoutCards();renderWires();renderEdgeList();showSlots(evalNet().found);updateSolved();window.scrollTo(0,0);
}

/* ===================== Start ===================== */
mLoad();buildMystery();updateSolved();
document.getElementById('mnew').addEventListener('click',resetMystery);
