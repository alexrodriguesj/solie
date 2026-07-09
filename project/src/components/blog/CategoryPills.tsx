import Link from "next/link";

interface Category {
  name: string;
  slug: string;
  count: number;
}

interface CategoryPillsProps {
  categories: Category[];
  /** Slug da categoria ativa. Ausente no índice /blog, onde "Todos" fica ativo. */
  activeSlug?: string;
}

const BASE =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors";
const ACTIVE = "bg-solie-green text-white border-solie-green";
const IDLE =
  "bg-white text-solie-green border-solie-beige hover:bg-solie-beige-light";

export function CategoryPills({ categories, activeSlug }: CategoryPillsProps) {
  if (categories.length === 0) return null;

  const total = categories.reduce((sum, c) => sum + c.count, 0);
  const allActive = !activeSlug;

  return (
    <nav aria-label="Categorias do blog" className="mb-10 px-4 md:px-0">
      <ul className="flex flex-wrap justify-center gap-2 md:gap-3">
        <li>
          <Link
            href="/blog"
            aria-current={allActive ? "page" : undefined}
            className={`${BASE} ${allActive ? ACTIVE : IDLE}`}
          >
            Todos
            <span className={allActive ? "text-white/60" : "text-solie-green/50"}>
              {total}
            </span>
          </Link>
        </li>

        {categories.map((category) => {
          const isActive = category.slug === activeSlug;
          return (
            <li key={category.slug}>
              <Link
                href={`/blog/categoria/${category.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={`${BASE} ${isActive ? ACTIVE : IDLE}`}
              >
                {category.name}
                <span
                  className={isActive ? "text-white/60" : "text-solie-green/50"}
                >
                  {category.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
