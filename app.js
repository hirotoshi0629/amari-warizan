let bank=[],mode="keypad",selectedGroup="ミックス",set=[],idx=0,score=0,typed={q:"",r:"",value:""},selectedChoice=null,selectedUnits={q:"",r:"",value:""};
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
  let a=$("#answerArea");
  if(q.format==="choice"){a.innerHTML='<p class="note">上の答えをタップしてえらびましょう。</p>';return}
  if(mode==="keypad"){
    if(q.format==="qr"){a.innerHTML=`<div class="answerBox"><span>商</span><div id="dq" class="numDisplay wideDisplay"></div>${unitButtons(q.qUnit,"q")}<span>あまり</span><div id="dr" class="numDisplay wideDisplay"></div>${unitButtons(q.rUnit,"r")}</div>${keypad()}`}
    else{a.innerHTML=`<div class="answerBox"><span>答え</span><div id="dv" class="numDisplay wideDisplay"></div>${unitButtons(q.unit,"value")}</div>${keypad()}`}
    document.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>key(b.dataset.k,q));
    document.querySelectorAll(".unitBtn").forEach(b=>b.onclick=()=>{let k=b.dataset.unitKey;selectedUnits[k]=b.dataset.unit;document.querySelectorAll(`[data-unit-key="${k}"]`).forEach(x=>x.classList.toggle("active",x===b));update()})
  }else{
    if(q.format==="qr"){
      a.innerHTML=`<div class="canvasWrap">
        ${handGroup("q","商",q.qUnit)}
        ${handGroup("r","あまり",q.rUnit)}
      </div><div class="handHint">数字はマスいっぱいに、大きく1文字ずつ書くとAIが読みやすくなります。</div>`
    }else{
      a.innerHTML=`<div class="canvasWrap">${handGroup("value","答え",q.unit)}</div>
      <div class="handHint">数字はマスいっぱいに、大きく書いてね。単位がある問題は、単位のマスにも書こう。</div>`
    }
    document.querySelectorAll(".handCanvas").forEach(draw);
    document.querySelectorAll(".eraseInk").forEach(b=>b.onclick=()=>{
      const c=document.querySelector(`canvas[data-ai-key="${b.dataset.clearKey}"][data-part="${b.dataset.clearPart}"]`);
      if(c)c.getContext("2d").clearRect(0,0,c.width,c.height);
    });
  }
}
function handGroup(key,label,unit){
  if(unit){
    return `<div class="handAnswerGroup">
      <div class="handSlot"><b>${label}（数字）</b><canvas class="handCanvas numberCanvas" data-ai-key="${key}" data-part="number" width="920" height="720"></canvas><button type="button" class="eraseInk" data-clear-key="${key}" data-clear-part="number">消す</button></div>
      <div class="handSlot"><b>単位</b><canvas class="handCanvas unitCanvas" data-ai-key="${key}" data-part="unit" width="600" height="720"></canvas><button type="button" class="eraseInk" data-clear-key="${key}" data-clear-part="unit">消す</button></div>
    </div>`
  }
  return `<div class="handSlot"><b>${label}</b><canvas class="handCanvas numberCanvas" data-ai-key="${key}" data-part="number" width="920" height="720"></canvas><button type="button" class="eraseInk" data-clear-key="${key}" data-clear-part="number">消す</button></div>`
}
function keypad(){return `<div class="keypad">${[1,2,3,4,5,6,7,8,9,0].map(n=>`<button data-k="${n}">${n}</button>`).join("")}<button data-k="C">C</button><button data-k="B">←</button></div>`}
function key(k,q){let f=q.format==="qr"?(typed.q===""?"q":"r"):"value";if(k==="C")typed={q:"",r:"",value:""};else if(k==="B")typed[f]=typed[f].slice(0,-1);else if(q.format==="qr"){if(typed.q==="")typed.q=k;else typed.r=(typed.r+k).slice(0,2)}else typed[f]=(typed[f]+k).slice(0,2);update()}
function update(){if($("#dq"))$("#dq").textContent=typed.q+(selectedUnits.q?" "+selectedUnits.q:"");if($("#dr"))$("#dr").textContent=typed.r+(selectedUnits.r?" "+selectedUnits.r:"");if($("#dv"))$("#dv").textContent=typed.value+(selectedUnits.value?" "+selectedUnits.value:"")}
function draw(c){let x=c.getContext("2d"),on=false;x.lineWidth=11;x.lineCap="round";x.strokeStyle="#173229";let p=e=>{let r=c.getBoundingClientRect();return[(e.clientX-r.left)*c.width/r.width,(e.clientY-r.top)*c.height/r.height]};c.onpointerdown=e=>{on=true;c.setPointerCapture?.(e.pointerId);let[a,b]=p(e);x.beginPath();x.moveTo(a,b)};c.onpointermove=e=>{if(!on)return;let[a,b]=p(e);x.lineTo(a,b);x.stroke()};c.onpointerup=()=>on=false;c.onpointercancel=()=>on=false}
function scratch(){let c=$("#scratchCanvas"),x=c.getContext("2d");x.clearRect(0,0,c.width,c.height);draw(c);$("#clearScratch").onclick=()=>x.clearRect(0,0,c.width,c.height)}
function at(q){if(q.format==="qr")return `${q.answer.q}${q.qUnit||""} あまり ${q.answer.r}${q.rUnit||""}`;return `${q.answer.value}${q.unit||""}`}
function normalizeUnitText(t){return (t||"").replace(/\s/g,"").replace(/[個箇ケ]/g,"こ").replace(/枚/g,"まい").replace(/袋/g,"ふくろ").replace(/艘/g,"そう").replace(/センチメートル|センチ/g,"cm").replace(/[Ｃｃ][Ｍｍ]/g,"cm").replace(/臺/g,"台").replace(/[マま][イぃ]/g,"まい").replace(/本ほん/g,"本")}
function parseAiText(text,unit){let t=normalizeUnitText(text);let m=t.match(/[0-9０-９]+/);let num=m?Number(m[0].replace(/[０-９]/g,ch=>"０１２３４５６７８９".indexOf(ch))):NaN;let hasUnit=!unit||t.includes(normalizeUnitText(unit));return{num,hasUnit,text:t}}
function preparedCanvas(src,scale=2,threshold=205){
  const c=document.createElement("canvas"),w=src.width*scale,h=src.height*scale;c.width=w;c.height=h;
  const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,w,h);x.drawImage(src,0,0,w,h);
  const im=x.getImageData(0,0,w,h),d=im.data;
  for(let i=0;i<d.length;i+=4){
    const g=(d[i]+d[i+1]+d[i+2])/3, v=g<threshold?0:255;
    d[i]=d[i+1]=d[i+2]=v;d[i+3]=255;
  }
  x.putImageData(im,0,0);return c;
}
async function ocrOnce(canvas,lang,params){
  const r=await Tesseract.recognize(canvas,lang,{...params,logger:m=>{if(m.status==="recognizing text")$("#aiStatus").textContent=`🤖 AIが答えを読んでいます… ${Math.round((m.progress||0)*100)}%`}});
  return {text:r.data.text||"",confidence:r.data.confidence||0};
}
async function aiReadNumber(canvas){
  if(!window.Tesseract)throw new Error("AI読取ライブラリを読み込めません");
  const tests=[
    [preparedCanvas(canvas,2,190),"eng",{tessedit_char_whitelist:"0123456789",tessedit_pageseg_mode:"10"}],
    [preparedCanvas(canvas,2,215),"eng",{tessedit_char_whitelist:"0123456789",tessedit_pageseg_mode:"10"}],
    [preparedCanvas(canvas,3,205),"eng",{tessedit_char_whitelist:"0123456789",tessedit_pageseg_mode:"7"}]
  ];
  let best={text:"",confidence:0};
  for(const [c,l,p] of tests){const r=await ocrOnce(c,l,p);if(r.confidence>best.confidence)best=r}
  return best;
}
async function aiReadUnit(canvas){
  if(!window.Tesseract)throw new Error("AI読取ライブラリを読み込めません");
  const a=await ocrOnce(preparedCanvas(canvas,2,205),"jpn+eng",{tessedit_pageseg_mode:"10"});
  const b=await ocrOnce(preparedCanvas(canvas,2,220),"jpn+eng",{tessedit_pageseg_mode:"7"});
  return a.confidence>=b.confidence?a:b;
}
function digitValue(text){
  const m=(text||"").replace(/[０-９]/g,ch=>"０１２３４５６７８９".indexOf(ch)).match(/\d+/);
  return m?Number(m[0]):NaN;
}
async function aiCheck(q){
  $("#checkBtn").disabled=true;
  $("#aiStatus").className="aiStatus";
  $("#aiStatus").textContent="🤖 AIが答えを読んでいます…";
  try{
    let results={};
    for(const key of (q.format==="qr"?["q","r"]:["value"])){
      const numCanvas=document.querySelector(`canvas[data-ai-key="${key}"][data-part="number"]`);
      const unitCanvas=document.querySelector(`canvas[data-ai-key="${key}"][data-part="unit"]`);
      const nr=await aiReadNumber(numCanvas);
      const expectedUnit=key==="q"?q.qUnit:key==="r"?q.rUnit:q.unit;

      let ur={text:"",confidence:0};
      if(expectedUnit&&unitCanvas) ur=await aiReadUnit(unitCanvas);

      const readUnit=normalizeUnitText(ur.text);
      const expectedNorm=normalizeUnitText(expectedUnit||"");
      const unitExact=!expectedUnit || readUnit.includes(expectedNorm);
      const unitUnreadable=!!expectedUnit && (ur.confidence<35 || !readUnit);
      const unitConfidentWrong=!!expectedUnit && !unitExact && ur.confidence>=55 && readUnit.length>0;

      results[key]={
        num:digitValue(nr.text),
        numConf:nr.confidence,
        rawNum:nr.text,
        rawUnit:ur.text,
        unitExact,
        unitUnreadable,
        unitConfidentWrong
      };
    }

    // 数字が読めない場合は「不正解」にしない。
    const unreadableNumberKeys=Object.entries(results)
      .filter(([key,x])=>!Number.isFinite(x.num)||x.numConf<18)
      .map(([key])=>key);
    if(unreadableNumberKeys.length){
      const label=k=>q.format==="qr"?(k==="q"?"商の数字":"あまりの数字"):"答えの数字";
      const labels=unreadableNumberKeys.map(label);
      const msg=labels.length===1?labels[0]:labels.slice(0,-1).join("、")+"と"+labels[labels.length-1];
      const f=$("#feedback");
      f.className="feedback answer";
      f.innerHTML=`🤖 <b>${msg}</b>をはっきり読めませんでした。該当するマスの<b>「消す」</b>で書き直して、数字をマスいっぱいに大きく書いてみてね。<br><small>AIが読めないだけなので、不正解にはしていません。</small>`;
      return;
    }

    const numberCorrect=q.format==="qr"
      ? results.q.num===q.answer.q && results.r.num===q.answer.r
      : results.value.num===q.answer.value;

    // 単位が「明確に別の単位」と読めた場合だけ単位不正解。
    const confidentUnitWrong=Object.values(results).some(x=>x.unitConfidentWrong);

    // 単位OCRが曖昧なら、正しい数字を誤答にしない。単位だけ書き直し案内。
    const ambiguousUnitKeys=Object.entries(results)
      .filter(([key,x])=>x.unitUnreadable && !x.unitExact)
      .map(([key])=>key);
    const unitAmbiguous=ambiguousUnitKeys.length>0;

    if(numberCorrect && unitAmbiguous && !confidentUnitWrong){
      const unitLabel=k=>q.format==="qr"?(k==="q"?"商の単位":"あまりの単位"):"答えの単位";
      const labels=ambiguousUnitKeys.map(unitLabel);
      const msg=labels.length===1?labels[0]:labels.slice(0,-1).join("、")+"と"+labels[labels.length-1];
      const f=$("#feedback");
      f.className="feedback answer";
      f.innerHTML=`🤖 数字は正しく読めました。<b>${msg}</b>だけAIがはっきり読めませんでした。該当する単位のマスだけ書き直して、もう一度「こたえあわせ」を押してね。<br><small>数字は正解なので、不正解にはしていません。</small>`;
      return;
    }

    if(numberCorrect && !confidentUnitWrong){
      fb(q,true);
      return;
    }

    if(!numberCorrect){
      fb(q,false);
      return;
    }

    // 数字は合っているが、単位を高い確信度で別物と読んだ場合のみ不正解。
    fb(q,false);

  }catch(e){
    const f=$("#feedback");
    f.className="feedback answer";
    f.innerHTML="🤖 AI判定を始められませんでした。通信を確認して、もう一度ためしてください。";
  }finally{
    $("#aiStatus").className="aiStatus hidden";
    $("#checkBtn").disabled=false;
  }
}
function check(){let q=set[idx];if(q.format==="choice"){if(!selectedChoice)return alert("答えをえらんでください。");return fb(q,selectedChoice===q.answer.value)}if(mode==="hand")return aiCheck(q);if(needsUnits(q)){if(q.format==="qr"&&((q.qUnit&&!selectedUnits.q)||(q.rUnit&&!selectedUnits.r)))return alert("単位まで答えましょう。");if(q.format!=="qr"&&q.unit&&!selectedUnits.value)return alert("単位まで答えましょう。")}let ok=q.format==="qr"?+typed.q===q.answer.q&&+typed.r===q.answer.r:+typed.value===q.answer.value;fb(q,ok)}
function fb(q,ok){if(ok)score++;let f=$("#feedback");f.className="feedback "+(ok?"ok":"ng");f.innerHTML=(ok?"⭕ せいかい！<br>":"△ ちがいます。答え：<b>"+at(q)+"</b><br>")+q.explanation;$("#checkBtn").classList.add("hidden");$("#showAnswerBtn").classList.add("hidden");$("#nextBtn").classList.remove("hidden")}
function showAnswer(){let q=set[idx],f=$("#feedback");f.className="feedback answer";f.innerHTML=`💡 答え：<b>${at(q)}</b><br>${q.explanation}`;$("#checkBtn").classList.add("hidden");$("#showAnswerBtn").classList.add("hidden");$("#nextBtn").classList.remove("hidden")}
function next(){if(++idx<10)render();else finish()}function finish(){let e=2+Math.floor(score/2);state.pieces+=e;while(state.pieces>=25*(state.world+1))state.world++;save();$("#scoreText").textContent=`${score} / 10 問 せいかい`;$("#pieceEarned").textContent=`${e}ピース GET！`;puzzle();show("result")}
function puzzle(){let local=state.pieces%25,bg=`linear-gradient(135deg,hsl(${(state.world*73)%360} 70% 80%),hsl(${(state.world*73+110)%360} 70% 65%))`;$("#worldTitle").textContent=themes[state.world%themes.length]+"・"+(state.world+1);$("#totalPieces").textContent=state.pieces;$("#pieceText").textContent="ピース "+state.pieces;$("#miniPuzzle").style.background=bg;let box=$("#jigsaw");box.innerHTML="";for(let i=0;i<25;i++){let p=document.createElement("div");p.className="piece"+(i<local?" on":"");p.style.background=bg;box.appendChild(p)}$("#puzzleStatus").textContent=`この絵は ${local} / 25 ピース。`}
document.querySelectorAll(".groupBtn").forEach(b=>b.onclick=()=>{selectedGroup=b.dataset.group;document.querySelectorAll(".groupBtn").forEach(x=>x.classList.toggle("selected",x===b))});document.querySelectorAll(".modeBtn").forEach(b=>b.onclick=()=>{mode=b.dataset.mode;document.querySelectorAll(".modeBtn").forEach(x=>x.classList.toggle("selected",x===b));$("#modeNote").textContent=mode==="keypad"?"テンキーでも、文章問題は単位まで答えます。":"書いた答えをAIが読み取って、自動で○×判定します。"});
$("#startBtn").onclick=start;$("#checkBtn").onclick=check;$("#showAnswerBtn").onclick=showAnswer;$("#nextBtn").onclick=next;$("#againBtn").onclick=start;$("#homeBtn").onclick=()=>{if($("#quiz").classList.contains("hidden")||confirm("この10問を途中でやめてホームに戻りますか？"))show("home")};$("#resultPuzzleBtn").onclick=()=>{puzzle();show("puzzle")};$("#puzzleHome").onclick=()=>show("home");$("#resultHomeBtn").onclick=()=>show("home");fetch("questions.json?v=3").then(r=>r.json()).then(d=>{bank=d.questions;puzzle()}).catch(()=>alert("問題データを読み込めませんでした。"));
