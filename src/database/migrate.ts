import sequelize from './config';
import { User, Wallet } from '../models';
import logger from '../utils/logger';

async function migrate(): Promise<void> {
  try {
    logger.info('Starting database migration...');
    
    await sequelize.authenticate();
    logger.info('Database connection established');
    
    await sequelize.sync({ force: false });
    
    logger.info('Database migration completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  migrate();
}

export default migrate;