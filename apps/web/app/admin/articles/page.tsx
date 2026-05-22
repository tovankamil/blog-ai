import Link from "next/link";
import { getAdminArticles } from "../../../lib/api";
import { formatDate } from "../../../lib/format";

export default async function AdminArticlesPage() {
  const articles = (await getAdminArticles()) ?? [];

  return (
    <section className="panel stack">
      <div className="eyebrow">Articles</div>
      <h1 className="page-title">Content pipeline</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {articles.length > 0 ? (
            articles.map((article) => (
              <tr key={article.id}>
                <td>{article.id}</td>
                <td>
                  <Link href={`/admin/articles/${article.id}`}>{article.title}</Link>
                </td>
                <td>{article.status}</td>
                <td>{formatDate(article.updated_at)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="muted">
                No articles found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
