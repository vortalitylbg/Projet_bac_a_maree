// Navbar (optionnel)
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ---- Particules canvas ----
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  // taille CSS
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  // taille pixel
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  // remettre la matrice puis scaler au DPR
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor(initial = false) { this.reset(initial); }

  reset(initial = false) {
    this.baseX = Math.random() * window.innerWidth;
    this.x = this.baseX;
    this.y = initial ? Math.random() * window.innerHeight : window.innerHeight + 20;

    // tailles variées
    this.size = 0.8 + Math.random() * 3.2; // 0.8px -> 4px

    // vitesses variées (certaines plus rapides)
    this.speedY = 0.25 + Math.random() * 2.0; // 0.25 -> 2.25 px/frame (≈60fps)

    // flottement latéral
    this.amp = 8 + Math.random() * 28;      // amplitude en px
    this.freq = 0.2 + Math.random() * 0.8;  // fréquence
    this.t = Math.random() * Math.PI * 2;   // phase

    // apparence
    this.alpha = 0.55 + Math.random() * 0.4;
    this.glow = 6 + Math.random() * 12;
  }

  update(dt) {
    // dt est en “frames” (1 ≈ 16.7ms)
    this.y -= this.speedY * dt;
    this.t += this.freq * 0.02 * dt; // progression temporelle
    this.x = this.baseX + Math.sin(this.t) * this.amp;

    // réapparition par le bas
    if (this.y < -20) this.reset(false);
  }

  draw() {
    ctx.save();
    ctx.shadowBlur = this.glow;
    ctx.shadowColor = `rgba(255,255,255,${this.alpha})`;
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const PARTICLE_COUNT = 100;
const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle(true));

let last = 0;
function tick(ts = 0) {
  const dt = last ? (ts - last) / 16.67 : 1; // 1 ≈ une frame à 60fps
  last = ts;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const p of particles) { p.update(dt); p.draw(); }

  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);


const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const overlay = document.querySelector(".overlay");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("active");
  overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
  hamburger.classList.remove("active");
  mobileMenu.classList.remove("active");
  overlay.classList.remove("active");
});
