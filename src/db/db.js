import Sequelize from 'sequelize';
import config from 'config';

const sequelize = new Sequelize(`${config.database.url}`);

exports.db = sequelize;
