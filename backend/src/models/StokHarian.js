import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

class StokHarian extends Model {}
StokHarian.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tanggal: { type: DataTypes.DATEONLY, allowNull: false, unique: true },
  stok_awal: { type: DataTypes.INTEGER, allowNull: false },
  penyesuaian: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  terjual: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  sisa: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  catatan: { type: DataTypes.STRING(200) }
}, { sequelize, modelName: 'StokHarian', tableName: 'stok_harian', timestamps: true });

export default StokHarian;
