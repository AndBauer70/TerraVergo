/* ===================== Start der Klimasimulation ===================== */
function start(data){if(data&&data.game&&data.game.hist)G=data.game;buildGame();if(!G)G=initState();render();}
window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});
