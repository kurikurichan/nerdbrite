'use strict';

// NEW: add this code to each migration file
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
// END of new code

module.exports = {
  up: (queryInterface, Sequelize) => {
      options.tableName = 'Tickets';
      return queryInterface.bulkInsert(options, [
        { eventId: 1, userId: 1},
        { eventId: 2, userId: 2},
        { eventId: 3, userId: 1}
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      options.tableName = 'Tickets';
      return queryInterface.bulkDelete(options, null, {});
  }
};
