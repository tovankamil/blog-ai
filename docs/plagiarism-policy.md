# Plagiarism Policy

Dokumen ini mengatur batas operasional AI-assisted rewrite, similarity checking, dan publish gate sebelum artikel tayang.

## 1. Purpose

Tujuan plagiarism policy:
- mencegah publish konten yang terlalu mirip source luar
- menjaga kualitas editorial dan originalitas
- memberi aturan yang jelas kapan artikel boleh lanjut, direvisi, atau diblok
- menyimpan audit trail untuk review internal

## 2. Core Rule

AI boleh dipakai untuk mempercepat produksi, tetapi artikel final tidak boleh menjadi hasil parafrase tipis dari satu source.

Setiap artikel wajib lolos:
- review sumber
- similarity scan
- manual review final

## 3. Allowed AI Rewrite Modes

### `safe rewrite`
Dipakai untuk:
- merapikan draft internal
- memperjelas bahasa
- memperbaiki struktur heading
- mengubah tone ke house style

### `source synthesis`
Dipakai untuk:
- menyatukan beberapa source record
- mengubah brief menjadi draft awal
- menggabungkan referensi luar dengan insight praktis internal

### `blocked rewrite`
Tidak boleh dipakai untuk publish:
- memparafrasekan satu artikel sumber secara langsung
- mempertahankan urutan ide dan struktur source hampir utuh
- mengganti kata dengan sinonim tanpa nilai tambah nyata
- menghilangkan attribution agar asal bahan tidak terlihat

## 4. Similarity Check

Setiap artikel harus menyimpan hasil:
- `overall_similarity_score`
- `max_source_similarity_score`
- daftar source yang paling mirip
- catatan reviewer

### Default action bands

`low similarity`
- artikel boleh lanjut ke manual review

`borderline similarity`
- artikel wajib ditinjau per section
- reviewer harus menandai bagian yang perlu rewrite ulang

`high similarity`
- publish diblok
- artikel harus dirombak besar atau dibatalkan

Catatan:
- threshold angka final bisa ditentukan setelah tooling dipilih
- untuk MVP, gunakan keputusan konservatif bila tool memberi hasil meragukan

## 5. Publish Gate

Artikel tidak boleh publish bila salah satu kondisi ini terjadi:
- source utama tidak tercatat
- similarity tinggi terhadap satu source
- reviewer menilai article flow terlalu mengikuti source asli
- artikel belum memiliki nilai tambah praktis
- hasil AI masih terasa generik atau templated

Artikel boleh publish jika:
- similarity berada di zona aman
- ada perubahan struktur dan ekspresi yang nyata
- ada sintesis, penjelasan, contoh, atau insight tambahan
- reviewer menyetujui kualitas final

## 6. Review Checklist

Reviewer harus mengecek:
- apakah artikel terlalu mengikuti urutan source asli
- apakah istilah, contoh, dan framing masih terlalu dekat dengan source
- apakah artikel menambahkan pengalaman, penjelasan, atau sudut pandang baru
- apakah ada kutipan yang perlu dipersingkat atau diberi attribution jelas
- apakah artikel tetap bermanfaat bila pembaca tidak pernah membuka source asli

## 7. Tooling Expectation

Tool plagiarism atau similarity yang dipilih minimal harus bisa:
- membandingkan draft dengan source record yang tersimpan
- mengeluarkan skor total
- mengidentifikasi source yang paling mirip
- menyimpan hasil ke audit trail

Jika tool belum tersedia, fallback MVP:
- cek similarity manual terhadap source utama
- review struktur heading
- review frase yang terlihat terlalu dekat

## 8. Audit Trail

Setiap run plagiarism check minimal menyimpan:
- `article_id`
- `job_id`
- waktu pemeriksaan
- hasil similarity
- source match utama
- keputusan reviewer
- alasan approve, revise, atau reject

## 9. Escalation Rules

Artikel harus di-escalate untuk review ketat bila:
- hanya memakai satu source utama
- source adalah kompetitor langsung yang artikelnya sangat lengkap
- hasil AI terlalu cepat keluar dengan struktur yang sangat mirip
- ada potensi sengketa hak cipta atau keluhan source

## 10. Operating Defaults

Default operasional untuk MVP:
- anggap satu-source rewrite sebagai high risk
- prioritaskan source synthesis
- simpan semua source yang dipakai draft
- jangan publish artikel yang similarity-nya meragukan hanya demi cepat tayang
- jika ragu, revisi atau drop artikel
