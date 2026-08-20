import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "./components/Header/Header.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Services from "./components/Services/Services.jsx";
import Methodology from "./components/Methodology/Methodology.jsx";
import Philosophy from "./components/Philosophy/Philosophy.jsx";
import Projects from "./components/Projects/Projects.jsx";
import Feedback from "./components/Feedback/Feedback.jsx";
import Contact from "./components/Contact/Contact.jsx";
import Footer from "./components/Footer/Footer.jsx";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function App() {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 1.15,
      smoothTouch: 0.1,
      effects: true,
    });

    const scrollToHash = (hash, animate = true) => {
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (target) smoother.scrollTo(target, animate, "top top");
    };

    const handleAnchorClick = (event) => {
      const anchor = event.target.closest?.('a[href^="#"]');
      const hash = anchor?.getAttribute("href");
      if (!hash || hash === "#" || !document.querySelector(hash)) return;

      event.preventDefault();
      scrollToHash(hash);
      if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    };

    const handleHashChange = () => scrollToHash(window.location.hash);
    const syncPausedState = () => {
      const isOverlayOpen = document.body.classList.contains("menu-open")
        || document.body.classList.contains("modal-open")
        || document.body.classList.contains("zoom-open");
      smoother.paused(isOverlayOpen);
    };

    const bodyObserver = new MutationObserver(syncPausedState);
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    document.addEventListener("click", handleAnchorClick);
    window.addEventListener("hashchange", handleHashChange);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      scrollToHash(window.location.hash, false);
    });

    return () => {
      bodyObserver.disconnect();
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("hashchange", handleHashChange);
      smoother.kill();
    };
  }, []);

  return (
    <>
      <Header />

      <div id="smooth-wrapper" ref={wrapperRef}>
        <div id="smooth-content" ref={contentRef}>
          <main>
            <Hero />
            <Services />
            <Methodology />
            <Philosophy />
            <Projects />
            <Feedback />
            <Contact />
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
