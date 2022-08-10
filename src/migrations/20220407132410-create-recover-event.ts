import { DataTypes, literal, QueryInterface, Sequelize } from 'sequelize';

export const up = async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('user', { id: Sequelize.INTEGER });
   */
  await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  return queryInterface.createTable('RecoverEvent', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: literal('uuid_generate_v4()'),
    },
    contractName: {
      type: DataTypes.STRING,
      unique: true,
    },
    block: {
      type: DataTypes.INTEGER
    }
  });
};

export const down = (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('user');
   */
  return queryInterface.dropTable('RecoverEvent');
};
