const {
  MENU_PRINCIPAL,
  CONSENTIMENTO_MESSAGE,
  ERRO_INTERNO,
} = require("../config/constants");
const { obterSaudacao } = require("../utils/helpers");
const { randomDelay } = require("../utils/delay");
const logger = require("../utils/logger");

const leadHandler = require("./leadHandler");
const agendamentoHandler = require("./agendamentoHandler");
const infoHandler = require("./infoHandler");
const fallbackHandler = require("./fallbackHandler");
const leadService = require("../services/leadService");

const intencoes = {
  MENU: /^(menu|MENU|inicio|INICIO|\/menu|0)$/,
  VALORES: /^(1|valores|VALORES|preco|PREÇO|quanto custa)/,
  DOCUMENTOS: /^(2|documentos|DOCUMENTOS|matricula|MATRÍCULA)/,
  MATRICULA: /^(3|matricular|MATRICULAR|quero me matricular)/,
  AGENDAR: /^(4|agendar|AGENDAR|agendamento|AGENDAMENTO)/,
  HORARIOS: /^(5|horarios|HORÁRIOS|endereco|ENDEREÇO|funcionamento)/,
  FALAR: /^(6|atendente|ATENDENTE|humano|HUMANO|falar)/,
  CONCORDO: /^(concordo|CONCORDO|sim|SIM|aceito|ACEITO)$/,
  SAIR: /^(sair|SAIR|revogar|REVOGAR|sair)/,
  CANCELAR: /^(cancelar|CANCELAR|voltar|VOLTAR)/,
  CONFIRMAR: /^(confirmar|CONFIRMAR|sim|SIM)$/,
};

const processarMensagem = async (msg, client) => {
  const telefone = msg.from;
  const corpo = msg.body.trim();

  try {
    if (
      agendamentoHandler.estaAgendando(telefone)
    ) {
      return await agendamentoHandler.processarResposta(
        telefone,
        corpo,
        client
      );
    }

    if (leadHandler.estaEmCaptura(telefone)) {
      return await leadHandler.processarResposta(telefone, corpo, client);
    }

    if (intencoes.CONCORDO.test(corpo)) {
      await leadService.concederConsentimento(telefone);
      return `✅ *Consentimento registrado!* Seus dados serão utilizados apenas para contato e agendamento.\n\n${MENU_PRINCIPAL}`;
    }

    if (intencoes.SAIR.test(corpo)) {
      await leadService.revogarDados(telefone);
      return `Seus dados foram removidos do nosso sistema. Caso mude de ideia, estaremos aqui.`;
    }

    if (intencoes.VALORES.test(corpo)) {
      return infoHandler.handleValores();
    }

    if (intencoes.DOCUMENTOS.test(corpo)) {
      return infoHandler.handleDocumentos();
    }

    if (intencoes.MATRICULA.test(corpo)) {
      return await leadHandler.iniciarCaptura(telefone);
    }

    if (intencoes.AGENDAR.test(corpo)) {
      return await agendamentoHandler.iniciarAgendamento(telefone);
    }

    if (intencoes.HORARIOS.test(corpo)) {
      return infoHandler.handleHorarios();
    }

    if (intencoes.FALAR.test(corpo)) {
      return await fallbackHandler.handleFallback(
        telefone,
        corpo,
        client
      );
    }

    if (intencoes.MENU.test(corpo)) {
      return MENU_PRINCIPAL;
    }

    return await fallbackHandler.handleFallback(telefone, corpo, client);
  } catch (error) {
    logger.error(`Erro no dispatcher: ${error.message}`, {
      telefone,
      mensagem: corpo,
      stack: error.stack,
    });
    return ERRO_INTERNO;
  }
};

const handleInicio = async (telefone) => {
  await leadService.encontrarOuCriar(telefone);

  const lead = await leadService.encontrarOuCriar(telefone);

  if (!lead.consentimento_lgpd) {
    return CONSENTIMENTO_MESSAGE;
  }

  return MENU_PRINCIPAL;
};

module.exports = { processarMensagem, handleInicio };
