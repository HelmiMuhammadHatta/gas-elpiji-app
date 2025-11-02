# Gas Elpiji App (PERN)

Aplikasi simpel buat catatan stok, booking, dan status pembayaran gas elpiji.

## Jalankan Cepat (Dev)

### 1) Backend
```bash
cd backend
cp .env.example .env
# edit .env sesuai Postgres kamu
npm i
npm run dev
```
API: http://localhost:4000/api

### 2) Frontend
```bash
cd ../frontend
npm i
npm run dev
```
UI: http://localhost:5173

> Pastikan `ORIGIN` di `.env` backend mengizinkan `http://localhost:5173`.

## Endpoints Singkat
- `GET /api/stok/:date`
- `POST /api/transaksi/booking`
- `PATCH /api/transaksi/:id/diambil`
- `PATCH /api/transaksi/:id/lunas`
- `GET /api/transaksi?date=YYYY-MM-DD`
- `GET /api/rekap?start=YYYY-MM-DD&end=YYYY-MM-DD`

## Skema Tabel
- `pelanggan(id, nama, no_hp, alamat, catatan, created_at, updated_at)`
- `stok_harian(id, tanggal, stok_awal, penyesuaian, terjual, sisa, catatan, created_at, updated_at)`
- `transaksi(id, tanggal_pesan, tanggal_ambil, pelanggan_id, jumlah, harga_satuan, total, status_pesanan, status_bayar, nominal_bayar, tanggal_bayar, catatan, created_at, updated_at)`

## Catatan
- `sequelize.sync({ alter: true })` dipakai untuk dev agar tabel otomatis dibuat/diperbarui.
- Ubah `PRICE_DEFAULT` di `.env` untuk harga default.
- Logika stok sederhana: booking mengurangi `sisa`, `diambil` menambah `terjual`.
