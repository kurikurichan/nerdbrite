'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Events', [
        {hostId: 1, venueId: 1, categoryId: 2, name: "Smash Ultimate Tournament", date: new Date('December 17, 2022 18:30:00'), capacity: 40},
        {hostId: 1, venueId: 3, categoryId: 2, name: "Monkey Dancers", date: new Date('November 17, 2022 19:00:00'), capacity: 200},
        {hostId: 1, venueId: 2, categoryId: 2, name: "AnimeNext Convention", date: new Date('July 17, 2023 08:00:00'), capacity: 2000}
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Events', null, {});
  }
};
