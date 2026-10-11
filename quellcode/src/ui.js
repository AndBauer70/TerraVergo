/* ===================== Zustand ===================== */
let G;
window.claude?.hot?.snapshot?.(()=>({game:G}));
const spent=()=>LEVERS.reduce((a,L)=>a+G.inv[L.k],0);
const ic=(id,style='')=>`<svg aria-hidden="true" ${style?`style="${style}"`:''}><use href="#${id}"/></svg>`;
const STCOL={good:'#1F9D45',mid:'#E8A600',bad:'#E0393B',tip:'#8B1E2D'};
function tippedLabel(k){const y=G.tipped[k];return k==='KR'&&y===2025?'Gekippt (GTPR 2025)':'Gekippt '+y;}
function elState(k){
  const e=EK[k],T=G.T;
  if(e.type==='tip'){if(G.tipped[k])return {st:'tip',lbl:tippedLabel(k),p:100};const p=G.S[k];const ex=T-effTc(k,G);
    return {st:p>=60||ex>0.4?'bad':p>0||ex>0?'mid':'good',lbl:p>=60?'Kritisch':p>0?'Gefahr':ex>0?'Schwelle erreicht':'Sicher',p};}
  if(e.type==='human'){const r=humanRisk(G)[k];if(G.humanCrossed[k]&&r>=100)return {st:'tip',lbl:'Grenze überschritten',p:100};
    return {st:r>=75?'bad':r>=50?'mid':'good',lbl:r>=75?'Kritisch':r>=50?'Belastet':'Im Griff',p:Math.min(100,r)};}
  if(e.type==='level'){const p=Math.min(100,G.SL/0.6);return {st:G.SL>=40?'bad':G.SL>=20?'mid':'good',lbl:`+${fmt(G.SL,0)} cm`,p};}
  if(e.type==='arctic'){const p=clamp((T-1)*100);return T<1.5?{st:'mid',lbl:'Schwindet',p}:T<2?{st:'bad',lbl:'Eisfrei: selten',p}:{st:'bad',lbl:'Eisfrei: oft',p};}
  if(e.type==='enso'){const on=!G.over&&ENSO[G.r]===1;return on?{st:'mid',lbl:'El Niño kommt',p:60}:{st:'good',lbl:'Neutral',p:15};}
  if(e.type==='extreme'){const x=extremeVal(k,T),p=clamp((T-1)/1.5*100);return {st:T<2?'mid':'bad',lbl:T<2?'Nimmt zu':'Stark',p,x};}
}
function nextNino(){for(let i=G.r;i<ROUNDS;i++)if(ENSO[i])return `${YEAR0+DT*i}–${YEAR0+DT*(i+1)}`;return null;}

/* ===================== Kopf ===================== */
function tipText(){
  const n=nTip(G);
  if(G.over){const nh=Object.keys(G.humanCrossed).length;return n+nh?`Die Erde hat Narben bekommen: ${n} weitere ${n===1?'Element':'Elemente'} im Erdsystem gekippt${nh?` und ${nh} beim Menschen`:''}. Schaut in der Fieberkurve nach, wann es passiert ist. Was hättet ihr früher tun können?`:'Großartig! Im Spiel ist kein weiteres Element gekippt. Ihr habt verstanden: Früh handeln wirkt am stärksten!';}
  const nino=ENSO[G.r]===1?' Achtung: In diesen fünf Jahren kommt ein starker El Niño (Spielannahme). Das setzt Korallen und Amazonas zusätzlich unter Stress.':'';
  if(G.r===0)return 'Willkommen im Kontrollraum! Die Erde hat schon rund 1,4 °C Fieber, und die Korallenriffe haben ihren Kipppunkt bereits überschritten. Euer Ziel: bis 2075 kein weiterer Kipppunkt, und die Menschen schützen. Im Stresstest ohne Klimaschutz steigt das Fieber bis 2075 auf rund 3,7 °C. Früh handeln wirkt am stärksten!'+nino;
  let worst=null,wp=-1;for(const k of TIPK){if(G.tipped[k])continue;const v=G.S[k]+(G.T-effTc(k,G))*40;if(v>wp){wp=v;worst=k;}}
  const hr=humanRisk(G);let hk=HUMK.reduce((a,k)=>hr[k]>hr[a]?k:a,HUMK[0]);
  if(hr[hk]>=70)return `${EK[hk].short}: Die Menschen dort kommen an ihre Grenzen (Risiko ${fint(hr[hk])}). Investiert in Anpassung!`+nino;
  if(G.E>15)return `Der Ausstoß liegt noch bei ${fmt(G.E,0)} Gt CO₂ pro Jahr. Solange er nicht bei null ist, steigt die Temperatur weiter. Am meisten in Gefahr: ${EK[worst]?.name??'–'}.`+nino;
  if(worst&&G.S[worst]>0)return `Gut! Der Ausstoß sinkt. Aber ${EK[worst].name} steht unter Druck (${fint(G.S[worst])} von 100). CO₂ aus der Luft holen kann die Temperatur langsam wieder senken.`+nino;
  return 'Stark! Die Erwärmung ist gebremst. Denkt an die Menschen: Der Meeresspiegel steigt trotzdem weiter.'+nino;
}
function renderTop(){
  document.getElementById('tip').innerHTML=`<b class="who">Prof. Geo sagt:</b>${tipText()}`;
  let h='<span class="l">Jahr</span>';
  for(let i=0;i<=ROUNDS;i++){const y=YEAR0+DT*i;let c='';
    if(i<=G.r){const lost=Object.entries(G.tipped).some(([k,v])=>v===y&&!(k==='KR'&&y===2025))||Object.values(G.humanCrossed).includes(y);c=lost?'lost':'done';}
    if(i===G.r&&!G.over)c='now';
    const nino=i<ROUNDS&&ENSO[i]?' nino':'';
    h+=`<i class="${c}${nino}"${nino?` title="El Niño in den Jahren ${y}–${y+5}"`:''}>${y}</i>`;}
  document.getElementById('years').innerHTML=h;
  const T=G.T;
  document.getElementById('tbig').textContent=`${fmt(T,2)} °C`;
  document.getElementById('tnote').textContent=T<1.5?'Unter der 1,5-Grad-Grenze von Paris.':T<2?'Über 1,5 °C, aber unter 2 °C.':'Über der Pariser 2-Grad-Grenze!';
}

