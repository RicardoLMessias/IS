import { useEffect, useState } from "react";
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
    return () => document.body.classList.remove("menu-open");
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
          <img src="/images/igor-santos-logo.png" alt="Igor Santos" />
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
      >
        <div className="mobile-menu__header">
          <span>Menu</span>
          <button aria-label="Fechar menu" onClick={closeMenu} type="button">×</button>
        </div>
        <nav aria-label="Navegação mobile">{navigation.map(renderLink)}</nav>
        <a className="schedule-button schedule-button--mobile" href="#contato" onClick={closeMenu}>
          Agende agora
        </a>
      </aside>
    </header>
  );
}
