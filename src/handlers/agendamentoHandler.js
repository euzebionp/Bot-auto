const agendamentoService = require("../services/agendamentoService");
const leadService = require("../services/leadService");
const logger = require("../utils/logger");
const { AGENDAR_MESSAGE, AULA_CONFIRMADA } = require("../config/constants");

const estadosAgendamento = new Map();

const iniciarAgendamento = async (telefone) => {
  const lead = await leadService.encontrarOuCriar(telefone);
  if (!lead.consentimento_lgpd) {
    return (
      `Antes de agendarmos, preciso do seu consentimento para armazenar seus dados.\n\n` +
      `Digite *CONCORDO* para prosseguir ou *CANCELAR* para voltar.`
    );
  }

  estadosAgendamento.set(telefone, { etapa: "data", leadId: lead.id });
  return AGENDAR_MESSAGE;
};

const processarResposta = async (telefone, mensagem, client) => {
  const sessao = estadosAgendamento.get(telefone);
  if (!sessao) return null;

  try {
    switch (sessao.etapa) {
      case "data": {
        const dataRegex = /^(\d{2})\/(\d{2})\s+às\s+(\d{2}):(\d{2})$/;
        const match = mensagem.match(dataRegex);
        if (!match) {
          return (
            `Formato inválido. Use o formato: *DD/MM às HH:MM*\n\n` +
            `Exemplo: *15/07 às 14:30*\n\n` +
            `Digite *CANCELAR* para desistir.`
          );
        }

        const [, dia, mes, hora, min] = match;
        const ano = new Date().getFullYear();
        const dataHora = new Date(ano, mes - 1, dia, hora, min);

        if (dataHora < new Date()) {
          return `Essa data já passou! Informe uma data futura ou digite *CANCELAR*.`;
        }

        const conflito = await agendamentoService.verificarConflito(dataHora);
        if (conflito) {
          return `Esse horário já está ocupado. Escolha outro horário ou digite *CANCELAR*.`;
        }

        sessao.dataHora = dataHora;
        sessao.etapa = "confirmar";

        const dataStr = dataHora.toLocaleDateString("pt-BR");
        const horaStr = dataHora.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          `📅 *Resumo do Agendamento*\n\n` +
          `Data: ${dataStr}\n` +
          `Horário: ${horaStr}\n` +
          `Tipo: Aula Prática\n\n` +
          `Digite *CONFIRMAR* para finalizar ou *CANCELAR* para desistir.`
        );
      }

      case "confirmar": {
        if (mensagem.toUpperCase() === "CONFIRMAR") {
          const agendamento = await agendamentoService.criarAgendamento(
            sessao.leadId,
            sessao.dataHora
          );

          const dataStr = sessao.dataHora.toLocaleDateString("pt-BR");
          const horaStr = sessao.dataHora.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          estadosAgendamento.delete(telefone);

          logger.info(
            `Agendamento #${agendamento.id} confirmado para lead #${sessao.leadId}`
          );

          return AULA_CONFIRMADA(dataStr, horaStr);
        }

        estadosAgendamento.delete(telefone);
        return "Agendamento cancelado. Digite *MENU* para voltar ao início.";
      }

      default:
        estadosAgendamento.delete(telefone);
        return null;
    }
  } catch (error) {
    logger.error(`Erro no agendamento: ${error.message}`);
    estadosAgendamento.delete(telefone);
    return `Desculpe, ocorreu um erro ao processar seu agendamento. Por favor, tente novamente mais tarde.`;
  }
};

const estaAgendando = (telefone) => estadosAgendamento.has(telefone);

const removerSessao = (telefone) => {
  estadosAgendamento.delete(telefone);
};

module.exports = {
  iniciarAgendamento,
  processarResposta,
  estaAgendando,
  removerSessao,
};
