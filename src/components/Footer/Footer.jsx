import { useRef } from "react";
import gsap from "gsap";
import "./Footer.css";

const footerNavigation = [
  { label: "Home", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Metodologia", href: "#metodologia" },
  { label: "Projetos", href: "#projetos" },
  { label: "Feedback", href: "#feedback" },
  { label: "Contato", href: "#contato" },
];

export default function Footer() {
  const drkButtonRef = useRef(null);
  const drkTextRef = useRef(null);
  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);

  const motionIsReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleDrkEnter = () => {
    if (motionIsReduced()) return;

    gsap.to(drkButtonRef.current, {
      duration: 0.4,
      scale: 1.08,
      y: -4,
      boxShadow: "0 0 30px rgba(231, 151, 255, 0.35)",
      ease: "power3.out",
    });
    gsap.to([topLineRef.current, bottomLineRef.current], {
      scaleX: 1,
      duration: 0.35,
      ease: "power2.out",
    });
    gsap.to(drkTextRef.current, {
      duration: 0.35,
      textShadow: "0 0 8px #e797ff",
      ease: "power2.out",
    });
  };

  const handleDrkMove = (event) => {
    if (motionIsReduced()) return;

    const rect = drkButtonRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    gsap.to(drkButtonRef.current, {
      x: x * 0.12,
      y: y * 0.12,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleDrkLeave = () => {
    if (motionIsReduced()) return;

    gsap.to(drkButtonRef.current, {
      scale: 1,
      x: 0,
      y: 0,
      boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
      duration: 0.7,
      ease: "elastic.out(1, 0.45)",
      overwrite: "auto",
    });
    gsap.to([topLineRef.current, bottomLineRef.current], {
      scaleX: 0,
      duration: 0.3,
    });
    gsap.to(drkTextRef.current, {
      textShadow: "0 0 0 transparent",
      duration: 0.3,
    });
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__main">
          <a className="footer__logo" href="#inicio" aria-label="Igor Santos — início">
            <img src="/images/igor-santos-logo.png" alt="Igor Santos" />
          </a>

          <nav className="footer__navigation" aria-label="Navegação do rodapé">
            {footerNavigation.map((item) => (
              <a href={item.href} key={item.href}>{item.label}</a>
            ))}
          </nav>
        </div>

        <div className="footer__bottom">
          <p>© 2026 Igor Santos. Todos os direitos reservados.</p>
          <button
            className="footer__drk"
            onMouseEnter={handleDrkEnter}
            onMouseLeave={handleDrkLeave}
            onMouseMove={handleDrkMove}
            ref={drkButtonRef}
            type="button"
          >
            <span className="footer__drk-line footer__drk-line--top" ref={topLineRef} />
            <span className="footer__drk-text" ref={drkTextRef}>Desenvolvido por DRK</span>
            <span className="footer__drk-line footer__drk-line--bottom" ref={bottomLineRef} />
          </button>
        </div>
      </div>
    </footer>
  );
}
