const SECRET = '612195';
const gate = document.getElementById('gate');
const overlay = document.getElementById('overlay');
const input = document.getElementById('codeInput');
const togglePassBtn = document.getElementById('togglePass');
const unlockBtn = document.getElementById('unlockBtn');
const closeBtn = document.getElementById('closeBtn');
const muteBtn = document.getElementById('muteBtn');
const volumeSlider = document.getElementById('volumeSlider');
const errorEl = document.getElementById('error');
const song = document.getElementById('song');
const heartsRain = document.getElementById('heartsRain');
let rainTimer = null;

const CELEBRATION_EMOJIS = ['🌸', '💖', '✨', '🌷', '🦋', '💛'];

function spawnJoyBurst(originX, originY, count = 26) {
    for (let i = 0; i < count; i++) {
        const el = document.createElement('span');
        el.className = 'burst-item';
        el.textContent = CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)];

        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
        const dist = 80 + Math.random() * 170;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist - 30;
        const rot = (Math.random() - 0.5) * 420;
        const dur = (0.85 + Math.random() * 0.55).toFixed(2) + 's';

        el.style.left = `${originX}px`;
        el.style.top = `${originY}px`;
        el.style.fontSize = `${18 + Math.random() * 14}px`;
        el.style.setProperty('--tx', `${tx.toFixed(1)}px`);
        el.style.setProperty('--ty', `${ty.toFixed(1)}px`);
        el.style.setProperty('--rot', `${rot.toFixed(0)}deg`);
        el.style.setProperty('--dur', dur);

        document.body.appendChild(el);
        setTimeout(() => el.remove(), parseFloat(dur) * 1000 + 60);
    }
}

function tryUnlock() {
    if (input.value.trim() === SECRET) {
        errorEl.textContent = '';
        const rect = unlockBtn.getBoundingClientRect();
        spawnJoyBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 28);

        gate.hidden = true;
        overlay.hidden = false;
        startHeartsRain();
        song.currentTime = 0;
        song.volume = volumeSlider.value;
        const p = song.play();
        if (p) p.catch(() => { });
    } else {
        errorEl.textContent = 'كلمة السر غير صحيحة 🌸 حاولي مرة أخرى بحب';
        errorEl.classList.remove('shake');
        void errorEl.offsetWidth;
        errorEl.classList.add('shake');
        input.value = '';
        input.focus();
    }
}

if (togglePassBtn) {
    togglePassBtn.addEventListener('click', () => {
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        togglePassBtn.textContent = isPass ? '🙈' : '👁️';
    });
}

unlockBtn.addEventListener('click', tryUnlock);
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryUnlock();
});

closeBtn.addEventListener('click', () => {
    overlay.hidden = true;
    gate.hidden = false;
    input.value = '';
    input.type = 'password';
    if (togglePassBtn) togglePassBtn.textContent = '👁️';
    song.pause();
    stopHeartsRain();
});

muteBtn.addEventListener('click', () => {
    song.muted = !song.muted;
    muteBtn.textContent = song.muted ? '🔇' : '🔊';
});

volumeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    song.volume = val;
    if (val === 0) {
        song.muted = true;
        muteBtn.textContent = '🔇';
    } else {
        song.muted = false;
        muteBtn.textContent = '🔊';
    }
});

/* توليد بريق ذهبي متناثر ومستمر حول اسم شيماء */
const scatterContainer = document.getElementById('scatterSparkleContainer');
if (scatterContainer) {
    setInterval(() => {
        const spark = document.createElement('div');
        spark.className = 'scatter-sparkle';

        const rx = (Math.random() - 0.5) * 165;
        const ry = (Math.random() - 0.5) * 62;

        spark.style.left = `calc(50% + ${rx}px)`;
        spark.style.top = `calc(50% + ${ry}px)`;

        const size = Math.random() * 14 + 8;
        spark.style.width = `${size}px`;
        spark.style.height = `${size}px`;

        const startX = (Math.random() - 0.5) * 26;
        const startY = (Math.random() - 0.5) * 26;
        const endX = startX + (Math.random() - 0.5) * 65;
        const endY = startY + (Math.random() - 0.5) * 65 - 22;

        spark.style.setProperty('--sx1', `${startX}px`);
        spark.style.setProperty('--sy1', `${startY}px`);
        spark.style.setProperty('--sx2', `${endX}px`);
        spark.style.setProperty('--sy2', `${endY}px`);

        const duration = Math.random() * 0.75 + 0.75;
        spark.style.animationDuration = `${duration}s`;

        scatterContainer.appendChild(spark);
        setTimeout(() => spark.remove(), duration * 1000);
    }, 85);
}

/* تأثير البريق المضيء المتبع لحركة الماوس أو اللمس */
let throttleTimer = false;
window.addEventListener('pointermove', (e) => {
    if (!throttleTimer) {
        createSparkleParticle(e.clientX, e.clientY);
        throttleTimer = true;
        setTimeout(() => {
            throttleTimer = false;
        }, 45);
    }
});

function createSparkleParticle(x, y) {
    const spark = document.createElement('div');
    spark.className = 'mouse-sparkle';

    const size = Math.random() * 18 + 10;
    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    spark.style.left = `${x - size / 2}px`;
    spark.style.top = `${y - size / 2}px`;

    const moveX = (Math.random() - 0.5) * 55;
    const moveY = (Math.random() - 0.5) * 55 - 20;
    spark.style.setProperty('--mx', `${moveX}px`);
    spark.style.setProperty('--my', `${moveY}px`);

    const duration = Math.random() * 0.7 + 0.55;
    spark.style.animationDuration = `${duration}s`;

    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), duration * 1000);
}

/* تساقط الورود والقلوب والفراشات المبهجة داخل الرسالة */
const RAIN = ['🌸', '💖', '✨', '🌷', '🦋', '💐'];
function startHeartsRain() {
    stopHeartsRain();
    rainTimer = setInterval(() => {
        const s = document.createElement('span');
        s.className = 'fall';
        s.textContent = RAIN[Math.floor(Math.random() * RAIN.length)];
        s.style.left = Math.random() * 100 + '%';
        s.style.fontSize = (16 + Math.random() * 18) + 'px';
        s.style.animationDuration = (4 + Math.random() * 4) + 's';
        heartsRain.appendChild(s);
        setTimeout(() => s.remove(), 8000);
    }, 320);
}

function stopHeartsRain() {
    if (rainTimer) clearInterval(rainTimer);
    rainTimer = null;
    heartsRain.innerHTML = '';
}

/* عناصر عائمة مزدهرة في الخلفية */
const EMOJIS = ['🌸', '✨', '💖', '🌷', '🦋', '☀️'];
const container = document.getElementById('particles');
for (let i = 0; i < 22; i++) {
    const span = document.createElement('span');
    span.className = 'particle';
    span.textContent = EMOJIS[i % EMOJIS.length];
    span.style.left = Math.random() * 100 + '%';
    span.style.fontSize = (16 + Math.random() * 18) + 'px';
    span.style.animationDuration = (8 + Math.random() * 10) + 's';
    span.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(span);
}