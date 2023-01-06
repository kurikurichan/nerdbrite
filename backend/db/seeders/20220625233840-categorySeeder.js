'use strict';

// NEW: add this code to each migration file
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
// END of new code

module.exports = {
  up: (queryInterface, Sequelize) => {
    options.tableName = 'Categories';
    return queryInterface.bulkInsert(options, [
      {type: "Conventions"},
      {type: "Gaming"},
      {type: "Music"}
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    options.tableName = 'Categories';
    return queryInterface.bulkDelete(options, null, {});
  }
};
