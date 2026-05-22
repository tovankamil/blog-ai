# Personal Programming Content Business Plan

Status dokumen:
- `Decided`: keputusan yang sudah dikunci dan menjadi dasar implementasi
- `Open`: butuh keputusan nanti, tetapi tidak menghalangi scaffolding awal
- `Deferred`: sengaja ditunda dari MVP

## 1. Product Summary

### Decided
- Produk ini adalah `situs konten pribadi` di niche `programming`.
- Tujuan utama 3-6 bulan pertama adalah `membangun traffic organik` dan `menciptakan aset konten evergreen`.
- Monetisasi utama fase awal adalah `ads setelah traffic stabil`.
- Workflow produksi konten adalah `AI-assisted rewrite + manual review`.
- Scope launch pertama adalah `solo MVP`, bukan platform komunitas dan bukan media besar.
- Scraping tetap dipakai, tetapi hanya dalam model `compliance-first`.

### Product statement
Bangun blog/tutorial programming pribadi yang cepat, SEO-first, mudah dikelola solo, dan cukup terstruktur untuk berkembang menjadi bisnis konten jangka panjang.

### Success criteria
- Situs publik live dengan halaman artikel, kategori, dan homepage yang SEO-ready.
- Ada workflow admin untuk membuat, mengedit, dan publish artikel dengan bantuan AI.
- Bisa publish konten secara konsisten tanpa bergantung pada operasi manual yang rumit.
- Struktur teknis cukup ringan untuk dikelola satu orang.
- Semua artikel yang publish lolos cek sumber, plagiarism gate, dan review manual.

## 2. Audience and Positioning

### Decided
- Audience utama:
  - developer pemula sampai menengah
  - pembaca yang mencari tutorial praktis
  - pencari solusi programming berbasis keyword evergreen
- Positioning:
  - fokus pada tutorial yang membantu pembaca menyelesaikan masalah
  - bukan portal news
  - bukan content farm
  - bukan tool directory di fase awal

### Content angle
- tutorial step-by-step
- error fixing / troubleshooting
- implementation guide
- best practice yang mudah dicari lewat search engine

### Deferred
- opini personal sebagai pilar utama
- tech news cepat
- halaman comparison tools sebagai produk inti

## 3. MVP Scope

### Decided
Fitur yang wajib ada untuk launch:
- homepage
- category page
- article page
- search dasar
- admin CMS sederhana
- AI-assisted drafting
- trend discovery dari scraping
- plagiarism checking sebelum publish
- publish workflow
- sitemap, metadata, dan schema SEO dasar

### Out of MVP
- user account publik
- bookmark
- read history
- comment system
- newsletter automation kompleks
- tool directory
- comparison engine
- realtime analytics kompleks
- multi-service backend

### MVP success target
- bisa publish minimal 20-30 artikel berkualitas tanpa mengubah arsitektur inti
- waktu publish artikel baru turun karena AI membantu draft awal
- semua artikel published punya metadata SEO, internal linking dasar, dan review manual
- semua artikel published punya jejak sumber dan hasil plagiarism scan yang tersimpan

## 4. Business Model

### Decided
- Monetisasi utama fase awal: `display ads`.
- Ads dipasang `setelah` traffic cukup stabil, bukan sebagai target pendapatan instan di minggu pertama.

### Follow-up monetization
- affiliate placement yang relevan dengan artikel
- digital product pribadi seperti template, cheat sheet, atau ebook

### Deferred
- sponsored post
- premium listing
- subscription content

## 5. Product Decisions

| Area | Status | Decision |
| --- | --- | --- |
| Niche | Decided | Programming |
| Content type | Decided | Tutorial evergreen |
| Monetization | Decided | Ads after traffic |
| Workflow | Decided | AI-assisted rewrite + manual review |
| Frontend | Decided | Next.js App Router |
| Backend shape | Decided | Go modular monolith |
| Go HTTP framework | Decided | Gin |
| Data access | Decided | SQLC |
| Primary DB | Decided | PostgreSQL |
| Cache / queue | Decided | Redis |
| API style | Decided | REST |
| Search MVP | Decided | PostgreSQL full-text search |
| Scraping | Decided | Untuk trend discovery dan source intake, bukan republish |
| Plagiarism check | Decided | Wajib sebelum publish |
| External search engine | Deferred | Meilisearch jika dibutuhkan nanti |
| Public auth | Deferred | Belum masuk MVP |
| Full auto republishing | Deferred | Tidak diizinkan di MVP |

## 6. Architecture

### Decided
Arsitektur awal adalah `modular monolith`, bukan microservices.

