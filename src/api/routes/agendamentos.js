const { Router } = require("express");
const { Op } = require("sequelize");
const { Agendamento, Lead } = require("../../database/models");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { status, data, page = 1, limit = 20 } = req.query;
    const where = {};

    if (status) where.status = status;
    if (data) {
      const inicio = new Date(data);
      inicio.setHours(0, 0, 0, 0);
      const fim = new Date(data);
      fim.setHours(23, 59, 59, 999);
      where.data_hora = { [Op.between]: [inicio, fim] };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { rows, count } = await Agendamento.findAndCountAll({
      where,
      order: [["data_hora", "DESC"]],
      limit: parseInt(limit),
      offset,
      include: [{ model: Lead, attributes: ["id", "nome", "telefone"] }],
    });

    res.json({
      agendamentos: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const agendamento = await Agendamento.findByPk(req.params.id, {
      include: [{ model: Lead, attributes: ["id", "nome", "telefone"] }],
    });
    if (!agendamento) return res.status(404).json({ erro: "Agendamento não encontrado" });
    res.json(agendamento);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const agendamento = await Agendamento.findByPk(req.params.id);
    if (!agendamento) return res.status(404).json({ erro: "Agendamento não encontrado" });

    const camposPermitidos = ["status", "tipo", "observacao", "data_hora"];
    const dados = {};
    for (const campo of camposPermitidos) {
      if (req.body[campo] !== undefined) dados[campo] = req.body[campo];
    }

    await agendamento.update(dados);
    res.json(agendamento);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const agendamento = await Agendamento.findByPk(req.params.id);
    if (!agendamento) return res.status(404).json({ erro: "Agendamento não encontrado" });
    await agendamento.update({ status: "cancelado" });
    res.json({ mensagem: "Agendamento cancelado" });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
