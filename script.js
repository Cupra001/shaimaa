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
const rosesField = document.getElementById('rosesField');
const particlesContainer = document.getElementById('particles');
const scatterContainer = document.getElementById('scatterSparkleContainer');

const isSmallScreen = () => window.matchMedia('(max-width: 767px)').matches;
const isCoarsePointer = () => window.matchMedia('(pointer: coarse)').matches;

let rainTimer = null;
let scatterTimer = null;
let resizeTimeout = null;

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function initFloatingRoses() {
    if (!rosesField) return;
    rosesField.innerHTML = '';

    const mobile = isSmallScreen();
    const count = mobile ? 10 : 16;

    for (let i = 0; i < count; i++) {
        const rose = document.createElement('div');
        rose.className = 'real-rose rose-float';

        const size = mobile
            ? randomBetween(62, 92).toFixed(0)
            : randomBetween(82, 128).toFixed(0);
        const dur = randomBetween(9, 15.5).toFixed(2);
        const delay = (-randomBetween(0, 14)).toFixed(2);
        const sway = randomBetween(-65, 65).toFixed(1);
        const rotStart = randomBetween(-35, 35).toFixed(0);
        const scale = randomBetween(0.95, 1.25).toFixed(2);
        const maxOp = randomBetween(0.86, 0.98).toFixed(2);

        rose.style.left = `${randomBetween(2, 90).toFixed(1)}%`;
        rose.style.setProperty('--rose-size', `${size}px`);
        rose.style.setProperty('--dur', `${dur}s`);
        rose.style.setProperty('--delay', `${delay}s`);
        rose.style.setProperty('--sway', `${sway}px`);
        rose.style.setProperty('--rotStart', `${rotStart}deg`);
        rose.style.setProperty('--scale', scale);
        rose.style.setProperty('--maxOp', maxOp);

        rosesField.appendChild(rose);
    }
}

initFloatingRoses();

function spawnJoyBurst(originX, originY, count = 22) {
    const mobile = isSmallScreen();
    const actualCount = mobile ? Math.min(count, 14) : count;

    for (let i = 0; i < actualCount; i++) {
        const rose = document.createElement('div');
        rose.className = 'real-rose rose-burst';

        const angle = (Math.PI * 2 * i) / actualCount + randomBetween(-0.25, 0.25);
        const dist = randomBetween(85, mobile ? 150 : 210);
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist - 25;
        const rot = randomBetween(-220, 220).toFixed(0);
        const dur = randomBetween(0.95, 1.45).toFixed(2);
        const size = mobile
            ? randomBetween(56, 82).toFixed(0)
            : randomBetween(72, 108).toFixed(0);
        const endScale = randomBetween(1.05, 1.45).toFixed(2);

        rose.style.left = `${(originX - Number(size) / 2).toFixed(1)}px`;
        rose.style.top = `${(originY - Number(size) / 2).toFixed(1)}px`;
        rose.style.setProperty('--rose-size', `${size}px`);
        rose.style.setProperty('--tx', `${tx.toFixed(1)}px`);
        rose.style.setProperty('--ty', `${ty.toFixed(1)}px`);
        rose.style.setProperty('--rot', `${rot}deg`);
        rose.style.setProperty('--dur', `${dur}s`);
        rose.style.setProperty('--endScale', endScale);

        document.body.appendChild(rose);
        setTimeout(() => rose.remove(), parseFloat(dur) * 1000 + 100);
    }
}

function tryUnlock() {
    if (!input || !errorEl || !gate || !overlay) return;

    if (input.value.trim() === SECRET) {
        errorEl.textContent = '';

        if (unlockBtn) {
            const rect = unlockBtn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2 || window.innerWidth / 2;
            const cy = rect.top + rect.height / 2 || window.innerHeight / 2;
            spawnJoyBurst(cx, cy, 22);
        }

        gate.hidden = true;
        overlay.hidden = false;
        startHeartsRain();

        if (song) {
            song.currentTime = 0;
            song.volume = volumeSlider ? parseFloat(volumeSlider.value) : 0.85;
            const playPromise = song.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => { });
            }
        }
    } else {
        errorEl.textContent = 'كلمة السر غير صحيحة 🌸 حاولي مرة أخرى بحب';
        errorEl.classList.remove('shake');
        void errorEl.offsetWidth;
        errorEl.classList.add('shake');
        input.value = '';
        input.focus();
    }
}

if (togglePassBtn && input) {
    togglePassBtn.addEventListener('click', () => {
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        togglePassBtn.textContent = isPass ? '🙈' : '👁️';
    });
}

if (unlockBtn) {
    unlockBtn.addEventListener('click', tryUnlock);
}

if (input) {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') tryUnlock();
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        if (overlay) overlay.hidden = true;
        if (gate) gate.hidden = false;
        if (input) {
            input.value = '';
            input.type = 'password';
        }
        if (togglePassBtn) togglePassBtn.textContent = '👁️';
        if (song) song.pause();
        stopHeartsRain();
    });
}

