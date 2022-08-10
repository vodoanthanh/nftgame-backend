import { DataTypes, literal, QueryInterface, Sequelize } from 'sequelize';

export const up = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('user', { id: Sequelize.INTEGER });
   */
  await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  return queryInterface.createTable('Event', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: literal('uuid_generate_v4()'),
    },
    contractName: {
      type: DataTypes.STRING,
    },
    contractAddress: {
      type: DataTypes.STRING
    },
    transHash: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
    },
    param: {
      type: DataTypes.JSONB,
    },
    block: {
      type: DataTypes.INTEGER
    },
    isProcessed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    processedAt: {
      type: DataTypes.BIGINT
    },
    retryCount: {
      type: DataTypes.INTEGER
    },
    isFailed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }).then(() => {
    return queryInterface.addIndex('Event', ['isProcessed', 'isFailed', 'retryCount', 'block'], {
      name: 'eIdxIsProcessedRetryCountBlock'
    });
  });
};

export const down = (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('user');
   */
  return queryInterface.dropTable('Event');
};
