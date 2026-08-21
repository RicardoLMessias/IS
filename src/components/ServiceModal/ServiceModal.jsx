import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import ServiceMedia from "./ServiceMedia.jsx";
import { createFrameSequence } from "./frameSequence.js";
import "./ServiceModal.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function ServiceModal({ content, isOpen, onClose }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const scrollRef = useRef(null);
  const contentRef = useRef(content);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  if (isOpen) contentRef.current = content;
  const renderedContent = contentRef.current;
  const usesStructuredLayout = renderedContent?.id === "treinamento" || renderedContent?.id === "massagem";

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
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? []).filter((element) => !element.hasAttribute("hidden"));
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
    const splitInstances = [];
    const splitAnimations = [];
    const frameSequences = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 761px)").matches;

    blocks.forEach((block) => {
      const media = block.querySelector(".modal-service__media");
      if (!media) return;

      const video = media.querySelector("video");
      const frameCanvas = media.querySelector(".modal-service__frames");
      const frameTrack = block.querySelector(".modal-service__frame-track");
      const frameSequence = frameCanvas ? createFrameSequence(frameCanvas) : null;
      if (frameSequence) frameSequences.push(frameSequence);

      const mediaEnd = () => {
        const stickyTop = window.matchMedia("(max-width: 760px)").matches ? 0 : 96;
        return `bottom ${stickyTop + media.offsetHeight}px`;
      };
      const pinFramesOnMobile = Boolean(frameCanvas && !isDesktop);
      const mobileMediaTop = () => 66;

      triggers.push(
        ScrollTrigger.create({
          trigger: pinFramesOnMobile ? frameTrack : block,
          scroller,
          start: pinFramesOnMobile
            ? () => `top ${mobileMediaTop()}px`
            : "top top",
          end: pinFramesOnMobile
            ? () => `bottom ${mobileMediaTop() + media.offsetHeight}px`
            : mediaEnd,
          scrub: true,
          onUpdate: ({ progress }) => {
            media.style.setProperty("--media-progress", progress);
            if (frameSequence) frameSequence.renderFrame(progress * (frameSequence.frameCount - 1));
            if (video?.duration && Number.isFinite(video.duration)) {
              video.currentTime = progress * video.duration;
            }
          },
        }),
      );

      if (frameCanvas && !reduceMotion) {
        const eyebrow = block.querySelector(".modal-service__eyebrow");
        const title = block.querySelector("h3");
        const introParagraphs = block.querySelectorAll(".modal-service__copy > p");
        const closingParagraphs = block.querySelectorAll(".modal-service__closing p");
        const listPanel = block.querySelector(".modal-service__copy ul");
        const listItems = block.querySelectorAll("li");
        const titleSplit = SplitText.create(title, {
          type: "words",
          ...(isDesktop ? { mask: "words" } : {}),
          aria: "auto",
          wordsClass: "modal-service__split-word",
        });
        const introLines = [];
        const closingLines = [];
        splitInstances.push(titleSplit);

        introParagraphs.forEach((paragraph) => {
          const split = SplitText.create(paragraph, { type: "lines", ...(isDesktop ? { mask: "lines" } : {}), aria: "auto" });
          splitInstances.push(split);
          introLines.push(...split.lines);
        });
        closingParagraphs.forEach((paragraph) => {
          const split = SplitText.create(paragraph, { type: "lines", ...(isDesktop ? { mask: "lines" } : {}), aria: "auto" });
          splitInstances.push(split);
          closingLines.push(...split.lines);
        });

        gsap.set(eyebrow, { opacity: 0, y: 18 });
        gsap.set(titleSplit.words, { opacity: 0, yPercent: 110 });
        gsap.set(introLines, { opacity: 0, yPercent: 75 });
        gsap.set(listItems, { opacity: 0, x: 24 });
        gsap.set(closingLines, { opacity: 0, yPercent: 70 });
        if (!isDesktop && listPanel) gsap.set(listPanel, { opacity: 0, y: 14 });

        const mediaTextTimeline = gsap.timeline({
          scrollTrigger: isDesktop
            ? { trigger: block, scroller, start: "top top", end: mediaEnd, scrub: true, invalidateOnRefresh: true }
            : {
                trigger: frameTrack,
                scroller,
                start: () => `top ${mobileMediaTop()}px`,
                end: () => `+=${Math.max((frameTrack.offsetHeight - media.offsetHeight) * 0.62, scroller.clientHeight)}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
        });

        if (isDesktop) {
          mediaTextTimeline
            .to(eyebrow, { opacity: 1, y: 0, duration: 0.07, ease: "none" }, 0.02)
            .to(titleSplit.words, { opacity: 1, yPercent: 0, duration: 0.14, stagger: 0.018, ease: "none" }, 0.05)
            .to(introLines, { opacity: 1, yPercent: 0, duration: 0.16, stagger: 0.018, ease: "none" }, 0.18)
            .to(listItems, { opacity: 1, x: 0, duration: 0.08, stagger: 0.035, ease: "none" }, 0.34)
            .to(closingLines, { opacity: 1, yPercent: 0, duration: 0.13, stagger: 0.025, ease: "none" }, 0.78);
        } else {
          mediaTextTimeline
            .to(eyebrow, { opacity: 1, y: 0, duration: 0.08, ease: "none" }, 0.03)
            .to(titleSplit.words, { opacity: 1, yPercent: 0, duration: 0.18, stagger: 0.025, ease: "none" }, 0.08)
            .to(introLines, { opacity: 1, yPercent: 0, duration: 0.28, stagger: 0.025, ease: "none" }, 0.24);
          if (listPanel) mediaTextTimeline.to(listPanel, { opacity: 1, y: 0, duration: 0.12, ease: "none" }, 0.43);
          mediaTextTimeline
            .to(listItems, { opacity: 1, x: 0, duration: 0.18, stagger: 0.025, ease: "none" }, 0.46)
            .to(closingLines, { opacity: 1, yPercent: 0, duration: 0.2, stagger: 0.025, ease: "none" }, 0.66);
        }
        splitAnimations.push(mediaTextTimeline);
      }
    });

    if (!reduceMotion) {
      scroller.querySelectorAll(".modal-service--text").forEach((block) => {
        const title = block.querySelector("h3");
        const content = block.querySelector(".modal-service__content");
        const divider = block.querySelector(".modal-service__text-divider");
        const eyebrow = block.querySelector(".modal-service__eyebrow");
        const number = block.querySelector(".modal-service__text-number");
        const paragraphs = block.querySelectorAll(".modal-service__copy > p, .modal-service__closing p");
        const listPanel = block.querySelector(".modal-service__content ul");
        const listItems = block.querySelectorAll("li");
        const canPin = isDesktop;

        const titleSplit = SplitText.create(title, {
          type: "words",
          mask: "words",
          aria: "auto",
          wordsClass: "modal-service__split-word",
        });
        splitInstances.push(titleSplit);

        const paragraphLines = [];
        paragraphs.forEach((paragraph) => {
          const paragraphSplit = SplitText.create(paragraph, {
            type: "lines",
            mask: "lines",
            aria: "auto",
            linesClass: "modal-service__split-line",
          });
          splitInstances.push(paragraphSplit);
          paragraphLines.push(...paragraphSplit.lines);
        });

        gsap.set([number, eyebrow], { opacity: 0, y: 18 });
        gsap.set(titleSplit.words, { opacity: 0, yPercent: 115, rotationX: -26, transformOrigin: "50% 100%" });
        gsap.set(divider, { opacity: 0, scaleX: 0, transformOrigin: "center" });
        gsap.set(paragraphLines, { opacity: 0, yPercent: 85 });
        if (listPanel) {
          gsap.set(listPanel, { opacity: 0, scale: 0.96, y: 24 });
          gsap.set(listItems, { opacity: 0, y: 16 });
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            scroller,
            start: isDesktop ? "top 8%" : "top top",
            end: isDesktop
              ? () => `+=${Math.max(scroller.clientHeight * 2.15, 1450)}`
              : "bottom bottom",
            scrub: true,
            pin: canPin ? content : false,
            pinSpacing: canPin,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to([number, eyebrow], {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.08,
            ease: "none",
          })
          .to(titleSplit.words, {
            opacity: 1,
            yPercent: 0,
            rotationX: 0,
            duration: 0.7,
            stagger: 0.055,
            ease: "none",
          }, "-=0.18")
          .to(divider, {
            opacity: 1,
            scaleX: 1,
            duration: 0.38,
            ease: "none",
          })
          .to(paragraphLines, {
            opacity: 1,
            yPercent: 0,
            duration: 0.55,
            stagger: 0.045,
            ease: "none",
          }, "-=0.35");

        if (listPanel) {
          timeline
            .to(listPanel, {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.42,
              ease: "none",
            }, "-=0.18")
            .to(listItems, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.035,
            ease: "none",
            }, "-=0.18");
        }

        splitAnimations.push(timeline);
      });
    }

    // O primeiro cálculo pode acontecer antes da fonte Sora terminar de
    // carregar. No celular isso altera bastante a quebra das linhas e os
    // pontos de início/fim da animação.
    let cancelled = false;
    const refreshAfterLayout = () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (!cancelled) ScrollTrigger.refresh();
        });
      });
    };

    ScrollTrigger.refresh();
    refreshAfterLayout();
    document.fonts?.ready.then(() => {
      if (!cancelled) refreshAfterLayout();
    });

    return () => {
      cancelled = true;
      frameSequences.forEach((sequence) => sequence.destroy());
      triggers.forEach((trigger) => trigger.kill());
      splitAnimations.forEach((animation) => animation.kill());
      splitInstances.reverse().forEach((split) => split.revert());
    };
  }, [shouldRender, renderedContent]);

  if (!shouldRender) return null;

  return createPortal(
    <div className={`service-modal${isClosing ? " service-modal--closing" : ""}`} ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
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
          {renderedContent.sections.map((section, index) => {
            const mediaBelow = section.media?.layout === "below";
            const sectionLayout = usesStructuredLayout
              ? (section.media?.futureAsset && !mediaBelow ? "media" : "text")
              : "legacy";
            const mediaElement = (
              <div className="modal-service__media" aria-label={section.media?.label || section.mediaLabel}>
                <ServiceMedia index={index} section={section} />
              </div>
            );
            const copyElement = (
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
            );

            return (
            <article
              className={`modal-service modal-service--${sectionLayout}${mediaBelow ? " modal-service--media-below" : ""}${section.media?.type === "frames" ? " modal-service--frames" : ""}`}
              key={section.id}
              style={section.media?.type === "frames" ? {
                "--frame-scroll": `${(section.media.scrollScreens || 6.5) * 100}vh`,
                "--frame-scroll-mobile": `${(section.media.mobileScrollScreens || 5.2) * 100}vh`,
              } : undefined}
            >
              {sectionLayout !== "text" && (
                section.media?.type === "frames"
                  ? <div className="modal-service__frame-track">{mediaElement}</div>
                  : mediaElement
              )}

              <div className="modal-service__content">
                <div className="modal-service__heading">
                  {sectionLayout === "text" && <span className="modal-service__text-number">{String(index + 1).padStart(2, "0")}</span>}
                  <p className="modal-service__eyebrow">{section.eyebrow}</p>
                  <h3>{section.title}</h3>
                </div>
                {sectionLayout === "text" && <span className="modal-service__text-divider" aria-hidden="true" />}
                {section.media?.type === "frames"
                  ? <div className="modal-service__copy-track">{copyElement}</div>
                  : copyElement}
              </div>
              {mediaBelow && (
                <div className="modal-service__media" aria-label={section.media?.label || section.mediaLabel}>
                  <ServiceMedia index={index} section={section} />
                </div>
              )}
            </article>
            );
          })}
        </div>

        <footer className="service-modal__footer">
          <p>{renderedContent.footer?.text || "Seu planejamento evolui junto com você."}</p>
          <a href="#contato" onClick={onClose}>{renderedContent.footer?.cta || "Quero começar"}</a>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
