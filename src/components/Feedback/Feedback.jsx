import { feedbacks } from "../../data/feedbacks.js";
import "./Feedback.css";

export default function Feedback() {
  return (
    <section className="feedback" id="feedback">
      <div className="feedback__container">
        <header className="feedback__header">
          <h2>Feedbacks</h2>
          <p>Resultados reais de uma abordagem dedicada em treinamento e terapia.</p>
        </header>

        <div className="feedback__grid" aria-label="Depoimentos de clientes">
          {feedbacks.map((feedback) => (
            <article className="feedback-card" key={feedback.id}>
              <header className="feedback-card__person">
                <div className="feedback-card__avatar" aria-hidden={!feedback.avatar}>
                  {feedback.avatar && <img alt="" src={feedback.avatar} />}
                </div>

                <div>
                  <h3>{feedback.name}</h3>
                  <p>{feedback.role}</p>
                </div>
              </header>

              <blockquote>“{feedback.quote}”</blockquote>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