Core runtime:
- `apps/web`: Next.js untuk halaman publik dan admin UI
- `apps/api`: Go API untuk CMS, content API, AI jobs, dan cache orchestration
- PostgreSQL untuk source of truth
- Redis untuk cache dan background jobs

### Why this shape
- lebih cepat dibangun
- lebih murah dioperasikan
- lebih mudah di-debug oleh satu orang
- tetap bisa dipecah nanti jika traffic benar-benar menuntut

### Logical modules in API
- `content`
- `category`
- `tag`
- `admin`
- `sources`
- `seo`
- `search`
- `ai_jobs`
- `plagiarism`

### Deferred
- auth service terpisah
- search service terpisah
- worker fleet besar
- event bus lintas service

## 7. Content Workflow

### Decided
State artikel:
- `idea`
- `sourced`
- `draft`
- `ai_assisted`
- `plagiarism_check`
- `review`
- `scheduled`
- `published`
- `archived`

### Workflow rules
- artikel baru dimulai dari ide, input manual, atau hasil source intake dari scraper
- scraper hanya menyimpan sinyal tren, metadata sumber, kutipan pendek untuk review, dan URL sumber
- AI dipakai untuk outline, rewrite ke house style, ringkasan, dan draft awal
- mode rewrite boleh dipakai untuk mempercepat publish, tetapi hanya atas bahan kerja internal yang sudah diringkas atau disintesis lebih dulu
- rewrite dari satu artikel sumber secara langsung tidak boleh menjadi output publish final
- draft hasil AI harus berbasis sintesis multi-sumber, catatan editorial, atau pengalaman praktis, bukan rewrite tipis dari satu artikel sumber
- setiap draft wajib melewati plagiarism scan sebelum masuk review final
- artikel tidak boleh publish otomatis tanpa review manual
- publish membutuhkan:
  - slug
  - title
  - category
  - meta description
  - source list
  - hasil plagiarism check lulus
  - minimal internal link dasar
  - pengecekan kualitas manual

### Editorial quality gate
- konten harus original enough dan tidak sekadar hasil rewrite generik
- setiap artikel harus punya nilai praktis yang jelas
- jika memakai referensi luar, sumber dicatat untuk review, bukan untuk republish mentah
- artikel yang terlalu dekat dengan wording sumber harus direvisi atau dibatalkan publish

### Plagiarism gate
- sistem menyimpan skor kemiripan total dan per sumber
- artikel gagal publish bila similarity melewati threshold internal
- artikel dengan similarity borderline harus di-review manual per section
- hasil scan disimpan sebagai audit trail

### AI rewrite modes
- `safe rewrite`: merapikan draft internal, memperbaiki struktur, dan menyesuaikan tone
- `source synthesis`: menggabungkan beberapa source record menjadi brief atau draft awal
- `blocked rewrite`: menyalin satu source lalu memparafrasekannya tanpa nilai tambah substansial

## 8. Content Policy and SEO Safety

### Decided
- scraping dipakai untuk mendeteksi topik tren, mengumpulkan metadata sumber, dan membantu editorial workflow
- situs ini tidak akan mempublikasikan ulang konten pihak ketiga secara otomatis
- AI-generated text tidak publish tanpa sentuhan editorial manual
- crawler hanya boleh berjalan terhadap source yang lolos aturan robots, terms internal, dan screening editorial

### Compliance rules
- jangan scrape halaman yang melarang bot pada `robots.txt` untuk path yang ditargetkan
- jangan bypass paywall, login wall, CAPTCHA, atau proteksi akses
- jangan simpan atau olah data pribadi yang tidak diperlukan untuk editorial workflow
- jangan memublikasikan ulang artikel sumber dengan perubahan kosmetik atau parafrase tipis
- selalu simpan URL sumber, waktu crawl, dan status izin source
- gunakan AI rewrite sebagai alat bantu produksi, bukan sebagai alasan untuk menghapus attribution atau mengaburkan asal bahan riset

### Policy basis
- Google Search Essentials menekankan konten yang `helpful, reliable, people-first`
- Google spam policies melarang scraping yang bertujuan memanipulasi ranking dan republikasikan konten tanpa nilai tambah substansial
- panduan Google untuk konten generatif membolehkan AI sebagai alat bantu, tetapi memperingatkan bahwa pembuatan banyak halaman tanpa nilai tambah dapat melanggar scaled content abuse policy
- untuk monetisasi, halaman harus tetap patuh pada kebijakan AdSense dan tidak boleh berisi pelanggaran hak cipta
- untuk konteks Indonesia, workflow harus memperhatikan `UU No. 28 Tahun 2014 tentang Hak Cipta` dan `UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi`

