/* ===================== Mystery 2: Das Rätsel von Rungholt =====================
   Indizien deuten und auf der Spurenkarte verorten: die Lage Rungholts und die Ursachen des Untergangs 1362.
   Die Karte (rungholt_map.svg) erzeugt gen_rungholt_map.py; RPROJ muss zur Projektion dort passen. */
const MSPH={atmo:['Atmosphäre','var(--atmo)',1],hydro:['Hydrosphäre','var(--hydro)',1],kryo:['Kryosphäre','var(--kryo)',0],pedo:['Pedosphäre','var(--pedo)',1],bio:['Biosphäre','var(--bio)',0],mensch:['Mensch','var(--mensch)',0],litho:['Lithosphäre','#8C93A3',1]};
const RPROJ={lon0:8.25,lat1:54.68,k:Math.cos(54.5*Math.PI/180),W:1200,H:851};RPROJ.s=RPROJ.W/(0.85*RPROJ.k);RPROJ.km=RPROJ.s/111.2;
const P=(lon,lat)=>[(lon-RPROJ.lon0)*RPROJ.k*RPROJ.s,(RPROJ.lat1-lat)*RPROJ.s];
/* Zielbereiche (bewusst großzügig: „ungefähr lokalisieren“) */
const OUTER=[[8.33,54.69],[8.335,54.64],[8.37,54.603],[8.44,54.592],[8.452,54.575],[8.448,54.54],[8.452,54.50],[8.44,54.47],[8.445,54.432],[8.50,54.412],[8.58,54.402],[8.63,54.387],[8.60,54.36],[8.575,54.32]];
const ZONES={
 R:{t:'circle',c:P(8.725,54.455),r:3.5*RPROJ.km,n:'Rungholt (ungefähr)'},            // Watt um die Hallig Südfall: Funde, Kirche, Deich und Hafen
 L:{t:'circle',c:P(8.71,54.46),r:7*RPROJ.km,n:'Land der Edomsharde'},                  // das Marschland um Rungholt
 S:{t:'poly',p:[...OUTER.map(c=>P(...c)),P(8.15,54.32),P(8.15,54.69)],n:'offene Nordsee'},// westlich der Außensände
 C:{t:'line',l:[[[8.27,54.404],[8.40,54.407],[8.50,54.406],[8.58,54.418],[8.64,54.43],[8.69,54.44],[8.75,54.44],[8.82,54.437],[8.88,54.441],[8.95,54.453],[9.015,54.472]],[[8.69,54.44],[8.70,54.47],[8.735,54.495],[8.76,54.52],[8.778,54.55],[8.79,54.585]]].map(l=>l.map(c=>P(...c))),w:2.5*RPROJ.km,n:'Hever und Norderhever'},
};
function inZone(z,[x,y]){const Z=ZONES[z];
  if(Z.t==='circle')return Math.hypot(x-Z.c[0],y-Z.c[1])<=Z.r;
  if(Z.t==='poly'){let ins=false;const p=Z.p;for(let i=0,j=p.length-1;i<p.length;j=i++){const [xi,yi]=p[i],[xj,yj]=p[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)ins=!ins;}return ins;}
  if(Z.t==='line'){for(const l of Z.l)for(let i=0;i<l.length-1;i++){const [ax,ay]=l[i],[bx,by]=l[i+1];const dx=bx-ax,dy=by-ay;const t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));if(Math.hypot(x-ax-t*dx,y-ay-t*dy)<=Z.w)return true;}return false;}
  return false;}

/* z: Zielbereich, fake: falsche Spur, ohne z und fake: Hintergrund ohne festen Ort */
const RCARDS=[
 {id:'busch',s:'mensch',who:'Fund',t:'Bauer Busch findet Schleusen',x:'1921 entdeckte der Bauer Andreas Busch aus Nordstrand bei Ebbe im Watt rund um die Hallig Südfall Reste alter Schleusen. Später fand er dort Brunnen, Ackerfurchen, Wege und Gräber.',z:['R'],miss:'Sucht die Hallig Südfall auf der Karte. Busch fand seine Spuren rund um diese kleine Hallig.'},
 {id:'orkan',s:'atmo',t:'Der Orkan vom 16. Januar 1362',x:'Ein schwerer Orkan zog über England und die Niederlande bis nach Dänemark. In Nordfriesland drückte Wind aus Nordwest das Wasser der offenen Nordsee gegen die Küste. An der ganzen Nordsee starben mindestens 25.000 Menschen.',wind:1,miss:'Wind aus Nordwest heißt: Der Wind kommt aus Nordwesten. Wohin weht er dann? Dreht den Windpfeil.'},
 {id:'salz',s:'pedo',t:'Salz aus dem Torf',x:'Unter der Marsch lag salziger Torf. Die Menschen gruben ihn ab, verbrannten ihn und gewannen aus der Asche Salz, ihr wichtigstes Handelsgut. Wo der Torf abgegraben war, lag das Land tiefer.',z:['L'],miss:'Wo gruben die Rungholter den Torf ab? Unter ihrem eigenen Land, also dort, wo Rungholt lag.'},
 {id:'kirche',s:'mensch',who:'Messung',t:'Eine Kirche im Schlick',x:'2023 maßen Forschende aus Kiel und Mainz im Watt bei der Hallig Südfall das Magnetfeld des Bodens. Sie entdeckten den Grundriss einer großen Kirche (40 × 15 m) auf einer Warft, die Hauptkirche der Edomsharde.',z:['R'],miss:'Wo haben die Forschenden 2023 gemessen? Lest den Ortsnamen auf dem Indiz und sucht ihn auf der Karte.'},
 {id:'priele',s:'hydro',t:'Die Priele werden tiefer',x:'Deiche engen das Wasser ein. Dann strömt es in den Prielen schneller, und der Unterschied zwischen Ebbe und Flut wächst. Die Priele zwischen den Inseln, wie die Hever, wurden tiefer und breiter und rissen Land weg.',z:['C'],miss:'Sucht auf der Karte die Hever. Welcher Arm der Hever fließt nahe an Rungholt vorbei?'},
 {id:'beben',s:'litho',who:'Person',t:'Leonie aus der 7a ist sicher',x:'„Rungholt ist bei einem Erdbeben im Meer versunken, genau wie Atlantis!“',fake:1,h:'An der Nordseeküste gibt es keine starken Erdbeben. Welche Indizien erklären, warum das Land tiefer lag?'},
 {id:'edom',s:'mensch',who:'Quelle',t:'Hauptort der Edomsharde',x:'Im 14. Jahrhundert war Rungholt der Hauptort der Edomsharde, eines Bezirks mit Kirche, Gericht und Verwaltung. Rungholt lag südöstlich der heutigen Insel Pellworm.',z:['L'],miss:'Findet zuerst Pellworm. Wo auf der Karte liegt Südosten? Der Nordpfeil hilft.'},
 {id:'graeben',s:'pedo',t:'Gräben trocknen das Moor',x:'Für Äcker und Weiden zogen die Menschen Gräben durch das Moor. Trockener Torf sackt zusammen und zersetzt sich. So sank das Land bis etwa auf die Höhe des normalen Hochwassers.',z:['L'],miss:'Wo zogen die Rungholter ihre Gräben? Dort, wo sie wohnten und Äcker hatten.'},
 {id:'burchardi',s:'hydro',t:'Die Burchardiflut',x:'Am 11. Oktober 1634 zerriss eine Sturmflut die Insel Strand. Tausende Menschen starben. Übrig blieben Pellworm, Nordstrand und die Hallig Nordstrandischmoor.',fake:1,h:'Wann ging Rungholt unter? Kann eine Flut aus dem Jahr 1634 die Ursache sein?'},
 {id:'hafen',s:'mensch',who:'Fund',t:'Deich und Hafen',x:'Südlich der Hallig Südfall liegen im Watt die Reste eines großen mittelalterlichen Seedeichs. Dort hatte die Siedlung auch einen Hafen.',z:['R'],miss:'Südlich heißt: auf der Karte unterhalb. Unterhalb von welcher Hallig?'},
 {id:'handel',s:'mensch',who:'Fund',t:'Schätze aus der Ferne',x:'Im Watt fanden Archäologen Bronzekessel, Schwerter, glasierte Krüge und sogar Keramik aus Spanien. Rungholt handelte mit Hamburg, dem Rheinland und Flandern. Hier lebten wohl 1.000 bis 1.300 Menschen.'},
 {id:'deiche',s:'mensch',t:'Zu schwache Deiche',x:'Die Deiche des Mittelalters waren viel niedriger als heute. Um 1350 hatten Missernten, Viehseuchen und die Pest die Menschen geschwächt. Es fehlten Hände, um die Deiche zu pflegen.',z:['R'],miss:'Wo lag der Seedeich, der Rungholt schützen sollte? Ein anderes Indiz verrät es.'},
 {id:'heute',s:'atmo',t:'Das Meer steigt heute schneller',x:'Heute steigt der Meeresspiegel weltweit um fast 5 mm pro Jahr, vor allem weil der Mensch das Klima erwärmt.',fake:1,h:'Das stimmt, aber gab es 1362 schon Kohlekraftwerke und Autos? Dieses Indiz gehört in die Gegenwart.'},
 {id:'meer',s:'hydro',t:'Das Meer steigt langsam',x:'Seit dem Ende der letzten Eiszeit steigt der Meeresspiegel der Nordsee. Im Mittelalter stieg er nur noch langsam. Zugleich sank das Land der Marsch ab.'},
 {id:'fluten',s:'hydro',t:'Flut um Flut',x:'Schon im 13. und 14. Jahrhundert drangen Sturmfluten immer wieder in die Marsch ein. Jede Flut riss Land weg und machte die Küste verwundbarer für die nächste.'},
];
const RC=Object.fromEntries(RCARDS.map((c,i)=>[c.id,Object.assign(c,{n:i+1})]));
const WIND_OK=135; // Windpfeil zeigt nach Südosten: Wind aus Nordwest
const TEACHER=1172307947; // Lehrkraft-Code nur als Prüfsumme (wie im Rätsel vom Deich, siehe Lösungsblatt); öffnet die Schublade
function hash(t){let h=0x811c9dc5;for(const c of t){h^=c.codePointAt(0);h=Math.imul(h,0x01000193)>>>0;}return h;}
const pinIn=(id,z)=>!!M.pins[id]&&z.some(Z=>inZone(Z,M.pins[id]));
const IDEAS=[
 {n:'Spuren im Watt bei Südfall',c:['busch'],ok:()=>pinIn('busch',['R']),h:'Wo fand Bauer Busch die alten Schleusen?'},
 {n:'Die Hauptkirche liegt im Watt',c:['kirche'],ok:()=>pinIn('kirche',['R']),h:'Wo haben die Forschenden 2023 die Kirche entdeckt?'},
 {n:'Rungholt gefunden',c:['busch','kirche','hafen','edom'],ok:()=>!!M.flag&&inZone('R',M.flag),h:'Setzt die Rungholt-Fahne dorthin, wo die meisten Ortsspuren zusammenkommen.'},
 {n:'Der Sturm kam von der Nordsee',c:['orkan'],ok:()=>!!M.pins.orkan&&M.wind===WIND_OK,h:'Woher kam der Sturm? Setzt die Windrose auf die Karte und dreht den Windpfeil so, dass er zeigt, wohin der Wind wehte.'},
 {n:'Torf für Salz: Das Land wurde abgegraben',c:['salz'],ok:()=>pinIn('salz',['L']),h:'Womit verdienten die Rungholter ihr Geld, und was machte das mit ihrem Land?'},
 {n:'Gräben: Das Land sackte ab',c:['graeben'],ok:()=>pinIn('graeben',['L']),h:'Was passiert mit einem Moor, das trockengelegt wird?'},
 {n:'Der Deich hielt nicht stand',c:['deiche','hafen'],ok:()=>pinIn('deiche',['R'])||pinIn('hafen',['R']),h:'Was hätte Rungholt vor der Flut schützen sollen, und wo lag es?'},
 {n:'Das Meer gräbt Arme ins Land',c:['priele'],ok:()=>pinIn('priele',['C']),h:'Was geschah mit den Prielen, als die Deiche das Wasser einengten?'},
 {n:'Falsche Spuren entlarvt',all:1,c:RCARDS.filter(c=>c.fake).map(c=>c.id),ok:()=>RCARDS.filter(c=>c.fake).every(c=>M.fake[c.id]&&!M.pins[c.id]),h:'Nicht jedes Indiz ist ein Beweis. Welche Indizien sind Irrtümer oder gehören in eine andere Zeit? Markiert sie mit ✗.'},
];
const SENT=[
 {id:'s1',ok:'b',o:[['a','vor der Insel Sylt im offenen Meer'],['b','im heutigen Watt bei der Hallig Südfall'],['c','an Land, dort wo heute Husum steht']]},
 {id:'s2',ok:'a',o:[['a','drückte ein Orkan das Wasser der Nordsee gegen die Küste'],['b','ließ ein Erdbeben die Stadt im Meer versinken'],['c','zerriss die Burchardiflut die Insel Strand']]},
 {id:'s3',ok:'a',o:[['a','die Menschen ihr Land durch Torfabbau und Gräben selbst abgesenkt hatten'],['b','der Klimawandel das Meer schon stark erwärmt hatte'],['c','Gott die übermütigen Rungholter bestrafen wollte']]},
 {id:'s4',ok:'b',o:[['a','die Stadt zu weit draußen auf einer Insel lag'],['b','das Land verwundbar war'],['c','es in Nordfriesland keine Deiche gab']]},
];
const MKEY='terravergo-rungholt-v1';
const M={pins:{},flag:null,fake:{},bg:{},sent:{},solved:false,phase2:false,teacher:false,wind:0,wpos:{},wedges:[],wsign:false,pick:null,zones:false,deck:[],open:[]};
/* Ausgelegte Karten: deck ist die zufällige Lage der Karten, open die aufgedeckten Indizien in der Reihenfolge des Aufdeckens.
   Die erste Karte wird zufällig aufgedeckt, alle weiteren decken die Gruppen selbst auf, sobald die offenen Indizien beantwortet sind. */
