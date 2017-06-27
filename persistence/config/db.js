const databaseConfig= {
  host: "localhost",
  port: 5432,
  database: "payutest",
  user: "postgres"
};

const pgp = require("pg-promise")({});
const db = pgp(databaseConfig);

module.exports = db;