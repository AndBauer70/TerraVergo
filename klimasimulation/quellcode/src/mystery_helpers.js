/* Hilfsfunktionen für das eigenständige Mystery (in der Klimasimulation stehen sie in data.js und ui.js) */
const clamp=(x,a=0,b=100)=>Math.max(a,Math.min(b,x));
function star(cx,cy,ro,ri,n){let p=[];for(let i=0;i<n*2;i++){const r=i%2?ri:ro,a=Math.PI*i/n-Math.PI/2;p.push((cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1));}return p.join(' ');}