const answered=id=>!!(M.pins[id]||M.fake[id]||M.bg[id]);
const isRev=id=>M.open.includes(id);
const canOpen=()=>M.open.every(answered);
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function ensureDeck(){const ids=RCARDS.map(c=>c.id);
  if(!(M.deck.length===ids.length&&ids.every(id=>M.deck.includes(id))))M.deck=shuffle(ids);
  M.open=M.open.filter((id,i,a)=>RC[id]&&a.indexOf(id)===i);
  for(const id of ids)if(answered(id)&&!M.open.includes(id))M.open.push(id);
  if(!M.open.length)M.open=[M.deck[Math.floor(Math.random()*M.deck.length)]];}
function openCard(id){const msg=document.getElementById('rkmsg');
  if(isRev(id))return;
  if(!canOpen()){const c=M.open.find(x=>!answered(x));msg.textContent=`Beantwortet zuerst Indiz ${RC[c].n} „${RC[c].t}“. Dann dürft ihr die nächste Karte aufdecken.`;highlight(c);return;}
  msg.textContent='';M.open.push(id);mSave();renderCards();setTimeout(()=>{const el=document.getElementById('rc-'+id);el.querySelector('.rfront .rpick')?.focus({preventScroll:true});},450);}
function mLoad(){try{const d=JSON.parse(localStorage.getItem(MKEY)||'{}');if(d&&typeof d==='object'){
  for(const [id,p] of Object.entries(d.pins||{}))if(RC[id]&&Array.isArray(p))M.pins[id]=[+p[0],+p[1]];
  if(Array.isArray(d.flag))M.flag=[+d.flag[0],+d.flag[1]];for(const id of Object.keys(d.fake||{}))if(RC[id])M.fake[id]=true;
  for(const id of Object.keys(d.bg||{}))if(RC[id])M.bg[id]=true;if(Array.isArray(d.deck))M.deck=d.deck.filter(id=>RC[id]);if(Array.isArray(d.open))M.open=d.open.filter(id=>RC[id]);else if(+d.nrev)M.open=M.deck.slice(0,+d.nrev);
  M.sent=d.sent||{};M.solved=!!d.solved;M.phase2=!!d.phase2;M.teacher=!!d.teacher;M.wsign=!!d.wsign;M.wpos=d.wpos&&typeof d.wpos==='object'?d.wpos:{};M.wedges=(d.wedges||[]).filter(e=>Array.isArray(e)&&e.length>=2).map(e=>[e[0],e[1],[1,-1].includes(e[2])?e[2]:0]);M.wind=((Math.round((+d.wind||0)/45)*45)%360+360)%360;}}catch(e){}}
function mSave(){try{localStorage.setItem(MKEY,JSON.stringify({pins:M.pins,flag:M.flag,fake:M.fake,bg:M.bg,deck:M.deck,open:M.open,sent:M.sent,solved:M.solved,phase2:M.phase2,teacher:M.teacher,wind:M.wind,wpos:M.wpos,wedges:M.wedges,wsign:M.wsign}));}catch(e){}}
function evalNet(){
  const found=IDEAS.map(I=>I.ok());
  const shaky=[...RCARDS.filter(c=>c.fake&&M.pins[c.id]).map(c=>({c,h:c.h})),...RCARDS.filter(c=>!c.fake&&M.fake[c.id]).map(c=>({c,h:`„${c.t}“ ist keine falsche Spur. Lest das Indiz noch einmal: Es beruht auf Funden, Quellen oder Forschung.`})),...RCARDS.filter(c=>c.fake&&M.bg[c.id]).map(c=>({c,h:c.h}))];
  const miss=RCARDS.filter(c=>(c.z&&((M.pins[c.id]&&!pinIn(c.id,c.z))||M.bg[c.id]))||(c.wind&&((M.pins[c.id]&&M.wind!==WIND_OK)||M.bg[c.id])));
  return {found,n:found.filter(Boolean).length,shaky,miss};}

/* --- Geschichte --- */
const WATTBG=`<rect width="320" height="170" fill="#CDEBFF"/><rect y="92" width="320" height="12" fill="#3D8FD6"/><path d="M0 102h320V170H0Z" fill="#EAD9A8" stroke="#1B1B2F" stroke-width="2.5"/>
   <g fill="none" stroke="#B89A5B" stroke-width="2.5" stroke-linecap="round"><path d="M150 120c8-4 16 4 24 0s16-4 24 0M200 140c8-4 16 4 24 0s16-4 24 0M150 158c8-4 16 4 24 0s16-4 24 0M260 124c8-4 16 4 24 0"/></g>
   <g fill="none" stroke="#1B1B2F" stroke-width="2.5" stroke-linecap="round"><path d="M120 34l6 4 6-4M138 22l5 3 5-3"/></g>`;
