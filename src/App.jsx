import React, {
  useState, useEffect, useRef, useCallback
} from "react";
import {
  IMG_FLORAL, IMG_TABLE, IMG_COUPLE, IMG_CASTLE, IMG_DRESS
} from "./images3.js";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Cormorant+Upright:wght@300;400;500&family=Cinzel:wght@400;500&display=swap');

:root {
  --bg:      #f7f5f2;
  --blue:    #3a5a9b;
  --blue-d:  #1e3470;
  --blue-l:  #5b7bbf;
  --blue-xs: rgba(58,90,155,0.08);
  --text:    #1a2a4a;
  --muted:   rgba(58,90,155,0.55);
  --line:    rgba(58,90,155,0.22);
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

html, body, #root {
  width:100%; height:100%;
  background:#f7f5f2;
  overflow:hidden;
  position:fixed;
  top:0; left:0;
}

::-webkit-scrollbar { width:2px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:rgba(58,90,155,.25); border-radius:1px; }

.page {
  position:fixed; inset:0;
  width:100%; height:100%;
  transition: opacity 1.2s ease;
  -webkit-overflow-scrolling:touch;
}
.page.hidden { opacity:0; pointer-events:none; }
.page.gone   { display:none; }

#conf-canvas {
  position:fixed; inset:0;
  width:100%; height:100%;
  pointer-events:none; z-index:9999;
}


.curtain {
  z-index:300;
  background:#0a1020;
  cursor:pointer;
  overflow:hidden;
  -webkit-tap-highlight-color:transparent;
}

.cv-vid {
  position:absolute; inset:0;
  width:100%; height:100%;
  object-fit:cover;
}



/* tap hint */
.cv-hint {
  position:absolute; inset:0; z-index:3;
  display:flex; flex-direction:column;
  align-items:center; justify-content:flex-end;
  padding-bottom:14svh;
  transition: opacity .5s ease;
}
.curtain.open .cv-hint { opacity:0; }

.cv-hint-text {
  font-family:'Cinzel', serif;
  font-size:clamp(10px,2.4vw,12px);
  letter-spacing:.55em;
  text-transform:uppercase;
  color:rgba(200,218,255,.65);
  margin-bottom:18px;
}
.cv-hint-dots {
  display:flex; flex-direction:column;
  align-items:center; gap:4px;
  animation: hint-fall 2s ease-in-out infinite;
}
.cv-hint-dots span {
  display:block; width:5px; height:5px;
  border-radius:50%;
  background:rgba(200,218,255,.5);
}
.cv-hint-dots span:nth-child(2) { opacity:.5; margin-top:-2px; }
.cv-hint-dots span:nth-child(3) { opacity:.22; margin-top:-2px; }
@keyframes hint-fall {
  0%,100% { transform:translateY(0); opacity:.8; }
  50%     { transform:translateY(6px); opacity:1; }
}


.invite {
  z-index:100;
  overflow-y:scroll; overflow-x:hidden;
  -webkit-overflow-scrolling:touch;
  overscroll-behavior-y:contain;
  background:var(--bg);
  position:absolute;
  inset:0;
  touch-action:pan-y;
  will-change:scroll-position;
}

/* ── floral bg layer (fixed behind everything) */
.floral-bg {
  position:fixed; inset:0;
  background-image: var(--floral);
  background-size:cover; background-position:center;
  opacity:.09;
  pointer-events:none; z-index:0;
}

/* ── all content sits above floral */
.invite > *:not(.floral-bg) { position:relative; z-index:1; }

/* ── scroll reveal */
.rv {
  opacity:0; transform:translateY(36px);
  transition:
    opacity .9s cubic-bezier(.22,1,.36,1),
    transform .9s cubic-bezier(.22,1,.36,1);
}
.rv.in { opacity:1; transform:translateY(0); }


.hero-vid {
  position:absolute; inset:0;
  width:100%; height:100%;
  object-fit:cover; opacity:.38;
}
.hero {
  position:relative;
  height:100svh; min-height:560px;
  display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  text-align:center;
  overflow:hidden;
}

/* subtle top/bottom fade over the floral so text reads */
.hero::before,
.hero::after {
  content:''; position:absolute; left:0; right:0; height:30%;
  z-index:1; pointer-events:none;
}
.hero::before {
  top:0;
  background:linear-gradient(to bottom,
    rgba(247,245,242,.95), transparent);
}
.hero::after {
  bottom:0;
  background:linear-gradient(to top,
    rgba(247,245,242,.95), transparent);
}

.hero-body {
  position:relative; z-index:2;
  padding:28px 40px;
  background:rgba(247,245,242,.72);
  border-radius:8px;
  opacity:0; transform:translateY(28px);
  animation: hero-in 1.6s cubic-bezier(.22,1,.36,1) .35s forwards;
}
@keyframes hero-in { to { opacity:1; transform:translateY(0); } }

.hero-tag {
  font-family:'Cinzel', serif;
  font-size:clamp(9px,2vw,10px);
  letter-spacing:.6em; text-transform:uppercase;
  color:rgba(30,52,112,.7); margin-bottom:28px;
}

