import type { MetadataRoute } from "next";
import { seo } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: seo.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
