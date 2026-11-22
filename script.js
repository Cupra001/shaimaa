const SECRET = '612195';
const gate = document.getElementById('gate');
const overlay = document.getElementById('overlay');
const input = document.getElementById('codeInput');
const unlockBtn = document.getElementById('unlockBtn');
const closeBtn = document.getElementById('closeBtn');
const muteBtn = document.getElementById('muteBtn');
const errorEl = document.getElementById('error');
const song = document.getElementById('song');
const heartsRain = document.getElementById('heartsRain');
let rainTimer = null;

function tryUnlock() {
    if (input.value.trim() === SECRET) {
        errorEl.textContent = '';
        gate.hidden = true;
        overlay.hidden = false;
        startHeartsRain();
        song.currentTime = 0;
        song.volume = 0.85;
        const p = song.play();
        if (p) p.catch(() => { });
    } else {
        errorEl.textContent = 'كلمة السر غير صحيحة 💔 حاولي مرة أخرى';
        errorEl.classList.remove('shake');
        void errorEl.offsetWidth;
        errorEl.classList.add('shake');
        input.value = '';
        input.focus();
    }
}

unlockBtn.addEventListener('click', tryUnlock);
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryUnlock();
});
closeBtn.addEventListener('click', () => {
    overlay.hidden = true;
    gate.hidden = false;
    input.value = '';
    song.pause();
    stopHeartsRain();
});
muteBtn.addEventListener('click', () => {
    song.muted = !song.muted;
    muteBtn.textContent = song.muted ? '🔇' : '🔊';
});

/* توليد جسيمات دخانية مبعثرة ومستمرة حول اسم شيماء */
const scatterContainer = document.getElementById('scatterSmokeContainer');
if (scatterContainer) {
    setInterval(() => {
        const smokeP = document.createElement('div');
        smokeP.className = 'scatter-smoke';

        // توزيع عشوائي مبعثر يحيط بالاسم بالكامل دون أن يتوسطه بشكل خاطئ
        const rx = (Math.random() - 0.5) * 160;
        const ry = (Math.random() - 0.5) * 60;

        smokeP.style.left = `calc(50% + ${rx}px)`;
        smokeP.style.top = `calc(50% + ${ry}px)`;

        const size = Math.random() * 35 + 25;
        smokeP.style.width = `${size}px`;
        smokeP.style.height = `${size}px`;

        const startX = (Math.random() - 0.5) * 30;
        const startY = (Math.random() - 0.5) * 30;
        const endX = startX + (Math.random() - 0.5) * 70;
        const endY = startY + (Math.random() - 0.5) * 70 - 25;

        smokeP.style.setProperty('--sx1', `${startX}px`);
        smokeP.style.setProperty('--sy1', `${startY}px`);
        smokeP.style.setProperty('--sx2', `${endX}px`);
        smokeP.style.setProperty('--sy2', `${endY}px`);

        const duration = Math.random() * 0.7 + 0.6;
        smokeP.style.animationDuration = `${duration}s`;

        scatterContainer.appendChild(smokeP);
        setTimeout(() => smokeP.remove(), duration * 1000);
    }, 60); // سرعة التدفق والتكرار المستمر
}

/* تفاعل الدخان مع حركة الماوس */
let throttleTimer = false;
window.addEventListener('mousemove', (e) => {
    if (!throttleTimer) {
        createSmokeParticle(e.clientX, e.clientY);
        throttleTimer = true;
        setTimeout(() => {
            throttleTimer = false;
        }, 40);
    }
});

function createSmokeParticle(x, y) {
    const smoke = document.createElement('div');
    smoke.className = 'mouse-smoke';

    const size = Math.random() * 50 + 40;
    smoke.style.width = `${size}px`;
    smoke.style.height = `${size}px`;
    smoke.style.left = `${x - size / 2}px`;
    smoke.style.top = `${y - size / 2}px`;

    const moveX = (Math.random() - 0.5) * 60;
    const moveY = (Math.random() - 0.5) * 60 - 20;
    smoke.style.setProperty('--mx', `${moveX}px`);
    smoke.style.setProperty('--my', `${moveY}px`);

    const duration = Math.random() * 0.8 + 0.6;
    smoke.style.animationDuration = `${duration}s`;

    document.body.appendChild(smoke);
    setTimeout(() => smoke.remove(), duration * 1000);
}

const RAIN = ['🥀', '🖤', '💔', '🍂', '💧'];
function startHeartsRain() {
    stopHeartsRain();
    rainTimer = setInterval(() => {
        const s = document.createElement('span');
        s.className = 'fall';
        s.textContent = RAIN[Math.floor(Math.random() * RAIN.length)];
        s.style.left = Math.random() * 100 + '%';
        s.style.fontSize = (15 + Math.random() * 18) + 'px';
        s.style.animationDuration = (4 + Math.random() * 4) + 's';
        heartsRain.appendChild(s);
        setTimeout(() => s.remove(), 8000);
    }, 380);
}

function stopHeartsRain() {
    if (rainTimer) clearInterval(rainTimer);
    rainTimer = null;
    heartsRain.innerHTML = '';
}

const EMOJIS = ['🥀', '🖤', '🍂', '💧', '💔'];
const container = document.getElementById('particles');
for (let i = 0; i < 18; i++) {
    const span = document.createElement('span');
    span.className = 'particle';
    span.textContent = EMOJIS[i % EMOJIS.length];
    span.style.left = Math.random() * 100 + '%';
    span.style.fontSize = (15 + Math.random() * 18) + 'px';
    span.style.animationDuration = (9 + Math.random() * 10) + 's';
    span.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(span);
}