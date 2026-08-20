import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./Philosophy.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Philosophy() {
  const sectionRef = useRef(null);
  const iconRef = useRef(null);
  const quoteTextRef = useRef(null);
  const authorRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let splitText;
    const context = gsap.context(() => {
      splitText = SplitText.create(quoteTextRef.current, {
        type: "lines,words",
        mask: "lines",
        aria: "auto",
        autoSplit: true,
        linesClass: "philosophy__line",
        wordsClass: "philosophy__word",
        onSplit(self) {
          gsap.set(iconRef.current, {
            opacity: 0,
            rotation: -16,
            scale: 0.55,
          });
          gsap.set(self.words, {
            opacity: 0,
            rotationX: -32,
            transformOrigin: "50% 100%",
            yPercent: 115,
          });
          gsap.set(authorRef.current, { opacity: 0, y: 18 });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              end: "center 38%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .to(iconRef.current, {
              opacity: 1,
              rotation: 0,
              scale: 1,
              duration: 0.22,
              ease: "none",
            })
            .to(
              self.words,
              {
                opacity: 1,
                rotationX: 0,
                stagger: { amount: 0.82, from: "start" },
                yPercent: 0,
                duration: 0.56,
                ease: "none",
              },
              0.08,
            )
            .to(
              authorRef.current,
              {
                opacity: 1,
                y: 0,
                duration: 0.22,
                ease: "none",
              },
              "-=0.08",
            );

          return timeline;
        },
      });
    }, sectionRef);

    return () => {
      context.revert();
      splitText?.revert();
    };
  }, []);

  return (
    <section className="philosophy" id="filosofia" ref={sectionRef}>
      <blockquote className="philosophy__quote">
        <svg aria-hidden="true" className="philosophy__icon" ref={iconRef} viewBox="0 0 64 48">
          <path d="M6 44c9-4 14-10 15-18H8V4h22v18C30 34 22 42 10 47L6 44Zm30 0c9-4 14-10 15-18H38V4h22v18c0 12-8 20-20 25l-4-3Z" />
        </svg>

        <p ref={quoteTextRef}>
          “A verdadeira força não é forjada apenas na exaustão do músculo, mas no
          silêncio deliberado e restaurador da recuperação.”
        </p>

        <footer>
          <cite ref={authorRef}>Igor Santos</cite>
        </footer>
      </blockquote>
    </section>
  );
}
