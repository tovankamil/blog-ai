CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS authors (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    bio TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL DEFAULT '',
    content_md TEXT NOT NULL DEFAULT '',
    content_html TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL,
    category_id BIGINT REFERENCES categories(id),
    author_id BIGINT REFERENCES authors(id),
    meta_title TEXT NOT NULL DEFAULT '',
    meta_description TEXT NOT NULL DEFAULT '',
    cover_image_url TEXT NOT NULL DEFAULT '',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);

CREATE TABLE IF NOT EXISTS article_revisions (
    id BIGSERIAL PRIMARY KEY,
    article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL DEFAULT 'manual',
    content_md TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    created_by BIGINT REFERENCES admin_users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tags (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS article_tags (
    article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE IF NOT EXISTS sources (
    id BIGSERIAL PRIMARY KEY,
    domain TEXT NOT NULL UNIQUE,
    source_name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    review_status TEXT NOT NULL DEFAULT 'restricted',
    robots_status TEXT NOT NULL DEFAULT 'unknown',
    terms_review_status TEXT NOT NULL DEFAULT 'pending',
    crawl_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    crawl_interval_minutes INTEGER NOT NULL DEFAULT 360,
    last_checked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sources_review_status ON sources(review_status);
CREATE INDEX IF NOT EXISTS idx_sources_crawl_enabled ON sources(crawl_enabled);

CREATE TABLE IF NOT EXISTS source_records (
    id BIGSERIAL PRIMARY KEY,
    source_id BIGINT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    url TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL DEFAULT '',
    author_name TEXT NOT NULL DEFAULT '',
    published_at TIMESTAMPTZ,
    content_hash TEXT NOT NULL DEFAULT '',
    trend_score NUMERIC(10, 2) NOT NULL DEFAULT 0,
    crawled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_source_records_source_id ON source_records(source_id);
CREATE INDEX IF NOT EXISTS idx_source_records_trend_score ON source_records(trend_score);
CREATE INDEX IF NOT EXISTS idx_source_records_published_at ON source_records(published_at);

CREATE TABLE IF NOT EXISTS content_jobs (
    id BIGSERIAL PRIMARY KEY,
    article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE,
    job_type TEXT NOT NULL,
    status TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::JSONB,
    result_summary JSONB NOT NULL DEFAULT '{}'::JSONB,
    error_message TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_jobs_article_id ON content_jobs(article_id);
CREATE INDEX IF NOT EXISTS idx_content_jobs_job_type ON content_jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_content_jobs_status ON content_jobs(status);

CREATE TABLE IF NOT EXISTS plagiarism_checks (
    id BIGSERIAL PRIMARY KEY,
    article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    overall_similarity_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
    max_source_similarity_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
    matched_sources JSONB NOT NULL DEFAULT '[]'::JSONB,
    review_notes TEXT NOT NULL DEFAULT '',
    checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plagiarism_checks_article_id ON plagiarism_checks(article_id);
CREATE INDEX IF NOT EXISTS idx_plagiarism_checks_status ON plagiarism_checks(status);

