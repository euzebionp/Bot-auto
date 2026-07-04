const leadService = require("../services/leadService");
const logger = require("../utils/logger");

const estadosCaptura = new Map();

const iniciarCaptura = async (telefone) => {
  estadosCaptura.set(telefone, { etapa: "nome" });
  return "Ótimo! Vou te ajudar com a matrícula.\n\n📝 Por favor, informe seu *nome completo*:";
};

const processarResposta = async (telefone, mensagem, client) => {
  const sessao = estadosCaptura.get(telefone);
  if (!sessao) return null;

  try {
    switch (sessao.etapa) {
      case "nome":
        sessao.nome = mensagem;
        sessao.etapa = "interesse";
        return `Prazer, ${mensagem}! 🎉\n\nQual categoria você tem interesse?\n\n1️⃣ - Moto (A)\n2️⃣ - Carro (B)\n3️⃣ - Moto + Carro (AB)\n4️⃣ - ACC (Cursos Especiais)\n5️⃣ - Ainda não sei`;

      case "interesse":
        const mapaInteresse = {
          "1": "A",
          "2": "B",
          "3": "AB",
          "4": "ACC",
          "5": "indefinido",
        };
        sessao.interesse = mapaInteresse[mensagem] || mensagem;
        sessao.etapa = "confirmar";

        const lead = await leadService.encontrarOuCriar(telefone);
        await leadService.atualizarLead(telefone, {
          nome: sessao.nome,
          interesse: sessao.interesse,
          status: "qualificado",
        });
        await leadService.concederConsentimento(telefone);

        estadosCaptura.delete(telefone);

        logger.info(
          `Lead capturado: ${sessao.nome}, ${telefone}, interesse: ${sessao.interesse}`
        );

        return (
          `✅ *Cadastro realizado com sucesso!*\n\n` +
          `📝 *Nome:* ${sessao.nome}\n` +
          `🏷️ *Interesse:* ${sessao.interesse}\n\n` +
          `Um de nossos instrutores entrará em contato em breve para dar continuidade.\n\n` +
          `Enquanto isso, enviamos mais informações sobre essa categoria.\n\n` +
          `Digite *MENU* para voltar ao início.`
        );

      default:
        estadosCaptura.delete(telefone);
        return null;
    }
  } catch (error) {
    logger.error(`Erro na captura de lead: ${error.message}`);
    estadosCaptura.delete(telefone);
    return `Desculpe, tive um problema ao processar seu cadastro. Por favor, tente novamente mais tarde.`;
  }
};

const estaEmCaptura = (telefone) => estadosCaptura.has(telefone);

const removerSessao = (telefone) => {
  estadosCaptura.delete(telefone);
};

module.exports = {
  iniciarCaptura,
  processarResposta,
  estaEmCaptura,
  removerSessao,
};
