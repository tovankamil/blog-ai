# Handoff

## Summary

Repo ini sekarang sudah bergerak dari scaffold statis menjadi MVP yang punya:

- `apps/api` berbasis Go + Gin + PostgreSQL
- `apps/web` berbasis Next.js App Router
- public content pages yang membaca API nyata
- admin workflow dasar untuk article editing
- source pack management
- revision history
- job enqueue untuk `generate-draft` dan `plagiarism-check`
- login admin berbasis session web + backend bearer token

## What Is Done

### Monorepo and Runtime

- Struktur monorepo `apps/web`, `apps/api`, `packages/*` sudah siap.
- `apps/api` sudah bisa start dengan config dari root `.env`.
- `apps/web` sudah build dan membaca env dari `apps/web/.env.local`.

### Database and Seed

Migrasi yang sudah ada:

- [apps/api/migrations/001_init.sql](/D:/TFN/practice/golang/Blog/apps/api/migrations/001_init.sql)
- [apps/api/migrations/002_seed_mvp.sql](/D:/TFN/practice/golang/Blog/apps/api/migrations/002_seed_mvp.sql)
- [apps/api/migrations/003_seed_revisions.sql](/D:/TFN/practice/golang/Blog/apps/api/migrations/003_seed_revisions.sql)
- [apps/api/migrations/004_article_source_records.sql](/D:/TFN/practice/golang/Blog/apps/api/migrations/004_article_source_records.sql)
- [apps/api/migrations/005_seed_article_source_records.sql](/D:/TFN/practice/golang/Blog/apps/api/migrations/005_seed_article_source_records.sql)
- [apps/api/migrations/006_seed_admin_user.sql](/D:/TFN/practice/golang/Blog/apps/api/migrations/006_seed_admin_user.sql)

Data lokal yang sudah diseed:

- categories
- authors
- admin user
- sources
- source records
- articles
- article revisions
- plagiarism checks
- content jobs
- article-to-source-record links

### API

Backend store saat ini masih terpusat di:

- [apps/api/internal/store/store.go](/D:/TFN/practice/golang/Blog/apps/api/internal/store/store.go)

Public API yang sudah jalan:

- `GET /api/articles`
- `GET /api/articles/:slug`
- `GET /api/categories`
- `GET /api/categories/:slug/articles`
- `GET /api/search`

Admin API yang sudah jalan:

- `POST /api/admin/login`
- `GET /api/admin`
- `GET /api/admin/articles`
- `GET /api/admin/articles/:id`
- `POST /api/admin/articles`
- `PUT /api/admin/articles/:id`
- `POST /api/admin/articles/:id/source-records`
- `DELETE /api/admin/articles/:id/source-records/:sourceRecordID`
- `POST /api/admin/articles/:id/generate-draft`
- `POST /api/admin/articles/:id/plagiarism-check`
- `POST /api/admin/articles/:id/publish`
- `POST /api/admin/articles/:id/schedule`
- `GET /api/admin/jobs`
- `GET /api/admin/trends`
- `GET /api/admin/sources`
- `GET /api/admin/source-records`
- `POST /api/admin/sources`
- `PUT /api/admin/sources/:id`

### Admin Auth

Auth sekarang memakai dua lapis:

1. `POST /api/admin/login` memverifikasi `admin_users.password_hash` dengan bcrypt.
2. Backend mengeluarkan bearer token bertanda tangan HMAC.
3. `apps/web` menyimpan token itu di cookie session yang juga ditandatangani.
4. Request admin server-side mengirim `Authorization: Bearer <token>`.
5. Semua endpoint `/api/admin` ditolak bila bearer token tidak valid.

File penting:

- [apps/api/internal/platform/adminsession/session.go](/D:/TFN/practice/golang/Blog/apps/api/internal/platform/adminsession/session.go)
- [apps/api/internal/platform/http/admin_auth.go](/D:/TFN/practice/golang/Blog/apps/api/internal/platform/http/admin_auth.go)
- [apps/web/lib/admin-session.ts](/D:/TFN/practice/golang/Blog/apps/web/lib/admin-session.ts)

### Web

Public pages yang sudah membaca API:

- homepage
- article detail
- category page
- search page

Admin pages yang sudah aktif:

- overview
- article list
- article detail/editor
- source registry
- trend list

Admin article detail sekarang sudah punya:

- article metadata panel
- publish gate status
- plagiarism check summary
- full article edit form
- workflow action buttons
- source pack attach/detach
- revision history
- recent jobs table

File penting:

