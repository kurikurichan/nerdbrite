'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Categories', [
        {type: "Conventions"},
        {type: "Gaming"},
        {type: "Music"}
      ], {});
  },

  down: (queryInterface, Sequelize) => {

      return queryInterface.bulkDelete('Categories', null, {});
  }
};
