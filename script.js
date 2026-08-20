/* ---------- boot ---------- */
window.addEventListener('load', ()=>{
  setTimeout(()=>document.getElementById('boot').classList.add('hide'), 2300);
});

/* ---------- confetti (kept to 3 tones) ---------- */
(function(){
  const colors = ['#5be3ff','#ffc857','#ff7a5c'];
  const wrap = document.getElementById('confetti');
  for(let i=0;i<10;i++){
    const s = document.createElement('span');
    s.style.left = Math.random()*100 + 'vw';
    s.style.background = colors[i % colors.length];
    s.style.animationDuration = (9 + Math.random()*10) + 's';
    s.style.animationDelay = (Math.random()*10) + 's';
    s.style.width = s.style.height = (5 + Math.random()*4) + 'px';
    wrap.appendChild(s);
  }
})();

/* ---------- scroll reveal ---------- */
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
}, {threshold:.15});
document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));

/* ---------- pixel sprite builder ---------- */
function buildSprite(rows, colorMap, size, cls){
  const cols = rows[0].length;
  let rects = '';
  rows.forEach((row, r)=>{
    for(let c=0;c<cols;c++){
      const ch = row[c];
      if(ch === '.') continue;
      const color = colorMap[ch] || '#000';
      rects += `<rect x="${c*size}" y="${r*size}" width="${size}" height="${size}" fill="${color}"/>`;
    }
  });
  return `<svg class="${cls}" width="${cols*size}" height="${rows.length*size}" viewBox="0 0 ${cols*size} ${rows.length*size}">${rects}</svg>`;
}

/* ---------- walking mini figure (black hair, holding a small avatar-figure toy) ---------- */
let walkerWidth = 98, walkerHeight = 126;
(function(){
  const colorMap = {
    h:'#161616', f:'#f4c396', g:'#2fae66', k:'#14161c', s:'#f5f5f5', e:'#14161c'
  };
  const common = [
    "..............",
    "...hhhhhh....",
    "..hhhhhhhh...",
    "..hffffffh...",
    "..hfeffefh...",
    "...ffffff....",
    "....ffff.....",
    "..ggggggggf...",
    "..ggggggggf...",
    "..gggggggg....",
    "..gggggggg....",
    "..gggggggg....",
    "...gggggg.....",
    "...kkkkkk.....",
    "..kkkkkkkk...."
  ];
  const legsA = [
    "...kkk..kkk..",
    "...kk....kk..",
    "...ss....ss.."
  ];
  const legsB = [
    ".kkk....kkk...",
    ".kk......kk...",
    ".ss......ss..."
  ];

  // pad every row to the same length (14) so the grid stays aligned
  function pad(rows){
    const w = 14;
    return rows.map(r => (r.length < w) ? r + '.'.repeat(w - r.length) : r.slice(0,w));
  }
  const size = 7;
  const framesA = pad(common.concat(legsA));
  const framesB = pad(common.concat(legsB));
  const svgA = buildSprite(framesA, colorMap, size, 'frameA');
  const svgB = buildSprite(framesB, colorMap, size, 'frameB');
  walkerWidth = framesA[0].length * size;
  walkerHeight = framesA.length * size;

  // small avatar-figure toy: dark hair, blue face, teal collar/robe — held out near the hand
  const toyColorMap = { d:'#161616', t:'#4f9fd9', c:'#1f6b6b' };
  const toyRows = [
    ".dddddd.",
    "dddddddd",
    "dttttttd",
    ".tttttt.",
    ".tttttt.",
    "..tttt..",
    ".cccccc.",
    "cccccccc",
    "cccccccc",
    ".cccccc."
  ];
  const toySvg = buildSprite(toyRows, toyColorMap, 7, 'toy-svg');
  const toyWrap = document.createElement('div');
  toyWrap.className = 'toy-wrap';
  toyWrap.innerHTML = toySvg;

  const flip = document.getElementById('walkerFlip');
  flip.innerHTML = svgA + svgB;
  flip.appendChild(toyWrap);

  // account for the toy's overhang so the lane bounds keep it fully visible
  walkerWidth = Math.max(walkerWidth, 68 + toyRows[0].length * 7);
})();

