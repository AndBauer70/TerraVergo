/* ===================== 3D-Globus (Alternative zur Weltkarte) =====================
   Orthografische Projektion mit d3-geo; Landflächen: Natural Earth 1:110 Mio. (world-atlas). */
const LL={GR:[-38.5,72.6],WA:[-110,-78],AS:[40,77],GL:[85,28.5],PF:[134.8,67.6],BD:[-2,37.5],KT:[18,-1],GP:[-101.5,36.7],AM:[-53,57],MS:[73.5,4.2],NI:[-140,0],SO:[-45,-73],
  WM:[-2,2],HW:[21.5,46.8],IM:[88,13],TS:[-68,21],AZ:[-62,-4],KR:[147.7,-18.3],BW:[-105,55],NW:[-84.8,10.3],HI:[51,26],ER:[1,16],SA:[68.5,26.5],NK:[7.4,53.6]};
const VIEWS=[['Europa & Afrika',[-12,-28]],['Amerika',[78,-12]],['Asien & Australien',[-105,-8]],['Arktis',[-20,-72]],['Antarktis',[70,68]]];
const GL={view:'map',rot:[-12,-28,0],W:1000,H:520,R:236,cx:500,cy:264,ms:1,fs:11.5,built:false,drag:null,raf:0,anim:0,spin:false};
function prefView(v){try{if(v)localStorage.setItem('terravergo-view',v);return localStorage.getItem('terravergo-view');}catch(e){return null;}}
function globeSize(){const box=document.getElementById('globebox');const w=box.clientWidth||1000;const small=w<640;
  GL.W=small?560:1000;GL.H=small?560:520;GL.R=small?230:236;GL.cx=GL.W/2;GL.cy=GL.H/2+(small?6:4);GL.ms=small?1.15:1;GL.fs=small?13:11.5;
  const svg=document.getElementById('globe');svg.setAttribute('viewBox',`0 0 ${GL.W} ${GL.H}`);svg.classList.toggle('small',small);}
function gproj(){return d3.geoOrthographic().scale(GL.R).translate([GL.cx,GL.cy]).rotate(GL.rot).clipAngle(90).precision(0.4);}
function gcenter(){return [-GL.rot[0],-GL.rot[1]];}
function mscale(k){return (0.7+0.3*Math.cos(d3.geoDistance(LL[k],gcenter())))*GL.ms;}
/* Beschriftungen: Bevorzugte Seite aus der Karte, bei Überlappung die Gegenseite oder oben/unten */
const OPP={up:['down','right','left'],down:['up','right','left'],left:['right','down','up'],right:['left','down','up']};
function placeLabels(items){const fs=GL.fs,ov=(a,b)=>a[0]<b[2]&&a[2]>b[0]&&a[1]<b[3]&&a[3]>b[1];
  const {cx,cy,R}=GL,obst=items.map(it=>[it.x-22*it.s,it.y-22*it.s,it.x+22*it.s,it.y+22*it.s]);
  obst.push([cx+R*0.83-46,cy-R*0.83-44,cx+R*0.83+46,cy-R*0.83+28]);
  const lbox=(it,side)=>{const [lx,ly,anc]=LP[side],s=it.s,w=it.n*fs*0.62*s,X=it.x+lx*s,Y=it.y+(ly+(side==='down'?fs-11.5:0))*s;
    const x0=anc==='middle'?X-w/2:anc==='end'?X-w:X;return [x0,Y-fs*0.82*s,x0+w,Y+fs*0.22*s];};
  const done=[];
  for(const it of [...items].sort((a,b)=>b.s-a.s)){let pick=null,best=1e9;
    for(const side of [it.pref,...OPP[it.pref]]){const bx=lbox(it,side);
      const sc=(bx[0]<2||bx[2]>GL.W-2||bx[1]<2?3:0)+2*done.filter(d=>ov(d,bx)).length+obst.filter((m,j)=>items[j]!==it&&ov(m,bx)).length;
      if(sc<best){best=sc;pick=[side,bx];}if(sc===0)break;}
    done.push(pick[1]);
    const [lx,ly,anc]=LP[pick[0]];it.t.setAttribute('x',lx);it.t.setAttribute('y',ly+(pick[0]==='down'?fs-11.5:0));it.t.setAttribute('text-anchor',anc);}}
