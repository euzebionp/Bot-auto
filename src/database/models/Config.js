const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Config = sequelize.define("Config", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  chave: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  valor: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Config;
