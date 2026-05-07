import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image: string;
  hero?: string;
  video?: string;
  tags: string[];
  category: string;
  readTime: number;
  featured?: boolean;
  content: string;
  contentHtml: string;
}

export type BlogPostListItem = Omit<BlogPost, "contentHtml">;

export function slugify(value: string): string {
  return value
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(gfm).use(html, { sanitize: false }).process(markdown);
  return result.toString();
}

export function getAllPosts(): BlogPostListItem[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const wordCount = content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      author: data.author || "Soliê Pilates",
      image: data.image,
      hero: data.hero || undefined,
      video: data.video || undefined,
      tags: data.tags || [],
      category: data.category || "Pilates",
      readTime: data.readTime || readTime,
      featured: data.featured === true,
      content,
    };
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const contentHtml = await markdownToHtml(content);

  const wordCount = content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author || "Soliê Pilates",
    image: data.image,
    hero: data.hero || undefined,
    video: data.video || undefined,
    tags: data.tags || [],
    category: data.category || "Pilates",
    readTime: data.readTime || readTime,
    featured: data.featured === true,
    content,
    contentHtml,
  };
}

export function getRelatedPosts(slug: string, limit = 3): BlogPostListItem[] {
  const all = getAllPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];

  const others = all.filter((p) => p.slug !== slug);

  const scored = others.map((p) => {
    let score = 0;
    if (p.category === current.category) score += 10;
    const sharedTags = p.tags.filter((t) => current.tags.includes(t)).length;
    score += sharedTags * 3;
    return { post: p, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
  });

  return scored.slice(0, limit).map((s) => s.post);
}

export function getAllCategories(): { name: string; slug: string; count: number }[] {
  const all = getAllPosts();
  const map = new Map<string, { name: string; count: number }>();

  for (const post of all) {
    const slug = slugify(post.category);
    const existing = map.get(slug);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(slug, { name: post.category, count: 1 });
    }
  }

  return Array.from(map.entries())
    .map(([slug, { name, count }]) => ({ name, slug, count }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export function getAllTags(): { name: string; slug: string; count: number }[] {
  const all = getAllPosts();
  const map = new Map<string, { name: string; count: number }>();

  for (const post of all) {
    for (const tag of post.tags) {
      const slug = slugify(tag);
      const existing = map.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(slug, { name: tag, count: 1 });
      }
    }
  }

  return Array.from(map.entries())
    .map(([slug, { name, count }]) => ({ name, slug, count }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export function getPostsByCategory(categorySlug: string): BlogPostListItem[] {
  return getAllPosts().filter((p) => slugify(p.category) === categorySlug);
}

export function getPostsByTag(tagSlug: string): BlogPostListItem[] {
  return getAllPosts().filter((p) => p.tags.some((t) => slugify(t) === tagSlug));
}

export function getCategoryName(categorySlug: string): string | null {
  const found = getAllCategories().find((c) => c.slug === categorySlug);
  return found ? found.name : null;
}

export function getTagName(tagSlug: string): string | null {
  const found = getAllTags().find((t) => t.slug === tagSlug);
  return found ? found.name : null;
}
