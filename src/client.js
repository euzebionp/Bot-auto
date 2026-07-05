const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const logger = require("./utils/logger");
const botState = require("./state");

let reconectando = false;
let qrTimer = null;

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "./.local-auth" }),
  puppeteer: {
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--disable-blink-features=AutomationControlled",
    ],
    ignoreDefaultArgs: ["--enable-automation"],
  },
});

client.on("qr", (qr) => {
  logger.info("=== QR CODE DO WHATSAPP ===");
  logger.info("Abra WhatsApp > Aparelhos Conectados > Escanear QR Code");
  qrcode.generate(qr, { small: true });

  try {
    const qrDir = path.resolve(__dirname, "..", "data");
    if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });
    QRCode.toFile(
      path.join(qrDir, "qr-code.png"),
      qr,
      { width: 400, margin: 2 },
      () => {
        logger.info("QR Code salvo como imagem: data/qr-code.png");
      }
    );
  } catch (e) {}

  botState.setBotReady(false);
  if (qrTimer) clearTimeout(qrTimer);
  qrTimer = setTimeout(async () => {
    logger.info("QR Code expirado. Recarregando página...");
    try {
      const pages = await client.pupBrowser?.pages();
      if (pages?.length) {
        await pages[0].reload();
      }
    } catch (e) {
      logger.warn(`Erro ao recarregar: ${e.message}`);
    }
  }, 60000);
});

client.on("ready", () => {
  if (botState.isBotReady()) return;
  logger.info("Bot conectado ao WhatsApp!");
  botState.setBotReady(true);
  reconectando = false;
  if (qrTimer) clearTimeout(qrTimer);
});

client.on("disconnected", async (reason) => {
  botState.setBotReady(false);
  if (qrTimer) clearTimeout(qrTimer);

  logger.warn(`Desconectado: ${reason}`);

  if (reason === "LOGOUT") {
    logger.warn("Sessão invalidada. Escaneie o QR Code novamente quando o bot reiniciar.");
    return;
  }

  if (reconectando) return;
  reconectando = true;

  await new Promise((r) => setTimeout(r, 10000));

  try {
    await client.destroy();
  } catch (e) {
    logger.warn(`Erro ao destruir: ${e.message}`);
  }

  reconectando = false;
  logger.info("Reconectando...");
  client.initialize();
});

client.on("auth_failure", (msg) => {
  logger.error(`Falha de autenticação: ${msg}`);
  botState.setBotReady(false);
});

module.exports = client;
