import Link from "next/link";
import { searchPublishedArticles } from "../../lib/api";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const articles = q ? ((await searchPublishedArticles(q)) ?? []) : [];

  return (
    <section className="panel stack">
      <div className="eyebrow">Search</div>
      <h1 className="page-title">Search articles</h1>
      <p className="muted">
        Query the public API with `?q=`. Current term:{" "}
        <strong>{q || "not set"}</strong>
      </p>
      <pre>{`/search?q=dependency\nGET /api/search?q=${q || "dependency"}`}</pre>
      {q ? (
        <div className="stack">
          {articles.length > 0 ? (
            articles.map((article) => (
              <article className="card" key={article.id}>
                <div className="meta">{article.category_slug}</div>
                <h2>{article.title}</h2>
                <p className="muted">{article.excerpt}</p>
                <Link href={`/articles/${article.slug}`}>Open article</Link>
              </article>
            ))
          ) : (
            <div className="card">
              <p className="muted">No matching published articles found.</p>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
