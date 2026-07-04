const { Router } = require("express");
const fs = require("fs");
const path = require("path");

const router = Router();

const LOG_DIR = path.resolve(__dirname, "..", "..", "..", "logs");

router.get("/", (req, res) => {
  try {
    const { nivel = "combined", linhas = 100 } = req.query;
    const arquivo = nivel === "error" ? "error.log" : "combined.log";
    const caminho = path.join(LOG_DIR, arquivo);

    if (!fs.existsSync(caminho)) {
      return res.json({ logs: [], arquivo });
    }

    const conteudo = fs.readFileSync(caminho, "utf-8");
    const todasLinhas = conteudo.split("\n").filter(Boolean);
    const ultimasLinhas = todasLinhas.slice(-parseInt(linhas));

    const logs = ultimasLinhas.map((linha) => {
      try {
        return JSON.parse(linha);
      } catch {
        return { mensagem: linha };
      }
    });

    res.json({ logs, arquivo, totalDisponivel: todasLinhas.length, retornados: logs.length });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
