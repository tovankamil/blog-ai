INSERT INTO categories (name, slug, description)
VALUES
    ('Go', 'go', 'Go tutorials and backend implementation notes.'),
    ('Next.js', 'nextjs', 'Next.js content engineering and SEO patterns.'),
    ('Workflow', 'workflow', 'Editorial workflow, AI ops, and publishing systems.')
ON CONFLICT (slug) DO UPDATE
SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW();

INSERT INTO authors (name, slug, bio)
VALUES
    ('MD TSK', 'mdtsk', 'Owner and editor for the programming content workflow MVP.')
ON CONFLICT (slug) DO UPDATE
SET
    name = EXCLUDED.name,
    bio = EXCLUDED.bio,
    updated_at = NOW();

INSERT INTO sources (
    domain,
    source_name,
    category,
    review_status,
    robots_status,
    terms_review_status,
    crawl_enabled,
    crawl_interval_minutes,
    last_checked_at
)
VALUES
    ('go.dev', 'Go Docs', 'go', 'approved', 'allowed', 'approved', TRUE, 360, NOW() - INTERVAL '1 day'),
    ('nextjs.org', 'Next.js Docs', 'nextjs', 'approved', 'allowed', 'approved', TRUE, 360, NOW() - INTERVAL '1 day'),
    ('react.dev', 'React Docs', 'workflow', 'approved', 'allowed', 'approved', TRUE, 720, NOW() - INTERVAL '1 day')
ON CONFLICT (domain) DO UPDATE
SET
    source_name = EXCLUDED.source_name,
    category = EXCLUDED.category,
    review_status = EXCLUDED.review_status,
    robots_status = EXCLUDED.robots_status,
    terms_review_status = EXCLUDED.terms_review_status,
    crawl_enabled = EXCLUDED.crawl_enabled,
    crawl_interval_minutes = EXCLUDED.crawl_interval_minutes,
    last_checked_at = EXCLUDED.last_checked_at,
    updated_at = NOW();

INSERT INTO articles (
    title,
    slug,
    excerpt,
    content_md,
    content_html,
    status,
    category_id,
    author_id,
    meta_title,
    meta_description,
    cover_image_url,
    published_at
)
VALUES
    (
        'Dependency Injection in Go Without a Framework',
        'dependency-injection-in-go-without-framework',
        'How to keep constructors explicit and composable in a small Go codebase.',
        '# Dependency Injection in Go

Use constructors, keep interfaces narrow, and wire dependencies at the edge.

## Why it matters

Small Go systems stay maintainable when dependencies are visible and boring.',
        '<h1>Dependency Injection in Go</h1><p>Use constructors, keep interfaces narrow, and wire dependencies at the edge.</p><h2>Why it matters</h2><p>Small Go systems stay maintainable when dependencies are visible and boring.</p>',
        'published',
        (SELECT id FROM categories WHERE slug = 'go'),
        (SELECT id FROM authors WHERE slug = 'mdtsk'),
        'Dependency Injection in Go Without a Framework',
        'A practical guide to dependency injection in Go without adding a container.',
        '',
        NOW() - INTERVAL '2 day'
    ),
    (
        'Next.js Cache Revalidation for Content Sites',
        'nextjs-cache-revalidation-for-content-sites',
        'Operational notes for getting cache invalidation right on article updates.',
        '# Cache Revalidation

Map publish events to page and listing invalidation.

## Practical rule

Invalidate detail pages, homepage rails, and relevant category listings together.',
        '<h1>Cache Revalidation</h1><p>Map publish events to page and listing invalidation.</p><h2>Practical rule</h2><p>Invalidate detail pages, homepage rails, and relevant category listings together.</p>',
        'review',
        (SELECT id FROM categories WHERE slug = 'nextjs'),
        (SELECT id FROM authors WHERE slug = 'mdtsk'),
        'Next.js Cache Revalidation for Content Sites',
        'Patterns for predictable content cache invalidation in Next.js.',
        '',
        NULL
    )
ON CONFLICT (slug) DO UPDATE
SET
    title = EXCLUDED.title,
    excerpt = EXCLUDED.excerpt,
    content_md = EXCLUDED.content_md,
    content_html = EXCLUDED.content_html,
    status = EXCLUDED.status,
    category_id = EXCLUDED.category_id,
    author_id = EXCLUDED.author_id,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    cover_image_url = EXCLUDED.cover_image_url,
    published_at = EXCLUDED.published_at,
    updated_at = NOW();

INSERT INTO source_records (
    source_id,
    url,
    title,
    excerpt,
    author_name,
    published_at,
    content_hash,
    trend_score,
    crawled_at
)
VALUES
    (
        (SELECT id FROM sources WHERE domain = 'go.dev'),
        'https://go.dev/doc/',
        'dependency injection',
        'Go docs and examples relevant to dependency wiring.',
        'Go Team',
        NOW() - INTERVAL '3 day',
        'seed-go-doc',
        92,
        NOW() - INTERVAL '1 day'
    ),
    (
        (SELECT id FROM sources WHERE domain = 'nextjs.org'),
        'https://nextjs.org/docs/app/building-your-application/caching',
        'nextjs cache revalidation',
        'Caching and revalidation guidance for app router projects.',
        'Vercel',
        NOW() - INTERVAL '2 day',
        'seed-next-cache',
        88,
        NOW() - INTERVAL '1 day'
    ),
    (
        (SELECT id FROM sources WHERE domain = 'react.dev'),
        'https://react.dev/learn/react-compiler',
        'react compiler',
        'Compiler topic relevant to front-end content planning.',
        'React Team',
        NOW() - INTERVAL '2 day',
        'seed-react-compiler',
        85,
        NOW() - INTERVAL '1 day'
    )
ON CONFLICT (url) DO UPDATE
SET
    title = EXCLUDED.title,
    excerpt = EXCLUDED.excerpt,
    author_name = EXCLUDED.author_name,
    published_at = EXCLUDED.published_at,
    content_hash = EXCLUDED.content_hash,
    trend_score = EXCLUDED.trend_score,
    crawled_at = EXCLUDED.crawled_at;

INSERT INTO plagiarism_checks (
    article_id,
    status,
    overall_similarity_score,
    max_source_similarity_score,
    matched_sources,
    review_notes,
    checked_at
)
VALUES
    (
        (SELECT id FROM articles WHERE slug = 'nextjs-cache-revalidation-for-content-sites'),
        'pass',
        0.18,
        0.11,
        '["https://nextjs.org/docs/app/building-your-application/caching"]'::jsonb,
        'Similarity still comfortably below internal threshold.',
        NOW() - INTERVAL '2 hour'
    )
ON CONFLICT DO NOTHING;

INSERT INTO content_jobs (
    article_id,
    job_type,
    status,
    payload,
    result_summary,
    error_message
)
VALUES
    (
        (SELECT id FROM articles WHERE slug = 'nextjs-cache-revalidation-for-content-sites'),
        'generate_draft',
        'queued',
        '{"article_id": "2", "mode": "source_synthesis"}'::jsonb,
        '{"message": "Awaiting worker pickup"}'::jsonb,
        ''
    ),
    (
        (SELECT id FROM articles WHERE slug = 'nextjs-cache-revalidation-for-content-sites'),
        'plagiarism_check',
        'completed',
        '{"article_id": "2"}'::jsonb,
        '{"status": "pass"}'::jsonb,
        ''
    )
ON CONFLICT DO NOTHING;
