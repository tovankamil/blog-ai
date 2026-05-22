import Link from "next/link";
import { getPublishedArticles } from "../lib/api";

export default async function HomePage() {
  const articles = (await getPublishedArticles()) ?? [];

  return (
    <>
      <section className="hero">
        <span className="eyebrow">Programming Tutorial MVP</span>
        <h1>Build traffic from useful articles, not thin rewrites.</h1>
        <p>
          This scaffold gives you a reading-first public site, an internal admin
          surface, and enough structure to connect sources, AI rewrite jobs, and
          plagiarism checks later.
        </p>
      </section>

      <section className="panel stack">
        <div>
          <div className="eyebrow">Latest</div>
          <h2 className="page-title">Recent drafts ready for growth</h2>
        </div>
        <div className="grid">
          {articles.length > 0 ? (
            articles.map((article) => (
              <article className="card" key={article.slug}>
                <div className="meta">{article.category_slug}</div>
                <h3>{article.title}</h3>
                <p className="muted">{article.excerpt}</p>
                <Link href={`/articles/${article.slug}`}>Read article</Link>
              </article>
            ))
          ) : (
            <article className="card">
              <h3>API not reachable</h3>
              <p className="muted">
                Start the Go API on port 8080 or set `BLOG_API_BASE_URL` for the
                web app.
              </p>
            </article>
          )}
        </div>
      </section>
    </>
  );
}
