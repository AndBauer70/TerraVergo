const fs=require('fs');const vm=require('vm');
const ctx={console,Math,Object,JSON};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('src/data.js','utf8')+';this.api={EL,SK};',ctx);
const {EL,SK}=ctx.api;
const C={GR:[72.6,-38.5],WA:[-78,-110],AS:[77,40],GL:[28.5,85],PF:[67.6,134.8],BD:[37.5,-2],KT:[-1,18],GP:[36.7,-101.5],AM:[57,-53],MS:[4.2,73.5],NI:[0,-140],SO:[-73,-45],WM:[2,-2],HW:[46.8,21.5],IM:[13,88],TS:[21,-68],AZ:[-4,-62],KR:[-18.3,147.7],BW:[55,-105],NW:[10.3,-84.8],HI:[26,51],ER:[16,1],SA:[26.5,68.5],NK:[53.6,7.4]};
const f=(v,p,n)=>`${Math.abs(v).toLocaleString('de-DE',{maximumFractionDigits:1})}° ${v>=0?p:n}`;
const TYP={tip:e=>e.game?'Spiel-Schwelle':'Kipppunkt',arctic:()=>'Anzeige, kein Kipppunkt',enso:()=>'Ereignis, kein Kipppunkt',level:()=>'Anzeige, kein Kipppunkt',extreme:()=>'Extremwert, kein Kipppunkt',human:()=>'Anpassungsgrenze'};
const thr=e=>e.type==='tip'?`ca. ${e.Tc.toLocaleString('de-DE',{minimumFractionDigits:1})} °C; ${e.range}`:e.type==='human'?'Risiko 100 (Gefahr × fehlender Schutz)':e.range;
let h='<table class="el"><thead><tr><th>Sphäre</th><th>Element</th><th>Ort und Koordinaten</th><th>Art</th><th>Schwelle im Spiel</th><th>Quelle</th></tr></thead><tbody>';
for(const e of EL){const [la,lo]=C[e.k];h+=`<tr><td>${SK[e.sph].name}</td><td><b>${e.name}</b></td><td>${e.place.replace(/(, [^,]*°[^,]*)+$/,'')}<br><span class="co">${f(la,'N','S')}, ${f(lo,'O','W')}</span></td><td>${TYP[e.type](e)}</td><td>${thr(e)}</td><td class="q">${e.src}</td></tr>`;}
h+='</tbody></table>';
fs.writeFileSync('src/bh_elements.html',h);console.log('ok',EL.length);
