export type ArticleStatus =
  | "idea"
  | "sourced"
  | "draft"
  | "ai_assisted"
  | "plagiarism_check"
  | "review"
  | "scheduled"
  | "published"
  | "archived";

export interface ArticleCard {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedAt?: string;
}

export interface SourceRecord {
  id: string;
  title: string;
  url: string;
  trendScore: number;
  sourceName: string;
}

