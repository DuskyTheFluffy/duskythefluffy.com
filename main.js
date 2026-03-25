/* ================================================================
   DUSK PORTFOLIO — main.js v4
   · Particle web (mouse reactive, clean)
   · Custom cursor
   · Typewriter bio
   · Live clock
   · Countdown
   · Scroll reveal
   · Magnetic social buttons
   · Drag-to-scroll + auto-scroll games
   ================================================================ */

/* ── 1. PARTICLE WEB ─────────────────────────────────────────── */
(function ParticleWeb() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isMobile = window.matchMedia('(pointer:coarse)').matches;
    const COUNT = isMobile ? 45 : 95;
    const MAX_D = isMobile ? 100 : 130;
    const MOUSE_R = 160;

    let W, H, mouse = { x:-9999, y:-9999 }, pts = [];

    const resize = () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; };

    const mkPt = () => ({
        x: Math.random()*W, y: Math.random()*H,
        vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4,
    });

    const init = () => { resize(); pts = Array.from({length:COUNT},mkPt); };

    const draw = () => {
        ctx.clearRect(0,0,W,H);
        for (let i=0;i<pts.length;i++) {
            const p = pts[i];

            if (!isMobile) {
                const dx=p.x-mouse.x, dy=p.y-mouse.y;
                const d=Math.sqrt(dx*dx+dy*dy);
                if (d<MOUSE_R && d>0) { const f=(MOUSE_R-d)/MOUSE_R; p.vx+=(dx/d)*f*.9; p.vy+=(dy/d)*f*.9; }
            }

            const spd=Math.sqrt(p.vx*p.vx+p.vy*p.vy);
            if (spd>1.8){p.vx*=.93;p.vy*=.93;}
            if (spd<.05){p.vx+=(Math.random()-.5)*.12;p.vy+=(Math.random()-.5)*.12;}
            p.vx*=.993; p.vy*=.993;
            p.x+=p.vx; p.y+=p.vy;
            if (p.x<0)p.x=W; if(p.x>W)p.x=0;
            if (p.y<0)p.y=H; if(p.y>H)p.y=0;

            ctx.beginPath();
            ctx.arc(p.x,p.y,1.5,0,Math.PI*2);
            ctx.fillStyle='rgba(255,45,120,.5)';
            ctx.fill();

            for (let j=i+1;j<pts.length;j++) {
                const q=pts[j];
                const ex=p.x-q.x,ey=p.y-q.y,d2=ex*ex+ey*ey;
                if (d2<MAX_D*MAX_D) {
                    const a=(1-d2/(MAX_D*MAX_D))*.2;
                    ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
                    ctx.strokeStyle=`rgba(255,45,120,${a.toFixed(3)})`; ctx.lineWidth=.6; ctx.stroke();
                }
            }

            if (!isMobile) {
                const md=Math.sqrt((p.x-mouse.x)**2+(p.y-mouse.y)**2);
                if (md<MOUSE_R) {
                    const a=(1-md/MOUSE_R)*.45;
                    ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(mouse.x,mouse.y);
                    ctx.strokeStyle=`rgba(0,255,231,${a.toFixed(3)})`; ctx.lineWidth=.6; ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', e=>{ mouse.x=e.clientX; mouse.y=e.clientY; });
    window.addEventListener('mouseleave',()=>{ mouse.x=-9999; mouse.y=-9999; });

    init(); draw();
})();


/* ── 2. CUSTOM CURSOR ────────────────────────────────────────── */
(function Cursor() {
    if (window.matchMedia('(pointer:coarse)').matches) return;
    const dot=document.getElementById('cursor-dot');
    const ring=document.getElementById('cursor-ring');
    if (!dot||!ring) return;

    let mx=0,my=0,rx=0,ry=0;
    window.addEventListener('mousemove',e=>{ mx=e.clientX;my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
    (function lerp(){
        rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
        ring.style.left=rx+'px'; ring.style.top=ry+'px';
        requestAnimationFrame(lerp);
    })();

    document.querySelectorAll('a,button,.game-card,.project-item,.trait').forEach(el=>{
        el.addEventListener('mouseenter',()=>ring.classList.add('hovered'));
        el.addEventListener('mouseleave',()=>ring.classList.remove('hovered'));
    });
})();


/* ── 3. TYPEWRITER ───────────────────────────────────────────── */
(function Typewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const lines = [
        'Sabertoothed Fox · Gaymer',
        'Bass / Drums / DJ',
        'Linux · Cybersecurity Tinkerer',
        'Tech Head · Chill Vibes',
    ];
    let li=0, ci=0, deleting=false;
    const SPEED_TYPE=52, SPEED_DEL=28, PAUSE=2200;

    function tick() {
        const line = lines[li];
        if (!deleting) {
            el.textContent = line.slice(0, ++ci);
            if (ci===line.length) { deleting=true; setTimeout(tick,PAUSE); return; }
        } else {
            el.textContent = line.slice(0, --ci);
            if (ci===0) { deleting=false; li=(li+1)%lines.length; }
        }
        setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
    }
    setTimeout(tick, 800);
})();


/* ── 4. LIVE CLOCK ───────────────────────────────────────────── */
(function LiveClock() {
    const el = document.getElementById('live-clock');
    if (!el) return;
    const fmt = n => String(n).padStart(2,'0');
    const update = () => {
        const d=new Date();
        el.textContent=`${fmt(d.getHours())}:${fmt(d.getMinutes())}:${fmt(d.getSeconds())}`;
    };
    update(); setInterval(update,1000);
})();


/* ── 5. COUNTDOWN ────────────────────────────────────────────── */
(function Countdown() {
    const TARGET = new Date("March 27, 2026 00:00:00 GMT-0500").getTime();
    const els = {
        days:document.getElementById('cd-days'),
        hours:document.getElementById('cd-hours'),
        minutes:document.getElementById('cd-minutes'),
        seconds:document.getElementById('cd-seconds'),
        msg:document.getElementById('birthday-msg'),
    };
    const pad=n=>String(Math.max(0,n)).padStart(2,'0');
    function tick(el,val){
        if(!el||el.textContent===val)return;
        el.textContent=val; el.classList.remove('tick'); void el.offsetWidth;
        el.classList.add('tick'); setTimeout(()=>el.classList.remove('tick'),130);
    }
    function update(){
        const dist=TARGET-Date.now();
        if(dist<=0){['days','hours','minutes','seconds'].forEach(k=>tick(els[k],'00'));
            if(els.msg)els.msg.textContent='// 🎉 happy birthday, dusk!'; return;}
        tick(els.days,   pad(Math.floor(dist/86400000)));
        tick(els.hours,  pad(Math.floor((dist%86400000)/3600000)));
        tick(els.minutes,pad(Math.floor((dist%3600000)/60000)));
        tick(els.seconds,pad(Math.floor((dist%60000)/1000)));
    }
    update(); setInterval(update,1000);
})();


/* ── 6. SCROLL REVEAL ────────────────────────────────────────── */
(function ScrollReveal(){
    const io=new IntersectionObserver(entries=>{
        entries.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);} });
    },{threshold:.07,rootMargin:'0px 0px -16px 0px'});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
})();


