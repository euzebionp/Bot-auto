const leadService = require("../services/leadService");
const logger = require("../utils/logger");
const { FALLBACK_MESSAGE } = require("../config/constants");

const handleFallback = async (telefone, mensagem, client) => {
  try {
    const lead = await leadService.encontrarOuCriar(telefone);

    await leadService.registrarConversa(telefone, mensagem, "entrada");

    if (lead.nome && lead.interesse) {
      logger.info(
        `Fallback para lead qualificado: ${lead.nome} (${telefone})`
      );
      return (
        `Seu atendimento será transferido para um instrutor, ${lead.nome}!\n\n` +
        `📝 *Lead registrado:*\n` +
        `Nome: ${lead.nome}\n` +
        `Interesse: ${lead.interesse}\n\n` +
        `Em breve alguém entrará em contato.`
      );
    }

    return FALLBACK_MESSAGE;
  } catch (error) {
    logger.error(`Erro no fallback: ${error.message}`);
    return FALLBACK_MESSAGE;
  }
};

module.exports = { handleFallback };
