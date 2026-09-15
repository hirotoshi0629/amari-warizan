// 計算メモの手書き線を、iPadでも見やすい細さに調整
function draw(c){
  let x=c.getContext("2d"),on=false;
  x.lineWidth=5;
  x.lineCap="round";
  x.lineJoin="round";
  x.strokeStyle="#173229";
  let p=e=>{let r=c.getBoundingClientRect();return[(e.clientX-r.left)*c.width/r.width,(e.clientY-r.top)*c.height/r.height]};
  c.onpointerdown=e=>{on=true;c.setPointerCapture?.(e.pointerId);let[a,b]=p(e);x.beginPath();x.moveTo(a,b)};
  c.onpointermove=e=>{if(!on)return;let[a,b]=p(e);x.lineTo(a,b);x.stroke()};
  c.onpointerup=()=>on=false;
  c.onpointercancel=()=>on=false;
}