### SEO rules
- setiap artikel pakai SSR/ISR sesuai kebutuhan halaman
- URL harus pendek dan stabil
- canonical tag wajib
- sitemap wajib
- schema `Article` wajib
- noindex untuk halaman tipis atau belum layak publish

### Open
- aturan pasti untuk update artikel lama
- checklist editorial detail per kategori
- threshold similarity final yang dipakai saat plagiarism scan

## 9. Trend Discovery and Scraping Design

### Decided
Scraping pipeline dipakai untuk:
- mengambil daftar topik dan artikel yang sedang tren
- menangkap metadata sumber untuk riset
- memasok source pack ke workflow editorial

### Source intake rules
- hanya source yang masuk allowlist internal yang boleh di-crawl terjadwal
- setiap source menyimpan:
  - domain
  - kategori
  - robots status
  - crawl frequency
  - terms review status
  - last checked at
- crawler default mengambil:
  - URL
  - title
  - published time
  - author jika tersedia
  - excerpt pendek atau snippet untuk review
  - tag atau category sumber
- full body source tidak dijadikan konten publish mentah

### Trend scoring
- skor tren dibentuk dari kombinasi:
  - frekuensi topik muncul lintas source
  - freshness
  - keyword match terhadap niche programming
  - editorial priority

### Output scraper
- `trend candidates`
- `source records`
- `draft briefs` untuk artikel baru

### Deferred
- crawling skala besar
- crawling social network kompleks
- fully automated topic-to-publish pipeline

## 10. Data Model

### Decided
Entitas minimum untuk MVP:
- `articles`
- `article_revisions`
- `categories`
- `tags`
- `article_tags`
- `authors`
- `admin_users`
- `content_jobs`
- `sources`
- `source_records`
- `plagiarism_checks`

### Suggested core fields
`articles`
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
- `published_at`
- `created_at`
- `updated_at`

`article_revisions`
- `id`
- `article_id`
- `source_type`
- `content_md`
- `created_at`

`content_jobs`
- `id`
- `article_id`
- `job_type`
- `status`
- `payload`
- `result_summary`
- `created_at`
- `updated_at`

`sources`
- `id`
- `domain`
- `source_name`
- `category`
- `robots_status`
- `terms_review_status`
- `crawl_enabled`
- `crawl_interval_minutes`
- `last_checked_at`

`source_records`
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

`plagiarism_checks`
- `id`
- `article_id`
- `status`
- `overall_similarity_score`
- `max_source_similarity_score`
- `matched_sources`
- `review_notes`
- `checked_at`

### Deferred
- `users`
- `bookmarks`
- `read_histories`
- `comments`
- `newsletter_subscribers`

## 11. API Contract Summary

### Public API
- `GET /api/articles`
  - list article published
  - support pagination, category, tag, dan search query
- `GET /api/articles/:slug`
  - detail artikel published
- `GET /api/categories`
  - list kategori
- `GET /api/categories/:slug/articles`
  - artikel published per kategori
- `GET /api/search`
  - search sederhana berbasis PostgreSQL FTS

### Admin API
- `POST /api/admin/articles`
- `PUT /api/admin/articles/:id`
- `POST /api/admin/articles/:id/generate-draft`
- `POST /api/admin/articles/:id/plagiarism-check`
- `POST /api/admin/articles/:id/publish`
- `POST /api/admin/articles/:id/schedule`
- `GET /api/admin/jobs`
- `GET /api/admin/trends`
- `POST /api/admin/sources`
- `GET /api/admin/sources`

### API conventions
- response JSON konsisten
- list endpoint memakai `page`, `page_size`, `sort`
- admin endpoint membutuhkan session auth

## 12. Redis Strategy

### Decided
Redis dipakai hanya untuk hal yang memberi value nyata di MVP:
- cache homepage
- cache article detail
- background job untuk AI drafting
- background job untuk trend crawling dan plagiarism scan
- rate limiting dasar

### Key design
- `home:latest`
- `home:featured`
- `article:{slug}`
- `search:{query}`
- `job:ai:{id}`
- `job:crawl:{id}`
- `job:plagiarism:{id}`
- `rate_limit:{ip}`

### TTL
- homepage cache: 10 menit
- article cache: 1 jam
- search cache: 15 menit
- rate limit key: 1 menit

### Invalidation
- publish article baru: invalidate homepage cache terkait
- update article: invalidate `article:{slug}` dan query cache yang relevan
- category reassignment: invalidate article dan listing category terkait

### Job handling
- gunakan queue Redis untuk generate draft AI
- gunakan queue Redis untuk crawl trend dan plagiarism scan
- retry terbatas
- job gagal tetap tercatat di PostgreSQL

