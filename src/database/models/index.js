const sequelize = require("../../config/database");
const Lead = require("./Lead");
const Agendamento = require("./Agendamento");
const Conversa = require("./Conversa");
const Config = require("./Config");

Lead.hasMany(Agendamento, { foreignKey: "lead_id" });
Agendamento.belongsTo(Lead, { foreignKey: "lead_id" });

Lead.hasMany(Conversa, { foreignKey: "lead_telefone", sourceKey: "telefone" });
Conversa.belongsTo(Lead, { foreignKey: "lead_telefone", targetKey: "telefone" });

const syncDatabase = async () => {
  await sequelize.sync();
};

module.exports = {
  sequelize,
  Lead,
  Agendamento,
  Conversa,
  Config,
  syncDatabase,
};
