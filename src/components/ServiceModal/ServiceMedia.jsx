const graphicLabels = {
  assessment: "Avaliação individual",
  planning: "Estratégia personalizada",
  spreadsheet: "Treino organizado",
  nutrition: "Planejamento alimentar",
  resources: "Visão completa",
  feedback: "Acompanhamento semanal",
  adjustments: "Evolução contínua",
  process: "Método individualizado",
  audience: "Objetivos diferentes",
  journey: "Acompanhamento completo",
};

function AssessmentGraphic() {
  return (
    <div className="service-graphic__assessment">
      <div className="service-graphic__body"><span /><span /><span /></div>
      <div className="service-graphic__metric service-graphic__metric--one"><small>Composição</small><strong>01</strong></div>
      <div className="service-graphic__metric service-graphic__metric--two"><small>Mobilidade</small><strong>02</strong></div>
      <div className="service-graphic__metric service-graphic__metric--three"><small>Objetivos</small><strong>03</strong></div>
    </div>
  );
}

function PlanningGraphic() {
  return (
    <div className="service-graphic__planning">
      <div className="service-graphic__planning-head"><span>SEMANA 04</span><small>Plano individual</small></div>
      {["Força", "Volume", "Recuperação", "Progressão"].map((label, index) => (
        <div className="service-graphic__planning-row" key={label}>
          <span>{label}</span><i style={{ "--bar-size": `${58 + index * 11}%` }} />
        </div>
      ))}
    </div>
  );
}

function SpreadsheetGraphic() {
  return (
    <div className="service-graphic__sheet">
      <div className="service-graphic__sheet-head"><span>EXERCÍCIO</span><span>SÉRIES</span><span>REPS</span></div>
      {["Agachamento", "Supino", "Remada", "Elevação"].map((label, index) => (
        <div className="service-graphic__sheet-row" key={label}>
          <span><i>{String(index + 1).padStart(2, "0")}</i>{label}</span><b>{index % 2 ? 3 : 4}</b><b>{index % 2 ? "12" : "08"}</b>
        </div>
      ))}
      <div className="service-graphic__sheet-status"><i /> Sessão atualizada</div>
    </div>
  );
}

function NutritionGraphic() {
  return (
    <div className="service-graphic__nutrition">
      <div className="service-graphic__plate"><span>PLANO</span><strong>100%</strong></div>
      <div className="service-graphic__macros">
        <div><i /><span>Proteínas</span><strong>35%</strong></div>
        <div><i /><span>Carboidratos</span><strong>45%</strong></div>
        <div><i /><span>Gorduras</span><strong>20%</strong></div>
      </div>
    </div>
  );
}

function ResourcesGraphic() {
  return (
    <div className="service-graphic__resources">
      <div className="service-graphic__resource-core"><strong>360°</strong><span>Rotina</span></div>
      {[
        ["Hidratação", "01"], ["Sono", "02"], ["Recuperação", "03"], ["Hábitos", "04"],
      ].map(([label, number], index) => (
        <div className={`service-graphic__resource service-graphic__resource--${index + 1}`} key={label}><small>{number}</small>{label}</div>
      ))}
    </div>
  );
}

function FeedbackGraphic() {
  return (
    <div className="service-graphic__feedback">
      <div className="service-graphic__feedback-head"><span>CHECK-IN</span><strong>SEMANA 08</strong></div>
      <div className="service-graphic__score"><strong>8.7</strong><span>Resposta ao plano</span></div>
      {[72, 88, 64, 91].map((value, index) => <i key={value} style={{ "--feedback-height": `${value}%`, "--feedback-delay": index }} />)}
      <div className="service-graphic__feedback-foot"><span>Treino</span><span>Recuperação</span></div>
    </div>
  );
}

