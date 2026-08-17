import Header from "./components/Header/Header.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Services from "./components/Services/Services.jsx";
import Methodology from "./components/Methodology/Methodology.jsx";
import Philosophy from "./components/Philosophy/Philosophy.jsx";
import Projects from "./components/Projects/Projects.jsx";
import Feedback from "./components/Feedback/Feedback.jsx";
import Contact from "./components/Contact/Contact.jsx";
import Footer from "./components/Footer/Footer.jsx";

export default function App() {
  return (
    <>
      <Header />

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
    </>
  );
}