const STORY=[
 {who:'Prof. Geo',svg:`<svg viewBox="0 0 320 170" aria-hidden="true">${WATTBG}
   <path d="M226 136v30" stroke="#6B4423" stroke-width="6" stroke-linecap="round"/><path d="M216 166c6-4 14-4 20 0" fill="none" stroke="#B89A5B" stroke-width="2.5" stroke-linecap="round"/>
   <g stroke="#1B1B2F" stroke-width="2.5" stroke-linejoin="round"><rect x="156" y="14" width="152" height="128" rx="4" fill="#fff" transform="rotate(2 232 78)"/>
   <path d="M168 50h128M168 116h56M168 124h50M168 132h56" fill="none" transform="rotate(2 232 78)"/>
   <g transform="rotate(2 232 78)"><rect x="232" y="78" width="64" height="56" fill="#EAD9A8"/><path d="M246 128v-26h22v26M246 102l11-12 11 12M257 90v-8" fill="none"/><path d="M236 122c8-4 16 4 24 0s16-4 24 0" fill="none" stroke="#3D8FD6"/></g></g>
   <text x="232" y="34" text-anchor="middle" class="tiny" transform="rotate(2 232 78)">WATTENMEER-ZEITUNG</text>
   <text x="226" y="72" text-anchor="middle" class="mid" transform="rotate(2 232 78)">KIRCHE IM SCHLICK!</text>
   <use href="#i-geo-watt" x="0" y="20" width="140" height="150"/></svg>`,
  x:'Moin! Ich bin Prof. Geo. Heute führt uns ein Rätsel ins Wattenmeer. Forschende melden: Im Schlick vor der Küste liegt eine Kirche, mitten im Meer!'},
 {who:'Jannes, 13, Ostfriesland',svg:`<svg viewBox="0 0 320 170" aria-hidden="true"><rect width="320" height="170" fill="#CDEBFF"/>
   <rect y="84" width="320" height="14" fill="#3D8FD6"/><path d="M0 96h320V170H0Z" fill="#EAD9A8" stroke="#1B1B2F" stroke-width="2.5"/>
   <g fill="none" stroke="#B89A5B" stroke-width="2.5" stroke-linecap="round"><path d="M10 112c8-4 16 4 24 0s16-4 24 0M70 126c8-4 16 4 24 0s16-4 24 0M20 146c8-4 16 4 24 0s16-4 24 0M120 152c8-4 16 4 24 0s16-4 24 0M150 116c8-4 16 4 24 0"/></g>
   <g fill="none" stroke="#1B1B2F" stroke-width="2.5" stroke-linecap="round"><path d="M40 40l7 5 7-5M62 28l6 4 6-4M250 30l6 4 6-4"/></g>
   <circle cx="120" cy="134" r="5" fill="#7A4A2A" stroke="#1B1B2F" stroke-width="2"/><circle cx="150" cy="140" r="4" fill="#7A4A2A" stroke="#1B1B2F" stroke-width="2"/><circle cx="96" cy="120" r="4" fill="#7A4A2A" stroke="#1B1B2F" stroke-width="2"/>
   <g stroke="#1B1B2F" stroke-width="2.5" stroke-linejoin="round"><path d="M178 108l26-8 14 10-10 16-28 2Z" fill="#C2410C"/><path d="M186 112l18-4M184 120l22-2" fill="none" stroke="#FFD23F" stroke-width="2"/></g>
   <path d="M186 90l4-10M200 88l0-12M214 92l6-9" stroke="#FFD23F" stroke-width="3" stroke-linecap="round"/>
   <use href="#i-jannes" x="228" y="60" width="92" height="110"/></svg>`,
  x:'„Klassenfahrt nach Nordstrand! Bei der Wattwanderung zeigt uns die Wattführerin eine uralte Scherbe im Schlick. Sie sagt: Die stammt vielleicht aus Rungholt.“'},
 {who:'Inken, Wattführerin auf Nordstrand',svg:`<svg viewBox="0 0 320 170" aria-hidden="true"><rect width="320" height="170" fill="#DDE8FF"/>
   <path d="M100 80c14-6 28-6 42 0s28 6 42 0 28-6 42 0 28 6 42 0 28-6 52 0V170H100Z" fill="#3D8FD6" stroke="#1B1B2F" stroke-width="2.5"/>
   <g fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="7 6" opacity=".85" stroke-linejoin="round"><path d="M196 166v-44h40v44M196 122l20-16 20 16M244 166v-60l12-14 12 14v60M256 92v-12"/></g>
   <g stroke="#1B1B2F" stroke-width="2.5" stroke-linejoin="round"><path d="M256 34c-12 0-14 10-14 20l-6 8h40l-6-8c0-10-2-20-14-20Z" fill="#FFD23F"/><circle cx="256" cy="66" r="4" fill="#1B1B2F"/></g>
   <g fill="none" stroke="#1B1B2F" stroke-width="2.5" stroke-linecap="round"><path d="M226 38c-6 6-6 16 0 22M216 32c-10 10-10 24 0 34M286 38c6 6 6 16 0 22M296 32c10 10 10 24 0 34"/></g>
   <use href="#i-inken" x="0" y="56" width="100" height="114"/></svg>`,
  x:'„Die Leute erzählen: Rungholt war reich und übermütig, darum ließ Gott es versinken. Aber wo lag es genau? Und was ist damals wirklich passiert?“'},
 {who:'Prof. Geo',svg:`<svg viewBox="0 0 320 170" aria-hidden="true">${WATTBG}
   <g stroke="#1B1B2F" stroke-linejoin="round"><path d="M186 150l8-24M286 150l-8-24" stroke="#6B4423" stroke-width="5" stroke-linecap="round"/>
   <rect x="160" y="14" width="152" height="114" rx="4" fill="#fff" stroke-width="3"/>
   <g stroke-width="2"><rect x="170" y="24" width="40" height="18" rx="3" fill="#FF6B3D"/><rect x="170" y="62" width="40" height="18" rx="3" fill="#C2408F"/><rect x="226" y="42" width="40" height="18" rx="3" fill="#D4DCEA"/><rect x="226" y="94" width="40" height="18" rx="3" fill="#D4DCEA"/><rect x="276" y="68" width="28" height="18" rx="3" fill="#1B1B2F"/></g>
   <path d="M210 34l14 12M210 70l14-12M246 60v32M266 100l10-12M266 52l12 14" fill="none" stroke-width="2.5" stroke-linecap="round"/></g>
   <path d="M150 152c18-9 150-9 168 0v18H150Z" fill="#EAD9A8" stroke="#1B1B2F" stroke-width="2.5" stroke-linejoin="round"/>
   <use href="#i-geo-watt" x="0" y="20" width="140" height="150"/></svg>`,
  x:'„In der Fundkiste liegen 15 Indizien, noch verdeckt. Deckt sie auf und setzt sie auf die Karte. Habt ihr genug Spuren richtig gedeutet, baut ihr daraus ein Wirkungsgefüge: Wie kam es zum Untergang?“'},
];

