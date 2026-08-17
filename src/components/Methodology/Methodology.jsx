import { methodologySteps } from "../../data/methodology.js";
import "./Methodology.css";

export default function Methodology() {
  return (
    <section className="methodology" id="metodologia">
      <div className="methodology__container">
        <header className="methodology__header">
          <h2>Metodologia</h2>
          <p>
            Uma abordagem estruturada e científica para otimizar suas capacidades
            físicas e garantir progresso sustentável.
          </p>
        </header>

        <ol className="methodology__steps">
          {methodologySteps.map((step) => (
            <li className="methodology-step" key={step.number}>
              <span className="methodology-step__number">{step.number}</span>
              <div className="methodology-step__content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
