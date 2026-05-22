import { getAdminTrends } from "../../../lib/api";

export default async function AdminTrendsPage() {
  const trends = (await getAdminTrends()) ?? [];

  return (
    <section className="panel stack">
      <div className="eyebrow">Trend Intake</div>
      <h1 className="page-title">Trend candidates</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Topic</th>
            <th>Score</th>
            <th>Source pack</th>
          </tr>
        </thead>
        <tbody>
          {trends.length > 0 ? (
            trends.map((trend) => (
              <tr key={trend.topic}>
                <td>{trend.topic}</td>
                <td>{trend.trend_score}</td>
                <td>{trend.approved_sources} approved sources</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="muted">
                No trend candidates found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
