const path = require("path");
const { Sequelize } = require("sequelize");

const dbPath = path.resolve(__dirname, "..", "..", "data", "autoescola.db");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

module.exports = sequelize;
