const sequelize = require('../db')
const Sequelize = require('sequelize');

const users = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
});

sequelize.sync().then(result => console.log(result))
  .catch(err => console.log(err))

module.exports = users;