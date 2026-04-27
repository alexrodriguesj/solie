import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Tag } from "lucide-react";
import { getAllTags, getPostsByTag, getTagName } from "@/lib/blog";
import { Container } from "@/components/ui/Container";
import { PostGrid } from "@/components/blog/PostGrid";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllTags().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = getTagName(slug);
  if (!name) return {};

  const url = `https://soliepilates.com.br/blog/tag/${slug}`;
  const title = `${name} | Blog Soliê Pilates`;
  const description = `Artigos com a tag "${name}" no blog da Soliê Pilates, no Água Verde, Curitiba.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "pt_BR",
      siteName: "Soliê Pilates",
      url,
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const name = getTagName(slug);
  if (!name) notFound();

  const posts = getPostsByTag(slug);

  return (
    <main className="pt-24 md:pt-28 pb-16 bg-solie-beige-light min-h-screen">
      <Container>
        <nav className="px-4 md:px-0 mb-6 flex items-center gap-1 text-sm text-muted">
          <Link href="/" className="hover:text-solie-green transition-colors">
            Início
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/blog" className="hover:text-solie-green transition-colors">
            Blog
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground">#{name}</span>
        </nav>

        <div className="text-center mb-12 px-4">
          <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-solie-green font-medium">
            Tag
          </span>
          <div className="w-16 h-px bg-solie-green/30 mx-auto my-4" />
          <h1 className="text-3xl md:text-5xl font-light text-solie-green mb-4 font-serif leading-tight inline-flex items-center gap-3">
            <Tag className="w-7 h-7 md:w-9 md:h-9" />
            {name}
          </h1>
          <p className="text-base md:text-lg text-muted max-w-lg mx-auto">
            {posts.length} {posts.length === 1 ? "artigo" : "artigos"} com essa tag.
          </p>
        </div>

        <PostGrid posts={posts} />

        {posts.length === 0 && (
          <p className="text-center text-muted py-12">
            Nenhum artigo com essa tag ainda. Em breve.
          </p>
        )}
      </Container>
    </main>
  );
}