/* ===================== Fieberkurve mit Thermometer und Folgekosten ===================== */
const svgNS='http://www.w3.org/2000/svg';
const el=(t,a={},p)=>{const e=document.createElementNS(svgNS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;};
const txt=(p,x,y,s,a={})=>{const t=el('text',{x,y,...a},p);t.textContent=s;return t;};
function star(cx,cy,ro,ri,n){let p=[];for(let i=0;i<n*2;i++){const r=i%2?ri:ro,a=Math.PI*i/n-Math.PI/2;p.push((cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1));}return p.join(' ');}
const FV={L:78,R:640,T0:20,B:292,tmax:4.5,W:720};
function setFeverSize(){const svg=document.getElementById('fever');const w=svg.parentElement.clientWidth||720;const small=w<560;
  FV.W=small?470:720;FV.R=FV.W-80;FV.L=small?82:78;svg.setAttribute('viewBox',`0 0 ${FV.W} 330`);svg.classList.toggle('small',small);}
function feverScales(){
  const {L,R,T0,B,tmax}=FV;
  const cmax=Math.max(40,Math.ceil(Math.max(...REF.path.map(p=>p.cost),...G.hist.map(p=>p.cost))/10)*10);
  return {xs:y=>L+(R-L)*(y-2025)/50,ys:t=>B-(B-T0)*t/tmax,yc:c=>B-(B-T0)*c/cmax,cmax};
}
function renderFever(){
  setFeverSize();const svg=document.getElementById('fever');svg.innerHTML='';
  const {L,R,T0,B,tmax}=FV;const {xs,ys,yc,cmax}=feverScales();const small=FV.W<720;
  // Kipp-Ampel nach IPCC SYR, Longer Report 3.1.3
  for(const [a,b,f,l] of [[1.5,2.5,'#FFF0D2',small?'hohes Risiko':'hohes Kipprisiko'],[2.5,4,'#FFE1DC',small?'sehr hohes Risiko':'sehr hohes Kipprisiko'],[4,tmax,'#FFD0CA','']]){
    el('rect',{x:L,y:ys(b),width:R-L,height:ys(a)-ys(b),fill:f},svg);if(l)txt(svg,L+8,ys(b)+14,l,{class:'band'});}
  for(const t of [0,1,2,3,4])el('line',{x1:L,x2:R,y1:ys(t),y2:ys(t),stroke:t?'#DCE3EC':'#1B1B2F','stroke-width':t?1:2},svg);
  for(const t of [1.5,2])el('line',{x1:L,x2:R,y1:ys(t),y2:ys(t),stroke:'#1F9D45','stroke-width':2,'stroke-dasharray':'2 5'},svg);
  for(const t of [0,1,1.5,2,3,4]){const tx=txt(svg,L-8,ys(t)+4,fmt(t,t%1?1:0)+'°',{'text-anchor':'end'});if(t===1.5||t===2)tx.setAttribute('class','paris');
    el('line',{x1:42,x2:48,y1:ys(t),y2:ys(t),stroke:'#1B1B2F','stroke-width':2},svg);}
  // rechte Achse: Klimaschäden
  el('line',{x1:R+16,x2:R+16,y1:T0,y2:B,stroke:'#1B1B2F','stroke-width':1.5},svg);
  for(let c=0;c<=cmax;c+=10){el('line',{x1:R+16,x2:R+21,y1:yc(c),y2:yc(c),stroke:'#1B1B2F','stroke-width':1.5},svg);txt(svg,R+24,yc(c)+4,fint(c),{'text-anchor':'start'});}
  txt(svg,R+20,T0-8,small?'Bio. $':'Bio. US-$/Jahr',{'text-anchor':'middle',class:'axt'});
  txt(svg,small?10:L-8,T0-8,small?'°C':'°C über 1850–1900',{'text-anchor':'start',class:'axt'});
  for(let y=2025;y<=2075;y+=5){el('line',{x1:xs(y),x2:xs(y),y1:B,y2:B+5,stroke:'#1B1B2F','stroke-width':1.5},svg);if((y-2025)%(small?25:10)===0)txt(svg,xs(y),B+21,y,{'text-anchor':'middle'});}
  // Säulen: Klimaschäden pro Jahr (links: euer Weg, rechts: Stresstest)
  const bw=small?6:9;
  REF.path.forEach(p=>{el('rect',{x:xs(p.year)+1,y:yc(p.cost),width:bw,height:B-yc(p.cost),fill:'#fff',stroke:'#1B1B2F','stroke-width':1.2,'stroke-dasharray':'3 2'},svg);});
  G.hist.forEach(p=>{el('rect',{x:xs(p.year)-bw-1,y:yc(p.cost),width:bw,height:B-yc(p.cost),fill:'#F2A900',stroke:'#1B1B2F','stroke-width':1.2},svg);});
  // Linien
  el('polyline',{points:TPOL.map((t,i)=>`${xs(2025+5*i)},${ys(t)}`).join(' '),fill:'none',stroke:'#7D8597','stroke-width':2.5,'stroke-dasharray':'1 5','stroke-linecap':'round'},svg);
  el('polyline',{points:REF.path.map(p=>`${xs(p.year)},${ys(p.T)}`).join(' '),fill:'none',stroke:'#1B1B2F','stroke-width':2.5,'stroke-dasharray':'8 5'},svg);
  const lp=G.hist[G.hist.length-1];
  el('line',{x1:44,x2:xs(lp.year),y1:ys(lp.T),y2:ys(lp.T),stroke:'#E0393B','stroke-width':1.5,'stroke-dasharray':'3 3'},svg);
  el('polyline',{points:G.hist.map(p=>`${xs(p.year)},${ys(p.T)}`).join(' '),fill:'none',stroke:'#E0393B','stroke-width':4.5,'stroke-linejoin':'round','stroke-linecap':'round'},svg);
  el('circle',{cx:xs(lp.year),cy:ys(lp.T),r:6,fill:'#E0393B',stroke:'#1B1B2F','stroke-width':2},svg);
  for(const [k,y] of Object.entries(G.tipped)){if(k==='KR'&&y===2025)continue;const p=G.hist.find(h=>h.year===y);if(!p)continue;
    el('polygon',{points:star(xs(y),ys(p.T)-18,11,6,8),fill:'#FFD23F',stroke:'#1B1B2F','stroke-width':1.5},svg);
    el('use',{href:'#i-'+k,x:xs(y)-8,y:ys(p.T)-26,width:16,height:16},svg);}
  // Thermometer als linke Achse
  const top=ys(tmax)-6,tx=30;
  el('path',{d:`M${tx-9},${B+4} V${top+9} a9,9 0 0 1 18,0 V${B+4}`,fill:'#fff',stroke:'#1B1B2F','stroke-width':3},svg);
  el('rect',{x:tx-4.5,y:ys(Math.min(tmax,G.T)),width:9,height:B+8-ys(Math.min(tmax,G.T)),fill:'#E0393B',class:'merc'},svg);
  el('circle',{cx:tx,cy:B+16,r:13,fill:'#E0393B',stroke:'#1B1B2F','stroke-width':3},svg);
  el('circle',{cx:tx-4,cy:B+12,r:3.5,fill:'#fff',opacity:.6},svg);
  // Hover-Spalten
  const tt=document.getElementById('fever-tt');const box=svg.closest('.fwrap');
  for(let i=0;i<=ROUNDS;i++){const y=2025+5*i;const r=el('rect',{x:xs(y)-(R-L)/20,y:T0,width:(R-L)/10,height:B-T0,fill:'transparent',class:'hov'},svg);
    r.addEventListener('pointerenter',()=>{const p=G.hist[i],q=REF.path[i];
      tt.innerHTML=`<b>${y}</b>${p?`<span><i class="sw r"></i>Euer Weg: ${fmt(p.T,2)} °C · Schäden ${fmt(p.cost,1)} Bio. US-$ (Studien: ${fmt(p.lo,1)}–${fmt(p.hi,1)})</span>`:''}<span><i class="sw k"></i>Stresstest: ${fmt(q.T,2)} °C · Schäden ${fmt(q.cost,1)} Bio. US-$</span><span><i class="sw g"></i>Heutige Politik: ${fmt(TPOL[i],2)} °C</span>`;
      tt.hidden=false;const bb=box.getBoundingClientRect(),sb=svg.getBoundingClientRect();const px=sb.left-bb.left+xs(y)*sb.width/FV.W;
      tt.style.left=Math.max(4,Math.min(bb.width-tt.offsetWidth-4,px-tt.offsetWidth/2))+'px';tt.style.top=(sb.top-bb.top+8)+'px';});
    r.addEventListener('pointerleave',()=>{tt.hidden=true;});}
  // Tabelle
  document.getElementById('fever-tbl').innerHTML='<thead><tr><th>Jahr</th><th>Euer Weg</th><th>Stresstest SSP5-8.5</th><th>Heutige Politik</th><th>Schäden euer Weg</th><th>Schäden Stresstest</th></tr></thead><tbody>'+
    REF.path.map((q,i)=>{const p=G.hist[i];return `<tr><td>${q.year}</td><td>${p?fmt(p.T,2)+' °C':'–'}</td><td>${fmt(q.T,2)} °C</td><td>${fmt(TPOL[i],2)} °C</td><td>${p?fmt(p.cost,1)+' Bio. $':'–'}</td><td>${fmt(q.cost,1)} Bio. $</td></tr>`;}).join('')+'</tbody>';
}

/* ===================== Bilanz ===================== */
function renderTiles(){
  const o=outcomes(G),refO=REF.out,n=nTip(G),refN=nTip({tipped:REF.tipped});
  const tiles=[
    ['i-kipp','Gekippt',`${n} <small>weitere Elemente</small>`,`Kipppunkte und Spiel-Schwellen. Schon vor Spielbeginn: Korallenriffe. Im Stresstest bis 2075: <b>${refN}</b>.`],
    ['i-co2','CO₂-Ausstoß',`${fmt(G.E,0)} <small>Gt pro Jahr</small>`,`Stresstest: <b>${fint(REF.path[G.r].E)} Gt</b>. Gemessen 2025: 42 Gt. Bei null hört die Erwärmung fast auf.`],
    ['i-MS','Meeresspiegel',`+${fmt(G.SL,0)} <small>cm seit 2025</small>`,`Stresstest bis 2075: <b>+${fint(REF.SL)} cm</b>. Seit 1901 schon rund 23 cm.`],
    ['i-money','Klimaschäden',`${fmt(o.dmgAbs,1)} <small>Bio. US-$ pro Jahr</small>`,`≈ ${fmt(o.dmgPct,1)} % der Weltwirtschaft (Studien: ${fmt(o.dmgLo,1)}–${fmt(o.dmgHi,1)} %). Seit 2025: <b>${fint(G.costCum)} Bio. $</b>`],
    ['i-species','Artenverlust',`bis ${fmt(o.species,0)} <small>% der Landarten</small>`,`mit sehr hohem Aussterberisiko (obere IPCC-Werte, Mittel ca. ${fmt(o.speciesM,0)} %). Stresstest 2075: bis <b>${fint(refO.species)} %</b>`],
    ['i-dead','Klimatote',`${fint(o.deaths/1000)}.000 <small>pro Jahr</small>`,`zusätzliche Todesfälle (grobe Schätzung nach WHO-Ansatz). Seit 2025: <b>${fmt(G.deathsCum/1e6,1)} Mio.</b>`],
  ];
  document.getElementById('tiles').innerHTML=tiles.map(([i,t,v,s])=>`<div class="tile"><div class="th">${ic(i)}${t}</div><div class="v">${v}</div><div class="s">${s}</div></div>`).join('');
}

/* ===================== Karte ===================== */
let selected='ATM';
function linkActive(a,b){if(a==='ATM'||b==='ATM')return false;const e=EK[a];if(G.tipped[a]&&!(a==='KR'))return true;
  if(e.type==='level')return G.SL>10;if(e.type==='arctic')return G.T>=1.8;if(e.type==='enso')return ENSO[G.r]===1&&!G.over;if(e.type==='extreme')return G.T>=2;return (G.S[a]||0)>=25;}
const LP={up:[0,-30,'middle'],down:[0,38,'middle'],left:[-28,5,'end'],right:[28,5,'start']};
function buildMap(){
  const map=document.getElementById('map');
  const defs=el('defs',{},map);
  for(const [id,c] of [['mk-arrow','#1B1B2F'],['mk-arrow-r','#E0393B']]){const m=el('marker',{id,viewBox:'0 0 10 10',refX:'8',refY:'5',markerWidth:'5',markerHeight:'5',orient:'auto-start-reverse'},defs);el('path',{d:'M0,0 L10,5 L0,10 z',fill:c},m);}
  const lk=document.getElementById('links');
  for(const [a,b] of LINKS){
    if(a==='NI'&&b==='KR'){ // über den Pazifik nach Westen, über den Kartenrand hinweg
      const [x1,y1]=MAPPTS.NI,[x2,y2]=MAPPTS.KR;
      el('path',{class:'link','data-a':a,'data-b':b,d:`M${x1-24},${y1+8} Q${(x1+14)/2},${y1+40} 14,${y1+30}`},lk);
      el('path',{class:'link','data-a':a,'data-b':b,d:`M986,${y1+30} Q${(986+x2)/2},${y2+30} ${x2+27},${y2+6}`,'marker-end':'url(#mk-arrow)'},lk);
      continue;}
    const [x1,y1]=MAPPTS[a],[x2,y2]=MAPPTS[b];const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);const ux=dx/len,uy=dy/len;
    const ra=a==='ATM'?30:24,rb=b==='ATM'?34:28;
    const sx=x1+ux*ra,sy=y1+uy*ra,ex=x2-ux*rb,ey=y2-uy*rb;const bend=len>300?.12:.2;const mx=(sx+ex)/2-uy*len*bend,my=(sy+ey)/2+ux*len*bend;
    el('path',{class:'link','data-a':a,'data-b':b,d:`M${sx},${sy} Q${mx},${my} ${ex},${ey}`,'marker-end':'url(#mk-arrow)'},lk);}
  const g=document.getElementById('markers');
  const pickers=(mk,k)=>{const pick=()=>{selected=k;renderMap();renderInfo();renderCards();};mk.addEventListener('click',pick);mk.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();pick();}});};
  {const [x,y]=MAPPTS.ATM;const mk=el('g',{class:'mk hub',transform:`translate(${x},${y})`,tabindex:'0',role:'button','aria-label':'Atmosphäre, global','data-k':'ATM'},g);
   el('circle',{class:'halo',r:'28'},mk);el('use',{href:'#i-ATM',x:-22,y:-22,width:44,height:44},mk);
   txt(mk,0,-36,'Atmosphäre',{class:'ml','text-anchor':'middle'});txt(mk,0,46,'',{class:'ml hubv','text-anchor':'middle'});pickers(mk,'ATM');}
  for(const e of EL){const [x,y]=MAPPTS[e.k];const s=SK[e.sph];
    const mk=el('g',{class:'mk',transform:`translate(${x},${y})`,tabindex:'0',role:'button','aria-label':e.name,'data-k':e.k},g);
    el('circle',{class:'halo',r:'21'},mk);
    el('circle',{r:'21',fill:'none',stroke:'#E3E7EE','stroke-width':'5'},mk);
    el('circle',{class:'arc',r:'21',transform:'rotate(-90)',pathLength:'100','stroke-dasharray':'0 100'},mk);
    el('circle',{r:'15',fill:s.tint,stroke:'#1B1B2F','stroke-width':'1.5'},mk);
    el('use',{class:'mi',href:'#i-'+e.k,x:-12,y:-12,width:24,height:24},mk);
    const lp=LP[e.lab];txt(mk,lp[0],lp[1],e.short,{class:'ml','text-anchor':lp[2]});
    el('g',{class:'kippg'},mk);pickers(mk,e.k);}
  document.getElementById('maplegend').innerHTML=SPH.map(s=>`<span><i style="background:${s.color}"></i>${s.name}</span>`).join('')+
    `<span><b class="dash"></b>aktiver Dominoeffekt</span><label class="switch"><input type="checkbox" id="showlinks"> Alle Dominoeffekte zeigen</label>`;
  document.getElementById('showlinks').addEventListener('change',e=>{for(const id of ['map','globe'])document.getElementById(id).classList.toggle('showlinks',e.target.checked);});
}
function renderMap(){
  for(const mk of document.querySelectorAll('.mk:not(.hub)')){const k=mk.dataset.k;const s=elState(k);
    const a=mk.querySelector('.arc');a.setAttribute('stroke-dasharray',`${s.p} 100`);a.setAttribute('stroke',STCOL[s.st]);
    mk.classList.toggle('tipped',s.st==='tip');mk.classList.toggle('danger',s.st==='bad'&&EK[k].type!=='extreme');mk.classList.toggle('sel',selected===k);
    const kg=mk.querySelector('.kippg');kg.innerHTML='';
    if(s.st==='tip'){el('polygon',{points:star(16,-18,15,9,10),fill:'#E0393B',stroke:'#1B1B2F','stroke-width':'2'},kg);txt(kg,16,-13,'KIPP!',{class:'kipp','text-anchor':'middle',fill:'#fff'});}
  }
  for(const l of document.querySelectorAll('.link')){const act=linkActive(l.dataset.a,l.dataset.b);
    l.classList.toggle('on',l.dataset.a===selected||l.dataset.b===selected||act);l.classList.toggle('act',act);
    if(!l.classList.contains('glink')&&l.hasAttribute('marker-end'))l.setAttribute('marker-end',act?'url(#mk-arrow-r)':'url(#mk-arrow)');}
  const hv=document.querySelector('.hubv');if(hv)hv.textContent=`${fmt(G.T,2)} °C`;
  document.querySelector('.mk.hub')?.classList.toggle('sel',selected==='ATM');
  if(typeof drawGlobe==='function')drawGlobe();
}
function renderInfo(){
  const box=document.getElementById('info');
  if(selected==='ATM'){
    const inn=LINKS.filter(l=>l[1]==='ATM'),out=LINKS.filter(l=>l[0]==='ATM');
    box.innerHTML=`<div class="ih"><div class="ic" style="background:${SK.atmo.tint}">${ic('i-ATM')}</div><div><h3>Atmosphäre (global)</h3><div class="place">verbindet alle Sphären</div></div></div>
      <div>Die Luft verteilt die Wärme über den ganzen Planeten. Jede Tonne CO₂ macht sie wärmer, egal wo sie ausgestoßen wird: Pro 1.000 Gt CO₂ wird es etwa 0,5 °C wärmer. Einige Kipp-Elemente geben selbst CO₂ ab und heizen die Atmosphäre zusätzlich auf.</div>
      <dl class="facts"><dt>Jetzt</dt><dd>${fmt(G.T,2)} °C über 1850–1900</dd><dt>Ausstoß</dt><dd>${fmt(G.E,0)} Gt CO₂ pro Jahr</dd><dt>CO₂ in der Luft</dt><dd>2025: rund 426 ppm, über 50 % mehr als vor der Industrialisierung</dd></dl>
      <div><b class="sm">Heizen die Atmosphäre zusätzlich auf:</b><div class="fx">${inn.map(l=>`<span class="fxchip ${(G.tipped[l[0]]||(G.S[l[0]]||0)>=25)?'b':''}" title="${l[2]}">${ic('i-'+l[0])}${EK[l[0]].short}</span>`).join(' ')}</div></div>
      <div><b class="sm">Trifft besonders schnell:</b><div class="fx">${out.map(l=>`<span class="fxchip" title="${l[2]}">${ic('i-'+l[1])}${EK[l[1]].short}</span>`).join(' ')}</div></div>
      <div class="sm muted">Tippt auf einen Punkt der Karte, um mehr über ihn zu erfahren.</div>`;
    return;}
  const e=EK[selected],s=elState(selected),sp=SK[e.sph];
  let facts=`<dt>Sphäre</dt><dd>${sp.name} (${sp.sub})</dd>`,barL='Kipp-Druck';
  if(e.type==='tip'){facts+=`<dt>${e.game?'Spiel-Schwelle':'Kipppunkt'}</dt><dd>ca. ${fmt(e.Tc,1)} °C (${e.range})${e.k==='AZ'?`<br>bei ${fint(G.D)} % Abholzung jetzt ca. ${fmt(effTc('AZ',G),1)} °C`:''}${['AM','SO','WM','WA'].includes(e.k)&&Math.abs(effTc(e.k,G)-e.Tc)>0.01?`<br>durch Dominoeffekte jetzt ${fmt(effTc(e.k,G),2)} °C`:''}${(e.k==='NW')&&G.forest>0?`<br>durch Naturschutz +${fmt(G.forest,2)} °C`:''}</dd><dt>Zeitskala</dt><dd>${e.time}</dd>`;}
  else if(e.type==='human'){barL='Risiko für Menschen';facts+=`<dt>Risiko</dt><dd>${fint(humanRisk(G)[e.k])} von 100</dd><dt>Schutz</dt><dd>${fint(G.res[e.k])} von 100 (Anpassung)${protMult(G.T)<0.99?`<br>wirkt bei ${fmt(G.T,1)} °C nur noch zu ${fint(protMult(G.T)*100)} %`:''}</dd>`;}
  else if(e.type==='level'){barL='Meeresspiegel';facts+=`<dt>Anstieg</dt><dd>+${fmt(G.SL,0)} cm seit 2025 (seit 1901 schon rund 23 cm)</dd><dt>Stresstest</dt><dd>+${fint(REF.SL)} cm bis 2075; IPCC: 0,63–1,01 m bis 2100</dd><dt>Hinweis</dt><dd>${e.range}</dd>`;}
  else if(e.type==='arctic'){barL='Eisverlust';facts+=`<dt>Kipppunkt?</dt><dd>${e.range}</dd><dt>Eisfreier September</dt><dd>wahrscheinlich mindestens einmal vor 2050, in jedem Szenario; je wärmer, desto häufiger (IPCC AR6). Bei 2 °C etwa einmal pro Jahrzehnt (IPCC 2018).</dd>`;}
  else if(e.type==='enso'){barL='Zustand';const nn=nextNino();facts+=`<dt>Kipppunkt?</dt><dd>${e.range}</dd><dt>Nächster El Niño</dt><dd>${nn?nn+' (Spielannahme)':'bis 2075 keiner mehr angesagt'}</dd>`;}
  else if(e.type==='extreme'){barL='Stärke der Extreme';const x=s.x;facts+=e.k==='TS'?`<dt>${x.lbl}</dt><dd>${x.txt} als 1850–1900, dazu mehr Regen</dd><dt>Kipppunkt?</dt><dd>${e.range}</dd>`:`<dt>${x.lbl}</dt><dd>${x.txt} wie 1850–1900, ${x.inl}</dd><dt>Kipppunkt?</dt><dd>${e.range}</dd>`;}
  const outL=LINKS.filter(l=>l[0]===e.k),inL=LINKS.filter(l=>l[1]===e.k);
  const lk=l=>`<div class="lk">${ic('i-'+l)}`;
  const links=outL.map(l=>`${lk(l[1])}<span><b>${EK[l[1]].short}:</b> ${l[2]}</span></div>`).join('');
  const from=inL.map(l=>`${lk(l[0])}<span><b>${EK[l[0]].short}:</b> ${l[2]}</span></div>`).join('');
  box.innerHTML=`<div class="ih"><div class="ic" style="background:${sp.tint}">${ic('i-'+e.k)}</div><div><h3>${e.name}</h3><div class="place">📍 ${e.place}</div></div></div>
    <div><div class="pbh"><span>${barL}</span><span class="chip ${s.st}">${s.lbl}</span></div>
    <div class="pbar"><b style="width:${s.p}%;background:${STCOL[s.st]}"></b></div></div>
    <div>${e.why}</div><dl class="facts">${facts}</dl>
    ${links?`<div><b class="sm">Dominoeffekt auf:</b>${links}</div>`:''}
    ${from?`<div><b class="sm">Wird angestoßen von:</b>${from}</div>`:''}
    <div class="src">Quelle: ${e.src}</div>`;
}