function gvis(k){return d3.geoDistance(LL[k],gcenter())<Math.PI/2-0.06;}
function buildGlobe(){
  if(GL.built)return;GL.built=true;
  const svg=document.getElementById('globe');
  svg.innerHTML=`<defs>
    <radialGradient id="g-ocean" cx="38%" cy="32%" r="78%"><stop offset="0" stop-color="#E6F5FF"/><stop offset=".6" stop-color="#C2E4FB"/><stop offset="1" stop-color="#93C9EE"/></radialGradient>
    <radialGradient id="g-shade" cx="40%" cy="34%" r="72%"><stop offset=".55" stop-color="#1B1B2F" stop-opacity="0"/><stop offset="1" stop-color="#1B1B2F" stop-opacity=".2"/></radialGradient>
    <marker id="gk-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1B1B2F"/></marker>
    <marker id="gk-arrow-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#E0393B"/></marker>
    <marker id="gk-arrow-b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1E6FD0"/></marker>
    <marker id="gk-arrow-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#7A8194"/></marker></defs>
    <g id="gstars" aria-hidden="true">${gStars()}</g>
    <circle id="gshadow" fill="#000" opacity=".45"/>
    <circle id="gatmo" class="gatmo" fill="none" tabindex="0" role="button" aria-label="Atmosphäre, global"/>
    <circle id="gsea" fill="url(#g-ocean)"/><path id="ggrat" class="grat"/><path id="gland" class="land"/>
    <circle id="gsh" fill="url(#g-shade)" pointer-events="none"/><circle id="grim" fill="none" stroke="#1B1B2F" stroke-width="3" pointer-events="none"/>
    <g id="glinks"></g><g id="gmarkers"></g>
    <g id="gatmlbl" class="gatmlbl" pointer-events="none"><use href="#i-ATM" width="30" height="30" x="-15" y="-34"/><text class="ml" text-anchor="middle" y="12">Atmosphäre</text><text class="ml" id="gatmv" text-anchor="middle" y="27"></text></g>`;
  const lk=document.getElementById('glinks');
  LINKS.forEach(([a,b,,sg],i)=>el('path',{class:'link glink '+LSIGN[sg]+(a==='ATM'||b==='ATM'?' alink':''),'data-i':i,'data-a':a,'data-b':b},lk));
  GL.ex=makeLinkExtras(svg,lk,document.getElementById('gmarkers'));GL.hits=[...GL.ex.hits.querySelectorAll('.lhit')];
  const g=document.getElementById('gmarkers');
  for(const e of EL){const s=SK[e.sph];
    const mk=el('g',{class:'mk gmk',tabindex:'0',role:'button','aria-label':e.name,'data-k':e.k},g);
    el('circle',{class:'pingc',r:'21'},mk);el('circle',{class:'halo',r:'21'},mk);el('circle',{r:'21',fill:'none',stroke:'#E3E7EE','stroke-width':'5'},mk);
    el('circle',{class:'arc',r:'21',transform:'rotate(-90)',pathLength:'100','stroke-dasharray':'0 100'},mk);
    el('circle',{r:'15',fill:s.tint,stroke:'#1B1B2F','stroke-width':'1.5'},mk);
    el('use',{class:'mi',href:'#i-'+e.k,x:-12,y:-12,width:24,height:24},mk);
    const lp=LP[e.lab];txt(mk,lp[0],lp[1],e.short,{class:'ml','text-anchor':lp[2]});el('g',{class:'kippg'},mk);
    const pick=()=>{selectEl(e.k);if(d3.geoDistance(LL[e.k],gcenter())>0.6)centerOn(e.k);};
    mk.addEventListener('click',pick);mk.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();pick();}});}
  const atm=document.getElementById('gatmo');const pickA=()=>selectEl('ATM');
  atm.addEventListener('click',pickA);atm.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();pickA();}});
  // Drehen mit Maus, Stift oder Finger
  svg.addEventListener('pointerdown',ev=>{if(ev.target.closest('.mk')||ev.target.closest('.gatmo')||ev.target.closest('.lhit'))return;stopSpin();cancelAnimationFrame(GL.anim);
    GL.drag={x:ev.clientX,y:ev.clientY,r:[...GL.rot],id:ev.pointerId};svg.setPointerCapture(ev.pointerId);svg.classList.add('dragging');});
  svg.addEventListener('pointermove',ev=>{const d=GL.drag;if(!d||ev.pointerId!==d.id)return;const k=(180/Math.PI)/GL.R*(GL.W/svg.clientWidth);
    GL.rot=[d.r[0]+(ev.clientX-d.x)*k,clamp(d.r[1]-(ev.clientY-d.y)*k,-89,89),0];queueGlobe();});
  const end=()=>{GL.drag=null;svg.classList.remove('dragging');};svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
  svg.addEventListener('keydown',ev=>{if(ev.target!==svg)return;const m={ArrowLeft:[10,0],ArrowRight:[-10,0],ArrowUp:[0,-10],ArrowDown:[0,10]}[ev.key];if(!m)return;ev.preventDefault();stopSpin();
    GL.rot=[GL.rot[0]+m[0],clamp(GL.rot[1]+m[1],-89,89),0];queueGlobe();});
  document.getElementById('gviews').innerHTML=VIEWS.map(([n],i)=>`<button type="button" class="ghost sm" data-v="${i}">${n}</button>`).join('')+`<button type="button" class="ghost sm" id="gspin" aria-pressed="false">Langsam drehen</button>`;
  document.getElementById('gviews').addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b)return;if(b.id==='gspin'){GL.spin?stopSpin():startSpin();return;}stopSpin();rotateTo(VIEWS[+b.dataset.v][1]);});
}
function gStars(){let s=7,o='';const r=()=>(s=(s*16807)%2147483647)/2147483647;
  for(let i=0;i<70;i++){const x=(r()*1000).toFixed(0),y=(r()*560).toFixed(0),rad=(0.6+r()*1.3).toFixed(1);o+=`<circle class="star" cx="${x}" cy="${y}" r="${rad}" opacity="${(0.35+r()*0.6).toFixed(2)}"/>`;}return o;}
