let bank=[],selectedGroup="ミックス",set=[],idx=0,score=0,typed={q:"",r:"",value:""},selectedChoice=null,selectedUnits={q:"",r:"",value:""};
const $=s=>document.querySelector(s),views=["home","quiz","puzzle","result"];
const state=JSON.parse(localStorage.getItem("amariPuzzleState")||'{"pieces":0,"world":0}'),themes=["森のひみつ","海のたんけん","宇宙ステーション","恐竜の谷","おかしの国","空の王国"];
function save(){localStorage.setItem("amariPuzzleState",JSON.stringify(state))}function show(v){views.forEach(x=>$("#"+x).classList.toggle("hidden",x!==v));$("#homeBtn").classList.toggle("hidden",v==="home")}function sh(a){return[...a].sort(()=>Math.random()-.5)}function pick(a,n){return sh(a).slice(0,n)}
function makeSet(){if(selectedGroup!=="ミックス"){set=pick(bank.filter(q=>q.group===selectedGroup),10);return}set=sh([...pick(bank.filter(q=>["計算","あまりの意味","確かめ"].includes(q.category)),4),...pick(bank.filter(q=>["文章・基本","あまりを答える","切り上げ","切り捨て"].includes(q.category)),3),...pick(bank.filter(q=>["誤答発見","図・表・会話","思考・判断"].includes(q.category)),3)])}
function word(q){return !["計算","あまりの意味","確かめ"].includes(q.category)}
function start(){makeSet();idx=0;score=0;show("quiz");render()}
function render(){typed={q:"",r:"",value:""};selectedUnits={q:"",r:"",value:""};selectedChoice=null;let q=set[idx];$("#qCount").textContent=`${idx+1} / 10`;$("#catBadge").textContent=q.category;$("#barFill").style.width=`${(idx+1)*10}%`;$("#prompt").textContent=q.prompt;$("#feedback").className="feedback hidden";$("#aiStatus").className="aiStatus hidden";$("#nextBtn").classList.add("hidden");$("#checkBtn").classList.remove("hidden");$("#showAnswerBtn").classList.remove("hidden");$("#options").innerHTML=(q.options||[]).map((x,i)=>`<button class="option" data-v="${i+1}">${x}</button>`).join("");document.querySelectorAll(".option").forEach(b=>b.onclick=()=>{selectedChoice=+b.dataset.v;typed.value=b.dataset.v;document.querySelectorAll(".option").forEach(x=>x.classList.toggle("active",x===b))});answerUI(q);$("#scratchCard").classList.toggle("hidden",!word(q));if(word(q))scratch()}
function needsUnits(q){return !!(q.unit||q.qUnit||q.rUnit)}
function unitButtons(unit,key){if(!unit)return"";return `<div class="unitPicker"><button type="button" class="unitBtn" data-unit-key="${key}" data-unit="${unit}">${unit}</button></div>`}
function answerUI(q){
  const a=$("#answerArea");
  if(q.format==="choice"){
    a.innerHTML='<p class="note">上の答えをタップしてえらびましょう。</p>';
    return;
  }
  if(q.format==="qr"){
    a.innerHTML=`<div class="answerBox"><span>商</span><div id="dq" class="numDisplay wideDisplay"></div>${unitButtons(q.qUnit,"q")}<span>あまり</span><div id="dr" class="numDisplay wideDisplay"></div>${unitButtons(q.rUnit,"r")}</div>${keypad()}`
  }else{
    a.innerHTML=`<div class="answerBox"><span>答え</span><div id="dv" class="numDisplay wideDisplay"></div>${unitButtons(q.unit,"value")}</div>${keypad()}`
  }
  document.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>key(b.dataset.k,q));
  document.querySelectorAll(".unitBtn").forEach(b=>b.onclick=()=>{
    const k=b.dataset.unitKey;
    selectedUnits[k]=b.dataset.unit;
    document.querySelectorAll(`[data-unit-key="${k}"]`).forEach(x=>x.classList.toggle("active",x===b));
    update();
  });
}
function keypad(){return `<div class="keypad">${[1,2,3,4,5,6,7,8,9,0].map(n=>`<button data-k="${n}">${n}</button>`).join("")}<button data-k="C">C</button><button data-k="B">←</button></div>`}
function key(k,q){let f=q.format==="qr"?(typed.q===""?"q":"r"):"value";if(k==="C")typed={q:"",r:"",value:""};else if(k==="B")typed[f]=typed[f].slice(0,-1);else if(q.format==="qr"){if(typed.q==="")typed.q=k;else typed.r=(typed.r+k).slice(0,2)}else typed[f]=(typed[f]+k).slice(0,2);update()}
function update(){if($("#dq"))$("#dq").textContent=typed.q+(selectedUnits.q?" "+selectedUnits.q:"");if($("#dr"))$("#dr").textContent=typed.r+(selectedUnits.r?" "+selectedUnits.r:"");if($("#dv"))$("#dv").textContent=typed.value+(selectedUnits.value?" "+selectedUnits.value:"")}
function draw(c){let x=c.getContext("2d"),on=false;x.lineWidth=11;x.lineCap="round";x.strokeStyle="#173229";let p=e=>{let r=c.getBoundingClientRect();return[(e.clientX-r.left)*c.width/r.width,(e.clientY-r.top)*c.height/r.height]};c.onpointerdown=e=>{on=true;c.setPointerCapture?.(e.pointerId);let[a,b]=p(e);x.beginPath();x.moveTo(a,b)};c.onpointermove=e=>{if(!on)return;let[a,b]=p(e);x.lineTo(a,b);x.stroke()};c.onpointerup=()=>on=false;c.onpointercancel=()=>on=false}
function scratch(){let c=$("#scratchCanvas"),x=c.getContext("2d");x.clearRect(0,0,c.width,c.height);draw(c);$("#clearScratch").onclick=()=>x.clearRect(0,0,c.width,c.height)}
function at(q){if(q.format==="qr")return `${q.answer.q}${q.qUnit||""} あまり ${q.answer.r}${q.rUnit||""}`;return `${q.answer.value}${q.unit||""}`}
function normalizeUnitText(t){return (t||"").replace(/\s/g,"").replace(/[個箇ケ]/g,"こ").replace(/枚/g,"まい").replace(/袋/g,"ふくろ").replace(/艘/g,"そう").replace(/センチメートル|センチ/g,"cm").replace(/[Ｃｃ][Ｍｍ]/g,"cm").replace(/臺/g,"台").replace(/[マま][イぃ]/g,"まい").replace(/本ほん/g,"本")}
function parseAiText(text,unit){let t=normalizeUnitText(text);let m=t.match(/[0-9０-９]+/);let num=m?Number(m[0].replace(/[０-９]/g,ch=>"０１２３４５６７８９".indexOf(ch))):NaN;let hasUnit=!unit||t.includes(normalizeUnitText(unit));return{num,hasUnit,text:t}}