if (muteBtn && song) {
    muteBtn.addEventListener('click', () => {
        song.muted = !song.muted;
        muteBtn.textContent = song.muted ? '🔇' : '🔊';
    });
}

if (volumeSlider && song) {
    volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        song.volume = val;
        if (val === 0) {
            song.muted = true;
            if (muteBtn) muteBtn.textContent = '🔇';
        } else {
            song.muted = false;
            if (muteBtn) muteBtn.textContent = '🔊';
        }
    });
}

if (scatterContainer) {
    scatterTimer = setInterval(() => {
        if (!gate || gate.hidden) return;

        const spark = document.createElement('div');
        spark.className = 'scatter-sparkle';

        const rx = randomBetween(-75, 75).toFixed(1);
        const ry = randomBetween(-28, 28).toFixed(1);

        spark.style.left = `calc(50% + ${rx}px)`;
        spark.style.top = `calc(50% + ${ry}px)`;

        const size = randomBetween(7, 19).toFixed(0);
        spark.style.width = `${size}px`;
        spark.style.height = `${size}px`;

        const startX = randomBetween(-11, 11).toFixed(0);
        const startY = randomBetween(-11, 11).toFixed(0);
        const endX = (parseFloat(startX) + randomBetween(-28, 28)).toFixed(0);
        const endY = (parseFloat(startY) + randomBetween(-28, 28) - 18).toFixed(0);

        spark.style.setProperty('--sx1', `${startX}px`);
        spark.style.setProperty('--sy1', `${startY}px`);
        spark.style.setProperty('--sx2', `${endX}px`);
        spark.style.setProperty('--sy2', `${endY}px`);

        const duration = randomBetween(0.75, 1.5).toFixed(2);
        spark.style.animationDuration = `${duration}s`;

        scatterContainer.appendChild(spark);
        setTimeout(() => spark.remove(), parseFloat(duration) * 1000 + 60);
    }, isSmallScreen() ? 150 : 95);
}

let lastMoveTime = 0;
window.addEventListener('pointermove', (e) => {
    if (isCoarsePointer()) return;
    const now = performance.now();
    if (now - lastMoveTime < 55) return;
    lastMoveTime = now;
    createSparkleParticle(e.clientX, e.clientY);
}, { passive: true });

function createSparkleParticle(x, y) {
    const spark = document.createElement('div');
    spark.className = 'mouse-sparkle';

    const size = randomBetween(8, 22).toFixed(0);
    const moveX = randomBetween(-23, 23).toFixed(0);
    const moveY = (randomBetween(-23, 23) - 16).toFixed(0);
    const duration = randomBetween(0.45, 1.05).toFixed(2);

    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    spark.style.left = `${(x - Number(size) / 2).toFixed(1)}px`;
    spark.style.top = `${(y - Number(size) / 2).toFixed(1)}px`;
    spark.style.setProperty('--mx', `${moveX}px`);
    spark.style.setProperty('--my', `${moveY}px`);
    spark.style.animationDuration = `${duration}s`;

    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), parseFloat(duration) * 1000 + 60);
}

function startHeartsRain() {
    stopHeartsRain();
    if (!heartsRain) return;

    const mobile = isSmallScreen();
    const intervalMs = mobile ? 520 : 360;

    rainTimer = setInterval(() => {
        if (!heartsRain || (overlay && overlay.hidden)) return;

        const rose = document.createElement('div');
        rose.className = 'real-rose rose-fall';

        const size = mobile
            ? randomBetween(64, 96).toFixed(0)
            : randomBetween(86, 132).toFixed(0);
        const dur = randomBetween(5.2, 8.5).toFixed(2);
        const sway = randomBetween(-55, 55).toFixed(1);

        rose.style.left = `${randomBetween(1, 89).toFixed(1)}%`;
        rose.style.setProperty('--rose-size', `${size}px`);
        rose.style.setProperty('--sway', `${sway}px`);
        rose.style.animationDuration = `${dur}s`;

        heartsRain.appendChild(rose);
        setTimeout(() => rose.remove(), parseFloat(dur) * 1000 + 120);
    }, intervalMs);
}

function stopHeartsRain() {
    if (rainTimer) clearInterval(rainTimer);
    rainTimer = null;
    if (heartsRain) heartsRain.innerHTML = '';
}

if (particlesContainer) {
    const SPARKLES = ['✨', '💖', '🦋'];
    const totalParticles = isSmallScreen() ? 8 : 14;

    for (let i = 0; i < totalParticles; i++) {
        const span = document.createElement('span');
        span.className = 'particle';
        span.textContent = SPARKLES[i % SPARKLES.length];
        span.style.left = `${randomBetween(3, 97).toFixed(1)}%`;
        span.style.fontSize = `${randomBetween(14, 24).toFixed(0)}px`;
        span.style.animationDuration = `${randomBetween(10, 18).toFixed(1)}s`;
        span.style.animationDelay = `${(-randomBetween(0, 12)).toFixed(1)}s`;
        particlesContainer.appendChild(span);
    }
}

window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initFloatingRoses();
    }, 200);
});