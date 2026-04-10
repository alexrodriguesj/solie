import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, MessageCircle, Tag, ChevronRight } from "lucide-react";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/content";
import { formatWhatsAppLink } from "@/lib/utils";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Soliê Pilates`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      locale: "pt_BR",
      siteName: "Soliê Pilates",
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const whatsappLink = formatWhatsAppLink(
    siteConfig.whatsapp,
    "Olá! Li o artigo sobre Pilates no blog e gostaria de agendar uma aula experimental."
  );

  // Inject mid-article CTA after ~50% of paragraphs
  const paragraphs = post.contentHtml.split("</p>");
  const midPoint = Math.floor(paragraphs.length / 2);
  const ctaHtml = `<div class="not-prose my-10 bg-solie-green rounded-2xl p-6 md:p-8 text-center"><h3 class="text-xl md:text-2xl font-bold text-white mb-2">Quer aliviar sua dor?</h3><p class="text-white/80 mb-4">Agende uma avaliação gratuita com nossas fisioterapeutas.</p><a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-full font-medium transition-colors">Quero Minha Aula Grátis</a></div>`;
  paragraphs.splice(midPoint, 0, ctaHtml);
  const contentWithCta = paragraphs.join("</p>");

  return (
    <>
      <ReadingProgress slug={post.slug} />
      <main className="pt-24 md:pt-28 pb-16 bg-white min-h-screen">
        <Container size="md">
          {/* Breadcrumb */}
          <nav className="px-4 md:px-0 mb-6 flex items-center gap-1 text-sm text-muted">
            <Link href="/" className="hover:text-solie-green transition-colors">
              Início
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog" className="hover:text-solie-green transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground truncate max-w-[200px] md:max-w-none">
              {post.title}
            </span>
          </nav>

          <article className="px-4 md:px-0">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted mb-4">
              <span className="bg-solie-green text-white px-3 py-1 rounded-full text-xs font-medium">
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                ~{post.readTime} min de leitura
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-solie-green mb-4 leading-tight font-serif">
              {post.title}
            </h1>

            {/* Lead */}
            <p className="text-lg md:text-xl text-solie-green/70 mb-8 leading-relaxed">
              {post.description}
            </p>

            {/* Hero Image or Video */}
            {post.video ? (
              <div className="mb-10 mx-auto max-w-sm">
                <VideoPlayer src={post.video} name={post.slug} poster={post.image} autoUnmute />
              </div>
            ) : (
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 720px"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-serif prose-headings:text-solie-green prose-headings:font-bold
                prose-h2:border-l-[3px] prose-h2:border-solie-green prose-h2:pl-4 prose-h2:mt-10 prose-h2:mb-4
                prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-6
                prose-strong:text-foreground
                prose-li:text-foreground/80 prose-li:leading-relaxed
                prose-a:text-solie-green prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-solie-green prose-blockquote:bg-solie-beige-light prose-blockquote:rounded-r-xl prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic
                prose-img:rounded-xl
                mb-12"
              dangerouslySetInnerHTML={{ __html: contentWithCta }}
            />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10 pt-6 border-t border-solie-beige">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs bg-solie-beige-light text-solie-green px-3 py-1.5 rounded-full hover:bg-solie-beige transition-colors"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTA Final */}
            <div className="bg-solie-green rounded-2xl p-8 md:p-10 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 font-serif">
                Quer sentir a diferença?
              </h3>
              <p className="text-white/80 mb-6 max-w-md mx-auto">
                Agende sua aula experimental gratuita e descubra o Pilates
                na Soliê, no Água Verde.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full text-lg font-medium transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
                Quero Minha Aula Grátis
              </a>
              <p className="text-white/50 text-sm mt-3 italic">
                Duvidamos muito você não querer voltar pra segunda aula...
              </p>
            </div>
          </article>
        </Container>
      </main>
    </>
  );
}