/* ===================== Elementkarten ===================== */
const SHY={WA:'West­antarktis',MS:'Meeres­spiegel',SO:'Süd­polar­meer',AM:'Golfstrom-System',BD:'Mittelmeer-Böden',WM:'Westafr. Monsun',HW:'Hitze­wellen',TS:'Wirbel­stürme',NK:'Nordsee­küste',BW:'Nord­wälder',PF:'Perma­frost'};
function buildCards(){
  document.getElementById('spheres').innerHTML=SPH.map(s=>`<section class="sph" aria-label="${s.name}"><div class="sphhead ${s.light?'':'dark'}" style="background:${s.color}"><h3>${s.name}</h3><span>${s.sub}</span></div><div class="cards">${
    EL.filter(e=>e.sph===s.k).map(e=>`<button class="ecard" id="card-${e.k}" data-k="${e.k}" title="${e.name}" aria-label="${e.name}"><div class="row"><div class="ic" style="background:${s.tint}">${ic('i-'+e.k)}</div><div><div class="nm">${SHY[e.k]||e.short}</div><div class="pl">${e.place}</div></div></div>
      <div class="st"><span class="lab"></span><span class="chip"></span></div><div class="pbar"><b></b></div></button>`).join('')}</div></section>`).join('');
  document.getElementById('spheres').addEventListener('click',ev=>{const c=ev.target.closest('.ecard');if(!c)return;selected=c.dataset.k;renderMap();renderInfo();renderCards();
    document.getElementById('maph').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    if(GL.view==='globe')centerOn(selected);});
}
function cardLabel(e,s){
  if(e.type==='tip')return G.tipped[e.k]?'Nicht mehr aufzuhalten':`Kipp-Druck ${fint(s.p)} von 100\n${e.game?'Spiel-':''}Schwelle ca. ${fmt(effTc(e.k,G),1)} °C`;
  if(e.type==='human')return `Risiko ${fint(humanRisk(G)[e.k])} von 100\nSchutz ${fint(G.res[e.k])} von 100`;
  if(e.type==='level')return 'Anstieg seit 2025';
  if(e.type==='arctic')return 'kein Kipppunkt';
  if(e.type==='enso')return 'kein Kipppunkt, Verstärker';
  if(e.type==='extreme')return `${s.x.lbl}\n${s.x.txt}`;
}
function renderCards(){
  for(const e of EL){const c=document.getElementById('card-'+e.k),s=elState(e.k);
    c.classList.toggle('tipped',s.st==='tip');c.classList.toggle('sel',selected===e.k);
    c.querySelector('.lab').textContent=cardLabel(e,s);
    const ch=c.querySelector('.chip');ch.className='chip '+s.st;ch.textContent=s.lbl;
    const b=c.querySelector('.pbar b');b.style.width=s.p+'%';b.style.background=STCOL[s.st];}
}

