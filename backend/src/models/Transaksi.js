import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';
import Pelanggan from './Pelanggan.js';

class Transaksi extends Model {}
Transaksi.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tanggal_pesan: { type: DataTypes.DATEONLY, allowNull: false },
  tanggal_ambil: { type: DataTypes.DATEONLY },
  jumlah: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  harga_satuan: { type: DataTypes.INTEGER, allowNull: false },
  total: { type: DataTypes.INTEGER, allowNull: false },
  status_pesanan: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'BOOKING' },
  status_bayar: { type: DataTypes.STRING(11), allowNull: false, defaultValue: 'BELUM_LUNAS' },
  nominal_bayar: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  tanggal_bayar: { type: DataTypes.DATEONLY },
  catatan: { type: DataTypes.STRING(200) }
}, { sequelize, modelName: 'Transaksi', tableName: 'transaksi', timestamps: true });

Transaksi.belongsTo(Pelanggan, { foreignKey: { name: 'pelanggan_id', allowNull: true }, onDelete: 'SET NULL' });
Pelanggan.hasMany(Transaksi, { foreignKey: 'pelanggan_id' });

export default Transaksi;
