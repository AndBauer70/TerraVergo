/* ===================== Wechselwirkungen: Zustand, Darstellung, Animation, Kettenreaktion =====================
   Gemeinsam für Weltkarte (#map) und 3D-Globus (#globe). Jede Verbindung ist ein <path class="link" data-i>.
   Sichtbarkeit: on = gehört zum gewählten Element oder ist die gewählte Verbindung; cas = Kettenreaktion (2./3. Stufe);
   act = Auslöser ist gerade stark (wirkt gerade); wave = gerade laufende Stufe der Kettenreaktion. */
const LSIGN={'1':'pos','-1':'neg','0':'amb'};
const SIGNTXT={'1':'verstärkt','-1':'bremst','0':'unklar: kann verstärken oder bremsen'};
const SIGNSHORT={'1':'verstärkt','-1':'bremst','0':'unklar'};
const SIGNSYM={'1':'+','-1':'−','0':'±'};
const LX={sel:-1,cas:null,timers:[],raf:0,vis:{map:true,globe:true}};
const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const nm=k=>k==='ATM'?'Atmosphäre':EK[k].short;

/* Wie stark wirkt der Auslöser gerade? 0 … 1 */
function srcIntensity(k){
  if(!G)return 0;const T=G.T;
  if(k==='ATM')return clamp((T-1.2)/1.8,0,1);
  const e=EK[k];
  if(e.type==='tip')return G.tipped[k]?1:Math.max(G.S[k]/100,T>effTc(k,G)?0.3:0);
  if(e.type==='arctic')return clamp((T-1)/1.5,0,1);
  if(e.type==='enso')return !G.over&&ENSO[G.r]===1?1:0.1;
  if(e.type==='level')return clamp(G.SL/60,0,1);
  if(e.type==='extreme')return clamp((T-1)/1.5,0,1);
  if(e.type==='human')return clamp(humanRisk(G)[k]/100,0,1);
  return 0;
}
/* Wirkt die Verbindung gerade? (Auslöser über seiner Schwelle) */
function srcActive(k){
  if(!G)return false;const T=G.T;
  if(k==='ATM')return T>=2;
  const e=EK[k];
  if(G.tipped[k])return true;
  if(e.type==='tip')return (G.S[k]||0)>=25;
  if(e.type==='level')return G.SL>=10;
  if(e.type==='arctic')return T>=1.8;
  if(e.type==='enso')return ENSO[G.r]===1&&!G.over;
  if(e.type==='extreme')return T>=2;
  if(e.type==='human')return humanRisk(G)[k]>=75;
  return false;
}
function linkActive(a,b){return srcActive(a);}
function srcStatus(k){
  if(k==='ATM')return `${fmt(G.T,2)} °C Erwärmung${G.T>=2?' (stark)':''}`;
  const s=elState(k);return `${EK[k].short}: ${s.lbl}`;
}

/* Kettenreaktion: Verbindungen stromabwärts, Stufe für Stufe. Über die Atmosphäre wird nur weitergegangen, wenn sie selbst gewählt ist. */
function cascadeLevels(k,maxD=3){
  const lv=[],used=new Set(),seen=new Set([k]);let front=[k],viaAtm=false;
  for(let d=0;d<maxD;d++){const ids=[],next=[];
    for(const f of front){if(f==='ATM'&&k!=='ATM'){viaAtm=true;continue;}
      LINKS.forEach((l,i)=>{if(l[0]===f&&!used.has(i)){used.add(i);ids.push(i);if(!seen.has(l[1])){seen.add(l[1]);next.push(l[1]);}}});}
    if(!ids.length)break;lv.push(ids);front=next;}
  if(front.includes('ATM')&&k!=='ATM')viaAtm=true;
  return {lv,viaAtm};
}
/* Rückkopplungsschleifen durch k (Länge 2 und 3, nicht über die Atmosphäre) */
function loopsOf(k){
  const out=[],seen=new Set();
  LINKS.forEach((l,i)=>{if(l[0]!==k||l[1]==='ATM')return;const b=l[1];
    LINKS.forEach((m,j)=>{if(m[0]!==b)return;
      if(m[1]===k){const key=[i,j].sort().join();if(!seen.has(key)){seen.add(key);out.push([i,j]);}}
      else if(m[1]!=='ATM')LINKS.forEach((n,h)=>{if(n[0]===m[1]&&n[1]===k){const key=[i,j,h].sort().join();if(!seen.has(key)){seen.add(key);out.push([i,j,h]);}}});});});
  return out;
}
function loopSign(ids){let s=1;for(const i of ids){const v=LINKS[i][3];if(v===0)return 0;s*=v;}return s;}

