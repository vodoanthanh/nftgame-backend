import { UserInstance } from '@interfaces/model/user';
import { DataTypes } from 'sequelize';
import { sequelize } from '.';

// define model
const User = sequelize.define<UserInstance>('User',
  {
    id: {
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID
    },
    nonce: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID// Initialize with a random nonce
    },
    walletID: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export { User };

