'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tenants', 'tenant_id');

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Tenants', 'tenant_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Tenants',
        key: 'id'
      }
    });
  }
};
