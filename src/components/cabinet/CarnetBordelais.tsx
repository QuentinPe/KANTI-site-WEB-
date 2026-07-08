import ParallaxImage from "@/components/ParallaxImage";
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
    <section id="carnet-bordelais" className="relative bg-navy text-ivory py-24 md:py-36 overflow-hidden">
      {/* Ambient halos */}
      <div
        aria-hidden
        className="absolute top-[10%] right-[-10%] w-[520px] h-[520px] rounded-full pointer-events-none float-soft"
        style={{
          background: "radial-gradient(circle, hsl(var(--gold) / 0.10) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-[5%] left-[-8%] w-[480px] h-[480px] rounded-full pointer-events-none float-slow"
        style={{
          background: "radial-gradient(circle, hsl(0 0% 100% / 0.05) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="mb-16 md:mb-20 flex items-end justify-between border-b border-ivory/15 pb-6">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-gold mb-3 font-medium">
              Chapitre III
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-light leading-[1.05] tracking-tight text-white">
              Carnet bordelais.
            </h2>
          </div>
          <p className="hidden md:block font-heading italic text-[12px] tracking-[0.25em] text-ivory/55">
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
                {/* Image with parallax */}
                <div
                  className={`md:col-span-8 ${flip ? "md:order-2" : "md:order-1"}`}
                >
                  <div className="relative">
                    <div
                      aria-hidden
                      className="absolute -inset-6 rounded-[32px] opacity-70 pointer-events-none"
                      style={{
                        background: "radial-gradient(circle at 30% 30%, hsl(var(--gold) / 0.20), transparent 65%)",
                        filter: "blur(28px)",
                      }}
                    />
                    <ParallaxImage
                      src={note.image}
                      alt={note.alt}
                      className="aspect-[4/3] md:aspect-[16/10] ring-1 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
                      rounded="rounded-[22px]"
                      intensity={80}
                      overlayClassName="bg-gradient-to-t from-navy-deep/60 via-navy-deep/10 to-transparent"
                    />
                  </div>
                  <p className="mt-3 font-heading italic text-[11px] tracking-[0.22em] text-ivory/50">
                    Figure {String(i + 1).padStart(2, "0")} &nbsp;·&nbsp; {note.tag}
                  </p>
                </div>

                {/* Marginalia — glass card */}
                <aside
                  className={`md:col-span-4 ${flip ? "md:order-1" : "md:order-2"} md:pt-6`}
                >
                  <div className="rounded-2xl glass-dark p-6 md:p-7 relative overflow-hidden">
                    <span
                      aria-hidden
                      className="absolute left-0 top-6 bottom-6 w-[2px] bg-gradient-to-b from-gold via-gold/40 to-transparent"
                    />
                    <p className="font-heading italic text-[11px] tracking-[0.22em] text-gold mb-4">
                      {note.date}
                    </p>
                    <p className="text-[10px] tracking-[0.35em] uppercase text-ivory/50 mb-3 font-medium">
                      {note.kicker}
                    </p>
                    <h3 className="font-heading text-xl md:text-2xl leading-[1.2] tracking-tight text-white mb-5 font-light">
                      {note.title}
                    </h3>
                    <p className="text-ivory/70 text-[14.5px] leading-relaxed font-light">
                      {note.body}
                    </p>
                  </div>
                </aside>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}