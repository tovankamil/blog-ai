INSERT INTO article_source_records (article_id, source_record_id, note)
VALUES
    (
        (SELECT id FROM articles WHERE slug = 'dependency-injection-in-go-without-framework'),
        (SELECT id FROM source_records WHERE url = 'https://go.dev/doc/'),
        'Primary official reference for Go dependency wiring concepts.'
    ),
    (
        (SELECT id FROM articles WHERE slug = 'nextjs-cache-revalidation-for-content-sites'),
        (SELECT id FROM source_records WHERE url = 'https://nextjs.org/docs/app/building-your-application/caching'),
        'Primary caching reference for the current article draft.'
    ),
    (
        (SELECT id FROM articles WHERE slug = 'nextjs-cache-revalidation-for-content-sites'),
        (SELECT id FROM source_records WHERE url = 'https://react.dev/learn/react-compiler'),
        'Supplementary trend signal kept in the source pack for future follow-up.'
    )
ON CONFLICT (article_id, source_record_id) DO UPDATE
SET
    note = EXCLUDED.note;
