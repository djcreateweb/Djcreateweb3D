# DJ Create — Proyecto Web

## Estructura del proyecto

```
djcreate/
├── html/
│   └── index.html          → Página principal
├── css/
│   └── styles.css          → Estilos
├── js/
│   ├── frames.js           → Lógica scroll-driven con frames
│   └── main.js             → Scripts generales
├── frames/                 → Aquí van los PNGs/JPGs del vídeo
│   ├── frame_0000.jpg
│   ├── frame_0001.jpg
│   └── ...
├── assets/
│   ├── fonts/
│   ├── icons/
│   └── images/
└── extract_frames.py       → Script para extraer frames del vídeo
```

---

## Paso 1 — Extraer los frames del vídeo

1. Instala OpenCV si no lo tienes:
```
pip install opencv-python
```

2. Pon tu vídeo en la carpeta raíz del proyecto con el nombre `video.mp4`

3. Ejecuta el script:
```
python extract_frames.py
```

Los frames se guardarán automáticamente en la carpeta `/frames/`

---

## Paso 2 — Configurar frames.js

Abre `js/frames.js` y cambia estas variables:

```js
const TOTAL_FRAMES = 120;   // Número real de frames extraídos
const FRAMES_PATH = "../frames/";
const FRAME_PREFIX = "frame_";
const FRAME_EXT = ".jpg";
const FRAME_DIGITS = 4;
```

---

## Paso 3 — Abrir la web

Abre `html/index.html` en el navegador con un servidor local.
Recomendado: usa Live Server en VS Code.

---

## Notas importantes

- Cuantos más frames, más suave la animación
- Recomendado: entre 60 y 150 frames
- Los frames deben ser JPG para mejor rendimiento
- Resolución recomendada: 1920x1080
