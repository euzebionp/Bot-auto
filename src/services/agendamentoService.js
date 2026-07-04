const { Agendamento } = require("../database/models");
const { Op } = require("sequelize");
const logger = require("../utils/logger");

const criarAgendamento = async (leadId, dataHora, tipo = "aula_pratica") => {
  const agendamento = await Agendamento.create({
    lead_id: leadId,
    data_hora: new Date(dataHora),
    tipo,
    status: "confirmado",
  });
  logger.info(
    `Agendamento #${agendamento.id} criado para lead #${leadId} em ${dataHora}`
  );
  return agendamento;
};

const verificarConflito = async (dataHora) => {
  const conflito = await Agendamento.findOne({
    where: {
      data_hora: new Date(dataHora),
      status: { [Op.ne]: "cancelado" },
    },
  });
  return !!conflito;
};

const cancelarAgendamento = async (id) => {
  const agendamento = await Agendamento.findByPk(id);
  if (!agendamento) return null;
  await agendamento.update({ status: "cancelado" });
  return agendamento;
};

const listarAgendamentosDoDia = async (data) => {
  const inicio = new Date(data);
  inicio.setHours(0, 0, 0, 0);
  const fim = new Date(data);
  fim.setHours(23, 59, 59, 999);

  return Agendamento.findAll({
    where: {
      data_hora: { [Op.between]: [inicio, fim] },
      status: "confirmado",
    },
  });
};

const listarAgendamentosProximos = async (dias = 1) => {
  const inicio = new Date();
  const fim = new Date();
  fim.setDate(fim.getDate() + dias);
  fim.setHours(23, 59, 59, 999);

  return Agendamento.findAll({
    where: {
      data_hora: { [Op.between]: [inicio, fim] },
      status: "confirmado",
    },
  });
};

module.exports = {
  criarAgendamento,
  verificarConflito,
  cancelarAgendamento,
  listarAgendamentosDoDia,
  listarAgendamentosProximos,
};
