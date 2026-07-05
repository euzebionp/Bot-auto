const CATEGORIAS = {
  A: { nome: "Moto (A)", valor: 1200 },
  B: { nome: "Carro (B)", valor: 1500 },
  AB: { nome: "Moto + Carro (AB)", valor: 2200 },
  ACC: { nome: "ACC (Cursos Especiais)", valor: 800 },
  ADICIONAL_AUTOMATICO: { nome: "Adicional Câmbio Automático", valor: 300 },
};

const HORARIOS_FUNCIONAMENTO = {
  seg_a_sex: "08:00 às 12:00 | 13:00 às 18:00",
  sab: "08:00 às 12:00",
};

const ENDERECO = "Rua Exemplo, 123 - Centro, Cidade";

const TELEFONE_FIXO = "(34) 3356-0000";

const DOCUMENTOS_MATRICULA = [
  "RG (Original e Cópia)",
  "CPF (Original e Cópia)",
  "Comprovante de Residência (até 3 meses)",
  "Certidão de Nascimento ou Casamento",
  "02 fotos 3x4 recentes",
  "Comprovante de Escolaridade (ou declaração)",
];

const MENU_PRINCIPAL = `
*🏎️ Auto Escola Prime - Central de Atendimento*

Olá! Eu sou o *Assistente Virtual* da Auto Escola Prime. Como posso ajudar?

Digite o número da opção desejada:

1️⃣ - Valores e Categorias
2️⃣ - Documentos para Matrícula
3️⃣ - Quero me Matricular (Falar com Atendente)
4️⃣ - Agendar Aula Prática
5️⃣ - Horários e Endereço
6️⃣ - Falar com Atendente

*Ou envie sua mensagem que entenderei sua dúvida!*
`;

const FALLBACK_MESSAGE = `
Entendi! Vou transferir seu atendimento para um de nossos instrutores.

Enquanto isso, deixe registrado:
📝 *Nome:* 
📞 *Telefone:* 
🏷️ *Interesse:*

Por favor, responda com essas informações para agilizar seu atendimento.
`;

const CONSENTIMENTO_MESSAGE = `
Ao continuar utilizando este atendimento, você concorda com o armazenamento dos seus dados (nome e telefone) para fins de contato e agendamento de aulas, conforme a Lei Geral de Proteção de Dados (LGPD).

Digite *CONCORDO* para prosseguir ou *SAIR* para encerrar.
`;

const AGENDAR_MESSAGE = `
*📅 Agendamento de Aula Prática*

Por favor, informe a *data e horário* desejado (formato: DD/MM às HH:MM).

Exemplo: *15/07 às 14:30*
`;

const AULA_CONFIRMADA = (data, hora) => `
✅ *Aula Confirmada!*

📅 Data: ${data}
⏰ Horário: ${hora}

Estaremos aguardando você! Qualquer imprevisto, avise com antecedência.
`;

const LEMBRETE_AULA = (data, hora) => `
*🔔 Lembrete de Aula*

Não se esqueça da sua aula prática amanhã!
📅 Data: ${data}
⏰ Horário: ${hora}

Confirme presença respondendo *CONFIRMAR* ou cancele com *CANCELAR*.
`;

const ERRO_INTERNO = `
Desculpe, ocorreu um erro interno. Nosso time já foi notificado. Tente novamente mais tarde.
`;

const FORA_DO_HORARIO_MESSAGE = (saudacao) =>
  `${saudacao}! 😊\n\nAgradecemos o seu contato! Nosso horário de atendimento é de *Segunda a Sexta-feira, das 08:00 às 17:00*.\n\nAtualmente estamos fora do horário de atendimento, mas pode deixar que vamos retornar o mais breve possível!\n\nPara agilizar, por favor informe seu *nome completo* para entrarmos em contato:`;

module.exports = {
  CATEGORIAS,
  HORARIOS_FUNCIONAMENTO,
  ENDERECO,
  TELEFONE_FIXO,
  DOCUMENTOS_MATRICULA,
  MENU_PRINCIPAL,
  FALLBACK_MESSAGE,
  CONSENTIMENTO_MESSAGE,
  AGENDAR_MESSAGE,
  AULA_CONFIRMADA,
  LEMBRETE_AULA,
  ERRO_INTERNO,
  FORA_DO_HORARIO_MESSAGE,
};
