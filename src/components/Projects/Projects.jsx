import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { transformationImages } from "../../data/projects.js";
import "./Projects.css";

const carouselImages = [...transformationImages, ...transformationImages];
const carouselSpeed = 0.82;

export default function Projects() {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const zoomRef = useRef(null);
  const zoomImageRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const previousZoomIndexRef = useRef(null);
  const zoomDirectionRef = useRef(1);
  const [zoomIndex, setZoomIndex] = useState(null);
  const isZoomOpen = zoomIndex !== null;

  const changeZoomImage = (direction) => {
    const image = zoomImageRef.current;
    if (!image || zoomIndex === null) return;

    gsap.killTweensOf(image);
    gsap.to(image, {
      opacity: 0,
      x: direction * -46,
      scale: 0.965,
      duration: 0.14,
      ease: "power2.in",
      overwrite: true,
      onComplete: () => {
        zoomDirectionRef.current = direction;
        setZoomIndex((current) => {
          if (current === null) return null;
          return (current + direction + transformationImages.length) % transformationImages.length;
        });
      },
    });
  };

  const closeZoom = () => {
    gsap.killTweensOf(zoomImageRef.current);

    const timeline = gsap.timeline({ onComplete: () => setZoomIndex(null) });
    timeline
      .to(zoomImageRef.current, { opacity: 0, scale: 0.92, duration: 0.18, ease: "power2.in", overwrite: true })
      .to(zoomRef.current, { opacity: 0, duration: 0.18 }, 0.05);
  };

  const showPreviousZoom = () => changeZoomImage(-1);
  const showNextZoom = () => changeZoomImage(1);

  const handleCarouselPointerUp = (event) => {
    if (event.target.closest?.(".results-carousel__card")) return;

    const cards = Array.from(trackRef.current?.children ?? []);
    const clickedCard = cards
      .map((card) => {
        const rect = card.getBoundingClientRect();
        const containsPointer = event.clientX >= rect.left
          && event.clientX <= rect.right
          && event.clientY >= rect.top
          && event.clientY <= rect.bottom;

        return {
          card,
          containsPointer,
          distance: Math.abs((rect.left + rect.right) / 2 - event.clientX),
          zIndex: Number.parseInt(window.getComputedStyle(card).zIndex, 10) || 0,
        };
      })
      .filter(({ containsPointer }) => containsPointer)
      .sort((first, second) => second.zIndex - first.zIndex || first.distance - second.distance)[0]?.card;

    if (!clickedCard) return;
    setZoomIndex(Number(clickedCard.dataset.zoomIndex));
  };

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return undefined;

    const cards = Array.from(track.children);
    const motion = {
      x: 0,
      speed: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : carouselSpeed,
    };
    const setTrackX = gsap.quickSetter(track, "x", "px");
    let loopWidth = 0;
    let startingX = 0;

    const render = () => {
      setTrackX(motion.x);
      const center = viewport.clientWidth / 2;
      const influenceRange = Math.max(viewport.clientWidth * 0.52, 320);

      cards.forEach((card) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2 + motion.x;
        const distance = cardCenter - center;
        const normalized = gsap.utils.clamp(-1, 1, distance / influenceRange);
        const proximity = 1 - Math.min(1, Math.abs(distance) / influenceRange);

        gsap.set(card, {
          opacity: 0.4 + proximity * 0.6,
          rotation: normalized * -2.4,
          y: Math.abs(normalized) * 10,
          scale: 0.78 + proximity * 0.34,
          zIndex: Math.round(proximity * 10),
          force3D: true,
        });
      });
    };

    const refresh = () => {
      const repeatedFirstCard = cards[transformationImages.length];
      loopWidth = repeatedFirstCard.offsetLeft - cards[0].offsetLeft;
      startingX = viewport.clientWidth / 2 - cards[0].offsetWidth / 2;
      motion.x = startingX;
      render();
    };

    const tick = (_time, deltaTime) => {
      motion.x -= motion.speed * (deltaTime / (1000 / 60));
      if (motion.x <= startingX - loopWidth) motion.x += loopWidth;
      render();
    };

    const pause = () => {
      gsap.killTweensOf(motion);
      motion.speed = 0;
    };

    const pauseImmediately = () => {
      gsap.killTweensOf(motion);
      motion.speed = 0;
    };

    const resume = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.to(motion, { speed: carouselSpeed, duration: 0.55, ease: "power2.out", overwrite: true });
    };

    const handleFocusOut = (event) => {
      if (!viewport.contains(event.relatedTarget)) resume();
    };

    const resizeObserver = new ResizeObserver(refresh);
    resizeObserver.observe(viewport);
    viewport.addEventListener("mouseenter", pause);
    viewport.addEventListener("mouseleave", resume);
    viewport.addEventListener("pointerdown", pauseImmediately);
    viewport.addEventListener("focusin", pause);
    viewport.addEventListener("focusout", handleFocusOut);
    gsap.ticker.add(tick);
    refresh();

    return () => {
      resizeObserver.disconnect();
      viewport.removeEventListener("mouseenter", pause);
      viewport.removeEventListener("mouseleave", resume);
      viewport.removeEventListener("pointerdown", pauseImmediately);
      viewport.removeEventListener("focusin", pause);
      viewport.removeEventListener("focusout", handleFocusOut);
      gsap.ticker.remove(tick);
      gsap.killTweensOf(motion);
    };
  }, []);

  useEffect(() => {
    if (!isZoomOpen) return undefined;

    previousFocusRef.current = document.activeElement;
    document.body.classList.add("zoom-open");
    closeButtonRef.current?.focus({ preventScroll: true });

    const animation = gsap.timeline();
    animation
      .fromTo(zoomRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" })
      .fromTo(
        zoomImageRef.current,
        { opacity: 0, rotationY: -10, scale: 0.76 },
        { opacity: 1, rotationY: 0, scale: 1, duration: 0.62, ease: "power3.out" },
        0.04,
      );

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setZoomIndex(null);
      if (event.key === "ArrowLeft") changeZoomImage(-1);
      if (event.key === "ArrowRight") changeZoomImage(1);
      if (event.key !== "Tab") return;

      const focusable = Array.from(zoomRef.current?.querySelectorAll("button:not([disabled]), [tabindex]:not([tabindex=\"-1\"])") ?? []);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      animation.kill();
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("zoom-open");
      previousFocusRef.current?.focus({ preventScroll: true });
    };
  }, [isZoomOpen]);

  useLayoutEffect(() => {
    if (zoomIndex === null) {
      previousZoomIndexRef.current = null;
      return undefined;
    }

    if (previousZoomIndexRef.current === null) {
      previousZoomIndexRef.current = zoomIndex;
      return undefined;
    }

    previousZoomIndexRef.current = zoomIndex;
    const image = zoomImageRef.current;
    if (!image) return undefined;

    const revealImage = () => {
      gsap.fromTo(
        image,
        { opacity: 0, x: zoomDirectionRef.current * 46, scale: 0.965 },
        { opacity: 1, x: 0, scale: 1, duration: 0.25, ease: "power3.out", overwrite: true },
      );
    };

    if (image.complete) revealImage();
    else image.addEventListener("load", revealImage, { once: true });

    return () => {
      image.removeEventListener("load", revealImage);
    };
  }, [zoomIndex]);

  return (
    <>
      <section className="projects" id="projetos">
        <div className="projects__container">
          <header className="projects__header">
            <span>Resultados reais</span>
            <h2>Antes e Depois</h2>
            <p>
              Evoluções construídas com estratégia, consistência e acompanhamento
              individualizado ao longo de cada processo.
            </p>
          </header>

          <div className="results-carousel" onPointerUp={handleCarouselPointerUp} ref={viewportRef}>
            <div className="results-carousel__track" ref={trackRef}>
              {carouselImages.map((image, index) => {
                const originalIndex = index % transformationImages.length;
                const isDuplicate = index >= transformationImages.length;

                return (
                  <button
                    aria-hidden={isDuplicate ? "true" : undefined}
                    aria-label={`Ampliar ${image.title}, ${image.angle}`}
                    className="results-carousel__card"
                    data-zoom-index={originalIndex}
                    key={`${image.src}-${index}`}
                    onClick={() => setZoomIndex(originalIndex)}
                    tabIndex={isDuplicate ? -1 : 0}
                    type="button"
                  >
                    <img alt={isDuplicate ? "" : image.alt} loading={index > 2 ? "lazy" : "eager"} src={image.src} />
                    <span className="results-carousel__zoom-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="6" />
                        <path d="m16 16 4 4M11 8v6M8 11h6" />
                      </svg>
                    </span>
                    <span className="results-carousel__label">
                      <small>{image.title}</small>
                      {image.angle}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="results-carousel__hint">
              <span aria-hidden="true">Ⅱ</span> Passe o mouse para pausar · clique para ampliar
            </p>
          </div>
        </div>
      </section>

      {zoomIndex !== null && createPortal(
        <div
          aria-labelledby="results-zoom-title"
          aria-modal="true"
          className="results-zoom"
          ref={zoomRef}
          role="dialog"
        >
          <button aria-label="Fechar imagem ampliada" className="results-zoom__backdrop" onClick={closeZoom} type="button" />
          <div className="results-zoom__dialog">
            <button
              aria-label="Fechar imagem ampliada"
              className="results-zoom__close"
              onClick={closeZoom}
              ref={closeButtonRef}
              type="button"
            >
              ×
            </button>

            <button aria-label="Imagem anterior" className="results-zoom__arrow results-zoom__arrow--previous" onClick={showPreviousZoom} type="button">‹</button>
            <img
              alt={transformationImages[zoomIndex].alt}
              ref={zoomImageRef}
              src={transformationImages[zoomIndex].src}
            />
            <button aria-label="Próxima imagem" className="results-zoom__arrow results-zoom__arrow--next" onClick={showNextZoom} type="button">›</button>

            <div className="results-zoom__caption">
              <div>
                <span>{transformationImages[zoomIndex].title}</span>
                <strong id="results-zoom-title">{transformationImages[zoomIndex].angle}</strong>
              </div>
              <small>{String(zoomIndex + 1).padStart(2, "0")} / {String(transformationImages.length).padStart(2, "0")}</small>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
