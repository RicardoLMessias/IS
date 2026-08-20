import { useEffect, useRef, useState } from "react";
import { heroSlides } from "../../data/heroSlides.js";
import "./Hero.css";

const AUTOPLAY_DELAY = 5000;

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const remainingTime = useRef(AUTOPLAY_DELAY);
  const timerStartedAt = useRef(null);
  const previousIndex = useRef(activeIndex);

  const showSlide = (index) => {
    const total = heroSlides.length;
    setActiveIndex((index + total) % total);
  };

  useEffect(() => {
    if (previousIndex.current !== activeIndex) {
      previousIndex.current = activeIndex;
      remainingTime.current = AUTOPLAY_DELAY;
    }

    if (isPaused || heroSlides.length < 2) return undefined;

    timerStartedAt.current = performance.now();
    const timer = window.setTimeout(() => {
      timerStartedAt.current = null;
      remainingTime.current = AUTOPLAY_DELAY;
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, remainingTime.current);

    return () => {
      window.clearTimeout(timer);

      if (timerStartedAt.current !== null) {
        const elapsed = performance.now() - timerStartedAt.current;
        remainingTime.current = Math.max(0, remainingTime.current - elapsed);
        timerStartedAt.current = null;
      }
    };
  }, [activeIndex, isPaused]);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") showSlide(activeIndex - 1);
    if (event.key === "ArrowRight") showSlide(activeIndex + 1);
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(distance) > 50) showSlide(activeIndex + (distance < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  return (
    <section
      aria-label="Destaques"
      aria-roledescription="carrossel"
      className={`hero${isPaused ? " hero--paused" : ""}`}
      id="inicio"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
      onFocus={() => setIsPaused(true)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchEnd={handleTouchEnd}
      onTouchStart={(event) => {
        touchStartX.current = event.changedTouches[0].clientX;
      }}
      tabIndex="0"
    >
      <div className="hero__slides" aria-live="off">
        {heroSlides.map((slide, index) => {
          const TitleTag = index === 0 ? "h1" : "h2";

          return (
            <article
              aria-hidden={index !== activeIndex}
              className={`hero-slide${index === activeIndex ? " hero-slide--active" : ""}`}
              key={slide.id}
            >
            <img
              alt={slide.imageAlt}
              className="hero-slide__image"
              fetchPriority={index === 0 ? "high" : "auto"}
              loading={index === 0 ? "eager" : "lazy"}
              src={slide.image}
            />
            <div className="hero-slide__overlay" />

            <div className="hero-slide__content">
              <p className="hero-slide__eyebrow">{slide.eyebrow}</p>
              <TitleTag className="hero-slide__title">{slide.title}</TitleTag>
              <p className="hero-slide__description">{slide.description}</p>

              <div className="hero-slide__actions">
                {slide.actions.map((action) => {
                  const isExternal = action.href.startsWith("http");
                  return (
                    <a
                      className={`hero-button hero-button--${action.variant}`}
                      href={action.href}
                      key={`${slide.id}-${action.label}`}
                      rel={isExternal ? "noreferrer" : undefined}
                      tabIndex={index === activeIndex ? 0 : -1}
                      target={isExternal ? "_blank" : undefined}
                    >
                      {action.label}
                    </a>
                  );
                })}
              </div>
            </div>
            </article>
          );
        })}
      </div>

      {heroSlides.length > 1 && (
        <div className="hero__pagination" aria-label="Escolher destaque">
          {heroSlides.map((slide, index) => (
            <button
              aria-label={`Mostrar destaque ${index + 1}: ${slide.title}`}
              aria-pressed={index === activeIndex}
              className={index === activeIndex ? "is-active" : ""}
              key={slide.id}
              onClick={() => showSlide(index)}
              type="button"
            >
              <span><i /></span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
