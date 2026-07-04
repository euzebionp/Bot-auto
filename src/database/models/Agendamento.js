const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Agendamento = sequelize.define("Agendamento", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  lead_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  data_hora: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM(
      "aula_pratica",
      "aula_teorica",
      "visita",
      "exame"
    ),
    defaultValue: "aula_pratica",
  },
  status: {
    type: DataTypes.ENUM(
      "confirmado",
      "realizado",
      "cancelado",
      "ausente"
    ),
    defaultValue: "confirmado",
  },
  observacao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Agendamento;
