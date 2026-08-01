import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://doctorclinic.com";

  const publicRoutes = [
    "",
    "/about",
    "/services",
    "/doctors",
    "/contact",
    "/blog",
    "/booking",
    "/login",
    "/forgot-password",
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
