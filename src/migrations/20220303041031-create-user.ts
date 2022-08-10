import { DataTypes, literal, QueryInterface, Sequelize } from 'sequelize';

export const up = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('user', { id: Sequelize.INTEGER });
   */
  await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  return queryInterface.createTable('User',
    {
      id: {
        primaryKey: true,
        defaultValue: literal('uuid_generate_v4()'),
        type: DataTypes.UUID
      },
      nonce: {
        allowNull: false,
        defaultValue: literal('uuid_generate_v4()'),
        type: DataTypes.UUID// Initialize with a random nonce
      },
      walletID: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
    });
};

export const down = (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('user');
   */
  return queryInterface.dropTable('User');
};
