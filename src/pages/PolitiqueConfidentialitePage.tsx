import LegalLayout from "@/components/LegalLayout";

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalLayout
      eyebrow="Données personnelles"
      title="Politique de"
      highlight="confidentialité"
      subtitle="Engagement de KANTI sur la protection de vos données personnelles, conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés."
      breadcrumb="Confidentialité"
      updatedAt="Avril 2026"
      relatedLinks={[
        { label: "Mentions légales", to: "/mentions-legales" },
        { label: "Réclamations & médiation", to: "/reclamations" },
      ]}
      sections={[
        {
          id: "preambule",
          title: "Préambule",
          content: (
            <p>
              KANTI accorde une importance fondamentale au respect de la vie privée et à la
              protection des données personnelles de ses clients, prospects et visiteurs. La
              présente politique décrit les conditions dans lesquelles le cabinet collecte, traite,
              conserve et protège vos données, en conformité avec le Règlement (UE) 2016/679
              (RGPD) et la loi n° 78-17 du 6 janvier 1978 modifiée.
            </p>
          ),
        },
        {
          id: "responsable",
          title: "Responsable de traitement",
          content: (
            <>
              <p>
                Le responsable du traitement des données collectées sur ce site et dans le cadre
                des missions de conseil est :
              </p>
              <ul>
                <li><strong>KANTI</strong>, SAS au capital de 10 000 €</li>
                <li>12 rue Ferrere, 33000 Bordeaux</li>
                <li>Téléphone : 06 63 32 48 09, Courriel : <a href="mailto:kanti@adnfamily.com">kanti@adnfamily.com</a></li>
              </ul>
            </>
          ),
        },
        {
          id: "donnees",
          title: "Données collectées",
          content: (
            <>
              <p>Selon le contexte, KANTI peut être amené à collecter les catégories de données suivantes :</p>
              <ul>
                <li><strong>Données d'identification</strong> : civilité, nom, prénom, date et lieu de naissance, nationalité, copie de pièce d'identité.</li>
                <li><strong>Données de contact</strong> : adresse postale, courriel, numéro de téléphone.</li>
                <li><strong>Données patrimoniales et financières</strong> : revenus, charges, composition du patrimoine, contrats en cours, avis d'imposition, situation bancaire.</li>
                <li><strong>Données familiales</strong> : situation matrimoniale, régime, composition du foyer, ayants droit.</li>
                <li><strong>Données professionnelles</strong> : profession, statut, employeur, structure d'exercice.</li>
                <li><strong>Données de connexion</strong> : adresse IP, journaux de navigation, cookies (voir section dédiée).</li>
              </ul>
            </>
          ),
        },
        {
          id: "finalites",
          title: "Finalités & bases légales",
          content: (
            <>
              <p>Vos données sont traitées pour les finalités suivantes :</p>
              <ul>
                <li><strong>Exécution du contrat</strong> : réalisation du bilan patrimonial, recommandations, souscription de produits financiers, suivi des dossiers (art. 6.1.b RGPD).</li>
                <li><strong>Obligation légale</strong> : connaissance client (KYC), lutte contre le blanchiment et le financement du terrorisme (LCB-FT), conservation comptable et fiscale (art. 6.1.c RGPD).</li>
                <li><strong>Intérêt légitime</strong> : amélioration de nos services, sécurisation du site, gestion de la relation commerciale (art. 6.1.f RGPD).</li>
                <li><strong>Consentement</strong> : envoi de communications, lettres d'information, dépôt de cookies non essentiels (art. 6.1.a RGPD).</li>
              </ul>
            </>
          ),
        },
        {
          id: "destinataires",
          title: "Destinataires des données",
          content: (
            <>
              <p>
                Vos données ne sont jamais cédées ni vendues à des tiers. Elles peuvent être
                transmises, dans la stricte mesure nécessaire, aux destinataires suivants :
              </p>
              <ul>
                <li>Collaborateurs habilités du cabinet, soumis au secret professionnel.</li>
                <li>Partenaires producteurs (compagnies d'assurance, banques, sociétés de gestion) dans le cadre de la souscription d'un contrat à votre demande.</li>
                <li>Sous-traitants techniques (hébergement, outils CRM, signature électronique), liés par un contrat conforme à l'article 28 du RGPD.</li>
                <li>Autorités administratives, fiscales et judiciaires sur réquisition légale.</li>
              </ul>
            </>
          ),
        },
        {
          id: "conservation",
          title: "Durée de conservation",
          content: (
            <>
              <ul>
                <li><strong>Prospects</strong> : 3 ans à compter du dernier contact.</li>
                <li><strong>Clients</strong> : pendant toute la durée de la relation contractuelle, puis 5 ans après son extinction.</li>
                <li><strong>Documents LCB-FT et KYC</strong> : 5 ans à compter de la fin de la relation d'affaires.</li>
                <li><strong>Documents comptables et fiscaux</strong> : 10 ans conformément aux obligations légales.</li>
                <li><strong>Cookies</strong> : 13 mois maximum.</li>
              </ul>
            </>
          ),
        },
        {
          id: "droits",
          title: "Vos droits",
          content: (
            <>
              <p>
                Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants sur vos
                données :
              </p>
              <ul>
                <li>Droit d'accès, de rectification et d'effacement.</li>
                <li>Droit à la limitation et à l'opposition au traitement.</li>
                <li>Droit à la portabilité de vos données.</li>
                <li>Droit de retirer votre consentement à tout moment.</li>
                <li>Droit de définir des directives relatives au sort de vos données après votre décès.</li>
              </ul>
              <p>
                Pour exercer ces droits, adressez votre demande accompagnée d'un justificatif
                d'identité à <a href="mailto:kanti@adnfamily.com">kanti@adnfamily.com</a> ou par courrier au siège
                social. Une réponse vous sera apportée dans un délai d'un mois.
              </p>
              <p>
                En cas de désaccord persistant, vous pouvez introduire une réclamation auprès de la
                <strong> CNIL</strong>, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 -{" "}
                <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">www.cnil.fr</a>.
              </p>
            </>
          ),
        },
        {
          id: "securite",
          title: "Sécurité",
          content: (
            <p>
              KANTI met en œuvre des mesures techniques et organisationnelles appropriées pour
              protéger vos données contre tout accès non autorisé, altération, divulgation ou
              destruction : chiffrement des échanges (HTTPS/TLS), contrôle des accès, sauvegardes
              régulières, sensibilisation des collaborateurs et hébergement au sein de l'Union
              européenne.
            </p>
          ),
        },
        {
          id: "cookies",
          title: "Cookies & traceurs",
          content: (
            <>
              <p>
                Le site utilise des cookies strictement nécessaires à son fonctionnement, ainsi que
                des cookies de mesure d'audience anonymisée. Les cookies non essentiels ne sont
                déposés qu'après recueil de votre consentement, exprimé via le bandeau dédié.
              </p>
              <p>
                Vous pouvez à tout moment modifier vos préférences via les paramètres de votre
                navigateur ou le module de gestion des cookies.
              </p>
            </>
          ),
        },
        {
          id: "modifications",
          title: "Modifications",
          content: (
            <p>
              La présente politique peut être mise à jour à tout moment afin de refléter les
              évolutions réglementaires ou les pratiques du cabinet. La date de dernière mise à
              jour est indiquée en tête de page.
            </p>
          ),
        },
      ]}
    />
  );
}