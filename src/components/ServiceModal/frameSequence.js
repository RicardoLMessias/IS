const FORWARD_PRELOAD = 8;
const BACKWARD_PRELOAD = 3;
const MAX_CACHED_FRAMES = 48;
const CACHE_RADIUS = 24;

export function createFrameSequence(canvas) {
  const context = canvas.getContext("2d", { alpha: false });
  const frameCount = Number(canvas.dataset.frameCount);
  const startFrame = Number(canvas.dataset.startFrame || 1);
  const extension = canvas.dataset.extension || "webp";
  const filePrefix = canvas.dataset.filePrefix || "frame_";
  const numberPadding = Number(canvas.dataset.numberPadding || 4);
  const configuredBasePath = canvas.dataset.basePath;
  const basePath = /^(?:https?:)?\/\//i.test(configuredBasePath)
    ? configuredBasePath.replace(/\/$/, "")
    : `${import.meta.env.BASE_URL}${configuredBasePath.replace(/^\.?\//, "")}`.replace(/\/$/, "");
  const cache = new Map();
  let currentFrame = 0;
  let destroyed = false;

  const drawFrame = (image) => {
    if (destroyed || !image?.naturalWidth) return;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
    const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    context.clearRect(0, 0, width, height);
    context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
  };

  const loadFrame = (index) => {
    const safeIndex = Math.max(0, Math.min(frameCount - 1, index));
    if (cache.has(safeIndex)) return cache.get(safeIndex);

    const image = new Image();
    image.decoding = "async";
    const frameNumber = String(startFrame + safeIndex).padStart(numberPadding, "0");
    image.src = `${basePath}/${filePrefix}${frameNumber}.${extension}`;
    image.addEventListener("load", () => {
      if (!destroyed && safeIndex === currentFrame) drawFrame(image);
    }, { once: true });
    cache.set(safeIndex, image);
    return image;
  };

  const trimCache = () => {
    if (cache.size <= MAX_CACHED_FRAMES) return;
    cache.forEach((_, cachedIndex) => {
      if (Math.abs(cachedIndex - currentFrame) > CACHE_RADIUS) cache.delete(cachedIndex);
    });
  };

  const renderFrame = (index, preload = true) => {
    if (destroyed) return;
    currentFrame = Math.max(0, Math.min(frameCount - 1, Math.round(index)));
    const image = loadFrame(currentFrame);
    if (image.complete && image.naturalWidth) drawFrame(image);

    if (preload) {
      for (let offset = 1; offset <= FORWARD_PRELOAD; offset += 1) {
        loadFrame(currentFrame + offset);
        if (offset <= BACKWARD_PRELOAD) loadFrame(currentFrame - offset);
      }
      trimCache();
    }
  };

  const resizeObserver = new ResizeObserver(() => {
    const image = cache.get(currentFrame);
    if (image?.complete && image.naturalWidth) drawFrame(image);
  });
  resizeObserver.observe(canvas);
  renderFrame(0, false);

  return {
    frameCount,
    renderFrame,
    destroy() {
      destroyed = true;
      resizeObserver.disconnect();
      cache.clear();
    },
  };
}
