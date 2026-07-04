const { Router } = require("express");
const { Op } = require("sequelize");
const { Lead, Agendamento, Conversa } = require("../../database/models");
const sequelize = require("../../config/database");

const router = Router();

router.get("/resumo", async (req, res) => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const totalLeads = await Lead.count();
    const leadsHoje = await Lead.count({
      where: { created_at: { [Op.gte]: hoje } },
    });

    const leadsPorStatus = await Lead.findAll({
      attributes: ["status", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
      group: ["status"],
      raw: true,
    });

    const totalComConsentimento = await Lead.count({
      where: { consentimento_lgpd: true },
    });
    const taxaConsentimento = totalLeads > 0
      ? Math.round((totalComConsentimento / totalLeads) * 100)
      : 0;

    const totalAgendamentos = await Agendamento.count();

    const agendamentosHoje = await Agendamento.count({
      where: {
        data_hora: { [Op.between]: [hoje, amanha] },
        status: "confirmado",
      },
    });

    const agendamentosPorStatus = await Agendamento.findAll({
      attributes: ["status", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
      group: ["status"],
      raw: true,
    });

    const leadsPorInteresse = await Lead.findAll({
      attributes: ["interesse", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
      where: { interesse: { [Op.ne]: null } },
      group: ["interesse"],
      raw: true,
    });

    const totalConversas = await Conversa.count();

    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

    const leadsPorDia = await Lead.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("created_at")), "dia"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: { created_at: { [Op.gte]: trintaDiasAtras } },
      group: [sequelize.fn("DATE", sequelize.col("created_at"))],
      order: [[sequelize.fn("DATE", sequelize.col("created_at")), "ASC"]],
      raw: true,
    });

    const ultimosLeads = await Lead.findAll({
      order: [["created_at", "DESC"]],
      limit: 5,
      raw: true,
    });

    const agendamentosProximos = await Agendamento.findAll({
      where: {
        data_hora: { [Op.gte]: new Date() },
        status: "confirmado",
      },
      order: [["data_hora", "ASC"]],
      limit: 5,
      include: [{ model: Lead, attributes: ["nome", "telefone"] }],
    });

    res.json({
      totalLeads,
      leadsHoje,
      leadsPorStatus,
      taxaConsentimento,
      totalAgendamentos,
      agendamentosHoje,
      agendamentosPorStatus,
      leadsPorInteresse,
      totalConversas,
      leadsPorDia,
      ultimosLeads,
      agendamentosProximos,
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
