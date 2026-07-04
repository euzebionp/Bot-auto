const { Router } = require("express");
const { Op } = require("sequelize");
const { Lead, Conversa } = require("../../database/models");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { status, busca, page = 1, limit = 20 } = req.query;
    const where = {};

    if (status) where.status = status;
    if (busca) {
      where[Op.or] = [
        { nome: { [Op.like]: `%${busca}%` } },
        { telefone: { [Op.like]: `%${busca}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { rows, count } = await Lead.findAndCountAll({
      where,
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset,
      raw: true,
    });

    res.json({ leads: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ erro: "Lead não encontrado" });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ erro: "Lead não encontrado" });

    const camposPermitidos = ["nome", "interesse", "status", "consentimento_lgpd"];
    const dados = {};
    for (const campo of camposPermitidos) {
      if (req.body[campo] !== undefined) dados[campo] = req.body[campo];
    }
    dados.ultima_interacao = new Date();

    await lead.update(dados);
    res.json(lead);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.get("/:id/conversas", async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) return res.status(404).json({ erro: "Lead não encontrado" });

    const conversas = await Conversa.findAll({
      where: { lead_telefone: lead.telefone },
      order: [["timestamp", "ASC"]],
      limit: 100,
    });

    res.json(conversas);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