/* ---------- small companion robot that hovers along beside him ---------- */
let robotWidth = 60;
(function(){
  const colorMap = { m:'#233a63', y:'#5be3ff', o:'#ffc857', k:'#14161c' };
  const rows = [
    "....oo....",
    "....mm....",
    ".mmmmmmmm.",
    ".myymmyym.",
    ".mmmmmmmm.",
    "..mmmmmm..",
    ".mmmmmmmm.",
    ".mmmmmmmm.",
    ".mmmmmmmm.",
    "..mm..mm..",
    "..kk..kk.."
  ];
  const svg = buildSprite(rows, colorMap, 6, 'robot-svg');
  robotWidth = rows[0].length * 6;
  document.getElementById('botBuddyBob').innerHTML = svg;
})();

/* random back-and-forth wandering within the lane, with the robot buddy trailing along */
(function(){
  const lane = document.getElementById('walkLane');
  const walker = document.getElementById('walker');
  const flip = document.getElementById('walkerFlip');
  const robot = document.getElementById('botBuddy');
  let x = 20, targetX = 20, dir = 1, moving = false;

  function laneMax(){
    return Math.max(0, lane.clientWidth - walkerWidth);
  }
  function robotMax(){
    return Math.max(0, lane.clientWidth - robotWidth);
  }
  function pickTarget(){
    targetX = Math.random() * laneMax();
    moving = true;
  }
  function tick(){
    if(moving){
      const dx = targetX - x;
      if(Math.abs(dx) < 2){
        x = targetX; moving = false;
        setTimeout(pickTarget, 1000 + Math.random()*2200);
      } else {
        dir = dx > 0 ? 1 : -1;
        x += dir * 1.3;
        walker.style.transform = `translateX(${x}px)`;
        flip.style.transform = `scaleX(${dir})`;
      }
    }
    // robot buddy trails just behind him, whichever way he's facing
    const robotX = Math.max(0, Math.min(x + (dir > 0 ? -46 : 46), robotMax()));
    robot.style.transform = `translateX(${robotX}px)`;
    requestAnimationFrame(tick);
  }
  setInterval(()=>{ walker.classList.toggle('step', moving); }, 220);
  setTimeout(pickTarget, 600);
  requestAnimationFrame(tick);
  window.addEventListener('resize', ()=>{ targetX = Math.min(targetX, laneMax()); });
})();

/* ---------- pixel cake ---------- */
const cakeColors = {
  '.': null, r:'#ff3b5c', p:'#ffb6d2', w:'#fef6ff', c:'#8a5a34', l:'#233a63',
  '1':'#5be3ff', '2':'#ffc857'
};
const cakeGrid = [
  ".........rr.........",
  "......pppppppp......",
  "......w1wwww2ww......",
  "......wwwwwwww......",
  "...pppppppppppppp...",
  "...cc1cccc2cccc1c...",
  "...cccccccccccccc...",
  "...cccccccccccccc...",
  "pppppppppppppppppppp",
  "ww2wwww1wwww2wwww1ww",
  "wwwwwwwwwwwwwwwwwwww",
  "llllllllllllllllllll"
];
(function(){
  const size = 10;
  const cols = cakeGrid[0].length;
  let rects = '';
  cakeGrid.forEach((row,r)=>{
    for(let c=0;c<cols;c++){
      const ch = row[c];
      const color = cakeColors[ch];
      if(!color) continue;
      rects += `<rect x="${c*size}" y="${r*size+30}" width="${size}" height="${size}" fill="${color}"/>`;
    }
  });
  const svg = `<svg width="${cols*size}" height="${cakeGrid.length*size+30}" viewBox="0 0 ${cols*size} ${cakeGrid.length*size+30}">${rects}</svg>`;
  const stage = document.getElementById('cakeStage');
  stage.style.width = (cols*size) + 'px';
  stage.style.height = (cakeGrid.length*size+30) + 'px';
  stage.insertAdjacentHTML('afterbegin', svg);
})();