/* Klassen für alle Verbindungen auf Karte und Globus setzen */
function linkFlags(){
  const on=new Set(),cas=new Set(),wave=new Set();
  if(LX.sel>=0)on.add(LX.sel);
  else LINKS.forEach((l,i)=>{if(l[0]===selected||l[1]===selected)on.add(i);});
  if(LX.cas){LX.cas.lv.forEach((ids,d)=>{if(d<=LX.cas.step)for(const i of ids){if(!on.has(i))cas.add(i);if(d===LX.cas.step&&LX.cas.playing)wave.add(i);}});}
  else if(LX.sel<0){const {lv}=cascadeLevels(selected,2);if(lv[1])for(const i of lv[1])if(!on.has(i))cas.add(i);}
  return {on,cas,wave};
}
function arrowSuffix(i){const l=LINKS[i];return l[3]===-1?'-b':l[3]===0?'-g':srcActive(l[0])?'-r':'';}
function applyLinks(){
  if(!G)return;
  const f=linkFlags();
  for(const id of ['map','globe'])document.getElementById(id)?.classList.toggle('cas-run',!!LX.cas);
  for(const p of document.querySelectorAll('path.link[data-i]')){const i=+p.dataset.i,l=LINKS[i];
    const act=srcActive(l[0]);
    p.classList.toggle('on',f.on.has(i));p.classList.toggle('cas',f.cas.has(i));p.classList.toggle('wave',f.wave.has(i));
    p.classList.toggle('act',act);p.classList.toggle('sel',i===LX.sel);
    if(p.closest('#map')&&p.hasAttribute('marker-end'))p.setAttribute('marker-end',`url(#mk-arrow${arrowSuffix(i)})`);}
  for(const h of document.querySelectorAll('path.lhit[data-i]')){const i=+h.dataset.i,l=LINKS[i];
    h.classList.toggle('vis',f.on.has(i)||f.cas.has(i)||(srcActive(l[0])&&l[0]!=='ATM'&&l[1]!=='ATM'));}
  placeBadges('map');
  if(typeof drawGlobe==='function')drawGlobe();
  pStart();
}

/* Vorzeichen-Plaketten in der Mitte der hervorgehobenen Verbindungen */
function placeBadges(view){
  const svg=document.getElementById(view);if(!svg)return;
  for(const b of svg.querySelectorAll('.lbadge')){const i=+b.dataset.i,p=svg.querySelector(`path.link[data-i="${i}"]`);
    const show=p&&p.classList.contains('on')&&p.getAttribute('d');
    if(!show){b.style.display='none';continue;}
    let len=0;try{len=p.getTotalLength();}catch(e){}
    if(len<40){b.style.display='none';continue;}
    const pt=p.getPointAtLength(len*0.5);b.style.display='';b.setAttribute('transform',`translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)})`);}
}
function makeLinkExtras(svg,linkGroup,before){
  // unsichtbare, breite Klickflächen mit Tooltip, Plaketten und Partikel-Ebene; alles unter den Markern
  const mk=(a)=>{const g=el('g',a,linkGroup.parentNode);linkGroup.parentNode.insertBefore(g,before);return g;};
  const hits=mk({class:'lhits'}),parts=mk({class:'parts','aria-hidden':'true'}),badges=mk({class:'lbadges','aria-hidden':'true'});
  LINKS.forEach((l,i)=>{const h=el('path',{class:'lhit','data-i':i},hits);
    const t=document.createElementNS('http://www.w3.org/2000/svg','title');t.textContent=`${nm(l[0])} → ${nm(l[1])} (${SIGNSHORT[l[3]]}): ${l[2]}`;h.appendChild(t);
    h.addEventListener('click',ev=>{ev.stopPropagation();selectLink(i);});
    const b=el('g',{class:'lbadge '+LSIGN[l[3]],'data-i':i},badges);el('circle',{r:'8.5'},b);txt(b,0,4.3,SIGNSYM[l[3]],{'text-anchor':'middle'});b.style.display='none';});
  return {hits,badges,parts};
}

/* Partikel: kleine Punkte laufen von der Ursache zur Wirkung */
function pCount(p){if(p.classList.contains('wave'))return 4;if(p.classList.contains('on'))return p.classList.contains('act')?3:2;
  if(p.classList.contains('cas'))return 1;if(p.classList.contains('act')&&!p.classList.contains('alink')&&!LX.cas)return 1;return 0;}
function viewVisible(view){if(view==='map')return GL.view==='map'&&LX.vis.map;return GL.view==='globe'&&LX.vis.globe;}
function pStart(){if(reducedMotion()){for(const g of document.querySelectorAll('.parts'))g.innerHTML='';return;}
  if(!LX.raf)LX.raf=requestAnimationFrame(pTick);}