/* --- Aufbau --- */
const SVGNS='http://www.w3.org/2000/svg';
const pinIcon='<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M7 13C5 9 2.5 7.5 2.5 5a4.5 4.5 0 0 1 9 0C11.5 7.5 9 9 7 13Z" fill="#FF6B3D" stroke="#1B1B2F" stroke-width="1.6"/><circle cx="7" cy="5" r="1.6" fill="#fff"/></svg>';
const CELLS=[];for(let r=1;r<=6;r++)for(const c of 'ABCDEFGH')CELLS.push(c+r);
function cellOf([x,y]){const c=Math.max(0,Math.min(7,Math.floor(x/(RPROJ.W/8)))),r=Math.max(0,Math.min(5,Math.floor(y/(RPROJ.H/6))));return 'ABCDEFGH'[c]+(r+1);}
function cellCenter(cell,jit){const c='ABCDEFGH'.indexOf(cell[0]),r=+cell.slice(1)-1;const a=jit*2.4;return [(c+.5)*RPROJ.W/8+Math.cos(a)*14*(jit%3),(r+.5)*RPROJ.H/6+Math.sin(a)*14*(jit%3)];}
const cellOpts='<option value="">Planquadrat …</option>'+CELLS.map(c=>`<option value="${c}">${c}</option>`).join('');
function buildMystery(){
  document.getElementById('story').innerHTML=STORY.map((p,i)=>`<div class="pnl" style="--i:${i}"><span class="ptag">${p.who}</span>${p.svg}<div class="cap">${p.x}</div></div>`).join('');
  document.getElementById('rcards').innerHTML=RCARDS.map(c=>{const [sn,col,dark]=MSPH[c.s];return `<article class="rcard" id="rc-${c.id}" data-id="${c.id}"><div class="rinner">
    <div class="rfront" role="group" aria-labelledby="rt-${c.id}"><div class="band ${dark?'dark':''}" style="background:${col}"><span>${sn}</span>${c.who?`<span>${c.who}</span>`:''}</div><span class="rnum" style="background:${col};color:${dark?'#fff':'var(--ink)'}">${c.n}</span>
    <h4 id="rt-${c.id}">${c.t}</h4><p>${c.x}</p>
    <div class="ract"><button class="ghost rpick" type="button" data-id="${c.id}">${pinIcon}<span>Auf die Karte</span></button><select class="rcell" data-id="${c.id}" aria-label="Planquadrat für Indiz ${c.n}">${cellOpts}</select>${c.wind?`<span class="rrotw" hidden><button class="ghost rrot" type="button" data-d="-45" aria-label="Windpfeil gegen den Uhrzeigersinn drehen" title="Windpfeil drehen">⟲</button><button class="ghost rrot" type="button" data-d="45" aria-label="Windpfeil im Uhrzeigersinn drehen" title="Windpfeil drehen">⟳</button></span>`:''}<button class="ghost rbg" type="button" data-id="${c.id}" aria-pressed="false" title="Das Indiz hat keinen festen Ort auf der Karte">✓ Kein fester Ort</button><button class="ghost rfake" type="button" data-id="${c.id}" aria-pressed="false" title="Als falsche Spur markieren">✗ Falsche Spur</button></div></div>
    <div class="rback" role="button" tabindex="0" data-id="${c.id}" aria-label="Verdeckte Karte aufdecken"><span class="rbq" aria-hidden="true">?</span><span class="rbt">Indiz</span><span class="rbl">Terra Vergo</span><span class="rbh">Tippen zum Aufdecken</span></div></div></article>`;}).join('');
  const rc=document.getElementById('rcards');rc.classList.add('noanim');requestAnimationFrame(()=>requestAnimationFrame(()=>rc.classList.remove('noanim')));
  wireEvents();renderPins();renderCards();renderProg(evalNet().found);updateSolved();buildWG();
  fitList();addEventListener('resize',fitList);
  const w=document.getElementById('rmapwrap');if(w.scrollWidth>w.clientWidth)w.scrollLeft=(w.scrollWidth-w.clientWidth)*0.55; // auf dem Handy: Rungholt-Gegend in die Mitte
}
function fitList(){const h=document.getElementById('rmapwrap').offsetHeight;document.getElementById('rcards').style.setProperty('--rmaxh',Math.max(420,h-62)+'px');}
function renderCards(){
  for(const c of RCARDS){const el=document.getElementById('rc-'+c.id);const pinned=!!M.pins[c.id],fake=!!M.fake[c.id],bg=!!M.bg[c.id];
    const k=M.deck.indexOf(c.id),hid=!isRev(c.id);el.style.order=k;el.classList.toggle('hidden',hid);el.querySelector('.rfront').inert=hid;el.querySelector('.rback').inert=!hid;
    el.classList.toggle('placed',pinned);el.classList.toggle('fake',fake);el.classList.toggle('bg',bg);el.querySelector('.rbg').setAttribute('aria-pressed',bg?'true':'false');
    const pb=el.querySelector('.rpick');pb.disabled=fake;pb.classList.toggle('on',M.pick===c.id);
    pb.querySelector('span').textContent=M.pick===c.id?'Tippt auf die Karte …':c.wind?(pinned?'Windrose versetzen':'Windrose setzen'):pinned?'Versetzen':'Auf die Karte';
    const rw=el.querySelector('.rrotw');if(rw)rw.hidden=!pinned;
    const sel=el.querySelector('.rcell');sel.disabled=fake;sel.value=pinned?cellOf(M.pins[c.id]):'';
    const fb=el.querySelector('.rfake');fb.setAttribute('aria-pressed',fake?'true':'false');}
  document.getElementById('rflag').classList.toggle('on',M.pick==='flag');
  document.getElementById('rmapwrap').classList.toggle('picking',!!M.pick);
  const N=RCARDS.length,done=RCARDS.filter(c=>answered(c.id)).length;
  const no=M.open.length;document.getElementById('rcount').textContent=no<N?` · ${no} von ${N} aufgedeckt`:done<N?` · alle aufgedeckt, ${N-done} noch offen`:' · alle gedeutet';
  document.getElementById('rcards').classList.toggle('ready',no<N&&canOpen());
}
function pinSvg(id){const c=RC[id];const col=MSPH[c.s][1];const [x,y]=M.pins[id];
  return `<g class="pin" data-id="${id}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})" tabindex="0" role="button" aria-label="Stecknadel ${c.n}: ${c.t}, Planquadrat ${cellOf(M.pins[id])}. Pfeiltasten verschieben.">
    <circle class="ring" cx="0" cy="-27" r="22"/><path class="head" d="M0 0C-5-9-15-16-15-27a15 15 0 1 1 30 0C15-16 5-9 0 0Z" style="fill:${col}"/><circle cx="0" cy="-27" r="10.5"/><text x="0" y="-22">${c.n}</text></g>`;}
/* Windrose für Indiz 2: Ring mit Himmelsrichtungen (Norden oben), drehbarer Windpfeil; der Griff an der Pfeilspitze dreht in 45°-Schritten */
function windSvg(){const c=RC.orkan;const [x,y]=M.pins.orkan;const dirs=['N','NO','O','SO','S','SW','W','NW'];
  const lab=dirs.map((d,i)=>{const a=i*Math.PI/4,r=i%2?31:30;return `<text class="wl${i%2?' wl2':''}" x="${(Math.sin(a)*r).toFixed(1)}" y="${(-Math.cos(a)*r+4).toFixed(1)}">${d}</text>`;}).join('');
  return `<g class="pin wind" data-id="orkan" transform="translate(${x.toFixed(1)},${y.toFixed(1)})" tabindex="0" role="button" aria-label="Windrose zu Indiz ${c.n}, Planquadrat ${cellOf(M.pins.orkan)}. Der Windpfeil zeigt nach ${['Norden','Nordosten','Osten','Südosten','Süden','Südwesten','Westen','Nordwesten'][M.wind/45]}. Pfeiltasten verschieben, R dreht.">
    <circle class="ring" r="50"/><circle class="wbg" r="42"/>${dirs.map((d,i)=>`<path class="wt" d="M0 ${-42}v${i%2?5:8}" transform="rotate(${i*45})"/>`).join('')}${lab}
    <g class="warrow" transform="rotate(${M.wind})"><path class="wshaft" d="M0 20V-14"/><path class="whead" d="M0-26l-8 13h16Z"/><path class="wfeath" d="M0 20l-7 7M0 13l-7 7M0 20l7 7M0 13l7 7"/><circle class="rot" cx="0" cy="-22" r="13"/></g>
    <circle class="wnum" cx="34" cy="-34" r="11"/><text class="wn" x="34" y="-30">${c.n}</text></g>`;}
function flagSvg(){const [x,y]=M.flag;return `<g class="pin flag" data-id="flag" transform="translate(${x.toFixed(1)},${y.toFixed(1)})" tabindex="0" role="button" aria-label="Rungholt-Fahne, Planquadrat ${cellOf(M.flag)}. Pfeiltasten verschieben.">
    <circle class="ring" cx="16" cy="-34" r="30"/><ellipse cx="0" cy="0" rx="9" ry="4" fill="#1B1B2F" opacity=".35"/><path d="M0 2V-58" stroke="#1B1B2F" stroke-width="5" stroke-linecap="round"/>
    <path class="cloth" d="M0-58h56l-10 12 10 12H0Z"/><text x="24" y="-38" text-anchor="middle">RUNGHOLT?</text></g>`;}
function renderPins(){
  const g=document.getElementById('rpins');const ids=Object.keys(M.pins).filter(id=>RC[id]&&!M.fake[id]);
  ids.sort((a,b)=>M.pins[a][1]-M.pins[b][1]);
  g.innerHTML=ids.map(id=>id==='orkan'?windSvg():pinSvg(id)).join('')+(M.flag?flagSvg():'');
  renderZones();
}
function renderZones(){const g=document.getElementById('rzones');if(!M.zones){g.innerHTML='';return;}
  const R=ZONES.R,L=ZONES.L,C=ZONES.C;
  g.innerHTML=`<circle class="zl" cx="${L.c[0]}" cy="${L.c[1]}" r="${L.r}"/>`+C.l.map(l=>`<path class="zc" d="M${l.map(p=>p.map(v=>v.toFixed(1)).join(',')).join('L')}" stroke-width="${2*C.w}"/>`).join('')
   +`<circle class="zr" cx="${R.c[0]}" cy="${R.c[1]}" r="${R.r}"/><text x="${R.c[0]}" y="${R.c[1]+R.r+26}" text-anchor="middle">Rungholt (ungefähr)</text>`
   +`<text x="${L.c[0]}" y="${L.c[1]+L.r+24}" text-anchor="middle" class="zsm">Land um Rungholt (Edomsharde)</text>`
   +`<path class="zs" d="M${ZONES.S.p.map(p=>p.map(v=>v.toFixed(1)).join(',')).join('L')}Z"/><text x="150" y="760" text-anchor="middle">Die Flut kam</text><text x="150" y="786" text-anchor="middle">von der Nordsee</text>`;}
function setPick(p){M.pick=p;renderCards();
  const mm=document.getElementById('mmode');
  mm.textContent=p==='flag'?'Rungholt-Fahne: Tippt auf die Stelle, an der ihr Rungholt vermutet. (Esc bricht ab)':p==='orkan'?'Windrose: Tippt auf die Karte, um sie abzusetzen. Dann dreht den Windpfeil (Griff an der Spitze ziehen oder ⟲ ⟳ am Indiz), bis er zeigt, wohin der Sturm wehte. (Esc bricht ab)':p?`Indiz ${RC[p].n} „${RC[p].t}“: Tippt auf die Stelle der Karte, auf die es hinweist. (Esc bricht ab)`:'';
  if(p){const w=document.getElementById('rmapwrap');const r=w.getBoundingClientRect();if(r.top<0||r.bottom>innerHeight)w.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'center'});}}
function place(id,pt){const p=[Math.max(4,Math.min(RPROJ.W-4,pt[0])),Math.max(30,Math.min(RPROJ.H-4,pt[1]))];
  if(id==='flag')M.flag=p;else{M.pins[id]=p;delete M.fake[id];delete M.bg[id];}mSave();renderPins();renderCards();}
