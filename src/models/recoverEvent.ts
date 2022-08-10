import { RecoverEventInstance } from '@/interfaces/model/recoverEvent';
import { DataTypes } from "sequelize";
import { sequelize } from ".";

// define model
const RecoverEvent = sequelize.define<RecoverEventInstance>(
  'RecoverEvent',
  {
    id: {
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID
    },
    contractName: {
      type: DataTypes.STRING
    },
    block: {
      type: DataTypes.INTEGER
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export { RecoverEvent };