### Deferred
- realtime trending engine
- view counter aggregation kompleks
- dead-letter flow yang sangat kaya

## 13. Frontend Structure

### Decided
Monorepo target:

```text
apps/
  web/
  api/
packages/
  ui/
  config/
  types/
```

### `apps/web`
- `app/`
- `components/`
- `features/articles/`
- `features/categories/`
- `features/admin/`
- `lib/`
- `styles/`

### Key pages
- `/`
- `/articles/[slug]`
- `/categories/[slug]`
- `/search`
- `/admin/articles`
- `/admin/articles/[id]`
- `/admin/trends`
- `/admin/sources`

### UI direction
- reading-first
- cepat
- bersih
- tidak berat visual
- fokus pada keterbacaan code block dan struktur heading

## 14. Backend Structure

### Decided
Struktur Go:

```text
apps/api/
  cmd/
  internal/
    admin/
    aijobs/
    article/
    category/
    plagiarism/
    platform/
    search/
    seo/
    sources/
  migrations/
  sql/
```

### Module boundaries
- `article`: entity, repository, service, public handler
- `admin`: CMS action dan auth admin
- `aijobs`: enqueue, worker, job history
- `sources`: source registry, crawl policy, trend ingestion
- `plagiarism`: similarity check, result storage, publish gate
- `platform`: config, db, redis, logging, middleware
- `seo`: metadata builder, sitemap, slug rules

## 15. Milestones

### Milestone 1: Foundation
- setup monorepo
- setup Next.js
- setup Go API
- setup PostgreSQL dan Redis
- setup basic article schema

### Milestone 2: Public Content MVP
- homepage
- article page
- category page
- public content API
- search dasar
- SEO metadata dasar

### Milestone 3: Admin Workflow
- login admin
- create/edit article
- save draft
- source registry
- trend candidate list
- publish/schedule
- revision history minimum

### Milestone 4: AI Assistance
- generate outline
- generate draft
- plagiarism check
- job history
- manual review flow

### Milestone 5: Traffic Readiness
- sitemap
- schema markup
- cache invalidation
- analytics integration
- ad slot preparation

## 16. Non-Functional Requirements

### Decided
- page load homepage target: `< 2s` pada kondisi normal
- API p95 target: `< 250ms` untuk read endpoint dengan cache hangat
- admin flow harus tetap usable walau queue AI sedang sibuk
- semua publish action harus bisa diaudit minimal dari revision dan job history
- setiap crawl dan plagiarism check harus punya audit record

### Open
- target traffic bulanan awal
- provider observability final

## 17. Risks and Mitigations

### Risk
Traffic lambat tumbuh.

### Mitigation
Fokus pada keyword evergreen dan cadence konten yang realistis.

### Risk
Konten AI terasa generik dan gagal ranking.

### Mitigation
Paksa manual review dan dorong insight praktis pada setiap artikel.

### Risk
Scraping menghasilkan konten yang terlalu mirip sumber asli atau melanggar aturan source.

### Mitigation
Batasi scraper ke metadata dan source pack, pakai allowlist, cek robots, simpan attribution, dan blok publish bila plagiarism check gagal.

### Risk
Halaman monetized melanggar kebijakan Google atau hak cipta.

### Mitigation
Terapkan compliance gate sebelum publish dan review berkala terhadap source policy, content originality, dan ad placement.

### Risk
Scope membesar terlalu cepat.

### Mitigation
Tahan semua fitur non-MVP di status `Deferred`.

### Risk
Operasi terlalu berat untuk satu orang.

### Mitigation
Pilih modular monolith, search sederhana, dan CMS minimum.

## 18. Suggested Next Artifacts

Jika dokumen ini sudah disetujui, artefak berikut yang disarankan untuk dibuat:
- `README.md` monorepo overview
- `docs/prd.md` untuk kebutuhan produk rinci
- `docs/tech-spec.md` untuk contract teknis dan dependency
- `docs/content-playbook.md` untuk workflow editorial dan checklist publish
- `docs/source-policy.md` untuk aturan allowlist, robots, dan legal review source
- `docs/plagiarism-policy.md` untuk threshold, workflow review, dan alasan blok publish
- `docs/keyword-roadmap.md` untuk rencana topik awal

## 19. Implementation Order

Urutan kerja yang disarankan:
1. scaffold monorepo `apps/web` dan `apps/api`
2. buat schema database dasar
3. bangun source registry dan trend crawler compliance-first
4. bangun public article flow
5. bangun admin CMS minimum
6. tambahkan AI drafting dan plagiarism check job
7. tambahkan SEO hardening dan persiapan ads