/* ===================== Steuerpult ===================== */
const FXICON={co2:'i-co2',species:'i-species',dead:'i-dead'};
const fxc=(k,dir,good)=>`<span class="fxchip ${good?'g':'b'}">${ic(FXICON[k]||'i-'+k)}${dir}</span>`;
const RULES={co2:3,fs:2,gb:2,ee:3,bau:2};
function buildPult(){
  let html='',last=null;
  for(const L of LEVERS){if(L.grp!==last){html+=`<div class="grp"><i style="background:${L.col}"></i>${L.grp}</div>`;last=L.grp;}
    html+=`<div class="lever"><div class="lic">${ic(L.icon)}</div><div><div class="nm">${L.name}</div><div class="hint">${L.hint}</div></div>
      <div class="stepper"><button aria-label="${L.name} weniger" data-k="${L.k}" data-d="-1">−</button><output id="o-${L.k}">0</output><button aria-label="${L.name} mehr" data-k="${L.k}" data-d="1">+</button></div>
      <div class="fx">${L.fx.map(([k,d,g])=>fxc(k,d,g)).join('')}</div></div>`;}
  const box=document.getElementById('levers');box.innerHTML=html;
  box.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||G.over)return;const k=b.dataset.k,d=+b.dataset.d;if(d>0&&free()<=0)return;G.inv[k]=Math.max(0,G.inv[k]+d);renderPult();});
  for(const [id,max] of Object.entries(RULES)){const seg=document.getElementById(id);
    for(let i=0;i<=max;i++){const b=document.createElement('button');b.textContent=i;b.dataset.l=i;b.setAttribute('aria-label','Stufe '+i);seg.appendChild(b);}
    seg.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||G.over||b.disabled)return;G.inv[id]=+b.dataset.l;trim();renderPult();});}
  document.getElementById('kg').addEventListener('change',e=>{G.inv.kg=e.target.checked;renderPult();});
}
function free(){const bp=budgetParts(G);return bp.income-bp.programs-spent();}
function trim(){let over=-free();for(let i=LEVERS.length-1;i>=0&&over>0;i--){const k=LEVERS[i].k;const t=Math.min(G.inv[k],over);G.inv[k]-=t;over-=t;}
  for(const k of ['bau','ee'])while(over>0&&G.inv[k]>0){G.inv[k]--;over--;}}
