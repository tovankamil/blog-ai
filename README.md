# Blog Monorepo

Monorepo awal untuk produk konten pribadi niche programming.
codex resume 019e4bff-c20d-7b73-a750-150622138f32
## Apps

- `apps/web`: Next.js public site dan admin UI
- `apps/api`: Go API untuk content workflow, sources, AI jobs, dan publish gate

## Docs

- `planning.md`
- `docs/tech-spec.md`
- `docs/source-policy.md`
- `docs/plagiarism-policy.md`
- `docs/content-playbook.md`

## Backend Bootstrap

- API membaca konfigurasi database dari file root `.env`
- Prioritas koneksi database:
  1. `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
  2. fallback ke `DB_CONNECTION_STRING`
- Semua endpoint `/api/admin` sekarang membutuhkan `Authorization: Bearer <token>`
- Backend mengeluarkan bearer token dari `POST /api/admin/login`
- Backend menandatangani token admin dengan `ADMIN_SESSION_SECRET`
- Halaman admin web sekarang dilindungi cookie session yang ditandatangani dengan `BLOG_ADMIN_SESSION_SECRET`
- Login API publik: `POST /api/admin/login`
- Kredensial lokal seed:
  - email: `admin@local.dev`
  - password: `admin12345`
- Migrasi schema: `apps/api/migrations/001_init.sql`
- Seed data MVP: `apps/api/migrations/002_seed_mvp.sql`

## Current Status

- `apps/api` sudah terhubung ke PostgreSQL
- public dan admin handler sudah membaca data dari database, bukan response hardcoded
- database lokal `local_db_blog` sudah berisi seed minimum untuk categories, sources, articles, source records, plagiarism checks, dan jobs

## Next Step

1. install dependency frontend
2. hubungkan `apps/web` ke endpoint API yang sekarang sudah backed by PostgreSQL
3. pecah `apps/api` ke repository/service per module agar logic tidak menumpuk di store
4. tambahkan auth admin, worker queue, dan test coverage
