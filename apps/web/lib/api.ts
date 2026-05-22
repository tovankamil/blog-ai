type ApiResponse<T> = {
  data: T;
  meta: Record<string, unknown> | null;
  error: {
    code: string;
    message: string;
  } | null;
};

type APIError = {
  ok: false;
  error: string;
};

type APISuccess<T> = {
  ok: true;
  data: T;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_md: string;
  content_html: string;
  status: string;
  category_id: string;
  category_slug: string;
  author_id: string;
  meta_title: string;
  meta_description: string;
  cover_image_url: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type Source = {
  id: string;
  domain: string;
  source_name: string;
  category: string;
  review_status: string;
  robots_status: string;
  terms_review_status: string;
  crawl_enabled: boolean;
  crawl_interval_minutes: number;
  last_checked_at?: string;
  created_at: string;
  updated_at: string;
};

export type SourceRecord = {
  id: string;
  source_id: string;
  domain: string;
  url: string;
  title: string;
  excerpt: string;
  author_name: string;
  published_at?: string;
  trend_score: number;
  crawled_at: string;
  note: string;
};

export type TrendCandidate = {
  topic: string;
  trend_score: number;
  approved_sources: number;
  source_record_urls: string[];
};

export type Job = {
  id: string;
  article_id?: string;
  job_type: string;
  status: string;
  payload: Record<string, unknown>;
  result_summary: Record<string, unknown>;
  error_message: string;
  created_at: string;
  updated_at: string;
};

export type AdminOverview = {
  message: string;
  counts: {
    articles: number;
    jobs: number;
    sources: number;
  };
};

export type PlagiarismCheck = {
  article_id: string;
  status: string;
  overall_similarity_score: number;
  max_source_similarity_score: number;
  matched_sources: string[];
  review_notes: string;
  checked_at: string;
};

export type ArticleRevision = {
  id: string;
  article_id: string;
  source_type: string;
  content_md: string;
  notes: string;
  created_by: string;
  created_at: string;
};

export type AdminArticleDetail = {
  article: Article;
  latest_check: PlagiarismCheck | null;
  recent_jobs: Job[];
  revisions: ArticleRevision[];
  source_pack: SourceRecord[];
  can_publish: boolean;
  publish_blockers: string[];
};

export type UpdateArticlePayload = {
  title: string;
  slug: string;
  excerpt: string;
  content_md: string;
  content_html: string;
  status: string;
  category_slug: string;
  meta_title: string;
  meta_description: string;
  cover_image_url: string;
};

export type AdminIdentity = {
  user: {
    id: string;
    email: string;
    display_name: string;
  };
  token: string;
};

const API_BASE_URL =
  process.env.BLOG_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8080";

async function fetchAPI<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ApiResponse<T>;
    if (payload.error) {
      return null;
    }

    return payload.data;
  } catch {
    return null;
  }
}

async function adminHeaders() {
  const { getAdminSession } = await import("./admin-session");
  const session = await getAdminSession();
  if (!session?.apiToken) {
    return null;
  }

  return {
    Authorization: `Bearer ${session.apiToken}`,
  };
}

async function fetchAdminAPI<T>(path: string): Promise<T | null> {
  const headers = await adminHeaders();
  if (!headers) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: 0 },
      cache: "no-store",
      headers,
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ApiResponse<T>;
    if (payload.error) {
      return null;
    }

    return payload.data;
  } catch {
    return null;
  }
}

async function mutateAPI<T>(
  path: string,
  init: RequestInit,
): Promise<APISuccess<T> | APIError> {
  const headers = await adminHeaders();
  if (!headers) {
    return {
      ok: false,
      error: "admin session is not available",
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...headers,
        ...(init.headers ?? {}),
      },
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<T>;
    if (!response.ok || payload.error) {
      return {
        ok: false,
        error: payload.error?.message ?? "request failed",
      };
    }

    return {
      ok: true,
      data: payload.data,
    };
  } catch {
    return {
      ok: false,
      error: "API request failed",
    };
  }
}

export function getAPIBaseURL() {
  return API_BASE_URL;
}

export async function mutatePublicAPI<T>(
  path: string,
  init: RequestInit,
): Promise<APISuccess<T> | APIError> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
      cache: "no-store",
    });

    const payload = (await response.json()) as ApiResponse<T>;
    if (!response.ok || payload.error) {
      return {
        ok: false,
        error: payload.error?.message ?? "request failed",
      };
    }

    return {
      ok: true,
      data: payload.data,
    };
  } catch {
    return {
      ok: false,
      error: "API request failed",
    };
  }
}

export async function getPublishedArticles() {
  return fetchAPI<Article[]>("/api/articles");
}

export async function getPublishedArticle(slug: string) {
  return fetchAPI<Article>(`/api/articles/${slug}`);
}

export async function searchPublishedArticles(query: string) {
  const search = new URLSearchParams({ q: query });
  return fetchAPI<Article[]>(`/api/search?${search.toString()}`);
}

export async function getCategories() {
  return fetchAPI<Category[]>("/api/categories");
}

export async function getCategoryArticles(slug: string) {
  return fetchAPI<Article[]>(`/api/categories/${slug}/articles`);
}

export async function getAdminOverview() {
  return fetchAdminAPI<AdminOverview>("/api/admin");
}

export async function getAdminArticles() {
  return fetchAdminAPI<Article[]>("/api/admin/articles");
}

export async function getAdminArticle(id: string) {
  return fetchAdminAPI<AdminArticleDetail>(`/api/admin/articles/${id}`);
}

export async function getAdminJobs() {
  return fetchAdminAPI<Job[]>("/api/admin/jobs");
}

export async function getAdminSources() {
  return fetchAdminAPI<Source[]>("/api/admin/sources");
}

export async function getAdminSourceRecords() {
  return fetchAdminAPI<SourceRecord[]>("/api/admin/source-records");
}

export async function getAdminTrends() {
  return fetchAdminAPI<TrendCandidate[]>("/api/admin/trends");
}

export async function loginAdmin(email: string, password: string) {
  return mutatePublicAPI<AdminIdentity>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function updateAdminArticle(
  id: string,
  payload: UpdateArticlePayload,
) {
  return mutateAPI<Article>(`/api/admin/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function enqueueGenerateDraft(id: string) {
  return mutateAPI<Job>(`/api/admin/articles/${id}/generate-draft`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function enqueuePlagiarismCheck(id: string) {
  return mutateAPI<Job>(`/api/admin/articles/${id}/plagiarism-check`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function publishAdminArticle(id: string) {
  return mutateAPI<Article>(`/api/admin/articles/${id}/publish`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function scheduleAdminArticle(id: string) {
  return mutateAPI<Article>(`/api/admin/articles/${id}/schedule`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function attachArticleSourceRecord(
  id: string,
  payload: { source_record_id: string; note: string },
) {
  return mutateAPI<{ message: string }>(
    `/api/admin/articles/${id}/source-records`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function detachArticleSourceRecord(
  articleID: string,
  sourceRecordID: string,
) {
  return mutateAPI<{ message: string }>(
    `/api/admin/articles/${articleID}/source-records/${sourceRecordID}`,
    {
      method: "DELETE",
      body: JSON.stringify({}),
    },
  );
}