function queueGlobe(){cancelAnimationFrame(GL.raf);GL.raf=requestAnimationFrame(drawGlobe);}
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function rotateTo(target){cancelAnimationFrame(GL.anim);const from=[...GL.rot];let dl=((target[0]-from[0])%360+540)%360-180;const to=[from[0]+dl,target[1]];
  if(reduced()){GL.rot=[to[0],to[1],0];drawGlobe();return;}
  const t0=performance.now(),dur=650;const step=t=>{const u=Math.min(1,(t-t0)/dur),e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;GL.rot=[from[0]+(to[0]-from[0])*e,from[1]+(to[1]-from[1])*e,0];drawGlobe();if(u<1)GL.anim=requestAnimationFrame(step);};
  GL.anim=requestAnimationFrame(step);}
function centerOn(k){if(LL[k])rotateTo([-LL[k][0],clamp(-LL[k][1]*0.85,-80,80)]);}
function startSpin(){if(reduced())return;GL.spin=true;document.getElementById('gspin')?.setAttribute('aria-pressed','true');let last=performance.now();
  const step=t=>{if(!GL.spin)return;GL.rot=[GL.rot[0]+(t-last)*0.012,GL.rot[1],0];last=t;drawGlobe();GL.anim=requestAnimationFrame(step);};GL.anim=requestAnimationFrame(step);}
