import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getAllPosts } from "@/lib/blog";

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogHome() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <section id="blog" className="pb-12 md:pb-20 bg-white">
      <Container>
        <div className="overflow-hidden rounded-3xl bg-solie-green shadow-xl p-6 md:p-12">
          <h2 className="font-serif font-light text-white text-3xl md:text-4xl lg:text-5xl">
            Do Blog
          </h2>
          <div className="mt-5 md:mt-8 h-px bg-solie-beige/40" />

          {/* Desliza na horizontal até lg; destaque + 2 posts no desktop */}
          <div className="mt-6 md:mt-10 -mx-6 md:-mx-12 lg:mx-0 px-6 md:px-12 lg:px-0 grid grid-flow-col auto-cols-[72vw] sm:auto-cols-[44vw] gap-5 overflow-x-auto snap-x scroll-px-6 md:scroll-px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid-flow-row lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-8 lg:overflow-visible">
            {posts.map((post, index) => {
              const destaque = index === 0;

              return (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group snap-start block">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover object-[center_25%] group-hover:scale-105 transition-transform duration-500"
                      sizes={destaque ? "(min-width: 1024px) 50vw, 72vw" : "(min-width: 1024px) 25vw, 72vw"}
                    />
                  </div>
                  <p className="mt-4 text-sm text-solie-beige/80">{post.category}</p>
                  <h3
                    className={`mt-1 font-serif font-light text-white leading-snug group-hover:text-solie-beige transition-colors ${
                      destaque ? "text-2xl lg:text-4xl" : "text-2xl lg:text-xl"
                    }`}
                  >
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/80">
                    {formatarData(post.date)}, {post.readTime} min de leitura
                  </p>
                </Link>
              );
            })}
          </div>

          <Link
            href="/blog"
            className="mt-8 md:mt-10 inline-block border-b border-solie-beige/70 pb-1 text-white hover:text-solie-beige transition-colors"
          >
            Ler o Blog
          </Link>
        </div>
      </Container>
    </section>
  );
}
