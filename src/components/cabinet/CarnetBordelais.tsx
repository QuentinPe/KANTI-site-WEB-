import bureau1 from "@/assets/cabinet-bureaux-1.jpg";
import bureau2 from "@/assets/cabinet-bureaux-2.jpg";
import bureau3 from "@/assets/cabinet-bureaux-3.jpg";

const NOTES = [
  {
    image: bureau1,
    alt: "Espace de travail collaboratif sous charpente",
    date: "— Mars 2024",
    kicker: "L'atelier",
    title: "Sous les charpentes, la lumière du plateau.",
    body:
      "Un plateau ouvert, deux phone-boxes pour la confidence, une bibliothèque adossée aux dossiers en cours. Le cabinet a été pensé comme un atelier — pas comme une agence.",
    tag: "Bordeaux · Triangle d'Or",
  },
  {
    image: bureau2,
    alt: "Hall d'entrée vitré du cabinet",
    date: "— Juin 2024",
    kicker: "Le seuil",
    title: "Une entrée discrète, choisie.",
    body:
      "Verrière noire, chêne clair, quelques plantes. Rien qui ne crie. C'est ici que commencent les rendez-vous, qu'on pose son manteau, et qu'on prend le temps.",
    tag: "Accueil",
  },
  {
    image: bureau3,
    alt: "Salle de réunion premium",
    date: "— Novembre 2024",
    kicker: "La salle",
    title: "Là où les décisions prennent forme.",
    body:
      "Pour les audits patrimoniaux, les transmissions, les réunions familiales — une pièce dédiée, feutrée, où l'on peut étaler un dossier complet sur la table et y revenir plusieurs séances de suite.",
    tag: "Salle de comité",
  },
];

export default function CarnetBordelais() {
  return (
    <section id="carnet-bordelais" className="paper-grain text-ink py-24 md:py-36">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-16 md:mb-20 flex items-end justify-between border-b border-ink/25 pb-6">
          <div>
            <p className="font-editorial text-[10px] tracking-[0.35em] uppercase text-ink/60 mb-3">
              Chapitre II
            </p>
            <h2 className="font-editorial text-3xl md:text-5xl font-normal leading-[1.05] tracking-tight">
              Carnet bordelais.
            </h2>
          </div>
          <p className="hidden md:block font-editorial italic text-[12px] tracking-[0.25em] text-ink/55">
            Notes prises au fil des saisons.
          </p>
        </div>

        <div className="space-y-24 md:space-y-32">
          {NOTES.map((note, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={note.title}
                className="grid md:grid-cols-12 gap-8 md:gap-12 items-start reveal"
              >
                {/* Image */}
                <div
                  className={`md:col-span-8 ${flip ? "md:order-2" : "md:order-1"}`}
                >
                  <div className="relative overflow-hidden ring-1 ring-ink/15 aspect-[4/3] md:aspect-[16/10]">
                    <img
                      src={note.image}
                      alt={note.alt}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="mt-3 font-editorial italic text-[11px] tracking-[0.22em] text-ink/55">
                    Figure {String(i + 1).padStart(2, "0")} &nbsp;·&nbsp; {note.tag}
                  </p>
                </div>

                {/* Marginalia */}
                <aside
                  className={`md:col-span-4 ${flip ? "md:order-1" : "md:order-2"} md:pt-6`}
                >
                  <p className="font-editorial italic text-[11px] tracking-[0.22em] text-gold mb-4">
                    {note.date}
                  </p>
                  <p className="font-editorial text-[10px] tracking-[0.35em] uppercase text-ink/55 mb-3">
                    {note.kicker}
                  </p>
                  <h3 className="font-editorial text-2xl md:text-[26px] leading-[1.15] tracking-tight mb-5">
                    {note.title}
                  </h3>
                  <div className="editorial-rule-gold w-10 mb-5" aria-hidden />
                  <p className="text-ink/70 text-[14.5px] leading-relaxed font-light">
                    {note.body}
                  </p>
                </aside>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}