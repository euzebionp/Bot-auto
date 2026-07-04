const express = require("express");
const cors = require("cors");
const path = require("path");
const logger = require("../utils/logger");
const { autenticar, revogarToken, authMiddleware, adminMiddleware } = require("./auth");

const kpiRoutes = require("./routes/kpi");
const leadsRoutes = require("./routes/leads");
const agendamentosRoutes = require("./routes/agendamentos");
const configRoutes = require("./routes/config");
const botRoutes = require("./routes/bot");
const logsRoutes = require("./routes/logs");

const app = express();
const PORT = process.env.API_PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/auth/login", (req, res) => {
  const { usuario, senha } = req.body;
  if (!usuario || !senha) {
    return res.status(400).json({ erro: "Usuário e senha obrigatórios" });
  }
  const resultado = autenticar(usuario, senha);
  if (!resultado) {
    return res.status(401).json({ erro: "Credenciais inválidas" });
  }
  res.json(resultado);
});

app.post("/api/auth/logout", authMiddleware, (req, res) => {
  const header = req.headers.authorization;
  const token = header.slice(7);
  revogarToken(token);
  res.json({ mensagem: "Sessão encerrada" });
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.json({ usuario: req.usuario.usuario, role: req.usuario.role });
});

app.use("/api/kpi", authMiddleware, kpiRoutes);
app.use("/api/leads", authMiddleware, leadsRoutes);
app.use("/api/agendamentos", authMiddleware, agendamentosRoutes);
app.use("/api/config", authMiddleware, adminMiddleware, configRoutes);
app.use("/api/bot", authMiddleware, botRoutes);
app.use("/api/logs", authMiddleware, adminMiddleware, logsRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    res.status(404).json({ erro: "Rota não encontrada" });
  }
});

const iniciarServidor = () => {
  return new Promise((resolve) => {
    app.listen(PORT, () => {
      logger.info(`Painel de controle disponível em http://localhost:${PORT}`);
      resolve();
    });
  });
};

module.exports = { app, iniciarServidor };
