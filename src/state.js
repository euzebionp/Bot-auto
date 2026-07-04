const contatosRespondidos = new Set();

let client = null;

let botReady = false;

module.exports = {
  contatosRespondidos,
  getClient: () => client,
  setClient: (c) => { client = c; },
  isBotReady: () => botReady,
  setBotReady: (v) => { botReady = v; },
};
