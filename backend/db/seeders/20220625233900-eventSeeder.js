'use strict';

const d1 = "Come check out our monthly Smash tournament! Entry is $5 whether you are playing or spectating.";
const img1 = "https://www.smashbros.com/assets_v2/img/fighter/falco/ss_1.jpg";
const d2 = "So they're finally here, performing for you, If you know the words, you can join in too, Put your hands together, if you want to clap, As we take you through this monkey rap!";
const img2 = "https://i.dailymail.co.uk/i/pix/2010/02/10/article-1249824-083527F7000005DC-550_634x422.jpg";
const d3 = "Come all ye anime nerds to see anime stuff";
const img3 = "https://preview.redd.it/jkr7e8p7w8871.jpg?width=640&format=pjpg&auto=webp&s=a1a4024eda8f81db05e187b8b41cd7fda6db4e25";

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Events', [
        {hostId: 1, venueId: 1, categoryId: 2, name: "Smash Ultimate Tournament", date: new Date('December 17, 2022 18:30:00'), capacity: 40, image: img1, description: d1 },
        {hostId: 1, venueId: 3, categoryId: 2, name: "Monkey Dancers", date: new Date('November 17, 2022 19:00:00'), capacity: 200, image: img2, description: d2 },
        {hostId: 1, venueId: 2, categoryId: 2, name: "AnimeNext Convention", date: new Date('July 17, 2023 08:00:00'), capacity: 2000, image: img3, description: d3 }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Events', null, {});
  }
};
