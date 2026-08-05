import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import { z } from "zod";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

/**
 * Vocabulário controlado de tags. Fonte única da verdade.
 *
 * Uma tag fora desta lista quebra o build com erro explícito. Para criar uma
 * tag nova, adicione aqui primeiro. Regra de curadoria: a tag descreve corpo,
 * condição ou público, nunca o que a categoria já diz.
 */
export const BLOG_TAGS = [
  // Corpo
  "lombar",
  "coluna",
  "core",
  "quadril",
  "glúteo",
  "punho e mão",
  "pé e tornozelo",
  // Condição
  "hérnia de disco",
  "nervo ciático",
  "artrose",
  "neuromuscular",
  // Conceito
  "postura",
  "mobilidade",
  "controle motor",
  // Público
  "gestante",
  "melhor idade",
  "jovens",
  "sedentarismo",
] as const;

export type BlogTag = (typeof BLOG_TAGS)[number];

/**
 * Mínimo de posts para uma página de tag ser indexável e entrar no sitemap.
 * Abaixo disso a página continua navegável, mas com noindex.
 */
export const TAG_MIN_POSTS_INDEXAVEL = 3;

const frontmatterSchema = z.object({
  title: z.string().min(1, "obrigatório"),
  description: z.string().min(1, "obrigatório"),
  date: z.string().min(1, "obrigatório"),
  image: z.string().min(1, "obrigatório"),
  author: z.string().optional(),
  hero: z.string().optional(),
  video: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.enum(BLOG_TAGS)).optional(),
  readTime: z.number().optional(),
  featured: z.boolean().optional(),
});

type Frontmatter = z.infer<typeof frontmatterSchema>;

function parseFrontmatter(data: unknown, filename: string): Frontmatter {
  const result = frontmatterSchema.safeParse(data);

  if (!result.success) {
    const problemas = result.error.issues
      .map((issue) => {
        const campo = issue.path.join(".") || "(raiz)";
        return `  - ${campo}: ${issue.message}`;
      })
      .join("\n");

    throw new Error(
      `Frontmatter inválido em "${filename}":\n${problemas}\n\n` +
        `Tags permitidas: ${BLOG_TAGS.join(", ")}`
    );
  }

  return result.data;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image: string;
  hero?: string;
  video?: string;
  tags: BlogTag[];
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
    const { data: rawData, content } = matter(fileContent);
    const data = parseFrontmatter(rawData, filename);

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
  const { data: rawData, content } = matter(fileContent);
  const data = parseFrontmatter(rawData, `${slug}.mdx`);
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

/** Tags com posts suficientes para virar página de cluster indexável. */
export function getTagsIndexaveis(): { name: string; slug: string; count: number }[] {
  return getAllTags().filter((t) => t.count >= TAG_MIN_POSTS_INDEXAVEL);
}

export function isTagIndexavel(tagSlug: string): boolean {
  const found = getAllTags().find((t) => t.slug === tagSlug);
  return found ? found.count >= TAG_MIN_POSTS_INDEXAVEL : false;
}
