const fs=require('fs');const vm=require('vm');
const code=fs.readFileSync('src/data.js','utf8');
const ctx={console,Math,Object,JSON};vm.createContext(ctx);
vm.runInContext(code+'\n;this.__api={initState,simulate,REF,budgetParts,humanRisk,outcomes,nTip,TIPK,HUMK,LEVERS,NOINV,EK,effTc,spentK:(st)=>0};',ctx);
const A=ctx.__api;
function play(name,policy){
  const st=A.initState();const log=[];
  for(let r=0;r<10;r++){
    // set persistent settings
    const pol=policy(r,st);
    st.inv={...A.NOINV,...pol.set};
    const bp=A.budgetParts(st);let free=bp.income-bp.programs;
    for(const [k,w] of pol.spend){const n=Math.max(0,Math.min(free,w==='rest'?free:w));st.inv[k]+=n;free-=n;}
    const inv={...st.inv};const res=A.simulate(st,inv);st.prev=inv;
    log.push(`${2025+5*(r+1)} T=${st.T.toFixed(2)} E=${st.E.toFixed(1)} cut=${st.cut.toFixed(2)} SL=${st.SL.toFixed(0)} inc=${bp.income} free0=${bp.income-bp.programs} new:${res.newly.join(',')}${res.newHuman.length?' HUM:'+res.newHuman.join(','):''}`);
  }
  const hr=A.humanRisk(st);const o=A.outcomes(st);
  console.log(`\n== ${name}: T2075=${st.T.toFixed(2)} tipped(new)=${A.nTip(st)} [${Object.keys(st.tipped).join(',')}] human=${Object.keys(st.humanCrossed).join(',')} risks=${Object.entries(hr).map(([k,v])=>k+':'+v.toFixed(0)).join(' ')} dmg%=${o.dmgPct.toFixed(1)} deathsCum=${(st.deathsCum/1e6).toFixed(2)}M costCum=${st.costCum.toFixed(0)}`);
  console.log(log.join('\n'));
  console.log('pressures',Object.entries(st.S).map(([k,v])=>k+':'+v.toFixed(0)).join(' '));
}
play('Keine Maßnahmen',()=>({set:{},spend:[]}));
play('Stark früh (co2 3, fs 2, ee 3, Rest VE)',r=>({set:{co2:3,fs:2,ee:3},spend:[['VE','rest']]}));
play('Moderat (co2 1, ee 1, Mix)',r=>({set:{co2:1,ee:1},spend:[['VE',2],['WA',1],['HS',1],['LW',1],['KS',1],['FW','rest']]}));
play('Zögerlich (erst ab 2045 Klimaschutz)',r=>r<4?{set:{},spend:[['HS',2],['LW',2],['KS',2],['FW','rest']]}:{set:{co2:3,fs:2,ee:3},spend:[['VE','rest']]});
play('Nur Anpassung',r=>({set:{},spend:[['HS',2],['LW',3],['KS',1],['FW','rest']]}));
play('Smart: Schutz + Anpassung',r=>({set:{co2:3,fs:1,ee:3,bau:1},spend:[['VE',3],['WA',2],['LW',2],['HS',1],['FW','rest']]}));
play('Gold-Versuch: alles früh + Wald',r=>({set:{co2:3,fs:2,ee:3,gb:r<2?2:0},spend:[['WA',1],['VE','rest']]}));
play('Gold-Versuch 2: + CDR spaet',r=>({set:{co2:3,fs:2,ee:3,gb:r<2?2:0},spend:r<4?[['WA',1],['VE','rest']]:[['WA',1],['FO',3],['HS',1],['LW',1],['FW','rest']]}));
play('Gold 3: Wald 2',r=>({set:{co2:3,fs:2,ee:3,gb:r<2?2:0},spend:r<5?[['WA',2],['VE','rest']]:[['WA',1],['FO',4],['LW',1],['HS',1],['FW','rest']]}));
