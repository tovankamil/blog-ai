import { getAdminJobs, getAdminOverview } from "../../lib/api";

export default async function AdminPage() {
  const overview = await getAdminOverview();
  const jobs = (await getAdminJobs()) ?? [];

  return (
    <section className="panel stack">
      <div className="eyebrow">Overview</div>
      <h1 className="page-title">Editorial command center</h1>
      <p className="muted">
        This surface owns article workflow, source intake, AI drafting, and
        plagiarism review.
      </p>
      {overview ? (
        <div className="grid">
          <article className="card">
            <div className="meta">Articles</div>
            <h2>{overview.counts.articles}</h2>
          </article>
          <article className="card">
            <div className="meta">Sources</div>
            <h2>{overview.counts.sources}</h2>
          </article>
          <article className="card">
            <div className="meta">Jobs</div>
            <h2>{overview.counts.jobs}</h2>
          </article>
        </div>
      ) : (
        <div className="card">
          <p className="muted">Admin API is not reachable.</p>
        </div>
      )}
      <section className="stack">
        <div className="eyebrow">Recent Jobs</div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Article</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length > 0 ? (
              jobs.slice(0, 5).map((job) => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.job_type}</td>
                  <td>{job.status}</td>
                  <td>{job.article_id || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="muted">
                  No jobs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </section>
  );
}
