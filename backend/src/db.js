import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.PG_DB,
  process.env.PG_USER,
  process.env.PG_PASS,
  {
    host: process.env.PG_HOST,
    port: +process.env.PG_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {}
  }
);
