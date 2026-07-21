import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import LegalLayout from "@/components/LegalLayout";
import { getLegalContent } from "@/lib/legalService";
import { getSiteSettingsMap } from "@/lib/siteSettingsService";

export default function MentionsLegalesPage() {
  const { data: cms } = useQuery({
    queryKey: ["legal", "mentions-legales"],
    queryFn: () => getLegalContent("mentions-legales"),
  });
  const { data: settings = {} } = useQuery({
    queryKey: ["site-settings-map"],
    queryFn: getSiteSettingsMap,
    staleTime: 5 * 60 * 1000,
  });

  /* Regulatory fields · fall back to hardcoded defaults if not set in CMS */
  const s = (key: string, fallback: string) => settings[key] || fallback;

  const subtitle = cms?.subtitle || "Informations relatives à l'éditeur du site, à l'hébergement, aux statuts réglementaires du cabinet et aux conditions d'utilisation.";
  const updatedAt = cms?.updated_at
    ? new Date(cms.updated_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : s("legal_updated_at", "Avril 2026");

  const cmsSections = cms?.content_html
    ? [{ id: "content", title: "", content: (
        <div
          className="prose prose-slate prose-headings:font-heading prose-headings:font-light prose-headings:tracking-tight prose-a:text-[hsl(218_45%_38%)] prose-a:no-underline hover:prose-a:underline max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cms.content_html) }}
        />
      )}]
    : null;

  return (
    <LegalLayout
      eyebrow="Informations légales"
      title="Mentions"
      highlight="légales"
      subtitle={subtitle}
      breadcrumb="Mentions légales"
      updatedAt={updatedAt}
      relatedLinks={[
        { label: "Politique de confidentialité", to: "/politique-de-confidentialite" },
        { label: "Réclamations & médiation", to: "/reclamations" },
      ]}
      sections={cmsSections ?? [
        {
          id: "editeur",
          title: "Éditeur du site",
          content: (
            <>
              <p>
                Le présent site est édité par <strong>KANTI</strong>, société par actions simplifiée
                (SAS) immatriculée au Registre du Commerce et des Sociétés de{" "}
                {s("legal_rcs", "878 821 818 Bayonne").includes(" ")
                  ? s("legal_rcs", "878 821 818 Bayonne").replace(/^[\d\s]+/, "").trim() || "Bayonne"
                  : "Bayonne"}{" "}
                sous le numéro <strong>{s("legal_rcs", "878 821 818 Bayonne").match(/[\d\s]+/)?.[0]?.trim() ?? "878 821 818"}</strong> (Code NAF&nbsp;: 7022Z).
              </p>
              <ul>
                <li>Siège social : {s("legal_siege", "9 Rue de la Négresse, 64200 Biarritz")}</li>
                <li>Numéro de TVA intracommunautaire : {s("legal_tva", "FR34878821818")}</li>
                <li>Téléphone : {s("phone", "06 63 32 48 09")}</li>
                <li>Courriel : {s("email", "kanti@adnfamily.com")}</li>
                <li>Site : https://kanti.fr/</li>
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
              <p>
                KANTI est immatriculé au Registre Unique des Intermédiaires en Assurance, Banque et
                Finance (ORIAS) sous le numéro <strong>{s("legal_orias", "20 000 855")}</strong> en qualité de :
              </p>
              <ul>
                <li>
                  <strong>Conseiller en Investissements Financiers (CIF)</strong>, sous le contrôle
                  de l'Autorité des Marchés Financiers (AMF), 17 place de la Bourse, 75082 Paris
                  Cedex 02.
                </li>
                <li>
                  <strong>Courtier d'assurance (IAS)</strong>, sous le contrôle de l'Autorité de
                  Contrôle Prudentiel et de Résolution (ACPR), 4 place de Budapest, CS 92459 -
                  75436 Paris Cedex 09.
                </li>
                <li>
                  <strong>Courtier en opérations de banque et services de paiement
                  (IOBSP)</strong>, sous le contrôle de l'ACPR.
                </li>
                {s("legal_carte_pro", "CPI33012020000045313") && (
                  <li>
                    <strong>Activité de transaction immobilière</strong>, Carte professionnelle
                    «&nbsp;Transactions immobilières&nbsp;» n° <strong>{s("legal_carte_pro", "CPI33012020000045313")}</strong>,
                    délivrée par la CCI de Bordeaux-Gironde. Ne peut recevoir aucun fonds, effet ou
                    valeur.
                  </li>
                )}
              </ul>
              <p>
                KANTI est adhérent de <strong>La Compagnie CIF</strong> et de <strong>La Compagnie
                IOBSP</strong> (8 Rue Godot de Mauroy, 75009 Paris) sous le numéro
                {" "}<strong>{s("legal_compagnie_num", "F002635")}</strong>, ainsi que de la <strong>CNCEF Assurance</strong>
                (103 Boulevard Haussmann, 75008 Paris) sous le numéro <strong>{s("legal_cncef_num", "25/860422")}</strong>.
                Ces associations sont agréées par l'Autorité des Marchés Financiers et par
                l'Autorité de Contrôle Prudentiel et de Résolution. Les activités d'IAS et d'IOBSP
                sont contrôlables par l'ACPR.
              </p>
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
                <li>
                  Assureur : <strong>{s("legal_rc_assureur", "MMA IARD Assurances Mutuelles / MMA IARD")}</strong>,
                  160 rue Henri Champion, 72030 Le Mans Cedex 9
                </li>
                <li>Police d'assurance n° <strong>{s("legal_rc_police", "112 786 342")}</strong></li>
                <li>Numéro d'adhérent : <strong>{s("legal_rc_adherent", "231 972")}</strong></li>
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
              compétence exclusive des tribunaux de{" "}
              {s("legal_tribunal", "Bayonne")}, sous réserve des dispositions légales impératives
              applicables.
            </p>
          ),
        },
      ]}
    />
  );
}
