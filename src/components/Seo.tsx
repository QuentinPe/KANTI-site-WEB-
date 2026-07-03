import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://kanti-patrimoine-courtage.lovable.app";
const DEFAULT_OG = `${SITE_URL}/og-default.jpg`;

interface SeoProps {
  title: string;
  description: string;
  image?: string;
  /** JSON-LD object(s). Can be a single object or an array. */
  jsonLd?: object | object[];
  /** Override canonical URL. Defaults to current pathname. */
  canonical?: string;
  noindex?: boolean;
}

/**
 * Centralised SEO component, sets title, meta description, Open Graph,
 * Twitter cards, canonical, and optional JSON-LD structured data.
 */
export default function Seo({
  title,
  description,
  image = DEFAULT_OG,
  jsonLd,
  canonical,
  noindex = false,
}: SeoProps) {
  const { pathname } = useLocation();
  const url = canonical ?? `${SITE_URL}${pathname}`;
  const fullTitle = title.includes("KANTI") ? title : `${title}, KANTI`;
  const ldArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <html lang="fr" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="KANTI" />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
}

/* ------------------------------------------------------------------ */
/*  Réutilisable : générateurs de schémas JSON-LD                      */
/* ------------------------------------------------------------------ */

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "KANTI",
  description:
    "Cabinet indépendant de conseil en gestion de patrimoine à Biarritz.",
  url: SITE_URL,
  telephone: "+33-6-63-32-48-09",
  email: "kanti@adnfamily.com",
  priceRange: "€€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: "9 Rue de la Négresse",
    addressLocality: "Biarritz",
    postalCode: "64200",
    addressCountry: "FR",
  },
  areaServed: {
    "@type": "Place",
    name: "Nouvelle-Aquitaine",
  },
  sameAs: [],
};

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}#cabinet`,
  name: "KANTI, Cabinet de gestion de patrimoine",
  image: DEFAULT_OG,
  url: SITE_URL,
  telephone: "+33-6-63-32-48-09",
  address: {
    "@type": "PostalAddress",
    streetAddress: "9 Rue de la Négresse",
    addressLocality: "Biarritz",
    postalCode: "64200",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 43.4718,
    longitude: -1.5606,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
  ],
};

export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export { SITE_URL };