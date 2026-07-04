const { Router } = require("express");
const client = require("../../client");
const logger = require("../../utils/logger");
const botState = require("../../state");

const router = Router();

router.get("/status", (req, res) => {
  const conectado = botState.isBotReady() && client.info && client.info.wid ? true : false;
  res.json({
    conectado,
    info: client.info || null,
    cooldown: botState.contatosRespondidos.size,
    cooldownContatos: Array.from(botState.contatosRespondidos),
  });
});

router.post("/reconnect", (req, res) => {
  try {
    logger.info("Reconexão solicitada pelo painel de controle");
    client.initialize();
    res.json({ mensagem: "Reconectando..." });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.get("/cooldown", (req, res) => {
  res.json({
    total: botState.contatosRespondidos.size,
    contatos: Array.from(botState.contatosRespondidos),
  });
});

router.post("/cooldown/limpar", (req, res) => {
  botState.contatosRespondidos.clear();
  logger.info("Cooldown limpo pelo painel de controle");
  res.json({ mensagem: "Cooldown limpo" });
});

module.exports = router;
