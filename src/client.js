const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const logger = require("./utils/logger");
const botState = require("./state");

const client = new Client({
  auth: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
    ],
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  logger.info("QR Code gerado. Escaneie com o WhatsApp.");
  botState.setBotReady(false);
});

client.on("ready", () => {
  logger.info("Bot da Auto Escola conectado ao WhatsApp!");
  botState.setBotReady(true);
});

client.on("disconnected", (reason) => {
  logger.warn(`Desconectado: ${reason}. Tentando reconectar...`);
  botState.setBotReady(false);
  client.initialize();
});

client.on("auth_failure", (msg) => {
  logger.error(`Falha de autenticação: ${msg}`);
  botState.setBotReady(false);
});

module.exports = client;
