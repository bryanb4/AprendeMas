const { Pool } = require("pg");
require("dotenv").config();

console.log("Conectando a la base de datos...");

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME || "app1",
});

pool.on("error", (err) => {
  console.error("Error en el pool de Postgres:", err.message);
});

module.exports = pool;