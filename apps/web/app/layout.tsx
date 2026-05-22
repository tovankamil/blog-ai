import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { getCategories } from "../lib/api";

export const metadata: Metadata = {
  title: "Programming Notes",
  description: "SEO-first programming content business scaffold.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const categories = (await getCategories()) ?? [];
  const featuredCategory = categories[0]?.slug ?? "go";

  return (
    <html lang="en">
      <body>
        <main className="shell">
          <header className="panel">
            <div className="eyebrow">Solo Content Business</div>
            <div className="nav">
              <Link className="pill" href="/">
                Home
              </Link>
              <Link className="pill" href="/search">
                Search
              </Link>
              <Link className="pill" href={`/categories/${featuredCategory}`}>
                Categories
              </Link>
              <Link className="pill" href="/admin">
                Admin
              </Link>
            </div>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
