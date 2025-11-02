import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

class Pelanggan extends Model {}
Pelanggan.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama: { type: DataTypes.STRING(100), allowNull: false },
  no_hp: { type: DataTypes.STRING(20) },
  alamat: { type: DataTypes.STRING(200) },
  catatan: { type: DataTypes.STRING(200) }
}, { sequelize, modelName: 'Pelanggan', tableName: 'pelanggan', timestamps: true });

export default Pelanggan;
