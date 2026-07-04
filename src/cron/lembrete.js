const cron = require("node-cron");
const agendamentoService = require("../services/agendamentoService");
const leadService = require("../services/leadService");
const client = require("../client");
const logger = require("../utils/logger");
const { LEMBRETE_AULA } = require("../config/constants");

const iniciarLembretes = () => {
  cron.schedule("0 18 * * *", async () => {
    logger.info("Executando lembretes automáticos de aula...");

    try {
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      amanha.setHours(0, 0, 0, 0);

      const agendamentos = await agendamentoService.listarAgendamentosDoDia(
        amanha
      );

      for (const agendamento of agendamentos) {
        try {
          const lead = await leadService.buscarPorId(
            agendamento.lead_id
          );

          if (!lead) {
            logger.warn(`Lead #${agendamento.lead_id} não encontrado para agendamento #${agendamento.id}`);
            continue;
          }

          const dataStr = agendamento.data_hora.toLocaleDateString("pt-BR");
          const horaStr = agendamento.data_hora.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          await client.sendMessage(
            lead.telefone,
            LEMBRETE_AULA(dataStr, horaStr)
          );

          logger.info(
            `Lembrete enviado para ${lead.telefone} (agendamento #${agendamento.id})`
          );
        } catch (err) {
          logger.error(
            `Erro ao enviar lembrete para agendamento #${agendamento.id}: ${err.message}`
          );
        }
      }
    } catch (error) {
      logger.error(`Erro na rotina de lembretes: ${error.message}`);
    }
  });

  logger.info("Cron de lembretes agendado para 18:00 todos os dias.");
};

module.exports = { iniciarLembretes };
