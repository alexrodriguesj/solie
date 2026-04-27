import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { BlogPostListItem } from "@/lib/blog";

interface PostGridProps {
  posts: BlogPostListItem[];
}

export function PostGrid({ posts }: PostGridProps) {
  if (posts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
      {posts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
          <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
            <div className="relative aspect-[3/4] overflow-hidden">
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
  );
}
