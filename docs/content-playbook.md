# Content Playbook

Dokumen ini adalah SOP operasional harian untuk produksi konten pada produk pribadi Anda.

Tujuannya:
- menjaga ritme publish tetap cepat
- memakai scraping dan AI rewrite secara aman
- menjaga kualitas SEO dan kepatuhan monetisasi
- membuat workflow cukup ringan untuk dijalankan satu orang

## 1. Publishing Principles

Prinsip kerja utama:
- publish cepat boleh, publish ceroboh tidak boleh
- scraping dipakai untuk menemukan peluang, bukan menyalin output
- AI dipakai untuk mempercepat drafting dan rewrite, bukan mengganti judgment editorial
- semua artikel harus memberi nilai tambah yang nyata
- jika artikel terasa terlalu dekat dengan source, artikel harus direvisi atau dibatalkan

## 2. Daily Workflow

Urutan kerja harian:
1. ambil kandidat topik dari trend crawler dan daftar ide internal
2. pilih topik yang paling layak untuk niche programming
3. kumpulkan source record dan buat brief
4. tulis atau generate draft dengan AI
5. lakukan rewrite manual dan tambahkan nilai tambah
6. jalankan plagiarism check
7. lakukan SEO review dan final editorial review
8. publish atau schedule
9. catat hasil dan peluang update artikel

## 3. Topic Selection

Prioritas topik:
- keyword evergreen dengan intent jelas
- problem solving yang sering dicari
- tutorial implementasi
- troubleshooting untuk stack atau tools populer

Topik sebaiknya dihindari untuk MVP:
- berita yang cepat basi
- topik sangat luas tanpa sudut praktis
- keyword yang hanya bisa diisi dengan konten tipis
- topik yang terlalu bergantung pada satu source luar

Checklist pilih topik:
- apakah pembaca tahu apa yang akan mereka dapat
- apakah ada intent pencarian yang jelas
- apakah topik bisa diberi sudut praktis
- apakah topik bisa ditulis lebih baik atau lebih jelas dari source yang ada
- apakah Anda punya minimal 2 source atau tambahan insight sendiri

## 4. Source Intake Workflow

Langkah source intake:
1. cek apakah domain source ada di allowlist
2. cek status source: `approved`, `restricted`, atau `blocked`
3. ambil metadata dan snippets yang diizinkan
4. simpan source record
5. kelompokkan source berdasarkan topik

Aturan kerja:
- jangan crawl source `blocked`
- source `restricted` hanya dipakai untuk review manual
- jika robots atau kebijakan source meragukan, hentikan intake
- satu topik idealnya tidak hanya bergantung pada satu source

Output source intake:
- `trend candidate`
- `source pack`
- `topic brief`

## 5. Brief Creation

Setiap artikel harus punya brief singkat sebelum drafting.

Isi minimum brief:
- working title
- target keyword
- audience intent
- masalah yang ingin diselesaikan
- poin utama artikel
- daftar source yang dipakai
- insight atau contoh yang ingin ditambahkan

Tujuan brief:
- mencegah AI langsung meniru source
- memastikan ada arah editorial sebelum drafting
- memaksa nilai tambah dipikirkan lebih awal

## 6. AI Drafting and Rewrite

AI boleh dipakai pada tahap berikut:
- membuat outline
- mengubah brief menjadi draft awal
- rewrite draft internal ke gaya yang lebih rapi
- merapikan kalimat, transisi, dan struktur section
- membuat variasi title dan meta description

AI tidak boleh dipakai untuk:
- menyalin satu artikel sumber lalu memparafrasekannya
- menghasilkan artikel final tanpa review manusia
- menghapus attribution atau jejak source

Mode penggunaan:

### `outline mode`
Dipakai saat topik sudah jelas, tetapi struktur belum rapi.

### `draft mode`
Dipakai untuk membuat draft awal dari brief dan source pack.

### `rewrite mode`
Dipakai untuk memperbaiki draft internal agar lebih enak dibaca.

