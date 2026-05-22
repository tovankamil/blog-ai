import Link from "next/link";
import { getCategoryArticles } from "../../../lib/api";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const articles = (await getCategoryArticles(slug)) ?? [];

  return (
    <section className="panel stack">
      <div className="eyebrow">Category</div>
      <h1 className="page-title">{slug.toUpperCase()}</h1>
      <p className="muted">
        Published articles in the `{slug}` category.
      </p>
      <div className="stack">
        {articles.length > 0 ? (
          articles.map((article) => (
            <article className="card" key={article.id}>
              <h2>{article.title}</h2>
              <p className="muted">{article.excerpt}</p>
              <Link href={`/articles/${article.slug}`}>Read article</Link>
            </article>
          ))
        ) : (
          <article className="card">
            <p className="muted">No published articles found for this category.</p>
          </article>
        )}
      </div>
    </section>
  );
}
