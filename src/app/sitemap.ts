export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://duskfall-survivors.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const languages = Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}/`]));

  const localized = (path: string, priority: number, freq: MetadataRoute.Sitemap[number]["changeFrequency"]) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency: freq,
      priority,
      alternates: {
        languages: {
          ...Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])),
          "x-default": `${SITE_URL}/en${path}`,
        },
      },
    }));

  return [
    ...localized("/", 1, "weekly"),
    ...localized("/privacy/", 0.3, "yearly"),
    ...localized("/terms/", 0.3, "yearly"),
    {
      url: `${SITE_URL}/play/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages },
    },
  ];
}