/* ---------- candles: 5 fixed on load, plus user can add more by tapping ---------- */
const stage = document.getElementById('cakeStage');
const candleCountEl = document.getElementById('candleCount');
const cakeMsg = document.getElementById('cakeMsg');
let candles = [];
const MAX_CANDLES = 12;

function placeCandle(x, y){
  const el = document.createElement('div');
  el.className = 'candle';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.innerHTML = '<div class="flame"></div>';
  stage.appendChild(el);
  candles.push({el});
}

function updateCount(){
  const lit = candles.filter(c=>!c.el.classList.contains('out')).length;
  candleCountEl.textContent = lit + ' CANDLE' + (lit!==1?'S':'') + ' LIT';
  if(candles.length>0 && lit===0){
    cakeMsg.innerHTML = '<strong>WISH REGISTERED.</strong><br>MAY IT COME TRUE WITHOUT ERRORS.';
  }
}

/* 5 default candles, spread across the top of the cake */
[[62,32],[86,20],[105,14],[124,20],[148,32]].forEach(([x,y])=>placeCandle(x,y));
updateCount();

stage.addEventListener('click', (e)=>{
  if(candles.length >= MAX_CANDLES) return;
  const rect = stage.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = Math.min(e.clientY - rect.top, rect.height - 26);
  placeCandle(x, y);
  cakeMsg.innerHTML = 'TAP FOR MORE, OR BLOW TO MAKE A WISH.';
  updateCount();
});

function blowOutCandles(){
  let blown = 0;
  candles.forEach(c=>{
    if(!c.el.classList.contains('out') && Math.random() > 0.5){
      c.el.classList.add('out');
      blown++;
    }
  });
  if(blown>0) updateCount();
}

/* ---------- mic ---------- */
const micBtn = document.getElementById('micBtn');
let audioCtx, analyser, dataArray, blowTimer;

micBtn.addEventListener('click', async ()=>{
  if(micBtn.classList.contains('listening')) return;
  try{
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);
    micBtn.classList.add('listening');
    micBtn.innerHTML = '<span class="dot"></span> LISTENING… BLOW NOW';
    blowTimer = setInterval(()=>{
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a,b)=>a+b,0)/dataArray.length;
      if(avg > 40) blowOutCandles();
      if(candles.every(c=>c.el.classList.contains('out'))){
        clearInterval(blowTimer);
        micBtn.classList.remove('listening');
        micBtn.innerHTML = '<span class="dot"></span> WISH COMPLETE';
      }
    }, 200);
  }catch(err){
    cakeMsg.innerHTML = 'MIC ACCESS DENIED. TAP "BLOW" BELOW INSTEAD.';
    micBtn.innerHTML = '<span class="dot"></span> BLOW (NO MIC)';
    micBtn.onclick = ()=>{ blowOutCandles(); };
  }
});

/* ---------- mini sudoku ---------- */
(function(){
  const solution = [1,2,3,4, 3,4,1,2, 2,1,4,3, 4,3,2,1];
  const givens =   [1,0,3,4, 0,4,0,2, 2,1,0,3, 0,3,2,0];
  const grid = document.getElementById('sudokuGrid');
  const msg = document.getElementById('sudokuMsg');
  const inputs = [];

  givens.forEach((v, i)=>{
    const inp = document.createElement('input');
    inp.maxLength = 1;
    inp.inputMode = 'numeric';
    if(v){
      inp.value = v;
      inp.disabled = true;
    } else {
      inp.addEventListener('input', ()=>{
        inp.value = inp.value.replace(/[^1-4]/g,'').slice(0,1);
      });
    }
    grid.appendChild(inp);
    inputs.push(inp);
  });

  document.getElementById('sudokuCheck').addEventListener('click', ()=>{
    const values = inputs.map(inp => parseInt(inp.value || '0', 10));
    if(values.includes(0)){
      msg.textContent = 'FILL EVERY CELL FIRST.';
      return;
    }
    const correct = values.every((v,i) => v === solution[i]);
    msg.innerHTML = correct
      ? '<strong style="color:var(--gold)">SOLVED! NICE BRAIN.</strong>'
      : 'NOT QUITE — CHECK ROWS, COLUMNS &amp; BOXES.';
  });
})();