function renderPult(){
  const bp=budgetParts(G),B=bp.income,used=bp.programs+spent(),f=B-used;
  document.getElementById('free').textContent=`${f} von ${B}`;
  const n=[`Grundbudget ${bp.base}`];if(bp.co2)n.push(`CO₂-Abgabe +${bp.co2}`);if(bp.fs)n.push(`Subventionsabbau +${bp.fs}`);if(bp.gb)n.push(`Anleihen +${bp.gb}`);
  if(bp.rep)n.push(`Rückzahlung −${bp.rep}`);if(bp.dmg)n.push(`Klimaschäden −${bp.dmg}`);if(bp.crisis)n.push(`Krisenhilfe −1`);if(bp.programs)n.push(`Förderprogramme −${bp.programs}`);
  document.getElementById('bnote').textContent=n.join(', ');
  document.getElementById('coins').innerHTML=Array.from({length:B},(_,i)=>`<svg class="${i>=f?'spent':''}"><use href="#i-coin"/></svg>`).join('');
  for(const L of LEVERS){document.getElementById('o-'+L.k).textContent=G.inv[L.k];
    for(const b of document.querySelectorAll(`#levers button[data-k="${L.k}"]`))b.disabled=!!G.over||(+b.dataset.d>0?f<=0:G.inv[L.k]===0);}
  for(const id of Object.keys(RULES))for(const b of document.querySelectorAll(`#${id} button`)){const l=+b.dataset.l;
    b.setAttribute('aria-pressed',String(l===G.inv[id]));
    const cost=(id==='ee'||id==='bau')?l-G.inv[id]:0;b.disabled=!!G.over||(cost>0&&cost>f);}
  const kg=document.getElementById('kg');kg.checked=!!G.inv.kg;kg.disabled=!!G.over;
  document.getElementById('co2hint').textContent=G.inv.kg?'Wer fossile Energie verbrennt, zahlt pro Tonne CO₂. Das Geld hilft ärmeren Ländern bei der Anpassung, also keine Münzen für den Fonds. Heute bekommen sie nur etwa ein Zwölftel dessen, was sie brauchen.':'Wer fossile Energie verbrennt, zahlt pro Tonne CO₂. 2024 brachte CO₂-Bepreisung weltweit über 100 Mrd. US-$ ein. Senkt den Ausstoß und bringt in der nächsten Runde Münzen.';
  document.getElementById('co2fx').innerHTML=fxc('co2','▼',1)+(G.inv.kg?`<span class="fxchip g">${HUMK.map(k=>ic('i-'+k)).join('')}▲ Schutz</span>`:`<span class="fxchip g">${ic('i-coin')}+1 je Stufe, nächste Runde</span>`);
  document.getElementById('fsfx').innerHTML=`<span class="fxchip g">${ic('i-coin')}+1 je Stufe, sofort</span>`+fxc('co2','▼',1)+`<span class="fxchip b">${ic('i-ER')}${ic('i-SA')}▼ Schutz</span>`;
  document.getElementById('gbfx').innerHTML=`<span class="fxchip g">${ic('i-coin')}+2 je Stufe, sofort</span><span class="fxchip b">${ic('i-coin')}Rückzahlung mit Zinsen${G.debt>0?`: noch ${fmt(G.debt,1)}`:''}</span>`;
  document.getElementById('eefx').innerHTML=`<span class="fxchip b">${ic('i-coin')}−1 je Stufe und Runde</span>`+fxc('co2','▼',1)+`<span class="fxchip g">−3 % Ausstoß je Stufe und Runde</span>`;
  document.getElementById('baufx').innerHTML=`<span class="fxchip b">${ic('i-coin')}−1 je Stufe und Runde</span>`+fxc('co2','▼',1)+fxc('HI','▲',1);
  const go=document.getElementById('go');go.disabled=!!G.over;go.textContent=G.over?'Spiel beendet':`Weiter nach ${YEAR0+DT*(G.r+1)}!`;
}

