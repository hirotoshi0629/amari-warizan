// 計算メモの線が縦・横どちらでも同じ太さに見えるようにする。
// 表示サイズとcanvas内部サイズを一致させ、縦横で別々に拡大されるのを防ぐ。
function prepareScratchCanvas(c){
  const rect=c.getBoundingClientRect();
  const dpr=Math.max(1,window.devicePixelRatio||1);
  const w=Math.max(1,Math.round(rect.width*dpr));
  const h=Math.max(1,Math.round(rect.height*dpr));
  if(c.width!==w||c.height!==h){c.width=w;c.height=h;}
  const x=c.getContext("2d");
  x.setTransform(dpr,0,0,dpr,0,0);
  return x;
}
function draw(c){
  let x=prepareScratchCanvas(c),on=false;
  x.lineWidth=5;
  x.lineCap="round";
  x.lineJoin="round";
  x.strokeStyle="#173229";
  const p=e=>{const r=c.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
  c.onpointerdown=e=>{on=true;c.setPointerCapture?.(e.pointerId);const[a,b]=p(e);x.beginPath();x.moveTo(a,b)};
  c.onpointermove=e=>{if(!on)return;const[a,b]=p(e);x.lineTo(a,b);x.stroke()};
  c.onpointerup=()=>on=false;
  c.onpointercancel=()=>on=false;
}
function scratch(){
  const c=document.querySelector("#scratchCanvas");
  let x=prepareScratchCanvas(c);
  x.clearRect(0,0,c.width,c.height);
  draw(c);
  document.querySelector("#clearScratch").onclick=()=>{
    x=prepareScratchCanvas(c);
    x.clearRect(0,0,c.width,c.height);
  };
}