'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    hostId: DataTypes.INTEGER,
    venueId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    date: DataTypes.DATE,
    capacity: DataTypes.INTEGER,
    image: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});
  Event.associate = function(models) {
    // associations can be defined here
    Event.hasMany(models.Ticket, { foreignKey: 'eventId', onDelete: "CASCADE", hooks:true });

    Event.belongsTo(models.User, { foreignKey: 'hostId' });
    Event.belongsTo(models.Venue, { foreignKey: 'venueId' });
    Event.belongsTo(models.Category, { foreignKey: 'categoryId' });
  };
  return Event;
};
