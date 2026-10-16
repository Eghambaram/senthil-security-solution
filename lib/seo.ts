import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://senthilsecuritysolutions.com";
export const SITE_NAME = "Senthil Security Solutions";

type Options = {
  /** Page name; becomes "{title} | Senthil Security Solutions, Chennai". */
  title: string;
  /** ≤ 155 characters. */
  description: string;
  path: string;
  noIndex?: boolean;
};

export function buildMetadata({ title, description, path, noIndex = false }: Options): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}, Chennai`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
