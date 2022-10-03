'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Venues', [
      {name: "The Grand Poobah", address: "30 N Sutton St", city: "Moose", state: "WY", zipcode: "010101", lat:2.0, lng:3.0},
      {venueName: "The Hemp Expo Center", address: "10100 E Main St", city: "Seattle", state: "WA", zipcode: "330001", lat:2.0, lng:3.0},
      {venueName: "Bean Theatre", address: "3487 Country Ave", city: "Warrenton", state: "VA", zipcode: "90505", lat:2.0, lng:3.0}
      ], {});
  },

  down: (queryInterface, Sequelize) => {

      return queryInterface.bulkDelete('Venues', null, {});
  }
};
