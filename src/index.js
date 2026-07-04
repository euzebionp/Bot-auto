const client = require("./client");
const logger = require("./utils/logger");
const { randomDelay } = require("./utils/delay");
const { syncDatabase } = require("./database/models");
const { processarMensagem, handleInicio } = require("./handlers/dispatcher");
const { iniciarLembretes } = require("./cron/lembrete");

const contatosRespondidos = new Set();
const COOLDOWN_HORAS = 2;
const COOLDOWN_MS = COOLDOWN_HORAS * 60 * 60 * 1000;

const iniciar = async () => {
  try {
    await syncDatabase();
    logger.info("Banco de dados sincronizado.");

    iniciarLembretes();

    client.on("message", async (msg) => {
      if (!msg.from.endsWith("@c.us")) return;
      if (msg.from === "status@broadcast") return;

      if (contatosRespondidos.has(msg.from)) {
        logger.info(`Cooldown ativo para ${msg.from}. Ignorando.`);
        return;
      }

      try {
        contatosRespondidos.add(msg.from);
        setTimeout(() => {
          contatosRespondidos.delete(msg.from);
        }, COOLDOWN_MS);

        if (
          msg.body.trim().toUpperCase() === "MENU" ||
          msg.body.trim().toUpperCase() === "OI" ||
          msg.body.trim().toUpperCase() === "OLÁ" ||
          msg.body.trim().toUpperCase() === "OLA" ||
          msg.body.trim().toUpperCase() === "BOM DIA" ||
          msg.body.trim().toUpperCase() === "BOA TARDE" ||
          msg.body.trim().toUpperCase() === "BOA NOITE" ||
          msg.body.trim().toUpperCase() === "INICIAR"
        ) {
          const chat = await msg.getChat();
          await randomDelay(2000, 4000);
          await chat.sendStateTyping();
          await randomDelay(2000, 4000);

          const resposta = await handleInicio(msg.from);
          await client.sendMessage(msg.from, resposta);
          return;
        }

        const chat = await msg.getChat();
        await randomDelay(2000, 5000);
        await chat.sendStateTyping();
        await randomDelay(3000, 6000);

        const resposta = await processarMensagem(msg, client);
        if (resposta) {
          await client.sendMessage(msg.from, resposta);
        }
      } catch (error) {
        logger.error(`Erro ao processar mensagem de ${msg.from}: ${error.message}`);
      }
    });

    client.initialize();
  } catch (error) {
    logger.error(`Erro ao iniciar bot: ${error.message}`);
    process.exit(1);
  }
};

iniciar();
