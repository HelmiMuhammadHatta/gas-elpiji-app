import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './db.js';
import './models/index.js';
import pelangganRouter from './routes/pelanggan.js';
import transaksiRouter from './routes/transaksi.js';
import stokRouter from './routes/stok.js';
import rekapRouter from './routes/rekap.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.ORIGIN?.split(',') || true, credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/pelanggan', pelangganRouter);
app.use('/api/transaksi', transaksiRouter);
app.use('/api/stok', stokRouter);
app.use('/api/rekap', rekapRouter);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // dev convenience
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (e) {
    console.error('Failed to start:', e);
    process.exit(1);
  }
}
start();
