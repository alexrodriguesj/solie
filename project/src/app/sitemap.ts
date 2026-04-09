import { getAllPosts } from "@/lib/blog";
import type { MetadataRoute } from "next";

const BASE_URL = "https://soliepilates.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const blogPages = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogPages,
  ];
}
