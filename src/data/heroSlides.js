// Para adicionar um slide, copie um objeto e altere seus dados.
// Para remover um slide, apague o objeto correspondente da lista.
export const heroSlides = [
  {
    id: "performance",
    eyebrow: "Performance & Recuperação",
    title: "Eleve o Seu Potencial Físico.",
    description:
      "Treinamento pessoal integrado e massagem terapêutica desenhados para performance máxima e restauração profunda.",
    image: `${import.meta.env.BASE_URL}images/hero/hero-01.webp`,
    imageAlt: "Igor Santos planejando um acompanhamento personalizado",
    actions: [
      { label: "Explorar Serviços", href: "#servicos", variant: "primary" },
      { label: "Minha Filosofia", href: "#filosofia", variant: "outline" },
    ],
  },
  {
    id: "mobilidade",
    eyebrow: "Movimento sem limitações",
    title: "Mobilidade para viver e treinar melhor.",
    description:
      "Avaliação cuidadosa e exercícios específicos para recuperar amplitude, controle e confiança nos movimentos.",
    image: `${import.meta.env.BASE_URL}images/hero/hero-02.webp`,
    imageAlt: "Igor Santos aplicando uma técnica de mobilidade e terapia manual",
    actions: [
      { label: "Ver metodologia", href: "#metodologia", variant: "primary" },
    ],
  },
  {
    id: "recuperacao",
    eyebrow: "Recuperação profunda",
    title: "Seu corpo também evolui quando recupera.",
    description:
      "Massagem terapêutica e desportiva para aliviar tensões, auxiliar a recuperação e preparar o próximo treino.",
    image: `${import.meta.env.BASE_URL}images/hero/hero-03.webp`,
    imageAlt: "Igor Santos realizando uma sessão de massagem terapêutica",
    actions: [
      { label: "Explorar tratamentos", href: "#servicos", variant: "primary" },
      { label: "Fale comigo", href: "#contato", variant: "outline" },
    ],
  },
  {
    id: "acompanhamento",
    eyebrow: "Acompanhamento personalizado",
    title: "Um plano construído para a sua jornada.",
    description:
      "Estratégia, acompanhamento e ajustes contínuos para transformar objetivos em progresso sustentável.",
    image: `${import.meta.env.BASE_URL}images/hero/hero-04.webp`,
    imageAlt: "Igor Santos aplicando uma técnica de mobilidade articular",
    actions: [
      { label: "Comece agora", href: "#contato", variant: "primary" },
      { label: "Nossa filosofia", href: "#filosofia", variant: "outline" },
    ],
  },
  {
    id: "ventosaterapia",
    eyebrow: "Técnicas complementares",
    title: "Recuperação planejada para o seu corpo.",
    description:
      "Recursos terapêuticos selecionados de acordo com suas necessidades para aliviar tensões e favorecer a recuperação.",
    image: `${import.meta.env.BASE_URL}images/hero/hero-05.webp`,
    imageAlt: "Igor Santos realizando uma sessão de ventosaterapia",
    actions: [
      { label: "Conhecer os serviços", href: "#servicos", variant: "primary" },
      { label: "Agende agora", href: "#contato", variant: "outline" },
    ],
  },
];
