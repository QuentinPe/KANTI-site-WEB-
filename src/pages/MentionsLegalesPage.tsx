import LegalLayout from "@/components/LegalLayout";

export default function MentionsLegalesPage() {
  return (
    <LegalLayout
      eyebrow="Informations légales"
      title="Mentions"
      highlight="légales"
      subtitle="Informations relatives à l'éditeur du site, à l'hébergement, aux statuts réglementaires du cabinet et aux conditions d'utilisation."
      breadcrumb="Mentions légales"
      updatedAt="Avril 2026"
      relatedLinks={[
        { label: "Politique de confidentialité", to: "/politique-de-confidentialite" },
        { label: "Réclamations & médiation", to: "/reclamations" },
      ]}
      sections={[
        {
          id: "editeur",
          title: "Éditeur du site",
          content: (
            <>
              <p>
                Le présent site est édité par <strong>KANTI</strong>, société par actions simplifiée
                (SAS) au capital social de 10 000 €, immatriculée au Registre du Commerce et des
                Sociétés de Bordeaux sous le numéro 000 000 000.
              </p>
              <ul>
                <li>Siège social : 9 Rue de la Négresse, 64200 Biarritz</li>
                <li>Numéro de TVA intracommunautaire : FR 00 000000000</li>
                <li>Téléphone : 06 63 32 48 09</li>
                <li>Courriel : kanti@adnfamily.com</li>
                <li>Directeur de la publication : le Président de KANTI</li>
              </ul>
            </>
          ),
        },
        {
          id: "hebergeur",
          title: "Hébergement",
          content: (
            <p>
              Le site est hébergé par <strong>Lovable Cloud</strong>, infrastructure opérée par des
              prestataires établis au sein de l'Union européenne. Toute demande relative à
              l'hébergement peut être adressée à l'éditeur, qui transmettra dans les meilleurs délais.
            </p>
          ),
        },
        {
          id: "activites",
          title: "Statuts réglementés & autorités de contrôle",
          content: (
            <>
              <p>
                KANTI exerce plusieurs activités réglementées dans le domaine du conseil financier,
                de l'assurance, du crédit et de l'immobilier. À ce titre, le cabinet est soumis au
                contrôle de plusieurs autorités.
              </p>
              <ul>
                <li>
                  <strong>Conseiller en Investissements Financiers (CIF)</strong> — enregistré à
                  l'ORIAS sous le n° 00 000 000, sous le contrôle de l'Autorité des Marchés
                  Financiers (AMF), 17 place de la Bourse — 75082 Paris Cedex 02.
                </li>
                <li>
                  Membre de la <strong>Chambre Nationale des Conseils en Gestion de Patrimoine
                  (CNCGP)</strong>, association professionnelle agréée par l'AMF.
                </li>
                <li>
                  <strong>Courtier en assurances (COA)</strong> — catégorie B, immatriculé à l'ORIAS,
                  sous le contrôle de l'Autorité de Contrôle Prudentiel et de Résolution (ACPR), 4
                  place de Budapest — CS 92459 — 75436 Paris Cedex 09.
                </li>
                <li>
                  <strong>Courtier en opérations de banque et services de paiement (COBSP)</strong> —
                  immatriculé à l'ORIAS, sous le contrôle de l'ACPR.
                </li>
                <li>
                  <strong>Activité de transaction immobilière</strong> — Carte professionnelle n° CPI
                  0000 0000 000 000 000, délivrée par la CCI de Bordeaux Gironde.
                </li>
              </ul>
              <p>
                Vérification des immatriculations sur{" "}
                <a href="https://www.orias.fr" target="_blank" rel="noreferrer">www.orias.fr</a>.
              </p>
            </>
          ),
        },
        {
          id: "garanties",
          title: "Responsabilité civile professionnelle & garantie financière",
          content: (
            <>
              <p>
                Conformément aux articles L.541-3 et L.512-6 du Code monétaire et financier, KANTI
                a souscrit une assurance de responsabilité civile professionnelle ainsi qu'une
                garantie financière auprès d'une compagnie agréée pour l'ensemble de ses activités
                réglementées.
              </p>
              <ul>
                <li>Assureur : compagnie d'assurance agréée — coordonnées disponibles sur demande</li>
                <li>Police n° 0000000000 — couverture conforme à la réglementation en vigueur</li>
                <li>Étendue territoriale : France et Union européenne</li>
              </ul>
            </>
          ),
        },
        {
          id: "propriete",
          title: "Propriété intellectuelle",
          content: (
            <>
              <p>
                L'ensemble des contenus présents sur le site (textes, illustrations, photographies,
                logos, marques, charte graphique, code source) est la propriété exclusive de KANTI
                ou de ses partenaires et est protégé par les législations françaises et
                internationales relatives à la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification ou diffusion, totale ou partielle,
                sans autorisation écrite préalable est strictement interdite et constitue une
                contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété
                intellectuelle.
              </p>
            </>
          ),
        },
        {
          id: "liens",
          title: "Liens hypertextes",
          content: (
            <p>
              Le site peut contenir des liens vers des sites tiers. KANTI n'exerce aucun contrôle
              sur le contenu de ces sites et décline toute responsabilité quant à leur disponibilité,
              leur contenu et l'usage qui peut en être fait.
            </p>
          ),
        },
        {
          id: "responsabilite",
          title: "Limitation de responsabilité",
          content: (
            <>
              <p>
                Les informations diffusées sur ce site ont un caractère général et ne constituent
                pas un conseil personnalisé. Elles ne peuvent se substituer à une étude
                patrimoniale, fiscale ou juridique réalisée dans le cadre d'une mission contractuelle.
              </p>
              <p>
                Malgré tout le soin apporté à la rédaction, KANTI ne peut garantir l'exactitude,
                l'exhaustivité ou l'actualité des informations publiées et décline toute
                responsabilité quant à l'utilisation qui pourrait en être faite.
              </p>
            </>
          ),
        },
        {
          id: "loi",
          title: "Loi applicable",
          content: (
            <p>
              Le présent site et les présentes mentions légales sont régis par le droit français.
              Tout litige relatif à leur interprétation ou à leur exécution relève de la
              compétence exclusive des tribunaux de Bayonne, sous réserve des dispositions légales
              impératives applicables.
            </p>
          ),
        },
      ]}
    />
  );
}