- [apps/web/lib/api.ts](/D:/TFN/practice/golang/Blog/apps/web/lib/api.ts)
- [apps/web/app/admin/articles/[id]/page.tsx](/D:/TFN/practice/golang/Blog/apps/web/app/admin/articles/[id]/page.tsx)
- [apps/web/app/admin/articles/[id]/actions.ts](/D:/TFN/practice/golang/Blog/apps/web/app/admin/articles/[id]/actions.ts)
- [apps/web/app/admin/articles/[id]/source-pack-actions.ts](/D:/TFN/practice/golang/Blog/apps/web/app/admin/articles/[id]/source-pack-actions.ts)
- [apps/web/app/login/page.tsx](/D:/TFN/practice/golang/Blog/apps/web/app/login/page.tsx)

### Source Pack and Jobs

Source pack sekarang adalah relasi eksplisit antara article dan source record.

Job enqueue sekarang tidak hardcoded lagi:

- `generate-draft` otomatis membaca `source_record_ids` dari source pack
- `plagiarism-check` otomatis membaca `source_record_ids` dari source pack
- `plagiarism-check` juga membaca `revision_id` terbaru

### Revision History

Setiap:

- create article
- update article

akan membuat row baru di `article_revisions`.

### Verification Done

Terakhir diverifikasi:

- `go test ./...` di `apps/api` lolos
- `npm.cmd run build --workspace apps/web` lolos

## Current Local Environment

### Backend Env

Root `.env` saat ini dipakai untuk:

- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`
- `ADMIN_SESSION_SECRET`

### Web Env

`apps/web/.env.local` saat ini dipakai untuk:

- `BLOG_API_BASE_URL`
- `BLOG_ADMIN_SESSION_SECRET`

### Local Admin Login

Seed admin lokal:

- email: `admin@local.dev`
- password: `admin12345`

Ini hanya untuk local development. Jangan dipakai di environment nyata.

## Important Constraints

- Banyak logic backend masih terkonsentrasi di `store.go`.
- Auth web sudah cukup untuk local/internal admin flow, tapi belum production-grade.
- Bearer token backend masih stateless HMAC, belum ada refresh, revocation, atau session table.
- Admin actions belum mencatat `admin_user_id` ke audit trail.
- Worker nyata untuk AI drafting dan plagiarism check belum ada; saat ini baru enqueue job row.

## What Is Next

### Highest Priority

1. Tambahkan `GET /api/admin/me`
2. Propagasikan `admin_user_id` dari bearer claims ke action write
3. Simpan actor itu ke:
   - `article_revisions.created_by`
   - publish audit
   - source attach/detach audit
   - job creation context

### Backend Cleanup

1. Pecah [apps/api/internal/store/store.go](/D:/TFN/practice/golang/Blog/apps/api/internal/store/store.go) menjadi repository/service per modul
2. Pisahkan domain:
   - article
   - admin
   - sources
   - jobs
   - auth
3. Tambahkan test unit dan integration test untuk:
   - login
   - article update
   - source pack attach/detach
   - publish gate
   - job payload generation

### Auth Hardening

1. Tambahkan refresh / sliding expiry untuk admin session
2. Tambahkan logout invalidation strategy jika nanti token tidak lagi stateless
3. Pertimbangkan session persistence atau JWT-style versioning
4. Jangan lagi menyimpan kredensial default di seed untuk environment non-local

### Editorial Workflow

1. Tambahkan source pack picker yang lebih baik:
   - search
   - filter by domain
   - filter by trend score
2. Tampilkan plagiarism check detail per source
3. Tampilkan revision diff, bukan hanya list revision
4. Tambahkan article creation UI di admin

### Worker and Jobs

1. Implement `cmd/worker` sungguhan
2. Sambungkan Redis queue jika masih sesuai keputusan arsitektur
3. Eksekusi nyata untuk:
   - `generate_draft`
   - `plagiarism_check`
4. Update `content_jobs.result_summary` dari hasil worker, bukan placeholder saja

### Source and Trend Workflow

1. Tambahkan UI create/update source
2. Tambahkan source record browser yang lebih eksplisit
3. Tambahkan flow dari trend candidate ke attach source pack

## Recommended Next Slice

Kalau lanjut langsung dari sini, urutan paling masuk akal:

1. `GET /api/admin/me`
2. actor propagation ke revision/job/source-pack writes
3. article creation UI
4. worker implementation untuk `generate_draft`

## Quick Start

### API

Jalankan dari `apps/api`:

```powershell
go run .\cmd\server
```

### Web

Jalankan dari root repo:

```powershell
npm.cmd run dev:web
```

Lalu buka `/login` dan masuk dengan kredensial local seed.
