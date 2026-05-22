INSERT INTO article_revisions (article_id, source_type, content_md, notes)
SELECT
    a.id,
    'manual',
    a.content_md,
    'seeded initial revision'
FROM articles a
WHERE NOT EXISTS (
    SELECT 1
    FROM article_revisions ar
    WHERE ar.article_id = a.id
);
