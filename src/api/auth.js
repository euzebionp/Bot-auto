const crypto = require("crypto");
const logger = require("../utils/logger");

const tokens = new Map();

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";
const USER_USER = process.env.USER_USER || "user";
const USER_PASS = process.env.USER_PASS || "user123";

const usuariosValidos = [
  { usuario: ADMIN_USER, senha: ADMIN_PASS, role: "admin" },
  { usuario: USER_USER, senha: USER_PASS, role: "user" },
];

function autenticar(usuario, senha) {
  const encontrado = usuariosValidos.find(
    (u) => u.usuario === usuario && u.senha === senha
  );
  if (!encontrado) return null;

  const token = crypto.randomBytes(32).toString("hex");
  tokens.set(token, {
    usuario: encontrado.usuario,
    role: encontrado.role,
    criadoEm: new Date(),
  });

  return { token, role: encontrado.role, usuario: encontrado.usuario };
}

function validarToken(token) {
  return tokens.get(token) || null;
}

function revogarToken(token) {
  tokens.delete(token);
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  const token = header.slice(7);
  const sessao = validarToken(token);
  if (!sessao) {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }

  req.usuario = sessao;
  next();
}

function adminMiddleware(req, res, next) {
  if (req.usuario.role !== "admin") {
    return res.status(403).json({ erro: "Acesso restrito a administradores" });
  }
  next();
}

module.exports = {
  autenticar,
  validarToken,
  revogarToken,
  authMiddleware,
  adminMiddleware,
};
