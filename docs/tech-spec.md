# Tech Spec

Dokumen ini adalah spesifikasi teknis awal untuk MVP produk konten pribadi di niche programming.

Dokumen ini mengikuti keputusan yang sudah ada di:
- `planning.md`
- `docs/source-policy.md`
- `docs/plagiarism-policy.md`
- `docs/content-playbook.md`

## 1. System Overview

MVP dibangun sebagai `modular monolith` dengan dua aplikasi utama:
- `apps/web`: Next.js App Router untuk public site dan admin UI
- `apps/api`: Go API untuk content management, source intake, AI jobs, dan publish workflow

Storage layer:
- PostgreSQL untuk data utama
- Redis untuk cache dan background jobs

Scope teknis MVP:
- public content rendering
- admin article workflow
- source registry
- trend intake
- AI-assisted rewrite jobs
- plagiarism check jobs

## 2. Monorepo Layout

Target struktur awal:

```text
apps/
  web/
  api/
packages/
  types/
  ui/
  config/
docs/
```

### `apps/web`

Target folder:

```text
apps/web/
  app/
    (public)/
    admin/
    api/
  components/
  features/
    articles/
    categories/
    admin/
    sources/
  lib/
  styles/
  types/
```

### `apps/api`

Target folder:

```text
apps/api/
  cmd/
    server/
    worker/
  internal/
    admin/
    aijobs/
    article/
    auth/
    category/
    plagiarism/
    platform/
    search/
    seo/
    sources/
  migrations/
  sql/
```

## 3. Core Modules

### `article`

Tanggung jawab:
- create, update, publish, schedule article
- fetch article list dan detail untuk public API
- manage article status
- persist metadata SEO

Objek utama:
- article entity
- article revision entity
- article repository
- article service
- public handler
- admin handler

### `sources`

Tanggung jawab:
- manage source registry
- source allowlist review state
- trend intake result
- source record storage

Objek utama:
- source entity
- source record entity
- source policy service
- crawler intake service

### `aijobs`

Tanggung jawab:
- enqueue draft generation
- enqueue rewrite job
- simpan job history
- simpan ringkasan hasil AI

### `plagiarism`

Tanggung jawab:
- menjalankan similarity check
- menyimpan hasil similarity
- blok publish bila article belum lolos gate

### `search`

Tanggung jawab:
- query PostgreSQL full-text search
- expose endpoint search publik

### `seo`

Tanggung jawab:
- canonical helper
- metadata helper
- sitemap data feed

### `auth`

Scope MVP:
- admin session auth saja
- tidak ada public user auth

## 4. Domain Model

### Article

Status yang dipakai:
- `idea`
- `sourced`
- `draft`
- `ai_assisted`
- `plagiarism_check`
- `review`
- `scheduled`
- `published`
- `archived`

Fields minimum:
- `id`
- `title`
- `slug`
- `excerpt`
- `content_md`
- `content_html`
- `status`
- `category_id`
- `author_id`
- `meta_title`
- `meta_description`
- `cover_image_url`
- `published_at`
- `created_at`
- `updated_at`

### Article Revision

Fields minimum:
- `id`
- `article_id`
- `source_type`
- `content_md`
- `notes`
- `created_by`
- `created_at`

### Category

Fields minimum:
- `id`
- `name`
- `slug`
- `description`
- `created_at`
- `updated_at`

### Tag

Fields minimum:
- `id`
- `name`
- `slug`

### Source

Fields minimum:
- `id`
- `domain`
- `source_name`
- `category`
- `review_status`
- `robots_status`
- `terms_review_status`
- `crawl_enabled`
- `crawl_interval_minutes`
- `last_checked_at`
- `created_at`
- `updated_at`

### Source Record

Fields minimum:
- `id`
- `source_id`
- `url`
- `title`
- `excerpt`
- `author_name`
- `published_at`
- `content_hash`
- `trend_score`
- `crawled_at`
- `created_at`

### Content Job

Job type minimum:
- `crawl_trend`
- `generate_outline`
- `generate_draft`
- `rewrite_draft`
- `plagiarism_check`

Status minimum:
- `queued`
- `processing`
- `completed`
- `failed`
- `cancelled`

Fields minimum:
- `id`
- `article_id`
- `job_type`
- `status`
- `payload`
- `result_summary`
- `error_message`
- `created_at`
- `updated_at`

### Plagiarism Check

Fields minimum:
- `id`
- `article_id`
- `status`
- `overall_similarity_score`
- `max_source_similarity_score`
- `matched_sources`
- `review_notes`
- `checked_at`
- `created_at`

## 5. Database Tables

Tabel minimum MVP:
- `articles`
- `article_revisions`
- `categories`
- `tags`
- `article_tags`
- `authors`
- `admin_users`
- `sources`
- `source_records`
- `content_jobs`
- `plagiarism_checks`

### Suggested constraints

`articles`
- unique `slug`
- index `status`
- index `published_at`
- index `category_id`

`categories`
- unique `slug`
- unique `name`

`tags`
- unique `slug`

`sources`
- unique `domain`
- index `review_status`
- index `crawl_enabled`

`source_records`
- unique `url`
- index `source_id`
- index `trend_score`
- index `published_at`