function check(){
  const q=set[idx];
  if(q.format==="choice"){
    if(!selectedChoice)return alert("答えをえらんでください。");
    return fb(q,selectedChoice===q.answer.value);
  }
  if(needsUnits(q)){
    if(q.format==="qr"&&((q.qUnit&&!selectedUnits.q)||(q.rUnit&&!selectedUnits.r))){
      return alert("単位まで答えましょう。");
    }
    if(q.format!=="qr"&&q.unit&&!selectedUnits.value){
      return alert("単位まで答えましょう。");
    }
  }
  const ok=q.format==="qr"
    ? +typed.q===q.answer.q && +typed.r===q.answer.r
    : +typed.value===q.answer.value;
  fb(q,ok);
}
function fb(q,ok){if(ok)score++;let f=$("#feedback");f.className="feedback "+(ok?"ok":"ng");f.innerHTML=(ok?"⭕ せいかい！<br>":"△ ちがいます。答え：<b>"+at(q)+"</b><br>")+q.explanation;$("#checkBtn").classList.add("hidden");$("#showAnswerBtn").classList.add("hidden");$("#nextBtn").classList.remove("hidden")}
function showAnswer(){let q=set[idx],f=$("#feedback");f.className="feedback answer";f.innerHTML=`💡 答え：<b>${at(q)}</b><br>${q.explanation}`;$("#checkBtn").classList.add("hidden");$("#showAnswerBtn").classList.add("hidden");$("#nextBtn").classList.remove("hidden")}
function next(){if(++idx<10)render();else finish()}function finish(){let e=2+Math.floor(score/2);state.pieces+=e;while(state.pieces>=25*(state.world+1))state.world++;save();$("#scoreText").textContent=`${score} / 10 問 せいかい`;$("#pieceEarned").textContent=`${e}ピース GET！`;puzzle();show("result")}
function puzzle(){
  const local=state.pieces%25;
  const bg=`linear-gradient(135deg,hsl(${(state.world*73)%360} 70% 80%),hsl(${(state.world*73+110)%360} 70% 65%))`;
  $("#worldTitle").textContent=themes[state.world%themes.length]+"・"+(state.world+1);
  $("#totalPieces").textContent=state.pieces;
  $("#pieceText").textContent="ピース "+state.pieces;
  $("#miniPuzzle").style.background=bg;

  const box=$("#jigsaw");
  box.innerHTML="";
  for(let i=0;i<25;i++){
    const p=document.createElement("div");
    p.className="piece"+(i<local?" on":"");
    p.style.background=bg;
    box.appendChild(p);
  }
  $("#puzzleStatus").textContent=`この絵は ${local} / 25 ピース。`;

  renderPuzzleGallery();
}
function renderPuzzleGallery(){
  const gallery=$("#puzzleGallery");
  if(!gallery)return;
  gallery.innerHTML="";

  const completed=Math.floor(state.pieces/25);
  $("#emptyGallery")?.classList.toggle("hidden",completed>0);

  for(let w=0;w<completed;w++){
    const item=document.createElement("div");
    item.className="galleryItem";

    const thumb=document.createElement("div");
    thumb.className="galleryThumb";
    const bg=`linear-gradient(135deg,hsl(${(w*73)%360} 70% 80%),hsl(${(w*73+110)%360} 70% 65%))`;

    for(let i=0;i<25;i++){
      const p=document.createElement("div");
      p.className="galleryPiece";
      p.style.background=bg;
      thumb.appendChild(p);
    }

    const meta=document.createElement("div");
    meta.className="galleryMeta";
    const name=document.createElement("div");
    name.className="galleryName";
    name.textContent=themes[w%themes.length]+"・"+(w+1);
    const badge=document.createElement("div");
    badge.className="galleryBadge";
    badge.textContent="完成！";

    meta.appendChild(name);
    meta.appendChild(badge);
    item.appendChild(thumb);
    item.appendChild(meta);
    gallery.appendChild(item);
  }
}
document.querySelectorAll(".groupBtn").forEach(b=>b.onclick=()=>{
  selectedGroup=b.dataset.group;
  document.querySelectorAll(".groupBtn").forEach(x=>x.classList.toggle("selected",x===b));
});
$("#startBtn").onclick=start;
$("#puzzleBtn").onclick=()=>{puzzle();show("puzzle")};
$("#checkBtn").onclick=check;
$("#showAnswerBtn").onclick=showAnswer;
$("#nextBtn").onclick=next;
$("#againBtn").onclick=start;
$("#homeBtn").onclick=()=>{
  if($("#quiz").classList.contains("hidden")||confirm("この10問を途中でやめてホームに戻りますか？"))show("home");
};
$("#resultPuzzleBtn").onclick=()=>{puzzle();show("puzzle")};
$("#puzzleHome").onclick=()=>show("home");
$("#resultHomeBtn").onclick=()=>show("home");
fetch("questions.json?v=4.1")
  .then(r=>r.json())
  .then(d=>{bank=d.questions;puzzle()})
  .catch(()=>alert("問題データを読み込めませんでした。"));
