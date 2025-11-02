import { Router } from 'express';
import { Op, fn, col, literal } from 'sequelize';
import Transaksi from '../models/Transaksi.js';
import Pelanggan from '../models/Pelanggan.js';
import { sequelize } from '../db.js';

const r = Router();

r.get('/', async (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) return res.status(400).json({ error: 'start & end diperlukan' });

  const totalTerjual = await Transaksi.sum('jumlah', {
    where: { status_pesanan: 'SELESAI', tanggal_ambil: { [Op.between]: [start, end] } }
  }) || 0;

  const totalUangMasuk = await Transaksi.sum('nominal_bayar', {
    where: { status_bayar: 'LUNAS', tanggal_bayar: { [Op.between]: [start, end] } }
  }) || 0;

  const piutang = await Transaksi.findAll({
    attributes: [
      [fn('COALESCE', col('Pelanggan.nama'), literal(`'Tanpa Nama'`)), 'nama'],
      [fn('COUNT', col('Transaksi.id')), 'jumlah_transaksi'],
      [fn('SUM', col('Transaksi.jumlah')), 'total_tabung'],
      [fn('SUM', literal(`"Transaksi"."total" - "Transaksi"."nominal_bayar"`)), 'estimasi_piutang']
    ],
    where: { status_bayar: 'BELUM_LUNAS' },
    include: [{ model: Pelanggan, attributes: [], required: false }],
    group: [col('Pelanggan.nama')],
    order: [[col('estimasi_piutang'), 'DESC']]
  });

  res.json({ totalTerjual, totalUangMasuk, piutang });
});

r.post('/mark-lunas', async (req, res) => {
  const { nama } = req.body || {};
  if (!nama || nama === 'Tanpa Nama') {
    return res.status(400).json({ error: 'Nama pelanggan diperlukan dan tidak boleh "Tanpa Nama".' });
  }

  const pelanggans = await Pelanggan.findAll({
    where: sequelize.where(sequelize.fn('LOWER', col('nama')), sequelize.fn('LOWER', nama))
  });
  if (!pelanggans.length) return res.status(404).json({ error: 'Pelanggan tidak ditemukan' });

  const ids = pelanggans.map(p => p.id);

  const [count] = await Transaksi.update(
    {
      status_bayar: 'LUNAS',
      nominal_bayar: col('total'),
      tanggal_bayar: new Date().toISOString().slice(0,10)
    },
    { where: { status_bayar: 'BELUM_LUNAS', pelanggan_id: { [Op.in]: ids } } }
  );

  res.json({ updated: count });
});

export default r;
