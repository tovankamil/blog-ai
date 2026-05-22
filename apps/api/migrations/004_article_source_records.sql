CREATE TABLE IF NOT EXISTS article_source_records (
    article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    source_record_id BIGINT NOT NULL REFERENCES source_records(id) ON DELETE CASCADE,
    note TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (article_id, source_record_id)
);

CREATE INDEX IF NOT EXISTS idx_article_source_records_article_id
    ON article_source_records(article_id);

CREATE INDEX IF NOT EXISTS idx_article_source_records_source_record_id
    ON article_source_records(source_record_id);
