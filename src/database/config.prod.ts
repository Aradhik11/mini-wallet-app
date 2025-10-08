import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = process.env.NODE_ENV === 'production' && process.env.DATABASE_URL?.startsWith('postgres')
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: process.env.DATABASE_URL || './database.sqlite',
      logging: process.env.NODE_ENV === 'development' ? console.log : false
    });

export default sequelize;