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
  video?: string;
  tags: string[];
  category: string;
  readTime: number;
  featured?: boolean;
  content: string;
  contentHtml: string;
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(gfm).use(html, { sanitize: false }).process(markdown);
  return result.toString();
}

export function getAllPosts(): Omit<BlogPost, "contentHtml">[] {
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
    video: data.video || undefined,
    tags: data.tags || [],
    category: data.category || "Pilates",
    readTime: data.readTime || readTime,
    featured: data.featured === true,
    content,
    contentHtml,
  };
}
