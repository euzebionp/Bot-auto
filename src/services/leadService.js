const { Lead, Conversa } = require("../database/models");
const logger = require("../utils/logger");

const encontrarOuCriar = async (telefone) => {
  const [lead] = await Lead.findOrCreate({
    where: { telefone },
    defaults: { status: "novo", consentimento_lgpd: false },
  });
  return lead;
};

const atualizarLead = async (telefone, dados) => {
  const lead = await Lead.findOne({ where: { telefone } });
  if (!lead) return null;

  dados.ultima_interacao = new Date();
  await lead.update(dados);
  return lead;
};

const registrarConversa = async (telefone, mensagem, direcao) => {
  await Conversa.create({
    lead_telefone: telefone,
    mensagem,
    direcao,
  });
};

const concederConsentimento = async (telefone) => {
  const lead = await Lead.findOne({ where: { telefone } });
  if (!lead) return false;
  await lead.update({ consentimento_lgpd: true, ultima_interacao: new Date() });
  logger.info(`Consentimento LGPD registrado para ${telefone}`);
  return true;
};

const revogarDados = async (telefone) => {
  const lead = await Lead.findOne({ where: { telefone } });
  if (!lead) return false;
  await Conversa.destroy({ where: { lead_telefone: telefone } });
  await lead.destroy();
  logger.info(`Dados revogados para ${telefone}`);
  return true;
};

const buscarPorId = async (id) => {
  return Lead.findByPk(id);
};

const listarLeads = async (filtros = {}) => {
  return Lead.findAll({ where: filtros, order: [["created_at", "DESC"]] });
};

module.exports = {
  encontrarOuCriar,
  atualizarLead,
  registrarConversa,
  concederConsentimento,
  revogarDados,
  buscarPorId,
  listarLeads,
};
