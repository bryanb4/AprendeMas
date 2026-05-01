const { Pool } = require("pg");
require("dotenv").config();

console.log("Conectando a la base de datos...");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

module.exports = pool;