import { EventInstance } from "@/interfaces/model/event";
import { DataTypes } from "sequelize";
import { sequelize } from ".";

// define model
const Event = sequelize.define<EventInstance>(
  'Event',
  {
    id: {
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID
    },
    contractName: {
      type: DataTypes.STRING
    },
    contractAddress: {
      type: DataTypes.STRING,
    },
    transHash: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING
    },
    param: {
      type: DataTypes.JSONB
    },
    block: {
      type: DataTypes.INTEGER,
      unique: true
    },
    isProcessed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    processedAt: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    retryCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isFailed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [{
      fields: ['block', 'isProcessed']
    }]
  }
);

export { Event };
