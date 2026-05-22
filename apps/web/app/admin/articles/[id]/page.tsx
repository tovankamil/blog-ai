import Link from "next/link";
import {
  getAdminArticle,
  getAdminSourceRecords,
  getCategories,
} from "../../../../lib/api";
import { formatDate } from "../../../../lib/format";
import { saveArticleAction, triggerWorkflowAction } from "./actions";
import {
  attachSourcePackAction,
  detachSourcePackAction,
} from "./source-pack-actions";

type AdminArticlePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
};

export default async function AdminArticlePage({
  params,
  searchParams,
}: AdminArticlePageProps) {
  const { id } = await params;
  const { success, error } = await searchParams;
  const detail = await getAdminArticle(id);
  const categories = (await getCategories()) ?? [];
  const sourceRecords = (await getAdminSourceRecords()) ?? [];

  if (!detail) {
    return (
      <section className="panel stack">
        <div className="eyebrow">Article Editor</div>
        <h1 className="page-title">Article #{id}</h1>
        <p className="muted">Article detail is not reachable from the admin API.</p>
      </section>
    );
  }

  const {
    article,
    latest_check: latestCheck,
    recent_jobs: recentJobs,
    revisions,
    source_pack: sourcePack,
  } = detail;
  const saveAction = saveArticleAction.bind(null, id);
  const workflowAction = triggerWorkflowAction.bind(null, id);
  const attachSourceAction = attachSourcePackAction.bind(null, id);
  const detachSourceAction = detachSourcePackAction.bind(null, id);
  const attachedSourceIDs = new Set(sourcePack.map((source) => source.id));
  const availableSourceRecords = sourceRecords.filter(
    (source) => !attachedSourceIDs.has(source.id),
  );

  return (
    <section className="panel stack">
      <div className="eyebrow">Article Editor</div>
      <h1 className="page-title">{article.title}</h1>
      {success ? <div className="notice success">{success}</div> : null}
      {error ? <div className="notice error">{error}</div> : null}
      <div className="grid">
        <article className="card">
          <div className="meta">Status</div>
          <h2>{article.status}</h2>
        </article>
        <article className="card">
          <div className="meta">Category</div>
          <h2>{article.category_slug}</h2>
        </article>
        <article className="card">
          <div className="meta">Updated</div>
          <h2>{formatDate(article.updated_at)}</h2>
        </article>
      </div>
      <div className="card stack">
        <div className="meta">Slug</div>
        <code>{article.slug}</code>
        <p className="muted">{article.excerpt || "No excerpt yet."}</p>
        <pre>{article.content_md || "No markdown content yet."}</pre>
        <Link href={`/articles/${article.slug}`}>Open public article</Link>
      </div>
      <div className="grid">
        <article className="card stack">
          <div className="meta">Publish Gate</div>
          <h2>{detail.can_publish ? "Ready" : "Blocked"}</h2>
          {detail.publish_blockers.length > 0 ? (
            <ul className="plain-list">
              {detail.publish_blockers.map((blocker) => (
                <li key={blocker}>{blocker}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">No publish blockers detected.</p>
          )}
        </article>
        <article className="card stack">
          <div className="meta">Latest Plagiarism Check</div>
          {latestCheck ? (
            <>
              <h2>{latestCheck.status}</h2>
              <p className="muted">
                Overall similarity: {Math.round(latestCheck.overall_similarity_score * 100)}%
              </p>
              <p className="muted">
                Max source similarity: {Math.round(latestCheck.max_source_similarity_score * 100)}%
              </p>
              <p className="muted">{latestCheck.review_notes}</p>
            </>
          ) : (
            <p className="muted">No plagiarism check recorded yet.</p>
          )}
        </article>
      </div>
      <section className="panel stack">
        <div className="eyebrow">Edit Article</div>
        <form action={saveAction} className="stack">
          <div className="form-grid">
            <label className="field">
              <span>Title</span>
              <input name="title" defaultValue={article.title} />
            </label>
            <label className="field">
              <span>Slug</span>
              <input name="slug" defaultValue={article.slug} />
            </label>
            <label className="field">
              <span>Status</span>
              <select name="status" defaultValue={article.status}>
                <option value="idea">idea</option>
                <option value="sourced">sourced</option>
                <option value="draft">draft</option>
                <option value="ai_assisted">ai_assisted</option>
                <option value="plagiarism_check">plagiarism_check</option>
                <option value="review">review</option>
                <option value="scheduled">scheduled</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </label>
            <label className="field">
              <span>Category</span>
              <select name="category_slug" defaultValue={article.category_slug}>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            <span>Excerpt</span>
            <textarea name="excerpt" rows={4} defaultValue={article.excerpt} />
          </label>
          <div className="form-grid">
            <label className="field">
              <span>Meta Title</span>
              <input name="meta_title" defaultValue={article.meta_title} />
            </label>
            <label className="field">
              <span>Meta Description</span>
              <input
                name="meta_description"
                defaultValue={article.meta_description}
              />
            </label>
          </div>
          <label className="field">
            <span>Cover Image URL</span>
            <input
              name="cover_image_url"
              defaultValue={article.cover_image_url}
            />
          </label>
          <label className="field">
            <span>Markdown Content</span>
            <textarea
              name="content_md"
              rows={14}
              defaultValue={article.content_md}
            />
          </label>
          <label className="field">
            <span>HTML Content</span>
            <textarea
              name="content_html"
              rows={10}
              defaultValue={article.content_html}
            />
          </label>
          <div className="actions-row">
            <button className="button primary" type="submit">
              Save Article
            </button>
          </div>
        </form>
      </section>
      <section className="panel stack">
        <div className="eyebrow">Workflow Actions</div>
        <form action={workflowAction} className="actions-row">
          <button
            className="button"
            type="submit"
            name="workflow_action"
            value="generate_draft"
          >
            Generate Draft
          </button>
          <button
            className="button"
            type="submit"
            name="workflow_action"
            value="plagiarism_check"
          >
            Run Plagiarism Check
          </button>
          <button
            className="button"
            type="submit"
            name="workflow_action"
            value="schedule"
          >
            Schedule
          </button>
          <button
            className="button primary"
            type="submit"
            name="workflow_action"
            value="publish"
          >
            Publish
          </button>
        </form>
      </section>
      <section className="panel stack">
        <div className="eyebrow">Source Pack</div>
        <form action={attachSourceAction} className="stack">
          <div className="form-grid">
            <label className="field">
              <span>Source Record</span>
              <select name="source_record_id" defaultValue="">
                <option value="" disabled>
                  Select source record
                </option>
                {availableSourceRecords.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.domain} | {source.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Editorial Note</span>
              <input
                name="source_note"
                placeholder="Why this source is relevant to the article"
              />
            </label>
          </div>
          <div className="actions-row">
            <button
              className="button"
              type="submit"
              disabled={availableSourceRecords.length === 0}
            >
              Attach Source Record
            </button>
          </div>
        </form>
        <div className="stack">
          {sourcePack.length > 0 ? (
            sourcePack.map((source) => (
              <article className="card stack" key={source.id}>
                <div className="meta">{source.domain}</div>
                <h2>{source.title}</h2>
                <p className="muted">{source.excerpt}</p>
                <div className="stack compact">
                  <code>{source.url}</code>
                  <p className="muted">
                    Trend score: {source.trend_score} | Crawled:{" "}
                    {formatDate(source.crawled_at)}
                  </p>
                  <p className="muted">{source.note || "No editorial note."}</p>
                  <form action={detachSourceAction} className="actions-row">
                    <input
                      type="hidden"
                      name="source_record_id"
                      value={source.id}
                    />
                    <button className="button danger" type="submit">
                      Detach
                    </button>
                  </form>
                </div>
              </article>
            ))
          ) : (
            <article className="card">
              <p className="muted">No source pack linked to this article yet.</p>
            </article>
          )}
        </div>
      </section>
      <section className="panel stack">
        <div className="eyebrow">Revision History</div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Source</th>
              <th>Note</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {revisions.length > 0 ? (
              revisions.map((revision) => (
                <tr key={revision.id}>
                  <td>{revision.id}</td>
                  <td>{revision.source_type}</td>
                  <td>{revision.notes || "-"}</td>
                  <td>{formatDate(revision.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="muted">
                  No revisions recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
      <section className="panel stack">
        <div className="eyebrow">Recent Jobs</div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Payload</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.job_type}</td>
                  <td>{job.status}</td>
                  <td>
                    <span className="muted">
                      {Array.isArray(job.payload.source_record_ids)
                        ? `${job.payload.source_record_ids.length} sources`
                        : "-"}
                      {job.payload.revision_id
                        ? ` | revision ${String(job.payload.revision_id)}`
                        : ""}
                    </span>
                  </td>
                  <td>{formatDate(job.updated_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="muted">
                  No jobs found for this article.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </section>
  );
}
