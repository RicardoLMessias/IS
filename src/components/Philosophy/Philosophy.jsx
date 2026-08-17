import "./Philosophy.css";

export default function Philosophy() {
  return (
    <section className="philosophy" id="filosofia">
      <blockquote className="philosophy__quote">
        <svg aria-hidden="true" className="philosophy__icon" viewBox="0 0 64 48">
          <path d="M6 44c9-4 14-10 15-18H8V4h22v18C30 34 22 42 10 47L6 44Zm30 0c9-4 14-10 15-18H38V4h22v18c0 12-8 20-20 25l-4-3Z" />
        </svg>

        <p>
          “A verdadeira força não é forjada apenas na exaustão do músculo, mas no
          silêncio deliberado e restaurador da recuperação.”
        </p>

        <footer>
          <cite>Igor Santos</cite>
        </footer>
      </blockquote>
    </section>
  );
}
