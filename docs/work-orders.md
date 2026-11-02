# Work Orders: Notes App

Prioritas pengerjaan: WO-1 sampai WO-5 secara berurutan. Setiap work order selesai jika gate-nya lulus tanpa mengubah file di `tests/`.

---

## WO-1 — Storage catatan

**Tujuan**

Menyediakan lapisan penyimpanan lokal berbasis `localStorage` yang menjadi satu-satunya sumber data catatan. Lapisan ini harus bisa dipakai oleh layar daftar, editor, dan pencarian tanpa logika penyimpanan tersebar di komponen lain.

**Yang dibuat/diubah**

- Dibuat: `src/storage.js` (atau `src/store.js`)
  - Ekspor `createStore()` dengan fungsi:
    - `list()` — mengembalikan seluruh catatan tersimpan.
    - `save(note)` — menambah catatan baru atau memperbarui catatan yang sudah ada.
    - `remove(id)` — menghapus catatan berdasarkan id.
    - `search(query)` — mengembalikan catatan yang cocok dengan query pada judul atau isi.
  - Skema data catatan minimal: `{ id, title, body }`.
  - Data tersimpan di `localStorage` dengan satu key yang konsisten dan didokumentasikan di komentar/README.
  - Perilaku tepi yang ditentukan sendiri oleh agent dan konsisten: judul/isi kosong, query kosong, `remove` untuk id yang tidak ada, serta data localStorage korup/versi lama.
- Diubah: `src/main.js` hanya jika diperlukan untuk memuat/menguji store.

**Gate (selesai bila)**

- `npm run lint` lulus tanpa error baru.
- `npm test` lulus; unit test yang sudah disediakan untuk `createStore()` (list, save, remove, search) lulus semua.

---

## WO-2 — Layar daftar dan editor catatan

**Tujuan**

Menyediakan antarmuka utama untuk melihat daftar catatan, menambah catatan baru, mengedit catatan yang dipilih, dan menghapus catatan. Semua aksi membaca/menulis lewat `createStore()` dari WO-1.

**Yang dibuat/diubah**

- Dibuat/diubah: `index.html` — kerangka halaman dengan heading "Catatan", form editor, dan area daftar catatan.
- Dibuat/diubah: `src/main.js` — logika render daftar, tambah, pilih/edit, dan hapus.
- Dibuat/diubah: `src/style.css` — tata letak daftar dan editor yang rapi di 360 px, tanpa horizontal scroll.
- Komponen UI harus memenuhi UI contract di `spec.md`:
  - Heading halaman: `Catatan`
  - Tombol: `Tambah catatan`, `Simpan`, `Hapus`
  - Input berlabel: `Judul`, `Isi`, `Cari`
  - Tombol dan area sentuh minimal 44 x 44 px.

**Gate (selesai bila)**

- `npm run lint` lulus.
- `npm test` lulus.
- `npm run test:e2e` lulus untuk skenario tambah, edit, dan hapus catatan (judul + isi tersimpan di localStorage).
- Secara manual: menambah, mengedit, dan menghapus catatan berfungsi; lebar layar 360 px tidak memunculkan horizontal scroll.

---

## WO-3 — Pencarian catatan

**Tujuan**

Menyediakan fitur pencarian yang memfilter daftar catatan berdasarkan teks di judul atau isi, memakai `search()` dari WO-1, dengan perilaku yang konsisten dan terdokumentasi.

**Yang dibuat/diubah**

- Dibuat/diubah: `index.html` — input `Cari` dengan label yang benar.
- Dibuat/diubah: `src/main.js` — menghubungkan input pencarian ke `search()` dan merender hasil filter.
- Dibuat/diubah: `src/style.css` — area pencarian rapi dan tetap tanpa horizontal scroll di 360 px.

**Keputusan perilaku yang harus ditentukan dan didokumentasikan di komentar/README**

- Pencarian *live* saat mengetik atau memakai tombol submit.
- Case-insensitive atau case-sensitive.
- Pencocokan substring atau kata utuh.
- Perilaku saat input pencarian dikosongkan.

**Gate (selesai bila)**

- `npm run lint` lulus.
- `npm test` lulus; unit test `search()` lulus.
- `npm run test:e2e` lulus untuk skenario pencarian di judul dan isi.
- Secara manual: pencarian memfilter daftar tanpa merusak data dan tanpa horizontal scroll di 360 px.

---

## WO-4 — Offline dan home screen (PWA)

**Tujuan**

Membuat aplikasi dapat dibuka saat offline dan dapat ditambahkan ke home screen sebagai PWA, sesuai bagian Data/stack dan fitur di `spec.md`.

**Yang dibuat/diubah**

- Dibuat: `public/manifest.webmanifest` (atau `public/manifest.json`) — berisi minimal `name`, `short_name`, `start_url`, `display`, dan ikon.
- Dibuat: `public/sw.js` — service worker yang meng-cache aset utama agar aplikasi terbuka tanpa koneksi.
- Dibuat/diubah: `public/` — aset ikon PWA yang dirujuk manifest.
- Dibuat/diubah: `index.html` — tautan manifest dan registrasi service worker.
- Dibuat/diubah: `vite.config.js` jika diperlukan agar manifest, service worker, dan ikon ter-copy sebagai aset statis.

**Gate (selesai bila)**

- `npm run build` dan `npm run preview` tidak error; aset PWA ter-copy ke hasil build.
- Aplikasi dapat dibuka ulang dari hasil build dalam kondisi offline (diverifikasi manual di browser atau Lighthouse).
- Lighthouse mode Mobile untuk aplikasi ini tidak kehilangan akses offline; Performance dan Accessibility tetap >= 90 (nilai akhir dilihat di WO-5).

---

## WO-5 — Polish dan kesiapan rilis

**Tujuan**

Memastikan seluruh aplikasi memenuhi spec, UI contract, dan ambang Lighthouse tanpa menambah fitur baru. Work order ini adalah tahap verifikasi dan perapian akhir.

**Yang dibuat/diubah**

- Diubah: `src/style.css` — perbaikan visual, spacing, dan aksesibilitas (kontras, fokus, ukuran sentuh).
- Diubah: `src/main.js` — perbaikan bug kecil dan pembersihan kode.
- Diubah: `index.html` — perbaikan markup semantik dan aksesibilitas.
- Dibuat/diubah: `README.md` atau komentar singkat bila ada catatan teknis yang perlu didokumentasikan.

**Gate (selesai bila)**

- `npm run lint`, `npm test`, dan `npm run test:e2e` semuanya lulus.
- Lighthouse mode Mobile: Performance >= 90 dan Accessibility >= 90.
- Pemeriksaan manual di lebar 360 px: tidak ada horizontal scroll, seluruh tombol/area sentuh >= 44 x 44 px.
- Semua UI contract terpenuhi: heading `Catatan`, tombol `Tambah catatan`/`Simpan`/`Hapus`, input berlabel `Judul`/`Isi`/`Cari`.
