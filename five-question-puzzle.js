(()=>{
  const TOTAL=5;
  const PIECES_PER_PUZZLE=25;
  const originalMakeSet=makeSet;
  const originalRender=render;

  function escSvg(s){return encodeURIComponent(s).replace(/'/g,'%27').replace(/"/g,'%22')}

  function sceneSvg(world){
    const n=world%6;
    const title=themes[world%themes.length]+"・"+(world+1);
    const scenes=[
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="#bfe9ff"/><stop offset="1" stop-color="#dff3c3"/></linearGradient></defs><rect width="500" height="500" fill="url(#g)"/><circle cx="410" cy="75" r="42" fill="#ffd45c"/><path d="M0 330L110 210l90 95 85-120 125 145 90-85v255H0z" fill="#78b96b"/><path d="M0 380l130-95 105 82 115-120 150 133v120H0z" fill="#4d8b55"/><g fill="#245c3b"><rect x="55" y="300" width="18" height="110"/><circle cx="64" cy="280" r="42"/><rect x="410" y="295" width="18" height="115"/><circle cx="419" cy="272" r="46"/></g><path d="M145 500q100-150 210 0" fill="#e8d6a4"/><text x="250" y="55" text-anchor="middle" font-size="24" font-family="sans-serif" font-weight="700" fill="#19462e">${title}</text></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><defs><linearGradient id="g" y2="1"><stop stop-color="#9be5ff"/><stop offset="1" stop-color="#167bc4"/></linearGradient></defs><rect width="500" height="500" fill="url(#g)"/><circle cx="95" cy="90" r="38" fill="#fff6b8" opacity=".9"/><g fill="#fff" opacity=".7"><circle cx="80" cy="195" r="8"/><circle cx="120" cy="235" r="12"/><circle cx="415" cy="165" r="9"/></g><path d="M0 385q70-40 140 0t140 0t140 0t140 0v115H0z" fill="#0a5c96"/><g fill="#ffd76a"><path d="M105 270q45-40 90 0q-45 40-90 0m90 0l35-25v50z"/><path d="M325 220q38-34 76 0q-38 34-76 0m76 0l28-20v40z"/></g><g fill="#55c987"><path d="M35 500q15-110 35 0M70 500q20-140 42 0M435 500q15-115 30 0"/></g><text x="250" y="55" text-anchor="middle" font-size="24" font-family="sans-serif" font-weight="700" fill="#075486">${title}</text></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><rect width="500" height="500" fill="#111a3a"/><g fill="#fff"><circle cx="55" cy="70" r="3"/><circle cx="130" cy="125" r="4"/><circle cx="420" cy="90" r="3"/><circle cx="380" cy="330" r="4"/><circle cx="90" cy="390" r="3"/></g><circle cx="390" cy="150" r="70" fill="#7a6ee6"/><ellipse cx="390" cy="150" rx="105" ry="24" fill="none" stroke="#d9b7ff" stroke-width="10"/><circle cx="135" cy="300" r="82" fill="#4fc0ef"/><path d="M75 300q60-70 120 0q-60 70-120 0" fill="#48b66e"/><path d="M225 180l45 35-16 52-58 4-18-49z" fill="#e7edf7"/><rect x="211" y="160" width="30" height="34" rx="8" fill="#f5a34c"/><text x="250" y="55" text-anchor="middle" font-size="24" font-family="sans-serif" font-weight="700" fill="#fff">${title}</text></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><defs><linearGradient id="g" y2="1"><stop stop-color="#ffdf9f"/><stop offset="1" stop-color="#e89a55"/></linearGradient></defs><rect width="500" height="500" fill="url(#g)"/><circle cx="400" cy="80" r="45" fill="#ffef87"/><path d="M0 330l90-90 80 70 90-135 105 125 65-70 70 100v170H0z" fill="#b96b43"/><path d="M0 385q100-45 190 0t180 0t130 0v115H0z" fill="#76a95b"/><path d="M160 355c25-52 80-57 110-24 20 22 15 63-19 75-36 13-88-8-91-51zm90-26 42-46 22 13-40 51z" fill="#335b38"/><circle cx="190" cy="342" r="5" fill="#fff"/><text x="250" y="55" text-anchor="middle" font-size="24" font-family="sans-serif" font-weight="700" fill="#6f3d24">${title}</text></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><rect width="500" height="500" fill="#fff2c9"/><path d="M0 380q80-80 160 0t160 0t180 0v120H0z" fill="#ffc6d8"/><g><rect x="95" y="235" width="15" height="150" fill="#d28a55"/><circle cx="102" cy="215" r="55" fill="#ff6f91"/><path d="M102 160v110M48 215h108M65 178l74 74M139 178l-74 74" stroke="#fff" stroke-width="8"/><rect x="375" y="270" width="14" height="125" fill="#c57d4b"/><circle cx="382" cy="250" r="48" fill="#78c9ff"/></g><path d="M205 380v-110h92v110M225 270v-58h52v58" fill="#ffd46d" stroke="#d68154" stroke-width="8"/><circle cx="250" cy="238" r="8" fill="#d68154"/><text x="250" y="55" text-anchor="middle" font-size="24" font-family="sans-serif" font-weight="700" fill="#a44768">${title}</text></svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><defs><linearGradient id="g" y2="1"><stop stop-color="#86d5ff"/><stop offset="1" stop-color="#eaf9ff"/></linearGradient></defs><rect width="500" height="500" fill="url(#g)"/><g fill="#fff"><ellipse cx="110" cy="130" rx="75" ry="34"/><ellipse cx="360" cy="110" rx="85" ry="38"/><ellipse cx="300" cy="285" rx="105" ry="42"/></g><path d="M170 420V275h160v145M145 420h210v35H145z" fill="#f3d379" stroke="#8b6b57" stroke-width="7"/><path d="M150 275l60-70 40 42 42-62 63 90z" fill="#f8b6c9" stroke="#8b6b57" stroke-width="7"/><rect x="215" y="335" width="70" height="85" rx="30" fill="#9c79c9"/><text x="250" y="55" text-anchor="middle" font-size="24" font-family="sans-serif" font-weight="700" fill="#245b7a">${title}</text></svg>`
    ];
    return `url("data:image/svg+xml,${escSvg(scenes[n])}")`;
  }

  function addPuzzleStyles(){
    if(document.querySelector('#fivePuzzleStyle'))return;
    const s=document.createElement('style');s.id='fivePuzzleStyle';s.textContent=`
      .jigsaw,.miniPuzzle,.earnedMiniPuzzle{display:grid!important;grid-template-columns:repeat(5,1fr);grid-template-rows:repeat(5,1fr);background:#e7ece9!important;overflow:hidden}
      .miniPuzzle{height:auto!important;aspect-ratio:1;max-width:320px;margin:12px auto;border:4px solid #fff;box-shadow:0 5px 18px #0002}
      .piece,.miniPiece,.earnedMiniPiece{position:relative;background-repeat:no-repeat;opacity:.09;filter:grayscale(1);border:1px solid #ffffffaa;transition:opacity .25s,filter .25s,transform .25s}
      .piece.on,.miniPiece.on,.earnedMiniPiece.on{opacity:1;filter:none}
      .piece.on::after,.miniPiece.on::after,.earnedMiniPiece.on::after{content:"";position:absolute;inset:0;box-shadow:inset 0 0 0 1px #fff8}
      .piece.newPiece,.miniPiece.newPiece,.earnedMiniPiece.newPiece{animation:piecePop .8s ease}
      @keyframes piecePop{0%{transform:scale(.55);opacity:.1}55%{transform:scale(1.12);opacity:1}100%{transform:scale(1)}}
      .earnedPuzzleCard{margin:14px auto;max-width:390px;padding:14px;border-radius:16px;background:#f7fbf8;border:2px solid #cfe5da}
      .earnedMiniPuzzle{width:220px;aspect-ratio:1;margin:10px auto;border-radius:14px}
      .pieceHole{background:#dfe6e2!important;opacity:.55!important;filter:none!important}
    `;document.head.appendChild(s);
  }

  function fillGrid(box,world,count,mini=false,newIndex=-1){
    if(!box)return;
    box.innerHTML='';
    const bg=sceneSvg(world);
    for(let i=0;i<PIECES_PER_PUZZLE;i++){
      const p=document.createElement('div');
      p.className=(mini?'miniPiece':'piece')+(i<count?' on':'')+(i===newIndex?' newPiece':'')+(i>=count?' pieceHole':'');
      p.style.backgroundImage=bg;
      p.style.backgroundSize='500% 500%';
      const col=i%5,row=Math.floor(i/5);
      p.style.backgroundPosition=`${col*25}% ${row*25}%`;
      box.appendChild(p);
    }
  }

  makeSet=function(){
    originalMakeSet();
    set=set.slice(0,TOTAL);
  };

  render=function(){
    originalRender();
    $('#qCount').textContent=`${idx+1} / ${TOTAL}`;
    $('#barFill').style.width=`${((idx+1)/TOTAL)*100}%`;
  };

  next=function(){if(++idx<TOTAL)render();else finish()};

  function currentLocal(){return state.pieces%PIECES_PER_PUZZLE}

  puzzle=function(newPieceIndex=-1){
    addPuzzleStyles();
    const local=currentLocal();
    const world=state.world;
    $('#worldTitle').textContent=themes[world%themes.length]+"・"+(world+1);
    $('#totalPieces').textContent=state.pieces;
    $('#pieceText').textContent=`ピース ${state.pieces}`;
    fillGrid($('#jigsaw'),world,local,false,newPieceIndex);
    fillGrid($('#miniPuzzle'),world,local,true,newPieceIndex);
    $('#puzzleStatus').textContent=`この絵は ${local} / ${PIECES_PER_PUZZLE} ピース。集めたピースは自動ではまります。`;
    renderPuzzleGallery();
  };

  finish=function(){
    const beforeLocal=currentLocal();
    state.pieces+=1;
    while(state.pieces>=PIECES_PER_PUZZLE*(state.world+1))state.world++;
    save();
    $('#scoreText').textContent=`${score} / ${TOTAL} 問 せいかい`;
    $('#pieceEarned').textContent='🧩 1ピース GET！ パズルにはめ込みました！';
    const newLocal=currentLocal();
    const newIndex=newLocal===0?-1:Math.max(0,newLocal-1);
    puzzle(newIndex);
    show('result');
    let card=document.querySelector('#earnedPuzzleCard');
    if(!card){
      card=document.createElement('div');card.id='earnedPuzzleCard';card.className='earnedPuzzleCard';
      const target=$('#pieceEarned');target.insertAdjacentElement('afterend',card);
    }
    card.innerHTML='<b>いまのパズル</b><div id="earnedMiniPuzzle" class="earnedMiniPuzzle"></div><small>色が見えているところが、集めたピースです。</small>';
    fillGrid($('#earnedMiniPuzzle'),state.world,newLocal,true,newIndex);
  };

  function patchLabels(){
    addPuzzleStyles();
    const h=document.querySelector('.introCard h1');if(h)h.textContent='5問チャレンジ！';
    const startBtn=$('#startBtn');if(startBtn)startBtn.textContent='この問題で5問スタート！';
    const again=$('#againBtn');if(again)again.textContent='同じ種類でもう5問';
    const resultTitle=document.querySelector('#result h2');if(resultTitle)resultTitle.textContent='5問 おつかれさま！';
    const qc=$('#qCount');if(qc&&qc.textContent==='1 / 10')qc.textContent='1 / 5';
    puzzle();
    if(startBtn)startBtn.onclick=start;
    if($('#nextBtn'))$('#nextBtn').onclick=next;
    if(again)again.onclick=start;
    if($('#puzzleBtn'))$('#puzzleBtn').onclick=()=>{puzzle();show('puzzle')};
    if($('#resultPuzzleBtn'))$('#resultPuzzleBtn').onclick=()=>{puzzle();show('puzzle')};
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patchLabels);else patchLabels();
})();
