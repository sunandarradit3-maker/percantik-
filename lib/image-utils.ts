type Controls = {
  intensity: number;
  smoothness: number;
  brightness: number;
  warmth: number;
  clarity: number;
};

type Mode = 'manual' | 'smart';

export async function applyBeautify(
  dataUrl: string,
  mode: Mode,
  controls: Controls,
  canvas?: HTMLCanvasElement | null
): Promise<string> {
  const img = await loadImage(dataUrl);
  const c = canvas ?? document.createElement('canvas');
  const ctx = c.getContext('2d');
  if (!ctx) return dataUrl;

  const maxWidth = 1600;
  const scale = Math.min(1, maxWidth / img.width);
  c.width = Math.round(img.width * scale);
  c.height = Math.round(img.height * scale);

  ctx.clearRect(0, 0, c.width, c.height);
  ctx.drawImage(img, 0, 0, c.width, c.height);

  const preset = mode === 'smart'
    ? { brightness: 1.05, contrast: 1.06, saturate: 1.03, blur: 0.4 }
    : {
        brightness: 1 + controls.brightness / 100,
        contrast: 1 + controls.intensity / 300,
        saturate: 1 + controls.warmth / 200,
        blur: controls.smoothness / 220,
      };

  ctx.filter = `brightness(${preset.brightness}) contrast(${preset.contrast}) saturate(${preset.saturate}) blur(${preset.blur}px)`;
  ctx.drawImage(img, 0, 0, c.width, c.height);

  ctx.globalAlpha = mode === 'smart' ? 0.03 : Math.min(0.08, controls.intensity / 1000);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.globalAlpha = 1;

  return c.toDataURL('image/png', 0.95);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
