import { Router } from 'express';
import { Op } from 'sequelize';
import Transaksi from '../models/Transaksi.js';
import Pelanggan from '../models/Pelanggan.js';
import StokHarian from '../models/StokHarian.js';

const r = Router();

// POST /api/transaksi/booking
r.post('/booking', async (req, res) => {
  const { tanggal_pesan, pelanggan_id, nama_pelanggan, jumlah = 1, harga_satuan, catatan } = req.body;
  const tgl = tanggal_pesan || new Date().toISOString().slice(0,10);
  let pid = pelanggan_id;
  if (!pid && nama_pelanggan) {
    const p = await Pelanggan.create({ nama: nama_pelanggan });
    pid = p.id;
  }
  const harga = harga_satuan || +(process.env.PRICE_DEFAULT || 20000);
  const total = harga * jumlah;

  // adjust stok
  let stok = await StokHarian.findOne({ where: { tanggal: tgl } });
  if (!stok) {
    stok = await StokHarian.create({
      tanggal: tgl, stok_awal: 0, penyesuaian: 0, terjual: 0, sisa: 0
    });
  }
  const newSisa = Math.max(0, (stok.sisa ?? 0) - jumlah);
  await stok.update({ sisa: newSisa });

  const trx = await Transaksi.create({
    tanggal_pesan: tgl,
    pelanggan_id: pid || null,
    jumlah,
    harga_satuan: harga,
    total,
    status_pesanan: 'BOOKING',
    status_bayar: 'BELUM_LUNAS',
    nominal_bayar: 0,
    catatan
  });
  res.status(201).json(trx);
});

// PATCH /api/transaksi/:id/diambil
r.patch('/:id/diambil', async (req, res) => {
  const id = req.params.id;
  const tanggal_ambil = req.body.tanggal_ambil || new Date().toISOString().slice(0,10);
  const trx = await Transaksi.findByPk(id);
  if (!trx) return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
  await trx.update({ status_pesanan: 'SELESAI', tanggal_ambil });
  // update terjual
  const stok = await StokHarian.findOne({ where: { tanggal: tanggal_ambil } });
  if (stok) {
    await stok.update({ terjual: (stok.terjual || 0) + trx.jumlah });
  }
  res.json(trx);
});

// PATCH /api/transaksi/:id/lunas
r.patch('/:id/lunas', async (req, res) => {
  const id = req.params.id;
  const nominal_bayar = req.body.nominal_bayar;
  const tanggal_bayar = req.body.tanggal_bayar || new Date().toISOString().slice(0,10);
  const trx = await Transaksi.findByPk(id);
  if (!trx) return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
  await trx.update({ status_bayar: 'LUNAS', nominal_bayar: nominal_bayar ?? trx.total, tanggal_bayar });
  res.json(trx);
});

// GET /api/transaksi?date=YYYY-MM-DD (list booking aktif hari itu)
r.get('/', async (req, res) => {
  const { date } = req.query;
  const where = {};
  if (date) where.tanggal_pesan = date;
  const list = await Transaksi.findAll({
    where,
    include: [{ model: Pelanggan }],
    order: [['createdAt','DESC']]
  });
  res.json(list);
});

export default r;
