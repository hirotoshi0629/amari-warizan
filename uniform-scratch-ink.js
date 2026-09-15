// Keep calculation-memo ink the same thickness in every direction.
// Match the canvas backing store to its displayed size so CSS stretching
// cannot make horizontal and vertical strokes look different.
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

draw=function(c){
  let x=prepareScratchCanvas(c),on=false;
  x.lineWidth=5;
  x.lineCap="round";
  x.lineJoin="round";
  x.strokeStyle="#173229";
  const p=e=>{
    const r=c.getBoundingClientRect();
    return [e.clientX-r.left,e.clientY-r.top];
  };
  c.onpointerdown=e=>{
    on=true;
    c.setPointerCapture?.(e.pointerId);
    const [a,b]=p(e);
    x.beginPath();x.moveTo(a,b);
  };
  c.onpointermove=e=>{
    if(!on)return;
    const [a,b]=p(e);
    x.lineTo(a,b);x.stroke();
  };
  c.onpointerup=()=>on=false;
  c.onpointercancel=()=>on=false;
};

scratch=function(){
  const c=document.querySelector("#scratchCanvas");
  const x=prepareScratchCanvas(c);
  x.clearRect(0,0,c.width,c.height);
  draw(c);
  document.querySelector("#clearScratch").onclick=()=>{
    const ctx=prepareScratchCanvas(c);
    ctx.clearRect(0,0,c.width,c.height);
  };
};
