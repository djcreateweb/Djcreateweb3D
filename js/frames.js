// ── CONFIGURACIÓN ─────────────────────────────────────────
const TOTAL_FRAMES = 120;        // Cambia por el número real de frames
const FRAMES_PATH = "../frames/"; // Ruta a la carpeta de frames
const FRAME_PREFIX = "frame_";   // Prefijo del nombre de cada frame
const FRAME_EXT = ".jpg";        // Extensión de los frames
const FRAME_DIGITS = 4;          // Dígitos del número: frame_0001.jpg
// ──────────────────────────────────────────────────────────

const canvas = document.getElementById("frameCanvas");
const ctx = canvas.getContext("2d");
const hero = document.getElementById("hero");
const heroContent = document.getElementById("heroContent");

// Precargar todas las imágenes
const frames = [];
let loadedCount = 0;

function padNumber(n, digits) {
  return String(n).padStart(digits, "0");
}

function getFramePath(index) {
  return `${FRAMES_PATH}${FRAME_PREFIX}${padNumber(index, FRAME_DIGITS)}${FRAME_EXT}`;
}

function preloadFrames() {
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = getFramePath(i);
    img.onload = () => {
      loadedCount++;
      if (loadedCount === 1) {
        // Dibuja el primer frame inmediatamente
        drawFrame(0);
        resizeCanvas();
      }
    };
    frames[i] = img;
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawFrame(index) {
  const img = frames[Math.min(Math.max(index, 0), TOTAL_FRAMES - 1)];
  if (!img || !img.complete) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Cover — igual que CSS object-fit: cover
  const scale = Math.max(
    canvas.width / img.naturalWidth,
    canvas.height / img.naturalHeight
  );
  const x = (canvas.width - img.naturalWidth * scale) / 2;
  const y = (canvas.height - img.naturalHeight * scale) / 2;
  ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
}

// ── SCROLL LOGIC ───────────────────────────────────────────
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const heroHeight = hero.offsetHeight - window.innerHeight;
  const progress = Math.min(Math.max(scrollTop / heroHeight, 0), 1);

  // Frame según el progreso del scroll
  const frameIndex = Math.floor(progress * (TOTAL_FRAMES - 1));
  drawFrame(frameIndex);

  // Mostrar el texto hero cuando el scroll llega al final
  if (progress > 0.85) {
    heroContent.classList.add("visible");
  } else {
    heroContent.classList.remove("visible");
  }
});

// ── INIT ───────────────────────────────────────────────────
window.addEventListener("resize", () => {
  resizeCanvas();
  drawFrame(0);
});

preloadFrames();
