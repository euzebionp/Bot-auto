# bot_ferias

Projeto Node.js para executar um bot localmente.

# bot_ferias

Projeto Node.js que envia respostas automáticas informando período de férias via WhatsApp.

## Requisitos

- Node.js (recomenda-se v16+)

## Instalação

1. Clone o repositório (se ainda não fez):

```bash
git clone https://github.com/euzebionp/bot-ferias.git
cd bot-ferias
```

2. Instale dependências:

```bash
npm install
```

## Executando o bot

1. Inicie o bot no terminal:

```bash
node index.js
```

2. No primeiro início o terminal exibirá um QR code (texto) — escaneie com o WhatsApp para autenticar a sessão.

3. O `LocalAuth` armazenará as credenciais em `.local-auth` (ou pasta equivalente) para logins futuros sem necessidade de novo QR.

Observação: se quiser ver o navegador abrir (útil para depuração), edite `index.js` e mude `headless: true` para `headless: false`.

## Notas sobre Git

- `node_modules/` foi removido do histórico e está listado no `.gitignore`. Não versionar dependências.
- Se precisar versionar binários grandes, use Git LFS: https://git-lfs.github.com/

## Troubleshooting rápido

- Se o Chromium não for baixado automaticamente, instale uma versão do Chrome/Chromium compatível e ajuste as opções do `puppeteer` em `index.js`.
- Para logs detalhados, execute com `DEBUG=puppeteer:* node index.js` ou ajuste as opções de `whatsapp-web.js`.

---

Atualizado com instruções de execução.
Arquivo gerado automaticamente pelo assistente.
