import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://kanti-patrimoine-courtage.lovable.app";
const DEFAULT_OG = `${SITE_URL}/og-default.jpg`;

interface ArticleMeta {
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  author?: string;
}

interface SeoProps {
  title: string;
  description: string;
  image?: string;
  /** JSON-LD object(s). Can be a single object or an array. */
  jsonLd?: object | object[];
  /** Override canonical URL. Defaults to current pathname. */
  canonical?: string;
  noindex?: boolean;
  /** Pass for article pages to emit og:type=article and article:* meta tags. */
  articleMeta?: ArticleMeta;
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
  articleMeta,
}: SeoProps) {
  const { pathname } = useLocation();
  const url = canonical ?? `${SITE_URL}${pathname}`;
  const fullTitle = title.includes("KANTI") ? title : `${title}, KANTI`;
  const ldArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  const isArticle = Boolean(articleMeta);

  return (
    <Helmet>
      <html lang="fr" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={isArticle ? "article" : "website"} />
      <meta property="og:site_name" content="KANTI" />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />

      {/* Article-specific OG */}
      {isArticle && articleMeta?.publishedTime && (
        <meta property="article:published_time" content={articleMeta.publishedTime} />
      )}
      {isArticle && articleMeta?.modifiedTime && (
        <meta property="article:modified_time" content={articleMeta.modifiedTime} />
      )}
      {isArticle && articleMeta?.section && (
        <meta property="article:section" content={articleMeta.section} />
      )}
      {isArticle && articleMeta?.author && (
        <meta property="article:author" content={articleMeta.author} />
      )}

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
    "Cabinet de conseil en gestion de patrimoine à Bordeaux.",
  url: SITE_URL,
  telephone: "+33-6-63-32-48-09",
  email: "kanti@adnfamily.com",
  priceRange: "€€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: "12 rue Ferrere",
    addressLocality: "Bordeaux",
    postalCode: "33000",
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
    streetAddress: "12 rue Ferrere",
    addressLocality: "Bordeaux",
    postalCode: "33000",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 44.8378,
    longitude: -0.5792,
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

export function blogPostingJsonLd(article: {
  title: string;
  excerpt: string;
  image: string;
  tag: string;
  author_name?: string | null;
  created_at: string;
  updated_at: string;
  slug?: string | null;
  id: string;
}) {
  const canonicalUrl = `${SITE_URL}/actualites/${article.slug ?? article.id}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": canonicalUrl,
    headline: article.title,
    description: article.excerpt,
    image: {
      "@type": "ImageObject",
      url: article.image,
      width: 1200,
      height: 630,
    },
    datePublished: article.created_at,
    dateModified: article.updated_at,
    author: {
      "@type": "Person",
      name: article.author_name ?? "Cabinet KANTI",
      url: `${SITE_URL}/cabinet`,
    },
    publisher: {
      "@type": "Organization",
      name: "KANTI",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-kanti.png`,
      },
    },
    url: canonicalUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    articleSection: article.tag,
    inLanguage: "fr-FR",
    isPartOf: {
      "@type": "Blog",
      name: "Actualités patrimoniales KANTI",
      url: `${SITE_URL}/actualites`,
    },
  };
}

export { SITE_URL };