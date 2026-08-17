import { useState } from "react";
import { contactDetails, locations } from "../../data/contact.js";
import "./Contact.css";

function Icon({ name }) {
  const paths = {
    email: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    phone: <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-1.5 2.2a15 15 0 0 1-7.7-7.7L9 8 7 3Z" />,
    location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" className="fill" /></>,
    whatsapp: <><path d="M20 11.5a8 8 0 0 1-11.7 7L4 20l1.4-4.1A8 8 0 1 1 20 11.5Z" /><path d="M9 8.5c.6 3 2.5 5 5.5 6" /></>,
    arrow: <path d="m9 18 6-6-6-6" />,
  };

  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
}

export default function Contact() {
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [formStatus, setFormStatus] = useState({ state: "idle", message: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus({ state: "sending", message: "Enviando sua mensagem..." });

    try {
      const response = await fetch("/api/contact.php", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Não foi possível enviar a mensagem.");
      }

      event.currentTarget.reset();
      setFormStatus({ state: "success", message: result.message });
    } catch (error) {
      setFormStatus({
        state: "error",
        message: error.message || "Ocorreu um erro. Tente novamente mais tarde.",
      });
    }
  };

  return (
    <section className="contact" id="contato">
      <div className="contact__container">
        <div className="contact__information">
          <h2>Inicie sua Jornada</h2>
          <p className="contact__introduction">
            Pronto para elevar o seu potencial físico? Entre em contato para discutir
            sobre um plano personalizado de treinamento e recuperação feito para as
            suas necessidades específicas.
          </p>

          <address className="contact__details">
            <a href={`mailto:${contactDetails.email}`}>
              <span className="contact__detail-icon"><Icon name="email" /></span>
              <span><small>Email</small>{contactDetails.email}</span>
            </a>
            <a href={`tel:${contactDetails.phoneNumber}`}>
              <span className="contact__detail-icon"><Icon name="phone" /></span>
              <span><small>Telefone</small>{contactDetails.phoneLabel}</span>
            </a>
          </address>

          <button
            aria-expanded={locationsOpen}
            aria-controls="contact-locations"
            className="contact__location-toggle"
            onClick={() => setLocationsOpen((current) => !current)}
            type="button"
          >
            <span className="contact__detail-icon"><Icon name="location" /></span>
            <span>Locais de atendimento</span>
            <Icon name="arrow" />
          </button>

          <div className={`contact__locations${locationsOpen ? " contact__locations--open" : ""}`} id="contact-locations">
            <div className="contact__locations-inner">
              {locations.map((location) => {
                const query = encodeURIComponent(location.mapQuery);
                return (
                  <article className="contact-location" key={location.id}>
                    <div>
                      <h3>{location.name}</h3>
                      <p>{location.address}</p>
                    </div>
                    <iframe
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${query}&output=embed`}
                      title={`Mapa de ${location.name}`}
                    />
                    <a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noreferrer">
                      Abrir no mapa <Icon name="arrow" />
                    </a>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="contact__social-actions">
            <a href={contactDetails.instagramUrl} target="_blank" rel="noreferrer">
              <Icon name="instagram" /> Instagram
            </a>
            <a href={contactDetails.whatsappUrl} target="_blank" rel="noreferrer">
              <Icon name="whatsapp" /> WhatsApp
            </a>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form__introduction">
            <p>Outra opção de contato</p>
            <a href={`mailto:${contactDetails.email}`}>
              Envie um e-mail e responderemos em breve.
            </a>
          </div>
          <div className="contact-form__divider"><span>ou preencha o formulário</span></div>

          <div className="contact-form__field">
            <label htmlFor="contact-name">Nome</label>
            <input id="contact-name" name="name" placeholder="Seu nome" required type="text" autoComplete="name" />
          </div>
          <div className="contact-form__field">
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" name="email" placeholder="Seu email" required type="email" autoComplete="email" />
          </div>
          <div className="contact-form__field">
            <label htmlFor="contact-phone">Celular</label>
            <input id="contact-phone" name="phone" placeholder="(11) 99999-9999" required type="tel" autoComplete="tel" />
          </div>
          <div className="contact-form__field">
            <label htmlFor="contact-message">Mensagem</label>
            <textarea id="contact-message" name="message" placeholder="Como posso te ajudar?" required />
          </div>
          <div className="contact-form__honeypot" aria-hidden="true">
            <label htmlFor="contact-website">Não preencha</label>
            <input id="contact-website" name="website" tabIndex="-1" type="text" autoComplete="off" />
          </div>
          <button disabled={formStatus.state === "sending"} type="submit">
            {formStatus.state === "sending" ? "Enviando..." : "Enviar Mensagem"}
          </button>
          <p aria-live="polite" className={`contact-form__status contact-form__status--${formStatus.state}`}>
            {formStatus.message}
          </p>
        </form>
      </div>
    </section>
  );
}
