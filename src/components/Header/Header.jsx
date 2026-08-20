import { useEffect, useRef, useState } from "react";
import "./Header.css";

const navigation = [
  { label: "Home", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Metodologia", href: "#metodologia" },
  { label: "Projetos", href: "#projetos" },
  { label: "Feedback", href: "#feedback" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  const menuButtonRef = useRef(null);
  const menuCloseRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    const handleScroll = () => setIsCompact(window.scrollY > 40);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("main section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-30% 0px -55%", threshold: [0, 0.1, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", isMenuOpen);
    if (!isMenuOpen) return () => document.body.classList.remove("menu-open");

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    menuCloseRef.current?.focus({ preventScroll: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("menu-open");
      menuButtonRef.current?.focus({ preventScroll: true });
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const renderLink = ({ label, href }) => {
    const sectionId = href.slice(1);
    const isActive = activeSection === sectionId;

    return (
      <a
        aria-current={isActive ? "page" : undefined}
        className={`nav-link${isActive ? " nav-link--active" : ""}`}
        href={href}
        key={href}
        onClick={closeMenu}
      >
        {label}
      </a>
    );
  };

  return (
    <header className={`header${isCompact ? " header--compact" : ""}`}>
      <div className="header__content">
        <nav className="header__nav header__nav--left" aria-label="Navegação principal">
          {navigation.slice(0, 3).map(renderLink)}
        </nav>

        <a className="header__logo" href="#inicio" aria-label="Igor Santos — início">
          <img
            alt="Igor Santos"
            decoding="async"
            fetchPriority="high"
            height="278"
            src={`${import.meta.env.BASE_URL}images/igor-santos-logo.webp`}
            width="240"
          />
        </a>

        <div className="header__right">
          <nav className="header__nav" aria-label="Navegação complementar">
            {navigation.slice(3).map(renderLink)}
          </nav>

          <a className="schedule-button" href="#contato">
            Agende agora
          </a>

          <button
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label="Abrir menu"
            className="menu-button"
            onClick={() => setIsMenuOpen(true)}
            ref={menuButtonRef}
            type="button"
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <button
        aria-label="Fechar menu"
        className={`menu-backdrop${isMenuOpen ? " menu-backdrop--visible" : ""}`}
        onClick={closeMenu}
        tabIndex={isMenuOpen ? 0 : -1}
        type="button"
      />

      <aside
        aria-hidden={!isMenuOpen}
        className={`mobile-menu${isMenuOpen ? " mobile-menu--open" : ""}`}
        id="mobile-navigation"
        inert={!isMenuOpen ? "" : undefined}
      >
        <div className="mobile-menu__header">
          <span>Menu</span>
          <button aria-label="Fechar menu" onClick={closeMenu} ref={menuCloseRef} type="button">×</button>
        </div>
        <nav aria-label="Navegação mobile">{navigation.map(renderLink)}</nav>
        <a className="schedule-button schedule-button--mobile" href="#contato" onClick={closeMenu}>
          Agende agora
        </a>
      </aside>
    </header>
  );
}