.hero-names {
  font-family:'Cormorant Upright', serif;
  font-size:clamp(60px,15vw,110px);
  font-weight:300; line-height:.88;
  color:#0e1e5a;
  text-shadow:0 1px 4px rgba(247,245,242,.8);
}
.hero-names em {
  display:block; font-style:italic;
  color:#1e3470;
  text-shadow:0 1px 4px rgba(247,245,242,.8);
}
.hero-amp {
  display:block;
  font-family:'Cormorant Garamond', serif;
  font-size:.42em; font-style:italic;
  color:rgba(58,90,155,.35);
  margin:.16em 0;
}

.hero-date {
  font-family:'Cinzel', serif;
  font-size:clamp(10px,2.4vw,13px);
  letter-spacing:.4em;
  color:rgba(30,52,112,.72); margin-top:14px;
}

.hero-line {
  width:1px; height:52px;
  background:linear-gradient(to bottom,
    transparent, var(--line), transparent);
  margin:24px auto;
}

.hero-scroll {
  font-family:'Cormorant Garamond', serif;
  font-style:italic;
  font-size:clamp(13px,3vw,14px);
  color:rgba(58,90,155,.4); letter-spacing:.1em;
  animation: breathe 3s ease-in-out infinite;
}
@keyframes breathe {
  0%,100% { opacity:.4; }
  50%     { opacity:.85; }
}


.sec {
  padding:88px 28px;
  max-width:520px; margin:0 auto;
  text-align:center;
  position:relative;
}

.sec-tag {
  font-family:'Cinzel', serif;
  font-size:clamp(8px,2vw,9px);
  letter-spacing:.65em; text-transform:uppercase;
  color:rgba(58,90,155,.75); margin-bottom:20px;
}

.sec-title {
  font-family:'Cormorant Upright', serif;
  font-size:clamp(30px,7.5vw,46px);
  font-weight:300; color:#102060;
  line-height:1.1; margin-bottom:16px;
}
.sec-title em { font-style:italic; color:var(--blue); }

.sec-body {
  font-family:'Cormorant Garamond', serif;
  font-size:clamp(17px,4.2vw,20px);
  line-height:1.85; font-weight:300;
  color:rgba(18,34,70,.88);
}

/* frosted content pill */
.frost {
  background:rgba(250,249,247,.82);
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  border-radius:12px;
  padding:52px 28px;
  margin:0 -4px;
}

.rule {
  width:48px; height:1px;
  background:linear-gradient(90deg,
    transparent, var(--line), transparent);
  margin:24px auto;
}

.ornament {
  display:block;
  font-family:'Cormorant Garamond', serif;
  font-size:16px; letter-spacing:.35em;
  color:rgba(58,90,155,.35);
  margin:0 auto 20px;
}


.cd-wrap {
  position:relative;
  padding:80px 28px;
  overflow:hidden;
}
/* faded table image behind */
.cd-img {
  position:absolute; inset:0;
  background-image: var(--table);
  background-size:cover; background-position:center;
  opacity:.07;
  filter:saturate(.4);
}
.cd-inner {
  position:relative; z-index:1;
  max-width:520px; margin:0 auto; text-align:center;
}

.cd-grid {
  display:grid; grid-template-columns:repeat(4,1fr);
  gap:10px; margin-top:36px;
}
.cd-unit {
  border:1px solid var(--line);
  border-radius:4px; padding:20px 8px 15px;
  background:rgba(255,255,255,.88);
  backdrop-filter:blur(8px);
  position:relative; overflow:hidden;
}
.cd-unit::before {
  content:''; position:absolute;
  top:0; left:18%; right:18%; height:1px;
  background:linear-gradient(90deg,
    transparent, rgba(58,90,155,.4), transparent);
}
.cd-num {
  display:block;
  font-family:'Cinzel', serif;
  font-size:clamp(26px,7vw,42px);
  font-weight:500; color:var(--blue-d);
  line-height:1; margin-bottom:8px;
}
.cd-lbl {
  font-family:'Cormorant Garamond', serif;
  font-size:clamp(9px,2.2vw,11px);
  letter-spacing:.22em; text-transform:uppercase;
  color:var(--muted);
}


.scratch-sec { padding:88px 28px; text-align:center; }
.scratch-frame {
  position:relative;
  width:min(290px,78vw); height:234px;
  margin:32px auto 0;
  border-radius:6px; overflow:hidden;
  cursor:crosshair;
  box-shadow:
    0 0 0 1px var(--line),
    0 8px 40px rgba(26,42,74,.12);
}
.scratch-reveal {
  position:absolute; inset:0;
  width:100%; height:100%;
  object-fit:contain;
  object-position:center center;
  background:#dce8f5;
  display:block;
}
.scratch-canvas {
  position:absolute; inset:0;
  width:100%; height:100%; touch-action:none;
}
.scratch-hint {
  font-family:'Cormorant Garamond', serif;
  font-style:italic;
  font-size:clamp(13px,3.2vw,15px);
  color:var(--muted); letter-spacing:.08em;
  margin-top:18px;
}
.scratch-msg {
  font-family:'Cormorant Upright', serif;
  font-size:clamp(18px,4.5vw,23px);
  font-weight:300; color:var(--blue);
  margin-top:22px;
  opacity:0; transition:opacity 1.3s ease;
}
.scratch-msg.on { opacity:1; }