function AdjustmentsGraphic() {
  return (
    <div className="service-graphic__adjustments">
      <div className="service-graphic__chart-head"><span>EVOLUÇÃO</span><strong>+24%</strong></div>
      <svg aria-hidden="true" viewBox="0 0 420 220">
        <path className="service-graphic__chart-grid" d="M10 40h400M10 100h400M10 160h400" />
        <path className="service-graphic__chart-area" d="M15 180 85 155l72 10 70-75 72 18 105-82v180H15Z" />
        <path className="service-graphic__chart-line" d="M15 180 85 155l72 10 70-75 72 18 105-82" />
        <g><circle cx="15" cy="180" r="5" /><circle cx="85" cy="155" r="5" /><circle cx="157" cy="165" r="5" /><circle cx="227" cy="90" r="5" /><circle cx="299" cy="108" r="5" /><circle cx="404" cy="26" r="6" /></g>
      </svg>
      <div className="service-graphic__chart-axis"><span>INÍCIO</span><span>AGORA</span></div>
    </div>
  );
}

function ProcessGraphic() {
  return (
    <div className="service-graphic__process">
      {["Avaliar", "Planejar", "Acompanhar", "Ajustar"].map((label, index) => (
        <div key={label}><i>{String(index + 1).padStart(2, "0")}</i><span>{label}</span></div>
      ))}
    </div>
  );
}

function AudienceGraphic() {
  return (
    <div className="service-graphic__audience">
      <div className="service-graphic__audience-core"><span>SEU</span><strong>OBJETIVO</strong></div>
      {["Força", "Performance", "Definição", "Condicionamento", "Hipertrofia", "Retorno"].map((label) => <span key={label}>{label}</span>)}
    </div>
  );
}

function JourneyGraphic() {
  return (
    <div className="service-graphic__journey">
      <div className="service-graphic__journey-line" />
      {[
        ["01", "Avaliação"], ["02", "Estratégia"], ["03", "Evolução"], ["04", "Resultado"],
      ].map(([number, label]) => <div key={number}><i>{number}</i><span>{label}</span></div>)}
    </div>
  );
}

const graphics = {
  assessment: AssessmentGraphic,
  planning: PlanningGraphic,
  spreadsheet: SpreadsheetGraphic,
  nutrition: NutritionGraphic,
  resources: ResourcesGraphic,
  feedback: FeedbackGraphic,
  adjustments: AdjustmentsGraphic,
  process: ProcessGraphic,
  audience: AudienceGraphic,
  journey: JourneyGraphic,
};

export default function ServiceMedia({ index, section }) {
  const media = section.media;
  const videoSource = media?.type === "video" ? media.src : section.video;

  if (media?.type === "frames") {
    return (
      <>
        <canvas
          aria-label={media.label || section.mediaLabel}
          className="modal-service__frames"
          data-base-path={media.basePath}
          data-frame-count={media.frameCount}
          data-start-frame={media.startFrame || 1}
          data-extension={media.extension || "jpg"}
          role="img"
        />
        <div className="modal-service__media-number">{String(index + 1).padStart(2, "0")}</div>
        <p>{media.caption || section.mediaLabel}</p>
      </>
    );
  }

  if (videoSource) {
    return (
      <>
        <video muted playsInline preload="metadata" poster={media?.poster} aria-label={media?.label || section.mediaLabel}>
          <source src={videoSource} type="video/mp4" />
        </video>
        <div className="modal-service__media-number">{String(index + 1).padStart(2, "0")}</div>
        <p>{media?.caption || section.mediaLabel}</p>
      </>
    );
  }

  if (media?.type === "image" && media.src) {
    return (
      <>
        <img alt={media.alt || ""} className="modal-service__image" src={media.src} />
        <div className="modal-service__media-number">{String(index + 1).padStart(2, "0")}</div>
        <p>{media.caption || section.mediaLabel}</p>
      </>
    );
  }

  if (media?.type === "graphic") {
    const Graphic = graphics[media.variant] || ProcessGraphic;
    return (
      <>
        <div className={`service-graphic service-graphic--${media.variant}`} aria-hidden="true"><Graphic /></div>
        <div className="modal-service__media-number">{String(index + 1).padStart(2, "0")}</div>
        <p>{media.caption || graphicLabels[media.variant]}</p>
      </>
    );
  }

  return (
    <>
      <div className="modal-service__media-number">{String(index + 1).padStart(2, "0")}</div>
      <div className="modal-service__play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m9 7 8 5-8 5V7Z" /></svg></div>
      <p>Vídeo em breve</p>
    </>
  );
}