/* ---------- reaction / latency test ---------- */
(function(){
  const box = document.getElementById('reactionBox');
  const label = document.getElementById('reactionLabel');
  const msg = document.getElementById('reactionMsg');
  const btn = document.getElementById('reactionBtn');
  let state = 'idle';
  let timeoutId, startTime;

  function verdict(ms){
    if(ms < 220) return 'ROBOT-LIKE REFLEXES 🤖';
    if(ms < 350) return 'PRETTY SHARP FOR A 43 Y/O ⚡';
    if(ms < 500) return 'RESPECTABLE 😎👍';
    return 'TAKE YOUR TIME, OLD TIMER 🐢';
  }

  btn.addEventListener('click', ()=>{
    if(state === 'idle' || state === 'done'){
      state = 'waiting';
      box.className = 'reaction-box wait';
      label.textContent = 'WAIT FOR GREEN…';
      msg.textContent = "DON'T CLICK YET.";
      btn.textContent = 'WAITING…';
      const delay = 1000 + Math.random()*2500;
      timeoutId = setTimeout(()=>{
        state = 'go';
        box.className = 'reaction-box go';
        label.textContent = 'CLICK NOW!';
        startTime = performance.now();
      }, delay);
    }
  });

  box.addEventListener('click', ()=>{
    if(state === 'waiting'){
      clearTimeout(timeoutId);
      state = 'done';
      box.className = 'reaction-box';
      label.textContent = 'TOO SOON';
      msg.textContent = 'YOU JUMPED THE GUN. TRY AGAIN.';
      btn.textContent = 'START TEST';
    } else if(state === 'go'){
      const ms = Math.round(performance.now() - startTime);
      state = 'done';
      box.className = 'reaction-box';
      label.textContent = ms + ' MS';
      msg.textContent = verdict(ms);
      btn.textContent = 'TRY AGAIN';
    }
  });
})();

/* ---------- typewriter wish message ---------- */
const wishText = "Happy Birthday, Mister Gopi! 🎂😂 Another year older, wiser… (and the same level of nonsense). Hope your day is filled with good food, zero stress, and people laughing at your jokes. Have a good one, mister! 🧛\u200d♂️🎉";
const twEl = document.getElementById('typewriter');
let typed = false;
const twObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !typed){
      typed = true;
      let i=0;
      const iv = setInterval(()=>{
        twEl.textContent = wishText.slice(0,i);
        i++;
        if(i>wishText.length) clearInterval(iv);
      }, 26);
    }
  });
}, {threshold:.4});
twObs.observe(document.querySelector('.terminal'));

/* ---------- conveyor belt gallery (photo or video per slot) ---------- */
(function(){
  const track = document.getElementById('beltTrack');
  const SLOT_COUNT = 4;

  function makeSlot(num){
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.innerHTML = `
      <video class="media-video" muted loop playsinline autoplay style="display:none"></video>
      <img class="media-img" alt="" style="display:none">
      <div class="ph-icon"></div>
      <div class="label">SLOT_0${num}</div>
    `;
    const video = slot.querySelector('.media-video');
    const img = slot.querySelector('.media-img');
    const icon = slot.querySelector('.ph-icon');
    const label = slot.querySelector('.label');

    function reveal(el){
      el.style.display = 'block';
      icon.style.display = 'none';
      label.style.display = 'none';
    }

    // try a video for this slot first (assets/photo-N.mp4)
    video.addEventListener('loadeddata', ()=> reveal(video));
    video.addEventListener('error', ()=>{
      // no video for this slot — fall back to a photo (assets/photo-N.jpg)
      img.src = `assets/photo-${num}.jpg`;
    });
    img.addEventListener('load', ()=> reveal(img));
    img.addEventListener('error', ()=>{ /* neither found — keep placeholder icon */ });

    video.src = `assets/photo-${num}.mp4`;

    return slot;
  }

  // duplicate the set once so the belt loop is seamless
  [1,2].forEach(()=>{
    for(let i=1;i<=SLOT_COUNT;i++) track.appendChild(makeSlot(i));
  });
})();