.rsvp-sec {
  padding:0;
  max-width:none;
  margin:0;
  text-align:center;
  position:relative;
  overflow:hidden;
  min-height:100px;
}
.rsvp-vid-bg {
  position:absolute; inset:0;
  width:100%; height:100%;
  object-fit:cover;
  opacity:1;
  z-index:0;
  pointer-events:none;
}
.rsvp-vid-overlay {
  position:absolute; inset:0;
  background:rgba(247,245,242,.45);
  z-index:1;
  pointer-events:none;
}
.rsvp-inner {
  position:relative; z-index:2;
  padding:88px 28px 90px;
  max-width:500px; margin:0 auto;
}
.rsvp-form {
  display:flex; flex-direction:column;
  gap:15px; margin-top:34px; text-align:left;
}
.f-lbl {
  display:block;
  font-family:'Cinzel', serif;
  font-size:9px; letter-spacing:.4em; text-transform:uppercase;
  color:var(--muted); margin-bottom:6px;
}
.f-input, .f-textarea {
  width:100%;
  background:rgba(255,255,255,.92);
  border:1px solid var(--line);
  border-radius:3px; padding:13px 15px;
  font-family:'Cormorant Garamond', serif;
  font-size:17px; color:var(--text);
  outline:none; font-weight:300;
  transition:border-color .3s, background .3s;
  -webkit-appearance:none;
}
.f-input::placeholder, .f-textarea::placeholder {
  color:rgba(58,90,155,.3);
}
.f-input:focus, .f-textarea:focus {
  border-color:rgba(58,90,155,.45);
  background:rgba(255,255,255,.9);
}
.f-textarea { resize:none; min-height:78px; }

