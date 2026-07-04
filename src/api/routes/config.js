const { Router } = require("express");
const { Config } = require("../../database/models");
const constants = require("../../config/constants");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const dbConfigs = await Config.findAll({ raw: true });
    const configMap = {};
    for (const c of dbConfigs) {
      configMap[c.chave] = c.valor;
    }

    res.json({
      categorias: constants.CATEGORIAS,
      horarios: constants.HORARIOS_FUNCIONAMENTO,
      endereco: constants.ENDERECO,
      telefone: constants.TELEFONE_FIXO,
      documentos: constants.DOCUMENTOS_MATRICULA,
      db: configMap,
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.put("/:chave", async (req, res) => {
  try {
    const { chave } = req.params;
    const { valor } = req.body;

    if (valor === undefined) {
      return res.status(400).json({ erro: "Valor é obrigatório" });
    }

    const [config] = await Config.findOrCreate({
      where: { chave },
      defaults: { chave, valor: String(valor) },
    });

    await config.update({ valor: String(valor) });
    res.json(config);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;