/* nach einer Antwort: nächstes Indiz aufdecken und zeigen */
function turnWind(d){M.wind=((M.wind+d)%360+360)%360;mSave();renderPins();}
/* nach einer Antwort: Hinweis, dass die nächste Karte aufgedeckt werden darf */
function afterAnswer(id){renderCards();const ok=M.open.length<M.deck.length&&canOpen();document.getElementById('rkmsg').textContent=ok?'Gut! Tippt auf eine verdeckte Karte, um das nächste Indiz aufzudecken.':'';return false;}
function svgPt(ev){const svg=document.getElementById('rmap');const pt=svg.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;const q=pt.matrixTransform(svg.getScreenCTM().inverse());return [q.x,q.y];}
function highlight(id){document.querySelectorAll('#rpins .pin').forEach(p=>p.classList.toggle('hl',p.dataset.id===id));
  if(id==='flag'||!RC[id])return;const el=document.getElementById('rc-'+id);
  el.scrollIntoView({behavior:'smooth',block:'center'});
  el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');}
function wireEvents(){
  const svg=document.getElementById('rmap');let drag=null;
  svg.addEventListener('pointerdown',ev=>{const pin=ev.target.closest('.pin');
    if(pin&&!M.pick&&ev.target.closest('.rot')){drag={rot:true,id:pin.dataset.id,el:pin,pid:ev.pointerId,moved:false,sx:ev.clientX,sy:ev.clientY};pin.setPointerCapture(ev.pointerId);pin.classList.add('drag');ev.preventDefault();return;}
    if(pin&&!M.pick){const id=pin.dataset.id;const cur=id==='flag'?M.flag:M.pins[id];const q=svgPt(ev);
      drag={id,el:pin,ox:cur[0]-q[0],oy:cur[1]-q[1],moved:false,pid:ev.pointerId,sx:ev.clientX,sy:ev.clientY};pin.setPointerCapture(ev.pointerId);pin.classList.add('drag');ev.preventDefault();return;}
    if(M.pick){const id=M.pick;place(id,svgPt(ev));setPick(null);if(id!=='flag'&&!afterAnswer(id))setTimeout(()=>highlight(id),250);ev.preventDefault();}});
  svg.addEventListener('pointermove',ev=>{if(!drag||ev.pointerId!==drag.pid)return;if(Math.abs(ev.clientX-drag.sx)+Math.abs(ev.clientY-drag.sy)>4)drag.moved=true;if(!drag.moved)return;
    if(drag.rot){const q=svgPt(ev),c=M.pins.orkan;const a=Math.atan2(q[0]-c[0],c[1]-q[1])*180/Math.PI;M.wind=((Math.round(a/45)*45)%360+360)%360;drag.el.querySelector('.warrow').setAttribute('transform',`rotate(${M.wind})`);return;}
    const q=svgPt(ev);const p=[Math.max(4,Math.min(RPROJ.W-4,q[0]+drag.ox)),Math.max(30,Math.min(RPROJ.H-4,q[1]+drag.oy))];
    if(drag.id==='flag')M.flag=p;else M.pins[drag.id]=p;drag.el.setAttribute('transform',`translate(${p[0].toFixed(1)},${p[1].toFixed(1)})`);});
  const end=ev=>{if(!drag)return;const d=drag;drag=null;d.el.classList.remove('drag');
    if(d.rot&&!d.moved){turnWind(45);return;}
    if(d.moved){mSave();renderPins();renderCards();}else highlight(d.id);};
  svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
  svg.addEventListener('keydown',ev=>{const pin=ev.target.closest('.pin');if(!pin)return;const id=pin.dataset.id;
    const st=ev.shiftKey?30:8;const mv={ArrowLeft:[-st,0],ArrowRight:[st,0],ArrowUp:[0,-st],ArrowDown:[0,st]}[ev.key];
    if(mv){ev.preventDefault();const cur=id==='flag'?M.flag:M.pins[id];place(id,[cur[0]+mv[0],cur[1]+mv[1]]);document.querySelector(`#rpins .pin[data-id="${id}"]`)?.focus();}
    else if(id==='orkan'&&(ev.key==='r'||ev.key==='R')){ev.preventDefault();turnWind(ev.key==='R'?-45:45);document.querySelector('#rpins .pin[data-id="orkan"]')?.focus();}
    else if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();highlight(id);}});
  document.getElementById('rcards').addEventListener('click',ev=>{
    const bk=ev.target.closest('.rback');if(bk){openCard(bk.dataset.id);return;}
    const rb=ev.target.closest('.rrot');if(rb){turnWind(+rb.dataset.d);return;}
    const pb=ev.target.closest('.rpick');if(pb){const id=pb.dataset.id;setPick(M.pick===id?null:id);return;}
    const fb=ev.target.closest('.rfake');if(fb){const id=fb.dataset.id;if(M.fake[id])delete M.fake[id];else{M.fake[id]=true;delete M.pins[id];delete M.bg[id];if(M.pick===id)setPick(null);}mSave();renderPins();renderCards();afterAnswer(id);return;}
    const bb=ev.target.closest('.rbg');if(bb){const id=bb.dataset.id;if(M.bg[id])delete M.bg[id];else{M.bg[id]=true;delete M.pins[id];delete M.fake[id];if(M.pick===id)setPick(null);}mSave();renderPins();renderCards();afterAnswer(id);}});
  document.getElementById('rcards').addEventListener('keydown',ev=>{const bk=ev.target.closest('.rback');if(bk&&(ev.key==='Enter'||ev.key===' ')){ev.preventDefault();openCard(bk.dataset.id);}});
  document.getElementById('rcards').addEventListener('change',ev=>{const s=ev.target.closest('.rcell');if(!s)return;const id=s.dataset.id;
    if(!s.value){delete M.pins[id];mSave();renderPins();renderCards();return;}place(id,cellCenter(s.value,RC[id].n));afterAnswer(id);});
  document.getElementById('rflag').addEventListener('click',()=>setPick(M.pick==='flag'?null:'flag'));
  document.getElementById('rzonebtn').addEventListener('click',ev=>{M.zones=!M.zones;ev.currentTarget.setAttribute('aria-pressed',M.zones);ev.currentTarget.textContent=M.zones?'Lösungsbereiche ausblenden':'Lösungsbereiche zeigen';renderZones();});
  addEventListener('keydown',ev=>{if(ev.key==='Escape'&&M.pick)setPick(null);});
  document.getElementById('mcheck').addEventListener('click',checkNet);
  document.getElementById('mopen').addEventListener('click',tryGate);
  document.getElementById('mteach').addEventListener('click',tryTeacher);
  document.getElementById('mcode').addEventListener('keydown',ev=>{if(ev.key==='Enter'){ev.preventDefault();tryTeacher();}});
}
/* Fortschritt der Spurenkarte: neun Spuren, ab sechs geht es weiter zum Wirkungsgefüge */
const GATE=6;
function bar(id,found,label){const n=found.filter(Boolean).length,el=document.getElementById(id);
  el.innerHTML=found.map(f=>`<i class="${f?'on':''}"></i>`).join('');el.setAttribute('aria-label',`${n} von ${found.length} ${label}`);return n;}
function renderProg(found){const n=bar('rprog',found,'Spuren richtig gedeutet');
  document.getElementById('rprogtxt').textContent=M.phase2?`${n} von 9 Spuren richtig gedeutet. Das Wirkungsgefüge ist freigeschaltet.`:n>=GATE?`${n} von 9 Spuren richtig gedeutet. Das reicht für das Wirkungsgefüge!`:`${n} von 9 Spuren richtig gedeutet. Ab ${GATE} Spuren geht es weiter zum Wirkungsgefüge.`;}
function checkNet(){
  const ev=evalNet();renderProg(ev.found);const mm=document.getElementById('mmsg');mm.textContent='';mm.className='mmsg';
  const fb=[`<b>${ev.n} von 9 Spuren</b> habt ihr richtig gedeutet.`];
  if(ev.shaky.length)fb.push(`${ev.shaky.length} ${ev.shaky.length===1?'Indiz führt':'Indizien führen'} euch auf eine falsche Fährte. Prof. Geo fragt: ${ev.shaky[0].h}`);
  else if(ev.miss.length){const c=ev.miss[0];
    fb.push(M.bg[c.id]?`Indiz ${c.n} hat sehr wohl einen Ort auf der Karte. Prof. Geo fragt: ${c.miss}`:c.wind?`Der Windpfeil der Windrose zeigt noch in die falsche Richtung. Prof. Geo fragt: ${c.miss}`:`${ev.miss.length===1?'Eine Stecknadel steckt':ev.miss.length+' Stecknadeln stecken'} noch am falschen Ort, zum Beispiel Nadel ${c.n}. Prof. Geo fragt: ${c.miss}`);}
  else if(ev.n<9){const I=IDEAS.find((I,i)=>!ev.found[i]&&(I.all?I.c.every(isRev):!I.c||I.c.some(isRev)));
    fb.push(I?`Prof. Geo fragt: ${I.h}`:'Deckt weitere Indizien auf: Beantwortet die offenen Indizien und tippt dann auf eine verdeckte Karte.');}
  if(ev.n===9)fb.push('Alle neun Spuren! Ihr arbeitet wie echte Küstenforscher.');
  if(ev.n>=GATE&&!M.phase2)fb.push('Ihr habt genug Spuren richtig gedeutet. Weiter zum Wirkungsgefüge!');
  document.getElementById('mfb').innerHTML=fb.map(x=>`<p>${x}</p>`).join('');
}
function tryGate(){const ev=evalNet();renderProg(ev.found);const msg=document.getElementById('mmsg');
  if(!M.phase2&&ev.n<GATE){msg.textContent=`Erst ${ev.n} von 9 Spuren sind richtig gedeutet. Ab ${GATE} geht es weiter. Lasst Prof. Geo eure Spurenkarte prüfen.`;msg.className='mmsg bad';return;}
  msg.textContent='';msg.className='mmsg';unlockWG();}
