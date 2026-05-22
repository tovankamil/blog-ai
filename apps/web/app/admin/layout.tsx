import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdminSession } from "../../lib/admin-session";
import { logoutAction } from "./logout-action";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminSession();

  return (
    <div className="admin-layout">
      <aside className="panel sidebar">
        <div className="eyebrow">Admin</div>
        <div className="muted">Signed in as {session.displayName}</div>
        <Link href="/admin">Overview</Link>
        <Link href="/admin/articles">Articles</Link>
        <Link href="/admin/trends">Trends</Link>
        <Link href="/admin/sources">Sources</Link>
        <form action={logoutAction}>
          <button className="button" type="submit">
            Sign Out
          </button>
        </form>
      </aside>
      <div className="stack">{children}</div>
    </div>
  );
}
