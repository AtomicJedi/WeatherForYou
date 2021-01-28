const host = process.env.DB_HOST || 'localhost';
const databaseName = 'express-postgres-docker'

module.exports = {
  server: {
    port: 9000
  },
  database: {
    url: `postgres://postgres:postgres@${host}:5432/${databaseName}`,
  },
};
