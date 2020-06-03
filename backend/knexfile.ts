import path from "path";
require("dotenv").config();

module.exports = {
  client: "pg",
  connection: process.env.CONNECTION_STRING,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: path.resolve(__dirname, "src", "database", "migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "src", "database", "seeds"),
  },
};