/* ===================== Comic nach jeder Runde ===================== */
const WG=['ZACK!','WUSCH!','YEAH!','SUPER!'],WB=['AUTSCH!','OH NEIN!','UFF!','KRACH!'];
function scene(i,leftIcon,leftLbl,rightIcon,rightLbl,word,good,badge,lt,rt){
  return `<svg viewBox="0 0 320 150" aria-hidden="true">
    <circle cx="58" cy="78" r="38" fill="${lt||'#fff'}" stroke="#1B1B2F" stroke-width="3"/><use href="#${leftIcon}" x="34" y="54" width="48" height="48"/>
    <text class="lb" x="58" y="138" text-anchor="middle">${leftLbl}</text>
    <path class="arw" d="M100 84 Q160 112 214 84" fill="none" stroke="#1B1B2F" stroke-width="5" stroke-linecap="round"/><path d="M205 72 220 82 204 94Z" fill="#1B1B2F"/>
    <g class="burst"><polygon points="${star(160,44,44,28,12)}" fill="${good?'#FFD23F':'#FF8A7A'}" stroke="#1B1B2F" stroke-width="3"/>
      <text class="word" x="160" y="53" text-anchor="middle" style="font-size:${Math.min(26,150/word.length)}px">${word}</text></g>
    <g class="effg ${good?'good':'bad'}"><circle cx="262" cy="78" r="38" fill="${rt||'#fff'}" stroke="#1B1B2F" stroke-width="3"/><use href="#${rightIcon}" x="238" y="54" width="48" height="48"/>
      ${badge?`<rect x="258" y="28" width="62" height="30" rx="15" fill="${good?'#1F9D45':'#E0393B'}" stroke="#1B1B2F" stroke-width="2.5"/><text class="bd" x="289" y="48" text-anchor="middle" fill="#fff">${badge}</text>`:''}</g>
    <text class="lb" x="262" y="138" text-anchor="middle">${rightLbl}</text></svg>`;
}
const TIPCAP={GR:'Das Eis wird über Jahrhunderte bis Jahrtausende weiter schmelzen. Wie schnell, hängt davon ab, wie warm es wird.',WA:'Langfristig sind 3–5 m Meeresspiegelanstieg festgelegt, auch wenn das Jahrhunderte dauert.',
  PF:'Der tauende Boden setzt jetzt selbst CO₂ und Methan frei.',AZ:'Der Regenwald wird zur Savanne und gibt CO₂ ab, statt es zu speichern.',
  AM:'Die Konvektion in der Labradorsee bricht ein. Die Umwälzströmung wird schwächer, Regenzeiten in Afrika verschieben sich.',SO:'Die Tiefsee bekommt weniger Sauerstoff, und das Meer nimmt weniger CO₂ auf.',
  KT:'Der Torf zersetzt sich und wird zur CO₂-Quelle.',BW:'Am Südrand sterben die Nordwälder. Brände setzen CO₂ frei.',NW:'Die Wolkenwälder trocknen aus. Viele seltene Arten verschwinden für immer.',
  GP:'Die Böden verwehen wie in der Dust Bowl. Eine Kornkammer der Welt gerät in Not.',BD:'Die Böden am Mittelmeer veröden: Humus weg, Ernten sinken, mehr Brände.',
  GL:'Die Gletscher sind nicht mehr zu retten. Nach dem „Peak Water“ fehlt im Sommer Wasser.',WM:'Der Westafrikanische Monsun springt in einen neuen Zustand. Für die Landwirtschaft im Sahel heißt das große Unsicherheit.'};
