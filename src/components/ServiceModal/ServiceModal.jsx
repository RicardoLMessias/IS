import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ServiceModal.css";

gsap.registerPlugin(ScrollTrigger);

export default function ServiceModal({ content, isOpen, onClose }) {
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const scrollRef = useRef(null);
  const contentRef = useRef(content);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  if (isOpen) contentRef.current = content;
  const renderedContent = contentRef.current;

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      return undefined;
    }

    if (!shouldRender) return undefined;

    setIsClosing(true);
    const exitTimer = window.setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
    }, 440);

    return () => window.clearTimeout(exitTimer);
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (!shouldRender) return undefined;

    previousFocusRef.current = document.activeElement;
    document.body.classList.add("modal-open");
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
      previousFocusRef.current?.focus({ preventScroll: true });
    };
  }, [shouldRender, onClose]);

  useLayoutEffect(() => {
    if (!shouldRender || !scrollRef.current) return undefined;

    const scroller = scrollRef.current;
    const blocks = scroller.querySelectorAll(".modal-service");
    const triggers = [];

    blocks.forEach((block) => {
      const media = block.querySelector(".modal-service__media");
      const video = media.querySelector("video");

      triggers.push(
        ScrollTrigger.create({
          trigger: block,
          scroller,
          start: "top top",
          end: () => {
            const stickyTop = window.matchMedia("(max-width: 760px)").matches ? 0 : 96;
            return `bottom ${stickyTop + media.offsetHeight}px`;
          },
          scrub: true,
          onUpdate: ({ progress }) => {
            media.style.setProperty("--media-progress", progress);
            if (video?.duration && Number.isFinite(video.duration)) {
              video.currentTime = progress * video.duration;
            }
          },
        }),
      );
    });

    ScrollTrigger.refresh();
    return () => triggers.forEach((trigger) => trigger.kill());
  }, [shouldRender, renderedContent]);

  if (!shouldRender) return null;

  return createPortal(
    <div className={`service-modal${isClosing ? " service-modal--closing" : ""}`} role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
      <button
        aria-label="Fechar detalhes do serviço"
        className="service-modal__close"
        onClick={onClose}
        ref={closeButtonRef}
        type="button"
      >
        <span aria-hidden="true">×</span>
      </button>

      <div className="service-modal__scroll" ref={scrollRef}>
        <header className="service-modal__hero">
          <p>{renderedContent.eyebrow}</p>
          <h2 id="service-modal-title">{renderedContent.title}</h2>
          <div className="service-modal__intro">
            {renderedContent.introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <ol className="service-modal__highlights">
            {renderedContent.highlights.map((item, index) => (
              <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>
            ))}
          </ol>
        </header>

        <div className="service-modal__sections">
          {renderedContent.sections.map((section, index) => (
            <article className="modal-service" key={section.id}>
              <div className="modal-service__media" aria-label={`Espaço reservado para vídeo: ${section.mediaLabel}`}>
                {section.video && (
                  <video muted playsInline preload="auto" aria-label={section.mediaLabel}>
                    <source src={section.video} type="video/mp4" />
                  </video>
                )}
                <div className="modal-service__media-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="modal-service__play" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="m9 7 8 5-8 5V7Z" /></svg>
                </div>
                <p>Vídeo em breve</p>
              </div>

              <div className="modal-service__content">
                <p className="modal-service__eyebrow">{section.eyebrow}</p>
                <h3>{section.title}</h3>
                <div className="modal-service__copy">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.items.length > 0 && (
                    <ul>
                      {section.items.map((item) => (
                        <li key={item}>
                          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 12 3 3 7-7" /></svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="modal-service__closing">
                    {section.closing.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer className="service-modal__footer">
          <p>Seu planejamento evolui junto com você.</p>
          <a href="#contato" onClick={onClose}>Quero começar</a>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
