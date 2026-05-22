import { getAdminSources } from "../../../lib/api";

export default async function AdminSourcesPage() {
  const sources = (await getAdminSources()) ?? [];

  return (
    <section className="panel stack">
      <div className="eyebrow">Sources</div>
      <h1 className="page-title">Source registry</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Domain</th>
            <th>Status</th>
            <th>Robots</th>
          </tr>
        </thead>
        <tbody>
          {sources.length > 0 ? (
            sources.map((source) => (
              <tr key={source.id}>
                <td>{source.domain}</td>
                <td>{source.review_status}</td>
                <td>{source.robots_status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="muted">
                No sources found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
