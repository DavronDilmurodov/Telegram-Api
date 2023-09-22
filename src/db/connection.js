import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "postgres",
  username: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  logging: false,
});

(async function () {
  try {
    await sequelize.authenticate();
    console.log("DB has run");
  } catch (error) {
    console.log("connection.js: " + error.message);
  }
})();

export default sequelize;