function tryTeacher(){const raw=document.getElementById('mcode').value.toUpperCase().replace(/[^A-ZÄÖÜ0-9]/g,'');const msg=document.getElementById('mmsg');
  if(hash(raw)!==TEACHER){msg.textContent='Dieser Lehrkraft-Code passt nicht.';msg.className='mmsg bad';return;}
  msg.textContent='Lehrkraft-Zugang: Alle Indizien sind aufgedeckt, das Wirkungsgefüge ist frei, die Musterlösung lässt sich einblenden.';msg.className='mmsg';
  M.open=[...M.open,...M.deck.filter(id=>!M.open.includes(id))];M.solved=true;M.teacher=true;renderCards();updateSolved();unlockWG();}
function ovOpen(html,focusId){const ov=document.getElementById('ov');ov.innerHTML=html;ov.hidden=false;document.body.style.overflow='hidden';ov.scrollTop=0;
  ov.onkeydown=e=>{if(e.key==='Escape')ovClose();};setTimeout(()=>document.getElementById(focusId)?.focus({preventScroll:true}),50);}
function ovClose(){const ov=document.getElementById('ov');if(ov.hidden)return;ov.hidden=true;ov.innerHTML='';document.body.style.overflow='';document.getElementById('wsubmit').focus({preventScroll:true});}
function showFinal(){
  ovOpen(`<div class="comic door"><div class="ctitle"><h2 id="ovt">Rätsel gelöst!</h2><div class="narr">Wirkungsgefüge und Lösungssatz stimmen</div></div>
    <div class="dwrap"><svg viewBox="0 0 220 200" class="dsvg" aria-hidden="true"><g class="burst" style="--i:0"><polygon points="${star(110,100,96,62,16)}" fill="#8CCBF5" stroke="#1B1B2F" stroke-width="3"/></g><path d="M0 170c30-8 60 0 110-4s80-8 110 0V200H0Z" fill="#EAD9A8" stroke="#1B1B2F" stroke-width="3" stroke-linejoin="round"/><path d="M14 186c6-3 12 3 18 0s12-3 18 0M168 184c6-3 12 3 18 0" fill="none" stroke="#B89A5B" stroke-width="2.5" stroke-linecap="round"/><use href="#i-geo-watt" x="40" y="30" width="140" height="150"/></svg>
    <div class="dtext"><p><b>Stark gelöst!</b> Rungholt lag im heutigen Watt bei der Hallig Südfall, südöstlich von Pellworm. Dort fanden Forschende Schleusen, Brunnen, einen Seedeich mit Hafen und 2023 die Hauptkirche.</p>
    <p>Euer Wirkungsgefüge zeigt: Der Orkan vom 16. Januar 1362 war die <b>Naturgefahr</b>, er trieb die Sturmflut auf. Zur Katastrophe wurde er, weil das Land <b>verwundbar</b> war: Für den Salzhandel gruben die Menschen Torf ab, Gräben ließen das Moor sacken, das Land lag tiefer. Die Deiche waren schwach, und mit jeder Flut fraßen sich die Priele tiefer ins Land, ein Teufelskreis. Die Flut heißt bis heute „Grote Mandrenke“, das große Ertrinken.</p>
    <p class="today"><b>Und heute?</b> Heute steigt das Meer schneller als im Mittelalter. Darum wachsen die Deiche an der Nordsee: Aus Rungholt haben die Menschen gelernt, ihre Küste weniger verwundbar zu machen.</p></div></div>
    <div class="csum" style="--n:1"><div class="m"><div>Das Rätsel von Rungholt ist <span>gelöst.</span></div></div><div class="cbtns"><button class="go" id="ovclose" type="button">Zurück zum Wirkungsgefüge</button></div></div></div>`,'ovclose');
  document.getElementById('ovclose').addEventListener('click',ovClose);
}
function updateSolved(){document.getElementById('rzonebtn').hidden=!M.solved;if(!M.solved&&M.zones){M.zones=false;renderZones();}
  document.getElementById('rwg').hidden=!M.phase2;document.getElementById('wsol').hidden=!M.teacher;
  document.getElementById('mopen').textContent=M.phase2?'Zum Wirkungsgefüge':'Weiter zum Wirkungsgefüge';}

/* ===================== Phase 2: Wirkungsgefüge ===================== */
/* Zustandskarten gibt es nur hier; sie verlangen die Zwischenschritte von den Ursachen bis zum Untergang */
const WSTATE=[
 {id:'hoehe',s:'pedo',t:'Höhe des Landes',k:'Wie hoch liegt die Marsch über dem Meer?'},
 {id:'flut',s:'hydro',t:'Wasserstand der Sturmflut',k:'Wie hoch steigt das Wasser am 16. Januar 1362 vor der Küste?'},
 {id:'bruch',s:'mensch',t:'Deichbrüche',k:'Das Wasser läuft über die Deiche und reißt sie auf.'},
 {id:'untergang',s:'mensch',t:'Untergang Rungholts',k:'Rungholt versinkt, das Land wird zu Watt.'}];
const WKURZ={handel:'Rungholt handelt mit Salz und wird reich.',salz:'Salztorf wird abgegraben und verbrannt.',graeben:'Gräben entwässern das Moor, der Torf sackt zusammen.',deiche:'Die Deiche sind niedrig und schlecht gepflegt.',priele:'Deiche engen das Wasser ein, die Priele werden tiefer.',orkan:'Orkan aus Nordwest am 16. Januar 1362.',meer:'Der Meeresspiegel steigt langsam.',fluten:'Jede Sturmflut reißt Land weg.',beben:'Leonie: Ein Erdbeben ließ Rungholt versinken.',burchardi:'1634 zerreißt eine Sturmflut die Insel Strand.',heute:'Heute steigt das Meer fast 5 mm pro Jahr.'};
const WKIND={orkan:'nat',meer:'nat',fluten:'nat',handel:'vul',salz:'vul',graeben:'vul',deiche:'vul',priele:'vul'};
const WCAUSE=['handel','salz','graeben','deiche','priele','orkan','meer','fluten'];
const WORDER=['handel','orkan','hoehe','graeben','deiche','flut','salz','meer','bruch','priele','fluten','untergang','beben','burchardi','heute'];
const WN=id=>WSTATE.find(x=>x.id===id)||RC[id];
/* auf dem Brett: Ursachen, Zustände und falsche Spuren, die die Gruppe nicht aussortiert hat */
const wNodes=()=>WORDER.filter(id=>WCAUSE.includes(id)||WSTATE.some(x=>x.id===id)||(RC[id]&&RC[id].fake&&isRev(id)&&!M.fake[id]));
/* e: [Ursache, Wirkung, Vorzeichen]; +1 je mehr, desto mehr; -1 je mehr, desto weniger */
const WIDEAS=[
 {n:'Salz bringt Geld, also wird Torf abgebaut',e:[['handel','salz',1],['salz','handel',1]],h:'Warum gruben die Rungholter überhaupt Torf ab?'},
 {n:'Torfabbau senkt das Land',e:[['salz','hoehe',-1]],h:'Was passiert mit der Höhe des Landes, wenn Torf abgegraben wird?'},
 {n:'Entwässerung senkt das Land',e:[['graeben','hoehe',-1]],h:'Was passiert mit der Höhe des Landes, wenn das Moor entwässert wird?'},
 {n:'Der Orkan treibt die Sturmflut auf',e:[['orkan','flut',1]],h:'Was macht der Orkan mit dem Wasserstand vor der Küste?'},
 {n:'Der Meeresspiegel hebt den Ausgangswasserstand',e:[['meer','flut',1]],h:'Von welchem Wasserstand startet die Sturmflut?'},
 {n:'Die Sturmflut bricht die Deiche',e:[['flut','bruch',1]],h:'Was passiert mit den Deichen, wenn das Wasser sehr hoch steigt?'},
 {n:'Schwache Deiche brechen leichter',e:[['deiche','bruch',1]],h:'Welche Rolle spielen die schwachen Deiche?'},
 {n:'Tiefes Land läuft voll',e:[['hoehe','untergang',-1],['hoehe','bruch',-1]],h:'Warum ist es so schlimm, wenn das Land tief liegt?'},
 {n:'Deichbrüche besiegeln den Untergang',e:[['bruch','untergang',1]],h:'Was folgt, wenn die Deiche brechen?'},
 {n:'Ein Teufelskreis',cyc:['fluten','priele'],h:'Jede Flut macht die nächste schlimmer. Findet ihr einen Kreislauf? Ein Pfeil darf auch zurückführen.'},
];
const WGATE=7;
const WSOL=[['handel','salz',1],['salz','hoehe',-1],['graeben','hoehe',-1],['orkan','flut',1],['meer','flut',1],['flut','bruch',1],['deiche','bruch',1],['hoehe','untergang',-1],['bruch','untergang',1],['deiche','priele',1],['priele','fluten',1],['fluten','priele',1],['fluten','hoehe',-1]];
const W={src:null,BW:1200,BH:640,s:1,built:false};
const wHas=(a,b)=>M.wedges.some(e=>e[0]===a&&e[1]===b);
function wCycle(starts){const adj={};for(const [a,b] of M.wedges)(adj[a]=adj[a]||[]).push(b);
  return starts.some(st=>{const seen=new Set();const stack=[...(adj[st]||[])];while(stack.length){const n=stack.pop();if(n===st)return true;if(seen.has(n))continue;seen.add(n);stack.push(...(adj[n]||[]));}return false;});}