function pTick(now){
  LX.raf=0;if(document.hidden){return;}
  let any=false;
  for(const view of ['map','globe']){const svg=document.getElementById(view);if(!svg)continue;const g=svg.querySelector('.parts');if(!g)continue;
    if(!viewVisible(view)){if(g.childNodes.length)g.innerHTML='';continue;}
    const want=[];
    for(const p of svg.querySelectorAll('path.link[data-i]')){const n=pCount(p);if(!n||!p.getAttribute('d'))continue;want.push([p,n]);}
    let k=0;
    for(const [p,n] of want){let len=p._len;if(view==='globe'||!len){try{len=p.getTotalLength();}catch(e){len=0;}if(view==='map')p._len=len;}
      if(len<12)continue;
      const i=+p.dataset.i,l=LINKS[i],act=p.classList.contains('act'),wave=p.classList.contains('wave');
      const speed=(wave?150:act?85:50)*(0.75+0.5*srcIntensity(l[0]))*(view==='globe'?GL.W/1000:1);
      const cls='pt '+(l[3]===-1?'p-neg':l[3]===0?'p-amb':act||wave?'p-act':'p-pos')+(p.classList.contains('cas')&&!wave?' p-cas':'');
      for(let j=0;j<n;j++){const u=((now/1000)*speed/len+j/n)%1;const pt=p.getPointAtLength(u*len);
        let c=g.childNodes[k];if(!c){c=el('circle',{r:'3.6'},g);}
        c.setAttribute('class',cls);c.setAttribute('cx',pt.x.toFixed(1));c.setAttribute('cy',pt.y.toFixed(1));c.style.opacity=(Math.sin(Math.PI*u)*1.15).toFixed(2);k++;}
      any=true;}
    while(g.childNodes.length>k)g.lastChild.remove();}
  if(any)LX.raf=requestAnimationFrame(pTick);
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&G)pStart();});

/* Auswahl */
function stopCascade(){for(const t of LX.timers)clearTimeout(t);LX.timers=[];LX.cas=null;for(const m of document.querySelectorAll('.mk.ping'))m.classList.remove('ping');}
function selectEl(k){selected=k;LX.sel=-1;stopCascade();renderMap();renderInfo();renderCards();}
function selectLink(i){LX.sel=i;stopCascade();renderMap();renderInfo();
  if(GL.view==='globe'){const l=LINKS[i];const a=l[0]==='ATM'?l[1]:l[0],b=l[1]==='ATM'?l[0]:l[1];
    if(LL[a]&&LL[b]){const m=d3.geoInterpolate(LL[a],LL[b])(0.5);rotateTo([-m[0],clamp(-m[1]*0.85,-80,80)]);}}}
function pingMarkers(keys){for(const k of keys)for(const m of document.querySelectorAll(`.mk[data-k="${k}"]`)){m.classList.remove('ping');void m.getBBox();m.classList.add('ping');
  LX.timers.push(setTimeout(()=>m.classList.remove('ping'),950));}}
function playCascade(k){
  stopCascade();LX.sel=-1;selected=k;
  const {lv,viaAtm}=cascadeLevels(k,3);if(!lv.length)return;
  LX.cas={k,lv,viaAtm,step:0,playing:true};
  const reduced=reducedMotion();
  if(reduced){LX.cas.step=lv.length-1;LX.cas.playing=false;renderMap();renderInfo();return;}
  const STEP=1400;
  lv.forEach((ids,d)=>{LX.timers.push(setTimeout(()=>{if(!LX.cas||LX.cas.k!==k)return;LX.cas.step=d;LX.cas.playing=true;applyLinks();markCasStep(d);
      LX.timers.push(setTimeout(()=>pingMarkers([...new Set(ids.map(i=>LINKS[i][1]))]),STEP*0.55));},d*STEP));});
  LX.timers.push(setTimeout(()=>{if(!LX.cas||LX.cas.k!==k)return;LX.cas.playing=false;applyLinks();markCasStep(-1);},lv.length*STEP+200));
  renderMap();renderInfo();
  if(GL.view==='globe')centerOn(k);
}
function markCasStep(d){for(const li of document.querySelectorAll('#info .casstep'))li.classList.toggle('now',+li.dataset.d===d);}

/* Info-Kasten: Bausteine */
function lkButton(i,dir){const l=LINKS[i],o=dir==='out'?l[1]:l[0],act=srcActive(l[0]);
  return `<button type="button" class="lkb" data-li="${i}"><span class="sg ${LSIGN[l[3]]}" title="${SIGNSHORT[l[3]]}">${SIGNSYM[l[3]]}</span>${ic('i-'+o)}<span><b>${nm(o)}</b>${act?' <i class="wirkt">wirkt gerade</i>':''}<br>${l[2]}</span></button>`;}
