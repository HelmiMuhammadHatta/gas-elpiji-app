import { Router } from 'express';
import StokHarian from '../models/StokHarian.js';
import { Op } from 'sequelize';

const r = Router();

// GET /api/stok/:date
r.get('/:date', async (req, res) => {
  const tanggal = req.params.date;
  let stok = await StokHarian.findOne({ where: { tanggal } });
  if (!stok) {
    // default stok_awal 50 kalau hari Senin; else 0
    const day = new Date(tanggal).getDay(); // 1 = Monday (but JS: 0=Sun,1=Mon)
    const isMonday = day === 1;
    stok = await StokHarian.create({
      tanggal,
      stok_awal: isMonday ? 50 : 0,
      penyesuaian: 0,
      terjual: 0,
      sisa: isMonday ? 50 : 0
    });
  }
  res.json(stok);
});

// PATCH penyesuaian atau set stok awal
r.patch('/:date', async (req, res) => {
  const tanggal = req.params.date;
  const { stok_awal, penyesuaian, terjual, sisa, catatan } = req.body;
  const [rows, [updated]] = await StokHarian.update(
    { stok_awal, penyesuaian, terjual, sisa, catatan },
    { where: { tanggal }, returning: true }
  );
  res.json(updated);
});

export default r;
