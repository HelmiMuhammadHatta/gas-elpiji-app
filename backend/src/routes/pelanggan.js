import { Router } from 'express';
import Pelanggan from '../models/Pelanggan.js';
import { Op } from 'sequelize';

const r = Router();

r.get('/', async (req, res) => {
  const q = req.query.q;
  const where = q ? { where: { nama: { [Op.like]: `%${q}%` } } } : {};
  const list = await Pelanggan.findAll({ order: [['nama','ASC']], ...where });
  res.json(list);
});

r.post('/', async (req, res) => {
  const { nama, no_hp, alamat, catatan } = req.body;
  if (!nama) return res.status(400).json({ error: 'Nama wajib diisi' });
  const p = await Pelanggan.create({ nama, no_hp, alamat, catatan });
  res.status(201).json(p);
});

export default r;
