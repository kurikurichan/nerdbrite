'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('Tickets', [
        { eventId: 1, userId: 1},
        { eventId: 2, userId: 2},
        { eventId: 3, userId: 1}
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Tickets', null, {});
  }
};
