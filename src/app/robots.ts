import type { MetadataRoute } from "next";
import { seo } from "./seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", seo.url).toString(),
  };
}
