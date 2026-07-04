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

module.exports = {
  obterSaudacao,
  formatarData,
  formatarTelefone,
  mascararTelefone,
};
