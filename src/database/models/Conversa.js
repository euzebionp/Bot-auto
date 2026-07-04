const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Conversa = sequelize.define("Conversa", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  lead_telefone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  mensagem: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  direcao: {
    type: DataTypes.ENUM("entrada", "saida"),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Conversa;