/* ── 7. MAGNETIC BUTTONS ─────────────────────────────────────── */
(function Magnetic(){
    if (window.matchMedia('(pointer:coarse)').matches) return;
    document.querySelectorAll('.magnetic').forEach(el=>{
        el.addEventListener('mousemove',e=>{
            const r=el.getBoundingClientRect();
            const cx=r.left+r.width/2, cy=r.top+r.height/2;
            const dx=(e.clientX-cx)*.28, dy=(e.clientY-cy)*.28;
            el.style.transform=`translate(${dx}px,${dy}px)`;
        });
        el.addEventListener('mouseleave',()=>{ el.style.transform=''; });
    });
})();


/* ── 8. 3D CAROUSEL ──────────────────────────────────────────── */
(function Carousel() {
    const stage = document.getElementById('carousel-stage');
    if (!stage) return;

    const cards = Array.from(stage.querySelectorAll('.game-card'));
    const N = cards.length;
    const angleStep = 360 / N;

    // radius: spread cards in a circle — tune based on card width
    function getRadius() {
        const cardW = cards[0].offsetWidth;
        return Math.round(cardW / (2 * Math.tan(Math.PI / N))) + 20;
    }

    function layoutCards() {
        const r = getRadius();
        cards.forEach((card, i) => {
            const angle = angleStep * i;
            card.style.transform = `rotateY(${angle}deg) translateZ(${r}px)`;
        });
    }

    layoutCards();
    window.addEventListener('resize', layoutCards);

    // continuous rotation state
    let currentAngle = 0;
    let targetAngle  = 0;
    let autoSpeed    = 0.06;   // degrees per frame when idle
    let isDragging   = false;
    let dragStartX   = 0;
    let dragStartAngle = 0;
    let lastUserTime = 0;

    // smooth lerp loop
    let rafId;
    function animate() {
        const now = Date.now();
        const idleFor = now - lastUserTime;

        if (!isDragging) {
            // resume auto-rotate after 1.5s of no interaction
            if (idleFor > 1500) {
                targetAngle -= autoSpeed;
            }
            // ease toward target
            currentAngle += (targetAngle - currentAngle) * 0.055;
        }

        stage.style.transform = `rotateY(${currentAngle}deg)`;
        rafId = requestAnimationFrame(animate);
    }
    animate();

    // ── prev / next buttons ──
    document.getElementById('carousel-prev')?.addEventListener('click', () => {
        targetAngle += angleStep;
        lastUserTime = Date.now();
    });
    document.getElementById('carousel-next')?.addEventListener('click', () => {
        targetAngle -= angleStep;
        lastUserTime = Date.now();
    });

    // ── mouse drag ──
    const scene = stage.closest('.carousel-scene');
    scene.addEventListener('mousedown', e => {
        isDragging   = true;
        dragStartX   = e.clientX;
        dragStartAngle = targetAngle;
        lastUserTime = Date.now();
        scene.style.cursor = 'grabbing';
        e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartX;
        targetAngle = dragStartAngle + dx * 0.35;
        currentAngle = targetAngle;
        lastUserTime = Date.now();
    });
    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        scene.style.cursor = 'grab';
        lastUserTime = Date.now();
    });

    // ── touch drag ──
    scene.addEventListener('touchstart', e => {
        dragStartX    = e.touches[0].clientX;
        dragStartAngle = targetAngle;
        lastUserTime  = Date.now();
    }, { passive: true });
    scene.addEventListener('touchmove', e => {
        const dx = e.touches[0].clientX - dragStartX;
        targetAngle  = dragStartAngle + dx * 0.3;
        currentAngle = targetAngle;
        lastUserTime = Date.now();
    }, { passive: true });
    scene.addEventListener('touchend', () => { lastUserTime = Date.now(); });
})();
document.getElementById('mc-copy-btn').addEventListener('click', () => {
    const ip = 'join.duskythefluffy.com';
    const confirm = document.getElementById('mc-copy-confirm');

    navigator.clipboard.writeText(ip).then(() => {
        confirm.classList.add('show');
        setTimeout(() => confirm.classList.remove('show'), 2000);
    });
});