function buildPanels(res,inv){
  const P=[];const b=res.before;const dT=G.T-b.T;
  const mit=inv.ee+inv.bau+inv.VE+inv.WA+inv.FO+inv.co2+inv.fs;
  const goodE=G.E<b.E-0.5;
  P.push({cls:goodE?'good':'bad',tag:'Eure Klimapolitik',svg:i=>scene(i,mit?(inv.ee?'i-EN':'i-VE'):'i-co2',mit?`${mit} × Klimaschutz`:'Kein Klimaschutz','i-thermo',`${fmt(G.T,2)} °C`,goodE?WG[i%4]:WB[i%4],dT<0.08,`${dT>=0?'▲':'▼'}${fmt(Math.abs(dT),2)}°`,'#FFF3A6','#FFE2D7'),
    cap:`Der Ausstoß ${goodE?'sinkt':'steigt'} von ${fmt(b.E,0)} auf <b>${fmt(G.E,0)} Gt CO₂</b> pro Jahr. Die Erde erwärmt sich ${dT>0.005?`um ${fmt(dT,2)} °C`:'kaum noch'} auf ${fmt(G.T,2)} °C.`});
  for(const k of res.newly.slice(0,2)){const e=EK[k];
    P.push({cls:'tip',tag:e.game?'Spiel-Schwelle überschritten!':'Kipppunkt überschritten!',svg:i=>`<svg viewBox="0 0 320 150" aria-hidden="true"><g class="burst"><polygon points="${star(110,75,70,44,14)}" fill="#E0393B" stroke="#1B1B2F" stroke-width="3"/>
      <circle cx="110" cy="75" r="32" fill="#fff" stroke="#1B1B2F" stroke-width="3"/><use href="#i-${k}" x="86" y="51" width="48" height="48" style="filter:grayscale(1)"/></g>
      <text class="word" x="240" y="70" text-anchor="middle" style="font-size:40px" fill="#E0393B" stroke="#1B1B2F" stroke-width="1.5">KIPP!</text><text class="lb" x="240" y="98" text-anchor="middle">${e.short}</text></svg>`,
      cap:`Gekippt: <b>${e.name}</b>. ${TIPCAP[k]||'Diese Veränderung lässt sich nicht mehr rückgängig machen.'}`});}
  for(const k of res.newHuman.slice(0,1)){const e=EK[k];
    P.push({cls:'tip',tag:'Anpassungsgrenze!',svg:i=>scene(i,'i-thermo','Klimafolgen','i-'+k,e.short,WB[i%4],false,'Grenze!','#FFE2D7',SK.mensch.tint),
      cap:`<b>${e.name}:</b> Die Menschen können sich nicht mehr genug schützen. Es drohen Not, Krankheit und Flucht.`});}
  if(res.nino&&P.length<4)P.push({cls:'bad',tag:'El Niño!',svg:i=>scene(i,'i-NI','El Niño','i-AZ','Amazonas',WB[(i+3)%4],false,'Dürre','#DDEBFB',SK.bio.tint),
    cap:'Ein starker El Niño heizt den östlichen Pazifik auf. Am Amazonas bleibt der Regen aus, und weltweit bleichen Korallen. Solche natürlichen Schwankungen kommen zur Erwärmung noch hinzu.'});
  if(res.arcticNow&&P.length<4)P.push({cls:'bad',tag:'Arktis',svg:i=>scene(i,'i-thermo','2 °C','i-AS','Meereis',WB[(i+1)%4],false,'eisfrei','#FFE2D7',SK.kryo.tint),
    cap:'Bei 2 °C wird die Arktis im Sommer häufig eisfrei (IPCC: etwa einmal pro Jahrzehnt). Das dunkle Meer schluckt mehr Wärme, Permafrost und Grönland tauen schneller.'});
  let wk=null,wd=0;for(const k of TIPK){if(G.tipped[k])continue;const d=G.S[k]-b.S[k];if(d>wd){wd=d;wk=k;}}
  if(wk&&P.length<4&&wd>1){const e=EK[wk];P.push({cls:'bad',tag:'Achtung',svg:i=>scene(i,'i-thermo',`${fmt(G.T,1)} °C`,'i-'+wk,e.short,WB[(i+1)%4],false,`▲${fint(wd)}`,'#FFE2D7',SK[e.sph].tint),
    cap:`<b>${e.name}:</b> Der Kipp-Druck steigt um ${fint(wd)} auf <b>${fint(G.S[wk])} von 100</b>. ${e.game?'Spiel-Schwelle':'Kippschwelle'}: ca. ${fmt(effTc(wk,G),1)} °C.`});}
  const adapt=inv.HS+inv.LW+inv.KS+inv.FW+inv.bau+(inv.kg?inv.co2:0);
  if(P.length<4){let hk=HUMK.reduce((a,k)=>res.hr[k]>res.hr[a]?k:a,HUMK[0]);const e=EK[hk];const d=res.hr[hk]-b.hr[hk];const good=d<=0;
    P.push({cls:good?'good':'bad',tag:adapt?'Anpassung':'Die Menschen',svg:i=>scene(i,adapt?'i-HS':'i-thermo',adapt?`${adapt} × Anpassung`:'Klimafolgen','i-'+hk,e.short,good?WG[(i+2)%4]:WB[(i+2)%4],good,`${d>=0?'▲':'▼'}${fint(Math.abs(d))}`,adapt?'#FFF3A6':'#FFE2D7',SK.mensch.tint),
    cap:`<b>${e.name}:</b> Das Risiko ${good?'sinkt':'steigt'} auf ${fint(res.hr[hk])} von 100.${adapt?'':' Ohne Anpassung sind die Menschen schutzlos.'}`});}
  if(P.length<4&&res.newly.length===0){P.push({cls:'good',tag:'Gute Nachricht',svg:i=>`<svg viewBox="0 0 320 150" aria-hidden="true"><g class="burst"><polygon points="${star(160,75,64,42,14)}" fill="#9BE7A8" stroke="#1B1B2F" stroke-width="3"/><text class="word" x="160" y="84" text-anchor="middle" style="font-size:28px">NICHTS GEKIPPT!</text></g></svg>`,
    cap:'In diesen 5 Jahren ist kein weiteres Element gekippt.'});}
  return P.slice(0,4);
}
function showComic(res,inv){
  const panels=buildPanels(res,inv);const y=YEAR0+DT*G.r;
  const ov=document.getElementById('ov');
  let title=`${y-5} bis ${y}`,narr='Inzwischen auf der Erde …',btn=`Weiter nach ${y+5}!`;
  if(G.over){title='2075: Bilanz!';narr='50 Jahre sind vorbei.';btn='Ergebnis ansehen';}
  ov.innerHTML=`<div class="comic"><div class="ctitle"><h2 id="ovt">${title}</h2><div class="narr">${narr}</div></div>
    <div class="strip">${panels.map((p,i)=>`<div class="pnl ${p.cls}" style="--i:${i}"><span class="ptag">${p.tag}</span>${p.svg(i)}<div class="cap">${p.cap}</div></div>`).join('')}</div>
    <div class="csum" style="--n:${panels.length}"><div class="m"><div>Klimatote in diesen 5 Jahren: <span>≈ ${fmt(res.avgDeaths*DT/1e6,2)} Mio.</span></div><div>Klimaschäden in diesen 5 Jahren: <span>≈ ${fint(res.avgCost*DT)} Bio. $</span></div></div>
    <button class="go" id="ovclose">${btn}</button></div></div>`;
  ov.hidden=false;document.body.style.overflow='hidden';
  const close=()=>{ov.hidden=true;ov.innerHTML='';document.body.style.overflow='';if(G.over)document.getElementById('verdict').scrollIntoView({block:'start'});};
  document.getElementById('ovclose').addEventListener('click',close);ov.onkeydown=e=>{if(e.key==='Escape')close();};
  setTimeout(()=>document.getElementById('ovclose')?.focus({preventScroll:true}),50);
}

/* ===================== Ergebnis ===================== */
function renderVerdict(){
  const box=document.getElementById('verdict');if(!G.over){box.hidden=true;return;}
  box.hidden=false;const nt=nTip(G),nh=Object.keys(G.humanCrossed).length,n=nt+nh;const o=outcomes(G);
  const refN=nTip({tipped:REF.tipped}),refH=Object.keys(REF.humanCrossed).length;
  const cls=n===0?'won':n<=2?'mixed':'lost';box.className='box verdict '+cls;
  const head=n===0?'Gold! Kein weiteres Element gekippt!':n<=2?`Silber: ${n} ${n===1?'Grenze':'Grenzen'} überschritten`:n<=4?`Bronze: ${n} Grenzen überschritten`:`Heißzeit: ${n} Grenzen überschritten`;
  const list=[...Object.keys(G.tipped).filter(k=>!(k==='KR'&&G.tipped[k]===2025)).map(k=>EK[k].short),...Object.keys(G.humanCrossed).map(k=>EK[k].short+' (Mensch)')].join(', ');
  const saved=Math.max(0,refN+refH-n);
  box.innerHTML=`<h2>${head}</h2><p>2075 liegt die Erwärmung bei <b>${fmt(G.T,2)} °C</b>. Im Stresstest ohne Klimaschutz wären es ${fmt(REF.path[ROUNDS].T,1)} °C mit ${refN} weiteren gekippten Elementen (Kipppunkte und Spiel-Schwellen) und ${refH} überschrittenen Anpassungsgrenzen.${list?` Bei euch überschritten: ${list}.`:''}${n===0&&G.T>=1.5?' Wichtig: In der Wirklichkeit liegen die Schwellen von Grönland, Westantarktis und Permafrost schon bei etwa 1,5 °C. Im Spiel kippen sie erst, wenn sich genug Druck aufbaut. Je kürzer und geringer die Überschreitung, desto kleiner das Risiko.':''}</p>
    <p class="save">${saved>0?`Ihr habt <b>${saved}</b> von ${refN+refH} Grenzen bewahrt, rund <b>${fmt(Math.max(0,REF.deathsCum-G.deathsCum)/1e6,1)} Mio.</b> Todesfälle und <b>${fint(Math.max(0,REF.costCum-G.costCum))} Bio. US-$</b> Schäden vermieden.`:'Euer Weg ist fast genau der Stresstest. Spielt noch einmal und probiert aus, was frühes Handeln bewirkt.'}</p>
    <p>Bilanz seit 2025: rund ${fmt(G.deathsCum/1e6,1)} Mio. zusätzliche Tote, ${fint(G.costCum)} Bio. US-$ Schäden, bis zu ${fint(o.species)} % der Landarten stark bedroht.</p>
    <p class="talk"><b>Redet darüber:</b> Welche Entscheidung hat am meisten bewirkt? Wo hat Anpassung geholfen, wo kam sie an Grenzen? Und wie geht es euch jetzt?</p>
    <button class="go" style="width:auto;padding:8px 24px" data-restart>Nochmal spielen!</button>`;
}