function wEval(){const nodes=wNodes();const E=M.wedges.filter(([a,b])=>nodes.includes(a)&&nodes.includes(b));
  const found=WIDEAS.map(I=>I.cyc?wCycle(I.cyc):I.e.some(([a,b])=>E.some(e=>e[0]===a&&e[1]===b)));
  const fwd=(a,b)=>WIDEAS.some(I=>I.e&&I.e.some(([x,y])=>x===a&&y===b))||WSOL.some(([x,y])=>x===a&&y===b);
  const shaky=[];
  for(const [a,b] of E){const A=WN(a),B=WN(b);
    if(A.fake||B.fake){const F=A.fake?A:B;shaky.push(`„${F.t}“ gehört nicht in die Kette. ${F.h}`);continue;}
    if(['handel','salz','graeben','orkan','meer'].includes(a)&&b==='untergang')shaky.push(`„${A.t}“ führt nicht direkt zum Untergang. Was liegt dazwischen? Nutzt die Zustandskarten.`);
    else if(a==='orkan'&&b==='hoehe')shaky.push('Senkt der Orkan das Land? Prüft, was der Sturm wirklich verändert.');
    else if(a==='untergang')shaky.push('Der Untergang ist das Ende der Kette. Prüft die Pfeilrichtung: Was ist Ursache, was Wirkung?');
    else if(fwd(b,a)&&!fwd(a,b))shaky.push(`Prüft die Richtung bei „${A.t} → ${B.t}“: Was ist Ursache, was Wirkung?`);}
  /* Je-desto: Vorzeichen der erwarteten Pfeile */
  const want={};for(const I of WIDEAS)if(I.e)for(const [a,b,sg] of I.e)want[a+'>'+b]=sg;for(const [a,b,sg] of WSOL)want[a+'>'+b]=sg;
  const signed=E.filter(e=>want[e[0]+'>'+e[1]]!==undefined);const right=signed.filter(e=>e[2]===want[e[0]+'>'+e[1]]);
  const wrongS=signed.filter(e=>e[2]&&e[2]!==want[e[0]+'>'+e[1]]);const open=signed.filter(e=>!e[2]);
  return {found,n:found.filter(Boolean).length,shaky,signed,right,wrongS,open};}
function buildWG(){
  const board=document.getElementById('board');
  board.querySelectorAll('.mcard').forEach(e=>e.remove());
  const kind=id=>WSTATE.some(x=>x.id===id)?'zus':WKIND[id]||'fake';
  board.insertAdjacentHTML('beforeend',wNodes().map(id=>{const c=WN(id);const [sn,col,dark]=MSPH[c.s];const k=kind(id);
    return `<div class="mcard wcard w-${k}" id="mc-${id}" data-id="${id}" tabindex="0" role="group" aria-label="Karte: ${c.t}">
    <div class="band ${dark?'dark':''}" style="background:${col}"><span>${sn}</span><span>${k==='zus'?'Zustand':k==='nat'?'Naturgefahr':k==='vul'?'vom Menschen':'Indiz '+c.n}</span></div><h4>${c.t}</h4><p>${WKURZ[id]||c.k||''}</p>
    <button class="cbtn" type="button" aria-label="Pfeil von „${c.t}“ ziehen" title="Pfeil zu einer anderen Karte ziehen">➜</button></div>`;}).join(''));
  const opts=wNodes().map(id=>`<option value="${id}">${WN(id).t}</option>`).join('');
  document.getElementById('mfrom').innerHTML='<option value="">Ursache …</option>'+opts;
  document.getElementById('mto').innerHTML='<option value="">Wirkung …</option>'+opts;
  for(const S of SENT){const sel=document.getElementById(S.id);sel.innerHTML='<option value="">… bitte wählen …</option>'+S.o.map(([v,t])=>`<option value="${v}">${t}</option>`).join('');sel.value=M.sent[S.id]||'';}
  document.getElementById('wsign').checked=M.wsign;document.getElementById('wsigninfo').hidden=!M.wsign;
  if(!W.built){wWire();W.built=true;}
  if(M.phase2)requestAnimationFrame(()=>{wLayout();wRender();});
  wProg(wEval().found);}
