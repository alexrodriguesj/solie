import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  getAllCategories,
  getCategoryName,
  getPostsByCategory,
} from "@/lib/blog";
import { Container } from "@/components/ui/Container";
import { PostGrid } from "@/components/blog/PostGrid";
import { CategoryPills } from "@/components/blog/CategoryPills";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = getCategoryName(slug);
  if (!name) return {};

  const url = `https://soliepilates.com.br/blog/categoria/${slug}`;
  const title = `${name} | Blog Soliê Pilates`;
  const description = `Artigos da categoria ${name} no blog da Soliê Pilates, no Água Verde, Curitiba.`;

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

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const name = getCategoryName(slug);
  if (!name) notFound();

  const posts = getPostsByCategory(slug);
  const categories = getAllCategories();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${name} | Blog Soliê Pilates`,
    description: `Artigos da categoria ${name} no blog da Soliê Pilates, no Água Verde, Curitiba.`,
    url: `https://soliepilates.com.br/blog/categoria/${slug}`,
    isPartOf: {
      "@type": "Blog",
      name: "Blog Soliê Pilates",
      url: "https://soliepilates.com.br/blog",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://soliepilates.com.br/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <main className="pt-24 md:pt-28 pb-16 bg-solie-beige-light min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
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
          <span className="text-foreground">{name}</span>
        </nav>

        <div className="text-center mb-12 px-4">
          <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-solie-green font-medium">
            Categoria
          </span>
          <div className="w-16 h-px bg-solie-green/30 mx-auto my-4" />
          <h1 className="text-3xl md:text-5xl font-light text-solie-green mb-4 font-serif leading-tight">
            {name}
          </h1>
          <p className="text-base md:text-lg text-muted max-w-lg mx-auto">
            {posts.length} {posts.length === 1 ? "artigo" : "artigos"} nessa categoria.
          </p>
        </div>

        <CategoryPills categories={categories} activeSlug={slug} />

        <PostGrid posts={posts} />

        {posts.length === 0 && (
          <p className="text-center text-muted py-12">
            Nenhum artigo nessa categoria ainda. Em breve.
          </p>
        )}
      </Container>
    </main>
  );
}
