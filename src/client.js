const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const logger = require("./utils/logger");

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
});

client.on("ready", () => {
  logger.info("Bot da Auto Escola conectado ao WhatsApp!");
});

client.on("disconnected", (reason) => {
  logger.warn(`Desconectado: ${reason}. Tentando reconectar...`);
  client.initialize();
});

client.on("auth_failure", (msg) => {
  logger.error(`Falha de autenticação: ${msg}`);
});

module.exports = client;