### `blocked mode`
Tidak boleh:
- tempel satu artikel kompetitor
- minta AI rewrite penuh
- publish hasilnya dengan sedikit edit

## 7. Human Value Add

Setelah AI drafting, tambahkan nilai tambah manusia:
- contoh implementasi
- penyederhanaan konsep
- langkah praktis
- warning atau pitfall
- perbandingan pendek bila relevan
- ringkasan keputusan teknis

Pertanyaan kontrol:
- apa yang pembaca dapat di sini yang tidak mereka dapat dari source asli
- apakah artikel ini membantu menyelesaikan masalah lebih cepat
- apakah artikel ini menunjukkan pemahaman, bukan sekadar parafrase

## 8. Plagiarism Review

Sebelum publish:
1. jalankan similarity check
2. lihat source dengan kemiripan tertinggi
3. review ulang section yang paling mirip
4. rewrite ulang bagian yang terlalu dekat
5. putuskan `approve`, `revise`, atau `reject`

Red flags:
- struktur heading sangat mirip source utama
- contoh, urutan ide, dan frasa kunci terlalu dekat
- AI menghasilkan draft terlalu cepat dan terlalu rapi dari satu source
- tidak ada insight baru

Default decision:
- similarity aman: lanjut review akhir
- similarity borderline: revisi section bermasalah
- similarity tinggi: blok publish

## 9. SEO Review

Checklist SEO minimum:
- title jelas dan tidak clickbait berlebihan
- slug pendek
- meta description ada
- heading rapi
- keyword utama muncul natural
- internal link dasar ada
- schema `Article` siap
- canonical benar

Checklist kualitas halaman:
- intro menjawab intent pembaca
- artikel tidak berputar-putar
- code block jika relevan mudah dibaca
- CTA atau ad placement tidak mengganggu

## 10. Publish Decision

Artikel boleh publish jika:
- brief jelas
- source tercatat
- plagiarism review lulus
- nilai tambah editorial ada
- metadata SEO lengkap

Artikel harus ditunda jika:
- masih terlalu mirip source
- topik belum tajam
- draft masih generik
- source compliance belum jelas

Artikel harus dibatalkan jika:
- source utamanya bermasalah
- value add tidak cukup
- similarity tetap tinggi setelah revisi

## 11. Post-Publish Workflow

Setelah publish:
1. cek tampilan halaman
2. cek metadata dan structured data
3. catat artikel ke daftar tracking
4. pantau performa awal
5. tandai peluang update jika topik berkembang

Yang perlu dicatat:
- tanggal publish
- keyword utama
- kategori
- source pack
- hasil plagiarism review
- catatan update

## 12. Weekly Routine

Rutinitas mingguan yang disarankan:
- review topik performa terbaik
- review artikel yang perlu diupdate
- tambah atau kurangi source allowlist
- audit artikel yang paling rawan similarity
- siapkan batch brief untuk minggu berikutnya

## 13. Suggested Cadence

Cadence awal yang realistis untuk solo operator:
- 3-5 brief per minggu
- 2-3 artikel publish per minggu
- 1 sesi review source policy per minggu
- 1 sesi update artikel lama per minggu

Fokus awal:
- konsistensi lebih penting daripada volume besar
- kualitas lebih penting daripada publish harian dengan artikel tipis

## 14. Minimum Tooling

Tooling minimum yang dibutuhkan workflow ini:
- source registry
- trend crawler sederhana
- article editor
- AI drafting job
- plagiarism or similarity checker
- publish and schedule control

Jika tooling belum lengkap, fallback manual masih bisa dipakai selama:
- source dicatat
- brief dibuat
- review similarity dilakukan manual
- keputusan publish tetap konservatif

## 15. Escalation Rules

Stop dan review lebih dalam jika:
- source meminta takedown
- ada dugaan pelanggaran hak cipta
- artikel kena similarity tinggi berulang kali
- AI output makin mirip kompetitor
- Anda mulai tergoda publish artikel tanpa brief dan review

Default tindakan saat ragu:
- jangan publish
- revisi brief
- ganti angle
- tambah insight asli
