// Erzeugt die Tabelle aller Wechselwirkungen für Begleitheft (src/bh_links.html) und Wissensbasis (src/wb_links.md)
const fs=require('fs');const vm=require('vm');
const ctx={console,Math,Object,JSON};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('src/data.js','utf8')+';this.api={EK,LINKS};',ctx);
const {EK,LINKS}=ctx.api;
const nm=k=>k==='ATM'?'Atmosphäre':EK[k].short;
const SG={'1':'+ verstärkt','-1':'− bremst','0':'± unklar'};
const order=['kryo','pedo','hydro','atmo','bio','mensch'];
const sph=k=>k==='ATM'?'atmo':EK[k].sph;
const rows=LINKS.map((l,i)=>({l,i})).sort((a,b)=>order.indexOf(sph(a.l[0]))-order.indexOf(sph(b.l[0]))||nm(a.l[0]).localeCompare(nm(b.l[0]),'de'));
let h='<table class="el lk"><thead><tr><th>Von → nach</th><th>Wirkung</th><th>Erklärung im Spiel</th><th>Vertrauen</th><th>Im Modell</th><th>Quelle</th></tr></thead><tbody>';
for(const {l} of rows)h+=`<tr><td><b>${nm(l[0])} → ${nm(l[1])}</b></td><td class="sg${l[3]}">${SG[l[3]]}</td><td>${l[2]}</td><td>${l[4]}</td><td>${l[6]?'ja':'nein'}</td><td class="q">${l[5]}</td></tr>`;
h+='</tbody></table>';
fs.writeFileSync('src/bh_links.html',h);
let md='| Von → nach | Wirkung | Mechanismus (wie im Spiel erklärt) | Vertrauen | im Spielmodell | Quelle |\n|---|---|---|---|---|---|\n';
for(const {l} of rows)md+=`| ${nm(l[0])} → ${nm(l[1])} | ${SG[l[3]]} | ${l[2]} | ${l[4]} | ${l[6]?'ja':'nein'} | ${l[5]} |\n`;
fs.writeFileSync('src/wb_links.md',md);
const c=s=>LINKS.filter(l=>l[3]===s).length;
console.log('ok',LINKS.length,'verstärkt',c(1),'bremst',c(-1),'unklar',c(0),'im Modell',LINKS.filter(l=>l[6]).length);