function loopsHtml(k){
  const ls=loopsOf(k);if(!ls.length)return '';
  return `<div class="loops"><b class="sm">Rückkopplungen:</b>${ls.map(ids=>{const s=loopSign(ids);const chain=[LINKS[ids[0]][0],...ids.map(i=>LINKS[i][1])].map(nm).join(' → ');
    const kind=s===1?['teufel','↻ verstärkend','Die Elemente schaukeln sich gegenseitig auf (Teufelskreis).']:s===-1?['ausgl','⇆ ausgleichend','Eine Wirkung bremst die andere wieder ab.']:['unkl','? unklar','Die Richtung ist noch nicht sicher bekannt.'];
    return `<div class="loop ${kind[0]}"><span class="lt">${kind[1]}</span> ${chain}<br><span class="sm muted">${kind[2]}</span></div>`;}).join('')}</div>`;
}
function cascadeHtml(k){
  const {lv,viaAtm}=cascadeLevels(k,3);if(!lv.length)return '';
  const running=LX.cas&&LX.cas.k===k;
  let h=`<div class="casbox"><button type="button" class="go casgo" data-cas="${k}">${running?'▶ Kettenreaktion noch einmal':'▶ Kettenreaktion zeigen'}</button>`;
  if(running){const reached=new Set([k]);
    h+=`<ol class="cas">${lv.map((ids,d)=>{const tg=[...new Set(ids.map(i=>LINKS[i][1]))];
      const out=tg.map(t=>reached.has(t)?`<span class="back" title="wirkt zurück auf ein schon erreichtes Element">${nm(t)} ↻</span>`:nm(t)).join(', ');
      for(const t of tg)reached.add(t);
      return `<li class="casstep" data-d="${d}"><b>${d+1}. Stufe:</b> ${out}</li>`;}).join('')}</ol><div class="sm muted">↻ = wirkt auf ein schon erreichtes Element zurück (Rückkopplung).</div>`;
    if(viaAtm)h+=`<div class="sm muted">Über die Atmosphäre wirkt die zusätzliche Erwärmung außerdem auf alle anderen Elemente.</div>`;}
  else h+=`<div class="sm muted">Zeigt Schritt für Schritt, was nacheinander angestoßen wird.</div>`;
  return h+'</div>';
}
function renderLinkInfo(box){
  const i=LX.sel,l=LINKS[i],act=srcActive(l[0]);
  const icon=k=>k==='ATM'?ic('i-ATM'):ic('i-'+k);
  box.innerHTML=`<div class="ih"><div class="ic lkic">${icon(l[0])}<span class="sg big ${LSIGN[l[3]]}">${SIGNSYM[l[3]]}</span>${icon(l[1])}</div><div><h3>Wechselwirkung</h3><div class="place">${nm(l[0])} → ${nm(l[1])}</div></div></div>
    <div class="lkstate"><span class="chip sgnchip ${LSIGN[l[3]]}">${SIGNSYM[l[3]]} ${SIGNSHORT[l[3]]}</span><span class="chip ${act?'bad':'good'}">${act?'wirkt gerade':'ruht noch'}</span></div>
    <div>${l[2]}</div>
    <dl class="facts"><dt>Bedeutung</dt><dd>${l[3]===1?`${nm(l[0])} erhöht den Druck auf ${nm(l[1])}.`:l[3]===-1?`${nm(l[0])} senkt den Druck auf ${nm(l[1])}.`:SIGNTXT['0']+'.'}</dd>
      <dt>Auslöser jetzt</dt><dd>${srcStatus(l[0])}</dd><dt>Vertrauen</dt><dd>${l[4]}</dd>
      <dt>Im Spiel</dt><dd>${l[6]?'wird im Spielmodell gerechnet':'zur Erklärung gezeigt, im Spielmodell nicht eigens gerechnet'}</dd></dl>
    <div class="lknav"><button type="button" class="ghost sm" data-pick="${l[0]}">← ${nm(l[0])}</button><button type="button" class="ghost sm" data-pick="${l[1]}">${nm(l[1])} →</button></div>
    <div class="src">Quelle: ${l[5]}</div>`;
}
function initInfoClicks(){
  document.getElementById('info').addEventListener('click',ev=>{
    const b=ev.target.closest('[data-li]');if(b){selectLink(+b.dataset.li);return;}
    const p=ev.target.closest('[data-pick]');if(p){selectEl(p.dataset.pick);if(GL.view==='globe')centerOn(p.dataset.pick);return;}
    const c=ev.target.closest('[data-cas]');if(c){playCascade(c.dataset.cas);}});
}
function initLinkObservers(){
  if(!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver(es=>{for(const e of es){const v=e.target.id==='mapscroll'?'map':'globe';LX.vis[v]=e.isIntersecting;}pStart();},{threshold:0.01});
  for(const id of ['mapscroll','globebox'])io.observe(document.getElementById(id));
}
