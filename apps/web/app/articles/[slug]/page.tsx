import { getAPIBaseURL, getPublishedArticle } from "../../../lib/api";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);

  if (!article) {
    return (
      <section className="panel stack">
        <div className="eyebrow">Article</div>
        <h1 className="page-title">{slug.replaceAll("-", " ")}</h1>
        <p className="muted">
          Published article not found. Check whether the API is running and the
          article status is `published`.
        </p>
        <pre>{`${getAPIBaseURL()}/api/articles/${slug}`}</pre>
      </section>
    );
  }

  return (
    <section className="panel stack">
      <div className="eyebrow">{article.category_slug}</div>
      <h1 className="page-title">{article.title}</h1>
      <p className="muted">{article.meta_description}</p>
      <article
        className="article-body"
        dangerouslySetInnerHTML={{ __html: article.content_html }}
      />
    </section>
  );
}
