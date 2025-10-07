import User from './User';
import Wallet from './Wallet';

// Define associations
User.hasMany(Wallet, { foreignKey: 'userId', as: 'wallets' });
Wallet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export {
  User,
  Wallet
};