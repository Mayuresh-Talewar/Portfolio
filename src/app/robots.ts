import type { MetadataRoute } from "next";
import { seo } from "./seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // Keep the fan art out of image search (docs/10 §5).
    rules: { userAgent: "*", allow: "/", disallow: "/art/luffy/" },
    sitemap: new URL("/sitemap.xml", seo.url).toString(),
  };
}