`content_jobs`
- index `article_id`
- index `job_type`
- index `status`

`plagiarism_checks`
- index `article_id`
- index `status`

## 6. API Design

Base path:
- public API: `/api`
- admin API: `/api/admin`

Response shape standar:

```json
{
  "data": {},
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 0
  },
  "error": null
}
```

Error shape standar:

```json
{
  "data": null,
  "meta": null,
  "error": {
    "code": "validation_error",
    "message": "invalid request"
  }
}
```

### Public endpoints

`GET /api/articles`
- query:
  - `page`
  - `page_size`
  - `category`
  - `tag`
  - `q`
  - `sort`
- hanya mengembalikan article `published`

`GET /api/articles/:slug`
- return full article detail
- hanya article `published`

`GET /api/categories`
- return category list

`GET /api/categories/:slug/articles`
- return published articles per category

`GET /api/search`
- query:
  - `q`
  - `page`
  - `page_size`

### Admin endpoints

`POST /api/admin/articles`
- buat article baru

`PUT /api/admin/articles/:id`
- update konten article

`GET /api/admin/articles`
- list semua article lintas status

`POST /api/admin/articles/:id/generate-draft`
- enqueue AI draft job

`POST /api/admin/articles/:id/plagiarism-check`
- enqueue plagiarism check

`POST /api/admin/articles/:id/publish`
- publish article jika gate lolos

`POST /api/admin/articles/:id/schedule`
- schedule article

`GET /api/admin/jobs`
- list job queue dan hasil

`GET /api/admin/trends`
- list trend candidates dari source records

`POST /api/admin/sources`
- tambah source ke registry

`GET /api/admin/sources`
- list source

`PUT /api/admin/sources/:id`
- update status source

## 7. Job Payloads

Payload disimpan sebagai JSON di `content_jobs.payload`.

### `crawl_trend`

```json
{
  "source_id": 12,
  "crawl_mode": "metadata_only",
  "limit": 20
}
```

### `generate_draft`

```json
{
  "article_id": 45,
  "mode": "source_synthesis",
  "source_record_ids": [101, 102],
  "brief": {
    "target_keyword": "golang dependency injection",
    "angle": "practical tutorial"
  }
}
```

### `rewrite_draft`

```json
{
  "article_id": 45,
  "mode": "safe_rewrite",
  "revision_id": 88
}
```

### `plagiarism_check`

```json
{
  "article_id": 45,
  "revision_id": 88,
  "source_record_ids": [101, 102, 103]
}
```

## 8. Publish Gate Logic

Artikel hanya bisa publish jika:
- status saat ini valid untuk publish
- title, slug, category, meta description tersedia
- source list tersedia
- plagiarism check terbaru berstatus lulus
- admin reviewer menyetujui

Artikel harus ditolak publish jika:
- source tidak tercatat
- plagiarism result belum ada
- status similarity tinggi
- article masih draft kosong atau terlalu tipis

## 9. Search Strategy

Search MVP memakai PostgreSQL full-text search.

Approach:
- simpan `tsvector` dari title + excerpt + content text
- lakukan ranking sederhana
- query search hanya terhadap article `published`

Future extension:
- jika relevansi dan performa mulai kurang, pindahkan ke Meilisearch

## 10. Cache Strategy

Redis key minimum:
- `home:latest`
- `home:featured`
- `article:{slug}`
- `search:{query}`
- `job:ai:{id}`
- `job:crawl:{id}`
- `job:plagiarism:{id}`
- `rate_limit:{ip}`

TTL default:
- homepage cache: 10 menit
- article cache: 1 jam
- search cache: 15 menit
- rate limit: 1 menit

Invalidation:
- publish baru: invalidate homepage dan category cache
- article update: invalidate detail page cache
- category change: invalidate article cache dan category listing

## 11. Admin UI Scope

Halaman admin minimum:
- article list
- article editor
- trend candidate list
- source registry list
- job status list

Kemampuan minimum:
- create/edit article
- save draft
- trigger AI draft
- trigger plagiarism check
- review hasil job
- publish/schedule

## 12. Security and Compliance Defaults

Default teknis:
- admin endpoint wajib auth
- log action minimum untuk publish dan source update
- jangan simpan data pribadi source di luar kebutuhan editorial
- source `blocked` tidak boleh ikut scheduler
- publish action gagal jika compliance gate tidak lengkap

## 13. Observability

Minimum observability:
- request log untuk API
- job execution log
- crawl success/failure log
- publish audit log
- plagiarism decision log

Metric minimum yang layak ditambahkan nanti:
- job success rate
- crawl failure rate
- article publish throughput
- cache hit rate

## 14. Open Decisions

Masih boleh diputuskan saat implementasi:
- library session auth admin
- editor UI final di admin
- provider LLM final
- tool similarity checker final
- analytics provider final

## 15. Build Order

Urutan implementasi teknis:
1. scaffold monorepo
2. buat migrasi tabel inti
3. implement `article`, `category`, `sources` repository dan service
4. implement public read API
5. implement admin article CRUD
6. implement source registry dan trend list
7. implement AI draft job
8. implement plagiarism check job
9. implement publish gate
10. implement cache invalidation dan SEO helper
