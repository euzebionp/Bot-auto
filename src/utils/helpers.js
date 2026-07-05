const obterSaudacao = () => {
  const hora = new Date().getHours();
  if (hora >= 5 && hora < 12) return "Bom dia";
  if (hora >= 12 && hora < 18) return "Boa tarde";
  return "Boa noite";
};

const formatarData = (data) => {
  const d = new Date(data);
  return d.toLocaleDateString("pt-BR");
};

const formatarTelefone = (telefone) => {
  return telefone.replace(/[^\d]/g, "");
};

const mascararTelefone = (telefone) => {
  const digits = telefone.replace(/[^\d]/g, "");
  if (digits.length < 4) return telefone;
  return `${digits.slice(0, 2)}****${digits.slice(-2)}`;
};

const isBusinessHours = () => {
  const agora = new Date();
  const diaSemana = agora.getDay();
  const hora = agora.getHours();
  return diaSemana >= 1 && diaSemana <= 5 && hora >= 8 && hora < 17;
};

module.exports = {
  obterSaudacao,
  isBusinessHours,
  formatarData,
  formatarTelefone,
  mascararTelefone,
};
