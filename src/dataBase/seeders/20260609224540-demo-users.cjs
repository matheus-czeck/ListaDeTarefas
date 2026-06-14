"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "João Silva",
          email: "joao.silva@email.com",
          password: "somente teste", 
          createdAt: new Date(), 
          updatedAt: new Date(),
        },
        {
          name: "Maria Souza",
          email: "maria.souza@email.com",
          password: "qualquer coisa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
  
     await queryInterface.bulkDelete('users', null, {});
     
  },
};
