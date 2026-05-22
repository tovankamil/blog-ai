import { redirect } from "next/navigation";
import { getAdminSession } from "../../lib/admin-session";
import { loginAction } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  const { error } = await searchParams;

  return (
    <section className="panel stack auth-shell">
      <div className="eyebrow">Admin Login</div>
      <h1 className="page-title">Editorial access</h1>
      <p className="muted">
        Sign in with the seeded local admin account to access the admin
        workflow.
      </p>
      {error ? <div className="notice error">{error}</div> : null}
      <form action={loginAction} className="stack auth-form">
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" defaultValue="admin@local.dev" />
        </label>
        <label className="field">
          <span>Password</span>
          <input name="password" type="password" defaultValue="admin12345" />
        </label>
        <div className="actions-row">
          <button className="button primary" type="submit">
            Sign In
          </button>
        </div>
      </form>
    </section>
  );
}
