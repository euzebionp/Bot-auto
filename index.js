const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

// Configuração do Cliente
const client = new Client({
  auth: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
    ],
  },
});

// Armazena quem já recebeu a mensagem recentemente para evitar spam (Anti-ban)
const contatosRespondidos = new Set();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Tudo certo! WhatsApp de Férias conectado.");
});

client.on("disconnected", (reason) => {
  console.log("Desconectado. Tentando reconectar...", reason);
  client.initialize();
});

// Função de Delay Aleatório (Mais humano que o fixo)
// Gera um tempo de espera entre min e max milissegundos
const randomDelay = (min, max) => {
  const ms = Math.floor(Math.random() * (max - min + 1) + min);
  return new Promise((res) => setTimeout(res, ms));
};

client.on("message", async (msg) => {
  // VERIFICAÇÕES DE SEGURANÇA E FILTROS:
  
  // 1. Ignorar mensagens de grupos (apenas conversas privadas)
  if (!msg.from.endsWith("@c.us")) return;

  // 2. Ignorar status/stories
  if (msg.from === "status@broadcast") return;

  // 3. Sistema de Cooldown (Anti-Flood)
  // Se já respondemos essa pessoa nas últimas 2 horas, ignoramos para não ser chato/banido
  if (contatosRespondidos.has(msg.from)) {
    console.log(`Mensagem ignorada de ${msg.from} (já respondido recentemente).`);
    return;
  }

  // LÓGICA DE RESPOSTA:
  
  try {
    const chat = await msg.getChat();

    // Adiciona o contato na lista de já respondidos
    contatosRespondidos.add(msg.from);
    
    // Remove o contato da lista após 2 horas (7200000 ms) para poder responder novamente no futuro
    setTimeout(() => {
      contatosRespondidos.delete(msg.from);
    }, 7200000); 

    // Delay inicial aleatório (entre 2 e 5 segundos) para parecer que você viu a mensagem
    await randomDelay(2000, 5000);

    // Simula "Digitando..." por um tempo aleatório (entre 3 e 6 segundos)
    await chat.sendStateTyping();
    await randomDelay(3000, 6000);

    // Define a saudação baseada na hora
    const hora = new Date().getHours();
    let saudacao;
    if (hora >= 5 && hora < 12) {
      saudacao = "Bom dia";
    } else if (hora >= 12 && hora < 18) {
      saudacao = "Boa tarde";
    } else {
      saudacao = "Boa noite";
    }

    // A Mensagem de Férias
    const mensagemFerias = 
      `${saudacao}! Tudo bem?\n\n` +
      `⚠️ *Aviso Automático*: Estou em período de férias e não estou acompanhando o WhatsApp no momento.\n\n` +
      `Para assuntos urgentes ou relacionados ao trabalho, por favor, entre em contato através dos canais abaixo:\n\n` +
      `📞 *Fixo:* (34) 3356-8050\n` +
      `🚛 *Chefe de Transporte (Ricardo Coelhão):* (34) 99790-9017\n\n` +
      `Agradeço a compreensão e retorno assim que possível!`;

    // Envia a mensagem
    await client.sendMessage(msg.from, mensagemFerias);
    console.log(`Resposta de férias enviada para ${msg.from}`);

  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
});

client.initialize();