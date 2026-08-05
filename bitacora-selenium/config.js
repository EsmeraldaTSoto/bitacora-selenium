// URL base donde se sirve la aplicacion Bitacora.
// Levantar la app antes de correr las pruebas con: npm run serve
const BASE_URL = process.env.BITACORA_BASE_URL || "http://localhost:8080";

module.exports = { BASE_URL };