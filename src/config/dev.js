const host = process.env.DB_HOST || 'localhost';
const databaseName = process.env.DB_DATABASE;
const user = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || 'postgres';

module.exports = {
  server: {
    port: 9000
  },
  database: {
    url: `postgres://${user}:${password}@${host}:5432/${databaseName}`,
  },
};
