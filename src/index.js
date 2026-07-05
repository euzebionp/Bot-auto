require("dotenv").config();

const client = require("./client");
const logger = require("./utils/logger");
const { syncDatabase } = require("./database/models");
const { processarMensagem, handleInicio } = require("./handlers/dispatcher");
const leadHandler = require("./handlers/leadHandler");
const { iniciarLembretes } = require("./cron/lembrete");
const botState = require("./state");
const { iniciarServidor } = require("./api/server");
const { obterSaudacao, isBusinessHours } = require("./utils/helpers");
const { FORA_DO_HORARIO_MESSAGE } = require("./config/constants");

botState.setClient(client);

process.on("unhandledRejection", (reason) => {
  logger.error(`Rejeição não tratada: ${reason?.message || reason}`);
});

process.on("uncaughtException", (error) => {
  logger.error(`Exceção não tratada: ${error.message}`);
});

const COOLDOWN_MS = 2 * 60 * 60 * 1000;

client.on("message", async (msg) => {
  if (!msg.from.endsWith("@c.us") || msg.from === "status@broadcast") return;

  if (botState.contatosRespondidos.has(msg.from)) return;

  try {
    botState.contatosRespondidos.add(msg.from);
    setTimeout(() => botState.contatosRespondidos.delete(msg.from), COOLDOWN_MS);

    const texto = msg.body.trim().toUpperCase();
    const inicios = ["MENU", "OI", "OLÁ", "OLA", "BOM DIA", "BOA TARDE", "BOA NOITE", "INICIAR"];

    const emHorarioComercial = isBusinessHours();
    const estaEmFluxo = leadHandler.estaEmCaptura(msg.from);

    if (!emHorarioComercial && !estaEmFluxo) {
      const chat = await msg.getChat();
      await new Promise((r) => setTimeout(r, 2000 + Math.random() * 2000));
      await chat.sendStateTyping();
      await new Promise((r) => setTimeout(r, 2000 + Math.random() * 2000));
      await client.sendMessage(msg.from, FORA_DO_HORARIO_MESSAGE(obterSaudacao()));
      leadHandler.iniciarCaptura(msg.from);
      return;
    }

    if (inicios.includes(texto)) {
      const chat = await msg.getChat();
      await new Promise((r) => setTimeout(r, 2000 + Math.random() * 2000));
      await chat.sendStateTyping();
      await new Promise((r) => setTimeout(r, 2000 + Math.random() * 2000));
      await client.sendMessage(msg.from, await handleInicio(msg.from));
      return;
    }

    const chat = await msg.getChat();
    await new Promise((r) => setTimeout(r, 2000 + Math.random() * 3000));
    await chat.sendStateTyping();
    await new Promise((r) => setTimeout(r, 3000 + Math.random() * 3000));

    const resposta = await processarMensagem(msg, client);
    if (resposta) {
      await client.sendMessage(msg.from, resposta);
    }
  } catch (error) {
    logger.error(`Erro ao processar mensagem de ${msg.from}: ${error.message}`);
  }
});

const iniciar = async () => {
  try {
    await syncDatabase();
    logger.info("Banco de dados sincronizado.");

    await iniciarServidor();
    iniciarLembretes();
    client.initialize();
  } catch (error) {
    logger.error(`Erro ao iniciar: ${error.message}`);
    process.exit(1);
  }
};

iniciar();