.f-choices { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.f-choice {
  padding:13px 10px;
  border:1px solid var(--line); border-radius:3px;
  background:rgba(255,255,255,.6);
  font-family:'Cormorant Garamond', serif;
  font-size:16px; color:rgba(58,90,155,.6);
  cursor:pointer; text-align:center;
  transition:all .3s; -webkit-tap-highlight-color:transparent;
}
.f-choice.sel {
  border-color:rgba(58,90,155,.6);
  background:rgba(58,90,155,.08);
  color:var(--blue-d);
}

.guests-list { display:flex; flex-direction:column; gap:8px; }
.g-row { display:flex; gap:8px; align-items:center; }
.g-row .f-input { flex:1; }
.g-btn {
  flex-shrink:0; width:40px; height:40px;
  border:1px solid var(--line); border-radius:3px;
  background:rgba(255,255,255,.6);
  color:var(--muted); font-size:20px; line-height:1;
  cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  transition:all .25s; -webkit-tap-highlight-color:transparent;
}
.g-btn:hover {
  background:rgba(58,90,155,.06);
  border-color:rgba(58,90,155,.4); color:var(--blue-d);
}
.g-add {
  width:100%; padding:12px;
  border:1px dashed var(--line); border-radius:3px;
  background:transparent;
  font-family:'Cormorant Garamond', serif;
  font-size:15px; font-style:italic;
  color:rgba(58,90,155,.4); cursor:pointer; text-align:center;
  transition:all .25s; -webkit-tap-highlight-color:transparent;
}
.g-add:hover { border-color:rgba(58,90,155,.38); color:var(--blue); }

.f-submit {
  margin-top:8px; padding:16px 32px;
  background:transparent;
  border:1px solid rgba(58,90,155,.4); border-radius:3px;
  font-family:'Cinzel', serif;
  font-size:10px; letter-spacing:.45em; text-transform:uppercase;
  color:var(--blue); cursor:pointer;
  position:relative; overflow:hidden;
  transition:border-color .3s; -webkit-tap-highlight-color:transparent;
}
.f-submit::after {
  content:''; position:absolute; inset:0;
  background:rgba(58,90,155,.06);
  transform:scaleX(0); transform-origin:left;
  transition:transform .45s ease;
}
.f-submit:hover::after { transform:scaleX(1); }
.f-submit:hover { border-color:rgba(58,90,155,.65); }


.venue-sec { padding:88px 28px 60px; text-align:center; }
.venue-card {
  max-width:430px; margin:0 auto;
  border:1px solid var(--line); border-radius:6px;
  overflow:hidden;
  background:rgba(255,255,255,.9);
  backdrop-filter:blur(8px);
  box-shadow:0 4px 30px rgba(26,42,74,.08);
}
.venue-img {
  width:100%; height:220px;
  object-fit:cover; object-position:center top;
  display:block;
  filter:brightness(.88) saturate(.75);
}
.venue-body { padding:26px 22px 30px; }
.venue-name {
  font-family:'Cormorant Upright', serif;
  font-size:clamp(20px,5vw,26px);
  font-weight:400; color:var(--blue-d);
  margin-bottom:8px;
}
.venue-detail {
  font-family:'Cormorant Garamond', serif;
  font-size:clamp(14px,3.5vw,17px);
  color:rgba(26,42,74,.65); line-height:1.65; font-weight:300;
}
.map-btns {
  display:grid; grid-template-columns:1fr 1fr;
  gap:9px; margin-top:22px;
}
.map-btn {
  display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  gap:7px; padding:13px 8px;
  border:1px solid var(--line); border-radius:4px;
  background:rgba(255,255,255,.5);
  text-decoration:none; cursor:pointer;
  transition:background .3s, border-color .3s;
  -webkit-tap-highlight-color:transparent;
}
.map-btn:hover {
  background:rgba(58,90,155,.06);
  border-color:rgba(58,90,155,.38);
}
.map-btn svg { width:20px; height:20px; }
.map-btn span {
  font-family:'Cinzel', serif;
  font-size:8px; letter-spacing:.25em; text-transform:uppercase;
  color:var(--muted);
}


.footer {
  padding:52px 28px 68px; text-align:center;
  border-top:1px solid var(--line);
}
.footer-name {
  font-family:'Cormorant Upright', serif;
  font-size:clamp(16px,4vw,20px); font-weight:300;
  font-style:italic; color:rgba(30,52,112,.65);
}
.footer-yr {
  font-family:'Cinzel', serif;
  font-size:9px; letter-spacing:.5em;
  color:rgba(58,90,155,.22); margin-top:10px;
}



.dress-sec { padding:88px 28px 72px; text-align:center; }
.dress-card {
  max-width:440px; margin:32px auto 0;
  border:1px solid var(--line);
  border-radius:10px; overflow:hidden;
  background:rgba(255,255,255,.78);
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
  box-shadow:0 4px 28px rgba(26,42,74,.08);
}
.dress-img-wrap {
  width:100%;
  background:rgba(248,250,255,.5);
  padding:24px 20px 10px;
  display:flex; align-items:center; justify-content:center;
}
.dress-img {
  width:100%; max-width:380px;
  height:auto; display:block;
  object-fit:contain;
}
.dress-body { padding:20px 26px 30px; }
.dress-title {
  font-family:'Cormorant Upright',serif;
  font-size:clamp(20px,5vw,26px);
  font-weight:400; color:var(--blue-d);
  letter-spacing:.06em; margin-bottom:10px;
}
.dress-divider {
  width:36px; height:1px;
  background:linear-gradient(90deg,transparent,var(--line),transparent);
  margin:0 auto 14px;
}
.dress-note {
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(16px,4vw,18px);
  line-height:1.75; font-weight:300; font-style:italic;
  color:rgba(26,42,74,.7);
}
.dress-tag {
  display:inline-block; margin-top:14px;
  font-family:'Cinzel',serif;
  font-size:9px; letter-spacing:.42em; text-transform:uppercase;
  color:var(--muted); padding:6px 16px;
  border:1px solid var(--line); border-radius:2px;
}


.toast {
  position:fixed; bottom:36px; left:50%;
  transform:translateX(-50%) translateY(14px);
  background:rgba(247,245,242,.96);
  border:1px solid var(--line); border-radius:4px;
  padding:13px 28px;
  font-family:'Cormorant Garamond', serif; font-size:16px;
  color:var(--blue);
  white-space:nowrap;
  opacity:0; transition:opacity .4s, transform .4s;
  z-index:9998; pointer-events:none;
  box-shadow:0 4px 24px rgba(26,42,74,.1);
}
.toast.on { opacity:1; transform:translateX(-50%) translateY(0); }


.music-btn {
  position:fixed; bottom:30px; right:20px;
  z-index:500;
  display:flex; align-items:center; gap:8px;
  padding:9px 16px 9px 13px;
  border-radius:40px;
  border:1px solid rgba(58,90,155,.28);
  background:rgba(247,245,242,.92);
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  cursor:pointer;
  box-shadow:0 2px 20px rgba(26,42,74,.1);
  transition:all .35s cubic-bezier(.22,1,.36,1);
  -webkit-tap-highlight-color:transparent;
}
.music-btn:hover {
  background:rgba(247,245,242,1);
  border-color:rgba(58,90,155,.5);
  box-shadow:0 4px 28px rgba(26,42,74,.15);
  transform:translateY(-2px);
}
.music-btn-icon { width:18px; height:18px; flex-shrink:0; }
.music-btn-label {
  font-family:'Cinzel',serif;
  font-size:9px; letter-spacing:.3em; text-transform:uppercase;
  color:var(--blue); white-space:nowrap;
}
.bar {
  animation:music-bar .75s ease-in-out infinite alternate;
  transform-origin:bottom;
}
.bar:nth-child(2){ animation-delay:.15s; }
.bar:nth-child(3){ animation-delay:.3s; }
@keyframes music-bar{
  from{ transform:scaleY(.25); }
  to  { transform:scaleY(1); }
}
`;


function useCountdown(iso) {
  const calc = () => {
    const d = new Date(iso) - Date.now();
    if (d <= 0) return { d:0,h:0,m:0,s:0 };
    return {
      d: Math.floor(d/86400000),
      h: Math.floor((d%86400000)/3600000),
      m: Math.floor((d%3600000)/60000),
      s: Math.floor((d%60000)/1000),
    };
  };
  const [t,setT] = useState(calc);
  useEffect(()=>{ const id=setInterval(()=>setT(calc()),1000); return()=>clearInterval(id); },[]);
  return t;
}


function useReveal() {
  useEffect(()=>{
    const els = document.querySelectorAll('.rv');
    const io  = new IntersectionObserver(
      es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold:0.1 }
    );
    els.forEach(el=>io.observe(el));
    return ()=>io.disconnect();
  });
}


function burst(cv){
  if(!cv) return;
  cv.width=window.innerWidth; cv.height=window.innerHeight;
  const ctx=cv.getContext('2d');
  const C=['#3a5a9b','#5b7bbf','#1e3470','#8aa8d8','#c8d6f0','#e0eaff'];
  const P=Array.from({length:110},()=>({
    x:cv.width/2+(Math.random()-.5)*110, y:cv.height/2+(Math.random()-.5)*110,
    vx:(Math.random()-.5)*10, vy:Math.random()*-13-4,
    a:1, c:C[Math.floor(Math.random()*C.length)],
    s:Math.random()*5+2.5, r:Math.random()*Math.PI*2, rv:(Math.random()-.5)*.18,
  }));
  let raf;
  const tick=()=>{
    ctx.clearRect(0,0,cv.width,cv.height);
    let alive=false;
    P.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.vy+=.38; p.a-=.012; p.r+=p.rv;
      if(p.a>0){ alive=true; ctx.save(); ctx.globalAlpha=p.a; ctx.fillStyle=p.c;
        ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s); ctx.restore(); }
    });
    if(alive) raf=requestAnimationFrame(tick); else ctx.clearRect(0,0,cv.width,cv.height);
  };
  tick(); return()=>cancelAnimationFrame(raf);
}


function useScratch(ref, onReveal){
  const dn=useRef(false), done=useRef(false);
  const xy=useCallback(e=>{
    const r=ref.current.getBoundingClientRect();
    const s=e.touches?e.touches[0]:e;
    return [s.clientX-r.left, s.clientY-r.top];
  },[]);
  const draw=useCallback((x,y)=>{
    const cv=ref.current; if(!cv) return;
    const ctx=cv.getContext('2d',{willReadFrequently:true});
    ctx.globalCompositeOperation='destination-out';
    ctx.beginPath(); ctx.arc(x,y,30,0,Math.PI*2); ctx.fill();
    if(done.current) return;
    const d=ctx.getImageData(0,0,cv.width,cv.height).data;
    let c=0; for(let i=3;i<d.length;i+=4) if(d[i]<128) c++;
    if(c/(d.length/4)>.52){ done.current=true; onReveal(); }
  },[onReveal]);

  useEffect(()=>{
    const cv=ref.current; if(!cv) return;
    cv.width=cv.offsetWidth; cv.height=cv.offsetHeight;
    const ctx=cv.getContext('2d',{willReadFrequently:true});
    /* floral-tinted cover */
    const g=ctx.createLinearGradient(0,0,cv.width,cv.height);
    g.addColorStop(0,'#dce6f5'); g.addColorStop(1,'#c8d8ee');
    ctx.fillStyle=g; ctx.fillRect(0,0,cv.width,cv.height);
    /* subtle pattern */
    for(let i=0;i<cv.width;i+=3){
      for(let j=0;j<cv.height;j+=3){
        ctx.fillStyle=`rgba(58,90,155,${Math.random()*.04})`;
        ctx.fillRect(i,j,1,1);
      }
    }
    const fs=Math.round(cv.width*.053);
    ctx.font=`italic ${fs}px 'Cormorant Garamond',serif`;
    ctx.fillStyle='rgba(30,52,112,.45)'; ctx.textAlign='center';
    ctx.fillText('Cızaraq açın...', cv.width/2, cv.height/2-8);
    ctx.font=`${Math.round(cv.width*.036)}px 'Cinzel',serif`;
    ctx.fillStyle='rgba(30,52,112,.25)';
    ctx.fillText('✦  S Ü R P R İ Z  ✦', cv.width/2, cv.height/2+24);

    const D=e=>{dn.current=true; draw(...xy(e));};
    const M=e=>{ if(dn.current){e.preventDefault(); draw(...xy(e));} };
    const U=()=>{dn.current=false;};
    cv.addEventListener('mousedown',D); cv.addEventListener('mousemove',M); cv.addEventListener('mouseup',U);
    cv.addEventListener('touchstart',D,{passive:true}); cv.addEventListener('touchmove',M,{passive:false}); cv.addEventListener('touchend',U);
    return()=>{
      cv.removeEventListener('mousedown',D); cv.removeEventListener('mousemove',M); cv.removeEventListener('mouseup',U);
      cv.removeEventListener('touchstart',D); cv.removeEventListener('touchmove',M); cv.removeEventListener('touchend',U);
    };
  },[]);
}


function R({children, delay=0, style={}}){
  return (
    <div className="rv" style={{transitionDelay:`${delay}ms`,...style}}>
      {children}
    </div>
  );
}


export default function App(){
  const [screen,  setScreen ] = useState('curtain');
  const [opening, setOpening] = useState(false);
  const [shown,   setShown  ] = useState(false);
  const [choice,  setChoice ] = useState('');
  const [name,    setName   ] = useState('');
  const [note,    setNote   ] = useState('');
  const [guests,  setGuests ] = useState(['']);
  const [tTxt,    setTTxt   ] = useState('');
  const [tOn,     setTOn    ] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  const cvRef = useRef(null);
  const audioRef = useRef(null);
  const hvRef = useRef(null);
  const cfRef = useRef(null);
  const scRef = useRef(null);
  const cd    = useCountdown('2026-09-30T17:00:00');

  useReveal();

  /* CSS inject */
  useEffect(()=>{
    const el=document.createElement('style');
    el.textContent=CSS; document.head.appendChild(el);
    return()=>el.remove();
  },[]);

  /* curtain first frame */
  useEffect(()=>{
    const v=cvRef.current; if(!v) return;
    v.load();
    v.addEventListener('loadedmetadata',()=>{ v.currentTime=.01; },{once:true});
  },[]);

  /* hero autoplay */
  useEffect(()=>{
    if(screen!=='invite') return;
    const v=hvRef.current; if(!v) return;
    v.load(); v.play().catch(()=>{});
  },[screen]);



  /* music auto-start on invite */
  useEffect(()=>{
    if(screen!=='invite') return;
    const a = audioRef.current;
    if(!a) return;
    a.volume = 0.4;
    a.play().then(()=>setMusicOn(true)).catch(()=>{});
  },[screen]);

  const toggleMusic = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (musicOn) { a.pause(); setMusicOn(false); }
    else { a.play().catch(()=>{}); setMusicOn(true); }
  }, [musicOn]);

    const openCurtain=useCallback(()=>{
    if(opening) return;
    setOpening(true);
    const v = cvRef.current;
    if(!v) { setTimeout(()=>setScreen('invite'),2500); return; }
    // play video, transition only after it ends
    const onEnded = () => {
      v.removeEventListener('ended', onEnded);
      setScreen('invite');
    };
    v.addEventListener('ended', onEnded);
    v.play().catch(()=>{
      // autoplay failed – transition after 2.5s
      v.removeEventListener('ended', onEnded);
      setTimeout(()=>setScreen('invite'),2500);
    });
  },[opening]);

  const onReveal=useCallback(()=>{ setShown(true); burst(cfRef.current); },[]);
  useScratch(scRef, onReveal);

  const toast=msg=>{ setTTxt(msg); setTOn(true); setTimeout(()=>setTOn(false),3200); };

  const submit=()=>{
    if(!name.trim()){ toast('Adınızı daxil edin'); return; }
    if(!choice){      toast('İştirak seçin');      return; }
    let msg='━━━━━━━━━━━━━━━━━\n💌 *Hüseyn & Günay – RSVP*\n━━━━━━━━━━━━━━━━━\n';
    msg+=`👤 *Ad:* ${name}\n`;
    msg+=choice==='yes'?'✅ *İştirak:* Bəli\n':'❌ *İştirak:* Xeyr\n';
    const gl=guests.filter(g=>g.trim());
    if(gl.length){ msg+='👥 *Qonaqlar:*\n'; gl.forEach((g,i)=>{msg+=`   ${i+1}. ${g}\n`;}); msg+=`🔢 *Cəmi:* ${gl.length+1} nəfər\n`; }
    if(note.trim()) msg+=`💬 *Mesaj:* ${note}\n`;
    msg+='━━━━━━━━━━━━━━━━━';
    window.open(`https://wa.me/994104195344?text=${encodeURIComponent(msg)}`,'_blank');
    toast('Cavabınız göndərildi 🤍');
  };

  const p2=n=>String(n).padStart(2,'0');

  const maps=[
    { label:'Google Maps', href:'https://maps.google.com/?q=Mirvari+Sadliq+Sarayi+Baku',
      icon:<svg viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="rgba(58,90,155,.7)"/></svg> },
    { label:'Waze', href:'https://waze.com/ul?q=Mirvari+Sadliq+Sarayi+Baku&navigate=yes',
      icon:<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="7" stroke="rgba(58,90,155,.7)" strokeWidth="1.5"/><circle cx="9.5" cy="10" r="1" fill="rgba(58,90,155,.7)"/><circle cx="14.5" cy="10" r="1" fill="rgba(58,90,155,.7)"/><path d="M9 13.5c.8 1 1.4 1.5 3 1.5s2.2-.5 3-1.5" stroke="rgba(58,90,155,.7)" strokeWidth="1.5" strokeLinecap="round" fill="none"/><path d="M12 17v2.5M10.5 19.5h3" stroke="rgba(58,90,155,.7)" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { label:'Bolt', href:'https://bolt.eu',
      icon:<svg viewBox="0 0 24 24" fill="none"><path d="M13 3L5 13h7l-1 8 8-10h-7l1-8z" stroke="rgba(58,90,155,.7)" strokeWidth="1.5" strokeLinejoin="round" fill="none"/></svg> },
    { label:'Uber', href:'https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=Mirvari+Sadliq+Sarayi+Baku',
      icon:<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="9" stroke="rgba(58,90,155,.7)" strokeWidth="1.5" fill="none"/><path d="M8 12h8M12 8v8" stroke="rgba(58,90,155,.7)" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  ];

  return (
    <>
      <canvas ref={cfRef} id="conf-canvas"/>

      {}
      <div
        className={`page curtain${screen==='invite'?' hidden':''}`}
        onClick={openCurtain}
      >
        <video ref={cvRef} className="cv-vid"
          playsInline webkit-playsinline="true" muted preload="auto">
          <source src="curtain.mp4" type="video/mp4"/>
        </video>
        <div className="cv-hint">
          <span className="cv-hint-text">toxunun</span>
          <div className="cv-hint-dots">
            <span/><span/><span/>
          </div>
        </div>
      </div>

      {}
      <div
        className={`page invite${screen==='invite'?'':' hidden'}`}
        style={{ '--floral':`url(${IMG_FLORAL})`, '--table':`url(${IMG_TABLE})` }}
      >
        {/* floral background */}
        <div className="floral-bg"/>

        {/* HERO */}
        <section className="hero">
          <video
            ref={hvRef}
            className="hero-vid"
            autoPlay
            playsInline
            muted
            loop
            preload="auto"
          >
            <source src="ballroom.mp4" type="video/mp4"/>
          </video>
          <div className="hero-body">
            <p className="hero-tag">Toy Dəvətnaməsi · 2026</p>
            <h1 className="hero-names">
              <em>Hüseyn</em>
              <span className="hero-amp">&</span>
              <em>Günay</em>
            </h1>
            <p className="hero-date">30 Sentyabr 2026</p>
            <div className="hero-line"/>
            <p className="hero-scroll">Aşağı sürüşdürün ↓</p>
          </div>
        </section>

        {/* INVITATION */}
        <section className="sec">
          <div className="frost">
          <R><span className="ornament">✦ ✦ ✦</span></R>
          <R delay={80}><p className="sec-tag">Əziz dostlar</p></R>
          <R delay={160}><div className="rule"/></R>
          <R delay={240}><h2 className="sec-title">Sevincimizi<br/><em>bölüşmək istəyirik</em></h2></R>
          <R delay={320}>
            <p className="sec-body">
              İki könlün bir olduğu bu müqəddəs anda sizi toy mərasimimizdə
              görmək bizə dərin sevinc bəxş edər. İştirakınız ən qiymətli hədiyyəmiz olacaq.
            </p>
          </R>
          <R delay={400}><div className="rule"/></R>
          </div>
        </section>

        {/* COUNTDOWN */}
        <section className="cd-wrap">
          <div className="cd-img"/>
          <div className="cd-inner">
            <R><p className="sec-tag">Toy gününə qədər</p></R>
            <R delay={80}><div className="rule"/></R>
            <R delay={160}>
              <div className="cd-grid">
                {[[p2(cd.d),'Gün'],[p2(cd.h),'Saat'],[p2(cd.m),'Dəqiqə'],[p2(cd.s),'Saniyə']].map(([n,l])=>(
                  <div key={l} className="cd-unit">
                    <span className="cd-num">{n}</span>
                    <span className="cd-lbl">{l}</span>
                  </div>
                ))}
              </div>
            </R>
          </div>
        </section>

        {/* SCRATCH */}
        <section className="scratch-sec">
          <div className="frost">
          <R><span className="ornament">✦ ✦ ✦</span></R>
          <R delay={80}><p className="sec-tag">Sürpriz</p></R>
          <R delay={160}><div className="rule"/></R>
          <R delay={240}><h2 className="sec-title"><em>Bir mesaj</em><br/>sizin üçün</h2></R>
          <R delay={320}>
            <div className="scratch-frame" id="scratchWrap">
              <img src={IMG_COUPLE} alt="Hüseyn & Günay" className="scratch-reveal"/>
              <canvas ref={scRef} className="scratch-canvas"/>
            </div>
          </R>
          <R delay={400}><p className="scratch-hint">Cızaraq mesajı açın ✦</p></R>
          </div>
          <p className={`scratch-msg${shown?' on':''}`}>
            İki ürək, bir tale — əbədi sevgi 🤍
          </p>
        </section>


        {/* DRESS CODE */}
        <section className="dress-sec">
          <R><span className="ornament">✦ ✦ ✦</span></R>
          <R delay={80}><p className="sec-tag">Geyim tərzi</p></R>
          <R delay={160}><div className="rule"/></R>
          <R delay={240}><h2 className="sec-title"><em>Dress Code</em></h2></R>
          <R delay={320}>
            <div className="dress-card">
              <div className="dress-img-wrap">
                <img src={IMG_DRESS} alt="Dress code" className="dress-img"/>
              </div>
              <div className="dress-body">
                <p className="dress-title">Rəsmi · Elegant</p>
                <div className="dress-divider"/>
                <p className="dress-note">
                  Qonaqlarımızı rəsmi geyim üslubu ilə qəbul etməkdən şərəf duyacağıq.
                </p>
                <span className="dress-tag">Formal Attire</span>
              </div>
            </div>
          </R>
        </section>

        {/* RSVP */}
        <section className="rsvp-sec">
          <video
            className="rsvp-vid-bg"
            autoPlay
            playsInline
            muted
            loop
            preload="auto"
          >
            <source src="rsvp-bg.mp4" type="video/mp4"/>
          </video>
          <div className="rsvp-vid-overlay"/>
          <div className="rsvp-inner">
          <div className="frost">
          <R><span className="ornament">✦ ✦ ✦</span></R>
          <R delay={80}><p className="sec-tag">İştirak blanki</p></R>
          <R delay={160}><div className="rule"/></R>
          <R delay={240}><h2 className="sec-title"><em>Gələcəksinizmi?</em></h2></R>
          <R delay={320}><p className="sec-body">Zəhmət olmasa 20 Sentyabr 2026-a qədər cavab verin.</p></R>
          <R delay={400}>
            <div className="rsvp-form">
              <div>
                <label className="f-lbl">Adınız Soyadınız</label>
                <input className="f-input" placeholder="Ad Soyad"
                  value={name} onChange={e=>setName(e.target.value)}/>
              </div>
              <div>
                <label className="f-lbl">İştirak</label>
                <div className="f-choices">
                  <button className={`f-choice${choice==='yes'?' sel':''}`} onClick={()=>setChoice('yes')}>
                    ✓&nbsp;&nbsp;Bəli, gələcəyəm
                  </button>
                  <button className={`f-choice${choice==='no'?' sel':''}`} onClick={()=>setChoice('no')}>
                    ✕&nbsp;&nbsp;Xeyr, gəlməyəcəm
                  </button>
                </div>
              </div>
              {choice==='yes'&&(
                <div>
                  <label className="f-lbl">Əlavə qonaqlar (ixtiyari)</label>
                  <div className="guests-list">
                    {guests.map((g,i)=>(
                      <div key={i} className="g-row">
                        <input className="f-input" placeholder={`Qonaq ${i+1}`}
                          value={g} onChange={e=>{const a=[...guests];a[i]=e.target.value;setGuests(a);}}/>
                        {guests.length>1&&
                          <button className="g-btn"
                            onClick={()=>setGuests(guests.filter((_,j)=>j!==i))}>−</button>}
                      </div>
                    ))}
                    {guests.length<6&&
                      <button className="g-add" onClick={()=>setGuests([...guests,''])}>
                        + Qonaq əlavə et
                      </button>}
                  </div>
                </div>
              )}
              <div>
                <label className="f-lbl">Mesaj (ixtiyari)</label>
                <textarea className="f-textarea"
                  placeholder="Bir şey əlavə etmək istəyirsiniz?"
                  value={note} onChange={e=>setNote(e.target.value)}/>
              </div>
              <button className="f-submit" onClick={submit}>Göndər</button>
            </div>
          </R>
          </div>
          </div>
        </section>

        {/* VENUE — ən sonda */}
        <section className="venue-sec">
          <R><span className="ornament">✦ ✦ ✦</span></R>
          <R delay={80}><p className="sec-tag">Mərasim yeri</p></R>
          <R delay={160}><div className="rule"/></R>
          <R delay={240}>
            <div className="venue-card">
              <img src={IMG_CASTLE} alt="Mirvari Şadlıq Sarayı" className="venue-img"/>
              <div className="venue-body">
                <h3 className="venue-name">Mirvari Şadlıq Sarayı</h3>
                <p className="venue-detail">30 Sentyabr 2026 · Saat 17:00</p>
                <p className="venue-detail">Bakı, Azərbaycan</p>
                <div className="map-btns">
                  {maps.map(m=>(
                    <a key={m.label} href={m.href} target="_blank" rel="noreferrer" className="map-btn">
                      {m.icon}
                      <span>{m.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </R>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="rule"/>
          <R><p className="footer-name">Hüseyn &amp; Günay · 2026</p></R>
          
        </footer>

        {/* AUDIO */}
        <audio ref={audioRef} loop preload="auto">
          <source src="music.mp3" type="audio/mpeg"/>
        </audio>

      </div>

      {/* MUSIC BUTTON */}
      {screen==='invite' && (
        <button className="music-btn" onClick={toggleMusic} aria-label="Musiqi">
          {musicOn ? (
            <>
              <svg className="music-btn-icon" viewBox="0 0 24 24" fill="none">
                <rect x="5"  y="6" width="3.5" height="12" rx="1.5" fill="var(--blue)"/>
                <rect x="15.5" y="6" width="3.5" height="12" rx="1.5" fill="var(--blue)"/>
              </svg>
              <span className="music-btn-label">Dayandır</span>
            </>
          ) : (
            <>
              <svg className="music-btn-icon" viewBox="0 0 24 24" fill="none">
                <g fill="var(--blue)">
                  <rect className="bar" x="3"  y="11" width="3" height="7"  rx="1.5"/>
                  <rect className="bar" x="10" y="8"  width="3" height="10" rx="1.5"/>
                  <rect className="bar" x="17" y="10" width="3" height="8"  rx="1.5"/>
                </g>
              </svg>
              <span className="music-btn-label">Musiqi</span>
            </>
          )}
        </button>
      )}

      <div className={`toast${tOn?' on':''}`}>{tTxt}</div>
    </>
  );
}