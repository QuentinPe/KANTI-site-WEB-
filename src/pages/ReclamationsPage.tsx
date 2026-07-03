import LegalLayout from "@/components/LegalLayout";

export default function ReclamationsPage() {
  return (
    <LegalLayout
      eyebrow="Relation client"
      title="Réclamations &"
      highlight="médiation"
      subtitle="Procédure de traitement des réclamations et voies de recours en cas de désaccord, conformément aux exigences de l'AMF, de l'ACPR et de la CNCGP."
      breadcrumb="Réclamations"
      updatedAt="Avril 2026"
      relatedLinks={[
        { label: "Mentions légales", to: "/mentions-legales" },
        { label: "Politique de confidentialité", to: "/politique-de-confidentialite" },
      ]}
      sections={[
        {
          id: "principe",
          title: "Notre engagement",
          content: (
            <p>
              KANTI s'attache à offrir à chacun de ses clients un service de qualité. Si malgré
              cette exigence vous estimez que la prestation rendue n'est pas conforme à vos
              attentes, le cabinet a mis en place une procédure de traitement des réclamations
              gratuite, claire et conforme aux recommandations de l'Autorité des Marchés
              Financiers (AMF) et de l'Autorité de Contrôle Prudentiel et de Résolution (ACPR).
            </p>
          ),
        },
        {
          id: "definition",
          title: "Qu'est-ce qu'une réclamation ?",
          content: (
            <p>
              Une réclamation est une déclaration actant le mécontentement d'un client envers le
              cabinet. Une demande d'information, d'avis, de clarification, de service ou de
              prestation ne constitue pas une réclamation au sens du présent dispositif.
            </p>
          ),
        },
        {
          id: "interlocuteur",
          title: "Étape 1 — Votre interlocuteur habituel",
          content: (
            <p>
              Nous vous invitons, dans un premier temps, à prendre contact avec votre conseiller
              habituel afin d'exposer votre demande. La majorité des situations trouvent une issue
              rapide à ce niveau. Vous pouvez le contacter par téléphone, par courriel ou lors d'un
              rendez-vous au cabinet.
            </p>
          ),
        },
        {
          id: "service",
          title: "Étape 2 — Service réclamations",
          content: (
            <>
              <p>
                Si la réponse apportée ne vous satisfait pas, ou si vous préférez vous adresser
                directement à la direction, votre réclamation peut être transmise au service
                réclamations du cabinet, par courrier ou par courriel.
              </p>
              <ul>
                <li><strong>Par courrier</strong> : KANTI — Service Réclamations — 9 Rue de la Négresse, 64200 Biarritz</li>
                <li><strong>Par courriel</strong> : <a href="mailto:kanti@adnfamily.com">kanti@adnfamily.com</a></li>
              </ul>
              <p>
                Afin de faciliter le traitement, votre courrier devra préciser vos coordonnées,
                la nature de votre réclamation, les pièces utiles et, le cas échéant, les
                références de votre dossier ou de votre contrat.
              </p>
            </>
          ),
        },
        {
          id: "delais",
          title: "Délais de traitement",
          content: (
            <>
              <p>Le cabinet s'engage à respecter les délais suivants :</p>
              <ul>
                <li><strong>Accusé de réception</strong> : sous 10 jours ouvrables à compter de la réception de la réclamation.</li>
                <li><strong>Réponse sur le fond</strong> : sous 2 mois maximum, sauf circonstances particulières dûment justifiées.</li>
              </ul>
              <p>
                Si un délai supplémentaire s'avère nécessaire, vous en serez informé en précisant
                les motifs et le nouveau délai prévisionnel de réponse.
              </p>
            </>
          ),
        },
        {
          id: "mediation",
          title: "Étape 3 — Médiation",
          content: (
            <>
              <p>
                À défaut de réponse satisfaisante au terme du processus interne ou en l'absence de
                réponse dans le délai imparti, vous pouvez saisir gratuitement l'un des médiateurs
                compétents, selon la nature de votre réclamation.
              </p>
              <ul>
                <li>
                  <strong>Médiateur de l'AMF</strong> — pour les litiges relatifs aux instruments
                  financiers et au conseil en investissements financiers.<br />
                  Autorité des Marchés Financiers — Médiateur — 17 place de la Bourse — 75082 Paris
                  Cedex 02 —{" "}
                  <a href="https://www.amf-france.org" target="_blank" rel="noreferrer">www.amf-france.org</a>.
                </li>
                <li>
                  <strong>Médiateur de l'Assurance</strong> — pour les litiges relatifs aux contrats
                  d'assurance.<br />
                  La Médiation de l'Assurance — TSA 50110 — 75441 Paris Cedex 09 —{" "}
                  <a href="https://www.mediation-assurance.org" target="_blank" rel="noreferrer">www.mediation-assurance.org</a>.
                </li>
                <li>
                  <strong>Médiateur de l'ANACOFI</strong> ou de la <strong>CNCGP</strong> — pour les
                  litiges entrant dans le champ du conseil en gestion de patrimoine non couvert par
                  les médiateurs précédents.
                </li>
                <li>
                  <strong>Médiation de la consommation</strong> — pour tout litige relevant du Code
                  de la consommation, conformément aux articles L.611-1 et suivants.
                </li>
              </ul>
              <p>
                La saisine du médiateur n'est recevable qu'après épuisement de la procédure
                interne et dans un délai d'un an à compter de la réclamation initiale.
              </p>
            </>
          ),
        },
        {
          id: "recours",
          title: "Voies de recours juridictionnelles",
          content: (
            <p>
              Indépendamment de la procédure de médiation, vous conservez la possibilité de saisir
              les juridictions compétentes. Les tribunaux de Bayonne sont compétents pour tout
              litige relatif à l'exécution des prestations du cabinet, sous réserve des
              dispositions légales protectrices des consommateurs.
            </p>
          ),
        },
        {
          id: "donnees-perso",
          title: "Réclamation relative à vos données personnelles",
          content: (
            <p>
              Pour toute réclamation portant spécifiquement sur le traitement de vos données
              personnelles, vous pouvez contacter notre délégué à la protection des données à{" "}
              <a href="mailto:kanti@adnfamily.com">kanti@adnfamily.com</a> ou saisir directement la CNIL —{" "}
              <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">www.cnil.fr</a>.
            </p>
          ),
        },
      ]}
    />
  );
}