/* ===================== Lehrkräfte-Tabelle ===================== */
const FOLGEN=[
 ['Kryosphäre','Abschmelzen des Grönländischen Eisschilds','Kipppunkt ca. 1,5 °C (0,8–3,4); ca. 7 m Meeresspiegel über Jahrtausende','GR'],
 ['Kryosphäre','Instabilität des Westantarktischen Eisschilds','Kipppunkt ca. 1,5 °C (1,0–3,0); langfristig 3–5 m Meeresspiegel','WA'],
 ['Kryosphäre','Rückgang des arktischen Sommermeereises','kein Kipppunkt (GTPR 2025); praktisch eisfreier September wahrscheinlich vor 2050 (IPCC AR6)','AS'],
 ['Kryosphäre','Gletscherschwund im Hochgebirge','regionaler Kipppunkt ca. 2,0 °C (1,5–3,0); Alpen >80 % Verlust bis 2100 bei hohem Ausstoß','GL'],
 ['Kryosphäre','Abnehmende Schneedecke','Frühjahrsschneedecke der Nordhalbkugel ca. −8 % pro Grad',''],
 ['Pedosphäre','Tauen des Permafrosts','abruptes Tauen ca. 1,5 °C (1,0–2,3), regional; Fläche −69 ± 20 % bis 2100 (RCP8.5)','PF'],
 ['Pedosphäre','Dürre und Humusverlust im Mittelmeerraum','ab 2 °C mehr Dürren (IPCC); Brandfläche +96–187 % bei 3 °C','BD'],
 ['Pedosphäre','Austrocknung tropischer Torfmoore','Kongobecken: ca. 29 Mrd. t Kohlenstoff (Crezee u. a. 2022)','KT'],
 ['Pedosphäre','Bodenerosion in Kornkammern','Wassererosion bis 2070 +30–66 % durch das Klima','GP'],
 ['Pedosphäre','Versalzung küstennaher Böden','Marsch an der Nordsee: Grundwasser teils bis an die Oberfläche versalzt',''],
 ['Hydrosphäre','Abschwächung der AMOC','Labradorsee 1,8 °C (1,1–3,8); Kollaps 4 °C (1,4–8); IPCC: kein abrupter Kollaps vor 2100 (mittleres Vertrauen), GTPR 2025: Risiko schon unter 2 °C','AM'],
 ['Hydrosphäre','Meeresspiegelanstieg','SSP5-8.5: +0,23 m (2050), +0,77 m (0,63–1,01) bis 2100 ggü. 1995–2014','MS'],
 ['Hydrosphäre','El Niño (ENSO)','kein Kipppunkt; Verstärker für Bleiche, Dürre und Rekordjahre','NI'],
 ['Hydrosphäre','Umwälzung im Südpolarmeer','ca. −40 % Bodenwasser bis 2050 bei hohem Ausstoß (Modell, Li u. a. 2023)','SO'],
 ['Hydrosphäre','Marine Hitzewellen und Versauerung','Hitzewellen im Meer seit den 1980ern etwa verdoppelt; SSP5-8.5: ca. 8-mal häufiger und pH −0,44 bis 2100',''],
 ['Atmosphäre','Westafrikanischer Monsun','einziger Kipppunkt-Kandidat der Atmosphäre: 2,8 °C (2,0–3,5), geringes Vertrauen, Richtung unsicher','WM'],
 ['Atmosphäre','Hitzewellen','50-jährliches Hitzeextrem 8,6-mal (1,5 °C), 13,9-mal (2 °C), 39,2-mal (4 °C) so häufig','HW'],
 ['Atmosphäre','Starkregen und Monsun','ca. +7 % pro Grad; 10-jährlicher Starkregen 1,5-mal (1,5 °C) bis 2,7-mal (4 °C) so häufig','IM'],
 ['Atmosphäre','Tropische Wirbelstürme','Anteil Kategorie 4–5: +10 / +13 / +20 % bei 1,5 / 2 / 4 °C','TS'],
 ['Atmosphäre','Agrar- und ökologische Dürre','10-jährliche Dürre in austrocknenden Regionen 2,4-mal (2 °C) bis 4,1-mal (4 °C) so häufig',''],
 ['Biosphäre','Absterben der Warmwasser-Korallenriffe','Kipppunkt 1,2 °C (1,0–1,5), laut GTPR 2025 überschritten; bei 1,5 °C weitere 70–90 % Rückgang (IPCC 2018)','KR'],
 ['Biosphäre','Absterben des Amazonas-Regenwalds','3,5 °C (2–6); mit Abholzung schon ab ca. 1,5–1,9 °C; Vorsorgegrenze 10 % Abholzung','AZ'],
 ['Biosphäre','Absterben borealer Wälder (Südrand)','ca. 4 °C (1,4–5,0); netto leicht kühlend durch hellere Oberfläche','BW'],
 ['Biosphäre','Verlust von Bergnebelwäldern','kein Kipppunkt; Goldkröte seit 1989 verschwunden, Klimabezug umstritten','NW'],
 ['Biosphäre','Artensterben an Land','sehr hohes Aussterberisiko: 3–14 % (1,5 °C), 3–18 % (2 °C), 3–29 % (3 °C), 3–39 % (4 °C)',''],
 ['Biosphäre','Mangroven','Rückzug wahrscheinlich ab ca. 4 mm pro Jahr Meeresspiegelanstieg',''],
 ['Mensch','Hitzestress','Grenze ca. 31 °C Feuchtkugeltemperatur für junge Gesunde (Vecellio u. a. 2022)','HI'],
 ['Mensch','Ernährungsunsicherheit und Dürre','ab 2 °C weiche Anpassungsgrenzen für Grundnahrungsmittel in den Tropen (IPCC)','ER'],
 ['Mensch','Wasser aus Gletschern, Flusshochwasser','Indus: ca. 268 Mio. Menschen; Flut 2022: ca. 9–12 % der Fläche, 33 Mio. Betroffene','SA'],
 ['Mensch','Küstenschutz und Sturmfluten','Niedersachsen: 1 m Vorsorgemaß plus 1 m Baureserve seit 2020/21; weltweit ca. 1 Mrd. Menschen Küstengefahren ausgesetzt','NK'],
 ['Mensch','Zusätzliche Todesfälle','WHO: ca. 250.000 pro Jahr (2030–2050); Hitzetote heute ca. 546.000 pro Jahr (Lancet Countdown 2025)',''],
 ['Mensch','Wirtschaftliche Schäden','keine robuste Einzelzahl (IPCC); DICE-2023: 3,1 % bei 3 °C; Kotz u. a. 2024 zurückgezogen',''],
 ['Mensch','Verwundbarkeit','3,3–3,6 Mrd. Menschen hoch verwundbar; Sterblichkeit bei Extremen dort 15-mal höher (IPCC SYR A.2.2)',''],
];
function renderFolgen(){
  document.getElementById('ftable').innerHTML='<thead><tr><th>Sphäre</th><th>Klimafolge</th><th>Kennzeichen / Schwelle</th></tr></thead><tbody>'+
    FOLGEN.map(([s,f,k,pick])=>`<tr class="${pick?'pick':''}"><td class="sph">${s}</td><td>${f}${pick?'<span class="tag">im Spiel</span>':''}</td><td>${k}</td></tr>`).join('')+'</tbody>';
}

/* ===================== Ablauf ===================== */
function render(){renderTop();renderFever();renderTiles();renderMap();renderInfo();renderCards();renderPult();renderVerdict();}
function endRound(){
  if(G.over)return;
  const inv={...G.inv};const res=simulate(G,inv);
  G.invHist.push(inv);G.prev=inv;G.last=res;G.inv={...NOINV,co2:inv.co2,kg:inv.kg,fs:inv.fs,ee:inv.ee,bau:inv.bau};trim();
  if(G.r>=ROUNDS)G.over=true;
  if(res.newly[0])selected=res.newly[0];
  render();if(res.newly[0]&&GL.view==='globe')centerOn(selected);showComic(res,inv);
}
function restart(){G=initState();selected='ATM';render();window.scrollTo(0,0);}
let gameBuilt=false;
function buildGame(){if(gameBuilt)return;gameBuilt=true;
  buildMap();buildCards();buildPult();renderFolgen();initViewToggle();
  document.getElementById('go').addEventListener('click',endRound);
  document.getElementById('restart').addEventListener('click',restart);
  document.getElementById('verdict').addEventListener('click',e=>{if(e.target.closest('[data-restart]'))restart();});
}

let feverW=0;addEventListener('resize',()=>{const w=document.getElementById('fever')?.parentElement.clientWidth;if(G&&w&&(w<560)!==(feverW<560)){feverW=w;renderFever();}else if(w)feverW=w;});
