'use strict';
module.exports = (sequelize, DataTypes) => {
  const Venue = sequelize.define('Venue', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.STRING,
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL
  }, {});
  Venue.associate = function(models) {
    // associations can be defined here
    Venue.hasMany(models.Event, { foreignKey: 'venueId' });
  };
  return Venue;
};
