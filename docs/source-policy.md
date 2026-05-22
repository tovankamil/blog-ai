# Source Policy

Dokumen ini mengatur bagaimana source eksternal boleh dipakai untuk trend discovery, riset, dan AI-assisted rewrite.

## 1. Purpose

Tujuan source policy:
- menjaga workflow scraping tetap patuh
- mencegah republish konten pihak ketiga
- memastikan source hanya dipakai untuk riset dan input editorial
- mengurangi risiko pelanggaran SEO, AdSense, hak cipta, dan data pribadi

## 2. Allowed Use

Source eksternal boleh dipakai untuk:
- mendeteksi topik yang sedang tren
- mengumpulkan URL, title, published time, category, dan metadata ringan
- membuat brief editorial internal
- membantu penyusunan outline dan draft awal
- membandingkan coverage beberapa source pada topik yang sama

Source eksternal tidak boleh dipakai untuk:
- publish ulang artikel sumber
- rewrite tipis dari satu artikel sumber
- copy-paste body penuh lalu diparafrasekan
- menghapus attribution asal bahan riset
- mengambil data pribadi yang tidak relevan

## 3. Source Classification

Setiap source harus masuk salah satu status berikut:

### `approved`
- domain sudah lolos review internal
- robots path yang akan diakses diizinkan
- tidak ada larangan internal yang diketahui
- boleh dijadwalkan untuk crawl

### `restricted`
- domain bisa dipakai untuk review manual
- crawl otomatis dibatasi atau dimatikan
- hanya metadata tertentu yang boleh diambil

### `blocked`
- tidak boleh di-crawl
- tidak boleh dipakai untuk source intake otomatis

## 4. Allowlist Review

Setiap source baru harus menyimpan data minimum:
- `domain`
- `source_name`
- `category`
- `review_status`
- `robots_status`
- `crawl_enabled`
- `reviewed_by`
- `review_notes`
- `last_reviewed_at`

Checklist review source:
- apakah source relevan dengan niche programming
- apakah path target diizinkan oleh `robots.txt`
- apakah source berada di balik paywall atau login wall
- apakah source sering memuat data pribadi atau data sensitif
- apakah source punya aturan penggunaan yang membuat crawl otomatis terlalu berisiko
- apakah source cenderung menghasilkan konten yang sulit diberi nilai tambah

## 5. Crawl Rules

Crawler wajib mengikuti aturan ini:
- hormati `robots.txt`
- jangan bypass CAPTCHA, auth wall, atau proteksi teknis
- jangan crawl aggressively
- gunakan interval crawl yang konservatif
- simpan `last_crawled_at`, response status, dan error state
- batasi default extraction ke metadata dan excerpt pendek

Default field yang boleh diambil:
- URL
- title
- slug jika ada
- published time
- author name jika tersedia secara publik
- excerpt pendek
- heading atau tag topik bila tersedia

Default field yang tidak boleh jadi target utama:
- body penuh untuk republish
- data akun user
- email, nomor telepon, atau data pribadi lain yang tidak perlu

## 6. Editorial Handling

Semua hasil crawl masuk ke workflow editorial, bukan langsung ke publish.

Output scraper yang diizinkan:
- `trend candidate`
- `source record`
- `topic brief`

Output scraper yang tidak diizinkan:
- artikel final siap publish tanpa edit
- halaman yang hanya menyusun ulang source luar

Aturan editorial:
- satu artikel publish sebaiknya berbasis lebih dari satu source atau ditambah pengalaman/original analysis
- sumber utama harus tetap tercatat walau output akhir ditulis ulang
- jika artikel terlalu dekat dengan satu source, artikel harus direvisi atau dibatalkan

## 7. Compliance Basis

Dasar operasional policy ini:
- Google Search Essentials menekankan helpful, reliable, people-first content
- Google spam policies melarang scraped content yang dipublikasikan ulang tanpa nilai tambah substansial
- Google guidance untuk generative AI content memperbolehkan AI sebagai alat bantu, tetapi bukan untuk scaled low-value output
- AdSense policy menuntut kepatuhan terhadap publisher policy dan pelanggaran hak cipta dapat memengaruhi monetisasi
- di Indonesia, penggunaan materi pihak ketiga harus memperhatikan `UU No. 28 Tahun 2014 tentang Hak Cipta`
- bila crawl atau penyimpanan data menyentuh data pribadi, workflow harus memperhatikan `UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi`

## 8. Audit Trail

Setiap source record minimal menyimpan:
- URL sumber
- domain sumber
- waktu crawl
- status crawl
- hash konten ringan jika dihitung
- reviewer atau sistem yang memproses
- relasi ke artikel internal jika dipakai

Audit trail ini dipakai untuk:
- review compliance
- investigasi plagiarism
- debugging output AI rewrite

## 9. Escalation Rules

Source harus dipindah ke `restricted` atau `blocked` bila:
- robots berubah dan path target tidak lagi diizinkan
- source meminta takedown atau keberatan
- hasil source berulang kali menghasilkan similarity tinggi
- source ternyata menuntut login atau memuat data yang terlalu sensitif
- ada risiko hak cipta atau compliance yang tidak bisa dijawab cepat

## 10. Operating Defaults

Default operasional untuk MVP:
- mulai dari allowlist kecil
- crawl sedikit source, tetapi konsisten
- utamakan metadata dan snippets
- semua artikel tetap melewati plagiarism check
- bila ragu, jangan crawl dan jangan publish
