const sequelize = require('../db')
const Sequelize = require('sequelize');

const favorites = sequelize.define("favorites", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false,
  },

})
// sequelize.sync().then(result => console.log(result))
//   .catch(err => console.log(err))

module.exports = favorites;