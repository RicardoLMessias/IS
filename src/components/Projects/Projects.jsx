import { useEffect, useRef, useState } from "react";
import { projects } from "../../data/projects.js";
import "./Projects.css";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const previousFocus = useRef(null);

  const closeGallery = () => setSelectedProject(null);
  const showImage = (index) => {
    const total = selectedProject.images.length;
    setActiveImage((index + total) % total);
  };

  useEffect(() => {
    if (!selectedProject) return undefined;
    document.body.classList.add("project-gallery-open");

    return () => {
      document.body.classList.remove("project-gallery-open");
      previousFocus.current?.focus({ preventScroll: true });
    };
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowLeft" && selectedProject.images.length > 1) showImage(activeImage - 1);
      if (event.key === "ArrowRight" && selectedProject.images.length > 1) showImage(activeImage + 1);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, activeImage]);

  const openGallery = (project, event) => {
    previousFocus.current = event.currentTarget;
    setActiveImage(0);
    setSelectedProject(project);
  };

  return (
    <section className="projects" id="projetos">
      <div className="projects__container">
        <header className="projects__header">
          <h2>Projetos de Transformação</h2>
          <p>
            Demonstrando os resultados de protocolos de treinamento e recuperação
            dedicados e integrados.
          </p>
        </header>

        <div className="projects__grid">
          {projects.map((project) => (
            <button className="project-card" key={project.id} onClick={(event) => openGallery(project, event)} type="button">
              <img alt={project.images[0].alt} loading="lazy" src={project.images[0].src} />
              <div className="project-card__overlay" />
              <span className="project-card__action">
                <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m4 17 5-4 4 3 3-2 4 3" /></svg>
                Ver galeria · {project.images.length} {project.images.length === 1 ? "foto" : "fotos"}
              </span>
              <div className="project-card__content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedProject && (
        <div className="project-gallery" role="dialog" aria-modal="true" aria-labelledby="project-gallery-title">
          <button aria-label="Fechar galeria" className="project-gallery__backdrop" onClick={closeGallery} type="button" />
          <div className="project-gallery__dialog">
            <button aria-label="Fechar galeria" className="project-gallery__close" onClick={closeGallery} type="button">×</button>
            <div className="project-gallery__media">
              <img alt={selectedProject.images[activeImage].alt} src={selectedProject.images[activeImage].src} />
              {selectedProject.images.length > 1 && (
                <>
                  <button aria-label="Imagem anterior" className="project-gallery__arrow project-gallery__arrow--previous" onClick={() => showImage(activeImage - 1)} type="button">‹</button>
                  <button aria-label="Próxima imagem" className="project-gallery__arrow project-gallery__arrow--next" onClick={() => showImage(activeImage + 1)} type="button">›</button>
                </>
              )}
            </div>
            <div className="project-gallery__information">
              <div>
                <span>Projeto de transformação</span>
                <h3 id="project-gallery-title">{selectedProject.title}</h3>
                <p>{selectedProject.description}</p>
              </div>
              <strong>{String(activeImage + 1).padStart(2, "0")} / {String(selectedProject.images.length).padStart(2, "0")}</strong>
            </div>
            {selectedProject.images.length > 1 && (
              <div className="project-gallery__thumbnails">
                {selectedProject.images.map((image, index) => (
                  <button aria-label={`Mostrar imagem ${index + 1}`} className={index === activeImage ? "is-active" : ""} key={image.src} onClick={() => setActiveImage(index)} type="button">
                    <img alt="" src={image.src} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
