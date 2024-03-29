"use strict";

// NEW: add this code to each migration file
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
// END of new code

const d1 =
  "Come check out our monthly Smash tournament! Entry is $5 whether you are playing or spectating.";
const img1 = "https://www.smashbros.com/assets_v2/img/fighter/falco/ss_1.jpg";
const d2 =
  "So they're finally here, performing for you, If you know the words, you can join in too, Put your hands together, if you want to clap, As we take you through this monkey rap!";
const img2 =
  "https://i.dailymail.co.uk/i/pix/2010/02/10/article-1249824-083527F7000005DC-550_634x422.jpg";
const d3 = "Come all ye anime nerds to see anime stuff";
const img3 =
  "https://i.pinimg.com/736x/66/9a/9c/669a9cba35f2f183b4f7f50acca73b68.jpg";
const d4 =
  "Watch five competitive eaters take on Kirby in a hotdog eating contest. How many hotdogs can they eat in 15 minutes?";
const img4 = "https://c.tenor.com/uWsVgFo8Z9cAAAAM/kirby-food.gif";
const d5 =
  "Bring your wands and let's see who knows the most about The Boy Who Lived!";
const img5 =
  "https://static.independent.co.uk/s3fs-public/thumbnails/image/2016/09/29/15/hp.jpg";

function createEventDate() {
  // create a date sometime in the future for event, between now and 4 months later (due to Render DB resetting every 90 days)
  const today = new Date();
  // actually change today to tomorrow to avoid errors
  today.setDate(today.getDate() + 1);
  const later = new Date();
  later.setMonth(today.getMonth() + 3);

  const randomTimestamp =
    today.getTime() + Math.random() * (later.getTime() - today.getTime());
  const randomDate = new Date(randomTimestamp);

  return randomDate;
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    options.tableName = "Events";
    return queryInterface.bulkInsert(
      options,
      [
        {
          hostId: 1,
          categoryId: 2,
          name: "Smash Ultimate Tournament",
          date: createEventDate(),
          capacity: 40,
          image: img1,
          description: d1,
          venueName: "The Grand Poobah",
          address: "30 N Sutton St, Moose, WY 010101",
          lat: 47.6000071,
          lng: -122.3109623,
        },
        {
          hostId: 1,
          categoryId: 3,
          name: "Monkey Dancers",
          date: createEventDate(),
          capacity: 200,
          image: img2,
          description: d2,
          venueName: "The Hemp Expo Center",
          address: "10100 E Main St, Seattle, WA 330001",
          lat: 38.7134516,
          lng: -77.7952712,
        },
        {
          hostId: 1,
          categoryId: 1,
          name: "AnimeNext Convention",
          date: createEventDate(),
          capacity: 2000,
          image: img3,
          description: d3,
          venueName: "Bean Theatre",
          address: "3487 Country Ave, Warrenton, VA 90505",
          lat: 43.0739705,
          lng: -73.7679799,
        },
        {
          hostId: 1,
          categoryId: 2,
          name: "Kirby's Eating Contest",
          date: createEventDate(),
          capacity: 250,
          image: img4,
          description: d4,
          venueName: "Bean Theatre",
          address: "3487 Country Ave, Warrenton, VA 90505",
          lat: 43.0739705,
          lng: -73.7679799,
        },
        {
          hostId: 2,
          categoryId: 2,
          name: "Harry Potter Trivia",
          date: createEventDate(),
          capacity: 25,
          image: img5,
          description: d5,
          venueName: "Bean Theatre",
          address: "3487 Country Ave, Warrenton, VA 90505",
          lat: 43.0739705,
          lng: -73.7679799,
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    options.tableName = "Events";
    return queryInterface.bulkDelete(options, null, {});
  },
};
