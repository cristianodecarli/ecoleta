import knex from "knex";

const connection = knex({
  client: "pg",
  connection: process.env.CONNECTION_STRING,
});

export default connection;