function stopSpin(){GL.spin=false;cancelAnimationFrame(GL.anim);document.getElementById('gspin')?.setAttribute('aria-pressed','false');}
function arcPts(a,b){const d=d3.geoDistance(a,b),ip=d3.geoInterpolate(a,b),t0=Math.min(.42,0.1/Math.max(d,1e-6)),n=Math.max(8,Math.ceil(d*30)),pts=[];
  for(let i=0;i<=n;i++)pts.push(ip(t0+(1-2*t0)*i/n));return pts;}
function drawGlobe(){
  if(!GL.built||GL.view!=='globe'||!G)return;
  GL.rot[0]=((GL.rot[0]%360)+540)%360-180;
  const p=gproj(),path=d3.geoPath(p),{cx,cy,R}=GL;
  for(const [id,r,dx] of [['gshadow',R,7],['gatmo',R+11,0],['gsea',R,0],['gsh',R,0],['grim',R,0]]){const c=document.getElementById(id);c.setAttribute('cx',cx+dx);c.setAttribute('cy',cy+dx);c.setAttribute('r',r);}
  document.getElementById('gland').setAttribute('d',path(LAND)||'');
  document.getElementById('ggrat').setAttribute('d',path(d3.geoGraticule10())||'');
  document.getElementById('gatmlbl').setAttribute('transform',`translate(${cx+R*0.83},${cy-R*0.83-6})`);
  document.getElementById('gatmv').textContent=`${fmt(G.T,2)} °C`;
  document.getElementById('gatmo').classList.toggle('sel',selected==='ATM'&&LX.sel<0);

  const items=[];
  for(const mk of document.querySelectorAll('#gmarkers .mk')){const k=mk.dataset.k;
    if(!gvis(k)){mk.style.display='none';continue;}
    const [x,y]=p(LL[k]);const s=mscale(k);const t=mk.querySelector('text.ml');
    items.push({x,y,s,t,pref:EK[k].lab,n:t.textContent.length});
    mk.style.display='';mk.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s.toFixed(3)})`);}
  placeLabels(items);
  for(const l of document.querySelectorAll('#glinks .link')){const i=+l.dataset.i,a=l.dataset.a,b=l.dataset.b;let d='',end=false;
    if(a==='ATM'||b==='ATM'){ // kurzer Pfeil nach außen zur Lufthülle (bzw. von ihr herein)
      const o=a==='ATM'?b:a;if(gvis(o)){const [x,y]=p(LL[o]);let vx=x-cx,vy=y-cy;const L=Math.hypot(vx,vy);
        if(L<25){vx=0;vy=-1;}else{vx/=L;vy/=L;}
        const r0=23*mscale(o),len=Math.min(62,L<25?R:R+11-L);
        if(len-r0>12){const m=[x+vx*r0,y+vy*r0].map(v=>v.toFixed(1)),q=[x+vx*len,y+vy*len].map(v=>v.toFixed(1));
          d=a==='ATM'?`M${q}L${m}`:`M${m}L${q}`;end=true;}}}
    else if(gvis(a)||gvis(b)){d=path({type:'LineString',coordinates:arcPts(LL[a],LL[b])})||'';end=gvis(b);}
    l.setAttribute('d',d);if(GL.hits)GL.hits[i].setAttribute('d',d);
    if(d&&end)l.setAttribute('marker-end',`url(#gk-arrow${arrowSuffix(i)})`);else l.removeAttribute('marker-end');}
  placeBadges('globe');
}
function setView(v){GL.view=v;prefView(v);
  document.getElementById('mapscroll').hidden=v!=='map';document.getElementById('globebox').hidden=v!=='globe';
  for(const b of document.querySelectorAll('#viewtoggle button'))b.setAttribute('aria-pressed',String(b.dataset.view===v));
  if(v==='globe'){buildGlobe();globeSize();if(G)renderMap();}else{stopSpin();if(G)applyLinks();}}
function initViewToggle(){
  document.getElementById('viewtoggle').addEventListener('click',ev=>{const b=ev.target.closest('button[data-view]');if(b)setView(b.dataset.view);});
  addEventListener('resize',()=>{if(GL.view==='globe'){globeSize();drawGlobe();}});
  if(prefView()==='globe')setView('globe');
}
