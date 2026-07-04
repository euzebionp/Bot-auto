const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Lead = sequelize.define("Lead", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  interesse: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(
      "novo",
      "qualificado",
      "matriculado",
      "perdido"
    ),
    defaultValue: "novo",
  },
  consentimento_lgpd: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  ultima_interacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Lead;
