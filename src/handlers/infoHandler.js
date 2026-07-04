const {
  CATEGORIAS,
  DOCUMENTOS_MATRICULA,
  HORARIOS_FUNCIONAMENTO,
  ENDERECO,
  TELEFONE_FIXO,
} = require("../config/constants");

const handleValores = () => {
  let msg = "*💰 Tabela de Valores*\n\n";
  for (const [, cat] of Object.entries(CATEGORIAS)) {
    msg += `• ${cat.nome}: *R$ ${cat.valor.toLocaleString("pt-BR")}*\n`;
  }
  msg +=
    "\n*Promoções*: Consulte nossos pacotes especiais com desconto!\n";
  msg +=
    "\n📱 *Formas de pagamento*: À vista (5% off) ou parcelamos em até 12x no cartão.\n";
  msg +=
    "\nDigite *VOLTAR* para retornar ao menu principal.";
  return msg;
};

const handleDocumentos = () => {
  let msg = "*📋 Documentos Necessários para Matrícula*\n\n";
  DOCUMENTOS_MATRICULA.forEach((doc, i) => {
    msg += `${i + 1}. ${doc}\n`;
  });
  msg +=
    "\n💡 *Dica*: Traga os documentos em envelope identificado com seu nome.\n";
  msg +=
    "\nDigite *VOLTAR* para retornar ao menu principal.";
  return msg;
};

const handleHorarios = () => {
  return (
    `*🕐 Horários de Funcionamento*\n\n` +
    `Segunda a Sexta: ${HORARIOS_FUNCIONAMENTO.seg_a_sex}\n` +
    `Sábado: ${HORARIOS_FUNCIONAMENTO.sab}\n\n` +
    `*📍 Endereço*: ${ENDERECO}\n\n` +
    `*📞 Telefone*: ${TELEFONE_FIXO}\n\n` +
    `Digite *VOLTAR* para retornar ao menu principal.`
  );
};

module.exports = { handleValores, handleDocumentos, handleHorarios };
