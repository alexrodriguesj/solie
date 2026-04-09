import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { Container } from "@/components/ui/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Soliê Pilates — Pilates Clínico no Água Verde, Curitiba",
  description:
    "Artigos sobre Pilates clínico, dor na coluna, postura, flexibilidade e bem-estar. Dicas de fisioterapeutas especializadas no Água Verde, Curitiba.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <main className="pt-24 md:pt-28 pb-16 bg-solie-beige-light min-h-screen">
      <Container>
        {/* Header */}
        <div className="text-center mb-14 px-4">
          <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-solie-green font-medium">
            Blog
          </span>
          <div className="w-16 h-px bg-solie-green/30 mx-auto my-4" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-solie-green mb-4 font-serif leading-tight">
            Movimento, saúde
            <br />
            e bem-estar
          </h1>
          <p className="text-base md:text-lg text-muted max-w-lg mx-auto">
            Conteúdo clínico para quem quer se mover melhor,
            sem dor e com qualidade de vida.
          </p>
        </div>

        {/* Post em destaque */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group block mb-10 px-4 md:px-0">
            <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 md:grid md:grid-cols-2 md:gap-0">
              <div className="relative aspect-[16/9] md:aspect-auto md:min-h-[360px] overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <span className="absolute top-4 left-4 bg-solie-green text-white text-xs font-medium px-3 py-1 rounded-full">
                  {featured.category}
                </span>
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-muted mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(featured.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    ~{featured.readTime} min de leitura
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-solie-green transition-colors font-serif">
                  {featured.title}
                </h2>
                <p className="text-muted mb-6 leading-relaxed">
                  {featured.description}
                </p>
                <div className="flex items-center gap-1 text-solie-green font-medium">
                  Ler artigo completo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          </Link>
        )}

        {/* Grid de posts */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <span className="absolute top-3 left-3 bg-solie-green text-white text-xs font-medium px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-muted mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        ~{post.readTime} min
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-solie-green transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted text-sm flex-1 mb-4 line-clamp-3">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-1 text-solie-green font-medium text-sm">
                      Ler artigo
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <p className="text-center text-muted py-12">
            Em breve novos artigos. Fique ligado!
          </p>
        )}
      </Container>
    </main>
  );
}
