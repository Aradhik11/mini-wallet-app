import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/config';

interface WalletAttributes {
  id: string;
  userId: string;
  address: string;
  encryptedPrivateKey: string;
  network: string;
}

interface WalletCreationAttributes {
  userId: string;
  address: string;
  encryptedPrivateKey: string;
  network?: string;
}

class Wallet extends Model<WalletAttributes, WalletCreationAttributes> implements WalletAttributes {
  public id!: string;
  public userId!: string;
  public address!: string;
  public encryptedPrivateKey!: string;
  public network!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Wallet.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  encryptedPrivateKey: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  network: {
    type: DataTypes.STRING,
    defaultValue: 'sepolia'
  }
}, {
  sequelize,
  tableName: 'wallets',
  timestamps: true
});

export default Wallet;