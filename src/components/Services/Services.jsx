import { useCallback, useState } from "react";
import { services } from "../../data/services.js";
import { trainingModal } from "../../data/trainingModal.js";
import { massageModal } from "../../data/massageModal.js";
import ServiceModal from "../ServiceModal/ServiceModal.jsx";
import ServiceIcon from "./ServiceIcon.jsx";
import "./Services.css";

export default function Services() {
  const [activeModal, setActiveModal] = useState(null);
  const closeModal = useCallback(() => setActiveModal(null), []);
  const modalContent = activeModal === "treinamento-pessoal" ? trainingModal : massageModal;

  return (
    <section className="services-section" id="servicos">
      <div className="services-section__container">
        <header className="services-section__header">
          <h2>Cuidado Compreensivo</h2>
          <p>
            Uma abordagem holística conectando condicionamento físico rigoroso e
            recuperação fisiológica essencial.
          </p>
        </header>

        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.id}>
              <div className="service-card__icon">
                <ServiceIcon name={service.icon} />
              </div>

              <h3>{service.title}</h3>
              <p>{service.description}</p>

              <ul className="service-card__tags" aria-label="Especialidades">
                {service.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>

              <button
                className="service-card__more"
                onClick={() => setActiveModal(service.id)}
                type="button"
              >
                Saiba Mais
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M5 12h13M13 7l5 5-5 5" />
                </svg>
              </button>
            </article>
          ))}
        </div>
      </div>

      <ServiceModal content={modalContent} isOpen={activeModal !== null} onClose={closeModal} />
    </section>
  );
}