function wProg(found){bar('wprog',found,'Kernideen im Wirkungsgefüge');}
function unlockWG(){M.phase2=true;mSave();updateSolved();renderProg(evalNet().found);buildWG();
  setTimeout(()=>document.getElementById('rwg').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'}),60);}
function wLayout(){
  const board=document.getElementById('board');const ids=wNodes();const cols=6,cw=180,gx=196,x0=16,y0=16,gy=26;
  let y=y0,rowH=0;const pos=[];
  ids.forEach((id,i)=>{const col=i%cols;if(col===0&&i){y+=rowH+gy;rowH=0;}rowH=Math.max(rowH,document.getElementById('mc-'+id).offsetHeight);pos.push([id,x0+col*gx,y]);});
  if(!rowH)return;
  W.BH=Math.max(520,y+rowH+y0+40);
  for(const [id,x,yy] of pos){if(!M.wpos[id])M.wpos[id]=[x,yy];}
  W.BH=Math.max(W.BH,...ids.map(id=>M.wpos[id][1]+document.getElementById('mc-'+id).offsetHeight+y0)); // Platz für verschobene Karten
  for(const id of ids){const p=M.wpos[id];p[0]=clamp(p[0],0,W.BW-cw);p[1]=clamp(p[1],0,W.BH-40);wPlace(id);}
  board.style.width=W.BW+'px';board.style.height=W.BH+'px';
  const w=document.getElementById('wires');w.setAttribute('viewBox',`0 0 ${W.BW} ${W.BH}`);w.setAttribute('width',W.BW);w.setAttribute('height',W.BH);
  wFit();}
function wPlace(id){const e=document.getElementById('mc-'+id),p=M.wpos[id];if(!e||!p)return;e.style.left=p[0]+'px';e.style.top=p[1]+'px';}
function wFit(){const wrap=document.getElementById('boardwrap');const board=document.getElementById('board');if(!wrap.clientWidth)return;
  W.s=Math.min(1,wrap.clientWidth/W.BW);if(W.s<0.62)W.s=0.62;board.style.transform=`scale(${W.s})`;wrap.style.height=Math.ceil(W.BH*W.s)+'px';wrap.classList.toggle('scroll',W.s===0.62&&wrap.clientWidth<W.BW*0.62);}
function wSetSrc(id){W.src=id;document.querySelectorAll('#board .mcard').forEach(c=>c.classList.toggle('src',c.dataset.id===id));document.getElementById('board').classList.toggle('connecting',!!id);
  document.getElementById('wmode').textContent=id?`Pfeil von „${WN(id).t}“: Tippt jetzt auf die Karte, auf die sie wirkt. (Esc bricht ab)`:'';}
function wAdd(a,b){if(!a||!b||a===b||wHas(a,b))return;M.wedges.push([a,b,0]);mSave();wRender();}
function wDel(a,b){M.wedges=M.wedges.filter(e=>!(e[0]===a&&e[1]===b));mSave();wRender();}
function wSign(a,b){const e=M.wedges.find(e=>e[0]===a&&e[1]===b);if(!e)return;e[2]=e[2]===0?1:e[2]===1?-1:0;mSave();wRender();}
const SG=v=>v===1?'+':v===-1?'–':'?';
function wWire(){
  const board=document.getElementById('board');let drag=null;
  board.addEventListener('pointerdown',ev=>{const card=ev.target.closest('.mcard');
    if(ev.target.closest('.cbtn')||ev.target.closest('.wdel')||ev.target.closest('.wsg'))return;
    if(!card){if(W.src)wSetSrc(null);return;}
    const id=card.dataset.id;
    if(W.src&&W.src!==id){wAdd(W.src,id);wSetSrc(null);ev.preventDefault();return;}
    drag={id,sx:ev.clientX,sy:ev.clientY,ox:M.wpos[id][0],oy:M.wpos[id][1],moved:false,pid:ev.pointerId};card.setPointerCapture(ev.pointerId);card.classList.add('drag');});
  board.addEventListener('pointermove',ev=>{if(!drag||ev.pointerId!==drag.pid)return;const dx=(ev.clientX-drag.sx)/W.s,dy=(ev.clientY-drag.sy)/W.s;if(Math.abs(dx)+Math.abs(dy)>3)drag.moved=true;
    const e=document.getElementById('mc-'+drag.id);M.wpos[drag.id]=[clamp(drag.ox+dx,0,W.BW-e.offsetWidth),clamp(drag.oy+dy,0,W.BH-e.offsetHeight)];wPlace(drag.id);wRender(true);});
  const end=()=>{if(!drag)return;document.getElementById('mc-'+drag.id).classList.remove('drag');if(drag.moved)mSave();drag=null;};
  board.addEventListener('pointerup',end);board.addEventListener('pointercancel',end);
  board.addEventListener('click',ev=>{const b=ev.target.closest('.cbtn');if(b){const id=b.closest('.mcard').dataset.id;if(W.src===id)wSetSrc(null);else if(W.src){wAdd(W.src,id);wSetSrc(null);}else wSetSrc(id);return;}
    const d=ev.target.closest('.wdel');if(d){wDel(d.dataset.a,d.dataset.b);return;}
    const g=ev.target.closest('.wsg');if(g)wSign(g.dataset.a,g.dataset.b);});
  board.addEventListener('keydown',ev=>{const card=ev.target.closest('.mcard');if(!card||ev.target.closest('.cbtn'))return;const id=card.dataset.id;
    if((ev.key==='Enter'||ev.key===' ')&&W.src&&W.src!==id){ev.preventDefault();wAdd(W.src,id);wSetSrc(null);return;}
    const mv={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]}[ev.key];
    if(mv){ev.preventDefault();M.wpos[id]=[clamp(M.wpos[id][0]+mv[0],0,W.BW-card.offsetWidth),clamp(M.wpos[id][1]+mv[1],0,W.BH-card.offsetHeight)];wPlace(id);wRender(true);mSave();}});
  addEventListener('keydown',ev=>{if(ev.key==='Escape'&&W.src)wSetSrc(null);});
  addEventListener('resize',wFit);
  document.getElementById('madd').addEventListener('click',()=>wAdd(document.getElementById('mfrom').value,document.getElementById('mto').value));
  document.getElementById('mlist').addEventListener('click',ev=>{const b=ev.target.closest('button[data-a]');if(!b)return;if(b.dataset.act==='sign')wSign(b.dataset.a,b.dataset.b);else wDel(b.dataset.a,b.dataset.b);});
  document.getElementById('wreset').addEventListener('click',()=>{M.wpos={};wLayout();mSave();wRender();});
  document.getElementById('wsign').addEventListener('change',ev=>{M.wsign=ev.target.checked;document.getElementById('wsigninfo').hidden=!M.wsign;mSave();wRender();});
  document.getElementById('wcheck').addEventListener('click',wCheck);
  document.getElementById('wsubmit').addEventListener('click',wSubmit);
  for(const S of SENT)document.getElementById(S.id).addEventListener('change',ev=>{M.sent[S.id]=ev.target.value;mSave();});
  let solArm=0;document.getElementById('wsol').addEventListener('click',ev=>{const b=ev.currentTarget;
    if(!solArm){b.textContent='Eigene Pfeile ersetzen?';b.classList.add('warn');solArm=setTimeout(()=>{solArm=0;b.textContent='Musterlösung zeigen';b.classList.remove('warn');},5000);return;}
    clearTimeout(solArm);solArm=0;b.textContent='Musterlösung zeigen';b.classList.remove('warn');M.wedges=WSOL.map(e=>e.slice());M.wsign=true;document.getElementById('wsign').checked=true;document.getElementById('wsigninfo').hidden=false;mSave();wRender();});
}
let wRaf=0;
function wRender(fast){cancelAnimationFrame(wRaf);wRaf=requestAnimationFrame(()=>{
  const svg=document.getElementById('wires');const nodes=wNodes();let h='<defs><marker id="mw-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1B1B2F"/></marker></defs>';
  const box=id=>{const e=document.getElementById('mc-'+id),p=M.wpos[id];return {x:p[0],y:p[1],w:e.offsetWidth,h:e.offsetHeight};};
  const edge=(b,dx,dy,pad)=>{const cx=b.x+b.w/2,cy=b.y+b.h/2;const t=Math.min(dx?(b.w/2+pad)/Math.abs(dx):1e9,dy?(b.h/2+pad)/Math.abs(dy):1e9);return [cx+dx*t,cy+dy*t];};
  for(const [a,b,sg] of M.wedges){if(!nodes.includes(a)||!nodes.includes(b)||!M.wpos[a]||!M.wpos[b])continue;const A=box(a),B=box(b);let dx=(B.x+B.w/2)-(A.x+A.w/2),dy=(B.y+B.h/2)-(A.y+A.h/2);const len=Math.hypot(dx,dy)||1;
    const off=wHas(b,a)?7:0,nx=-dy/len*off,ny=dx/len*off;const [x1,y1]=edge(A,dx,dy,2),[x2,y2]=edge(B,-dx,-dy,6);const p1=[x1+nx,y1+ny],p2=[x2+nx,y2+ny];
    const at=t=>[p1[0]+(p2[0]-p1[0])*t,p1[1]+(p2[1]-p1[1])*t];const [dxm,dym]=at(.62),[sx,sy]=at(.38);
    h+=`<line class="wire${M.wsign&&sg===-1?' neg':''}" x1="${p1[0]}" y1="${p1[1]}" x2="${p2[0]}" y2="${p2[1]}" marker-end="url(#mw-arrow)"/>`
     +(M.wsign?`<g class="wsg s${sg}" data-a="${a}" data-b="${b}" transform="translate(${sx},${sy})"><title>Je-desto-Zeichen ändern</title><circle r="12"/><text y="5">${SG(sg)}</text></g>`:'')
     +`<g class="wdel" data-a="${a}" data-b="${b}" transform="translate(${dxm},${dym})"><title>Pfeil löschen</title><circle r="10"/><path d="M-4,-4 4,4M4,-4 -4,4"/></g>`;}
  svg.innerHTML=h;
  if(fast)return;
  const ul=document.getElementById('mlist');const E=M.wedges.filter(([a,b])=>nodes.includes(a)&&nodes.includes(b));
  ul.innerHTML=E.length?E.map(([a,b,sg])=>`<li><span>${WN(a).t} <b>→</b> ${WN(b).t}</span><span class="wbtns">${M.wsign?`<button type="button" class="ghost sm" data-act="sign" data-a="${a}" data-b="${b}" aria-label="Je-desto-Zeichen von ${WN(a).t} nach ${WN(b).t} ändern, jetzt ${SG(sg)}">${SG(sg)}</button>`:''}<button type="button" class="ghost sm" data-a="${a}" data-b="${b}" aria-label="Pfeil von ${WN(a).t} nach ${WN(b).t} löschen">Löschen</button></span></li>`).join(''):'<li class="muted">Noch keine Pfeile. Fangt mit einer Ursache an, die ihr sicher kennt.</li>';
  document.getElementById('mcount').textContent=E.length;});}
function wCheck(){const ev=wEval();wProg(ev.found);const m=document.getElementById('wmsg');m.textContent='';m.className='mmsg';
  const fb=[`<b>${ev.n} von 10 Kernideen</b> stecken in eurem Wirkungsgefüge.`];
  if(ev.shaky.length)fb.push(`${ev.shaky.length} ${ev.shaky.length===1?'Pfeil steht':'Pfeile stehen'} auf wackeligen Füßen. Prof. Geo fragt: ${ev.shaky[0]}`);
  else if(ev.n<10){const i=ev.found.indexOf(false);fb.push(`Prof. Geo fragt: ${WIDEAS[i].h}`);}
  if(M.wsign&&ev.signed.length){if(ev.wrongS.length){const [a,b]=ev.wrongS[0];fb.push(`Je-desto: ${ev.right.length} von ${ev.signed.length} Zeichen stimmen. Prüft „${WN(a).t} → ${WN(b).t}“: Je mehr …, desto mehr oder desto weniger …?`);}
    else if(ev.open.length)fb.push(`Je-desto: ${ev.right.length} Zeichen stimmen, ${ev.open.length} ${ev.open.length===1?'Pfeil hat':'Pfeile haben'} noch ein „?“.`);
    else fb.push(`Je-desto: Alle ${ev.right.length} Zeichen stimmen. Profi-Arbeit!`);}
  if(ev.n===10)fb.push('Alle zehn Kernideen! Ihr denkt wie echte Systemforscher.');
  else if(ev.n>=WGATE)fb.push('Das reicht für den Lösungssatz. Fehlende Kernideen könnt ihr noch ergänzen.');
  document.getElementById('wfb').innerHTML=fb.map(x=>`<p>${x}</p>`).join('');}
function wSubmit(){const ev=wEval();wProg(ev.found);const m=document.getElementById('wmsg');
  if(ev.n<WGATE){m.textContent=`Prof. Geo möchte mindestens ${WGATE} Kernideen im Wirkungsgefüge sehen (bisher ${ev.n}). Lasst es prüfen.`;m.className='mmsg bad';return;}
  const wrong=SENT.filter(S=>document.getElementById(S.id).value!==S.ok).length;
  if(wrong){m.textContent=`Im Lösungssatz ${wrong===1?'passt eine Lücke':'passen '+wrong+' Lücken'} noch nicht. Schaut auf eure Spurenkarte und euer Wirkungsgefüge.`;m.className='mmsg bad';return;}
  m.textContent='';m.className='mmsg';M.solved=true;mSave();updateSolved();showFinal();}
/* „Neu beginnen“: zweistufig, damit niemand aus Versehen die Karte einer Gruppe löscht */
let resetArm=0;
function resetMystery(ev){const b=ev.currentTarget;
  const disarm=()=>{clearTimeout(resetArm);resetArm=0;b.textContent='Neu beginnen';b.classList.remove('warn');};
  if(!resetArm){b.textContent='Wirklich alles löschen?';b.classList.add('warn');resetArm=setTimeout(disarm,5000);return;}
  disarm();
  M.pins={};M.flag=null;M.fake={};M.bg={};M.sent={};M.solved=false;M.phase2=false;M.teacher=false;M.wind=0;M.wpos={};M.wedges=[];M.wsign=false;M.zones=false;M.deck=[];M.open=[];ensureDeck();mSave();document.getElementById('rkmsg').textContent='';wSetSrc(null);document.getElementById('wfb').innerHTML='';document.getElementById('wmsg').textContent='';
  document.getElementById('mcode').value='';const mm=document.getElementById('mmsg');mm.textContent='';mm.className='mmsg';
  document.getElementById('mfb').innerHTML='';const zb=document.getElementById('rzonebtn');zb.textContent='Lösungsbereiche zeigen';zb.setAttribute('aria-pressed','false');
  setPick(null);renderPins();renderCards();renderProg(evalNet().found);updateSolved();buildWG();window.scrollTo(0,0);
}

/* ===================== Start ===================== */
mLoad();ensureDeck();buildMystery();
document.getElementById('mnew').addEventListener('click',resetMystery);
