const fs = require("fs");
const path = require("path");

const SCREENSHOT_DIR = path.join(__dirname, "..", "reports", "screenshots");

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

/**
 * Toma una captura de pantalla del estado actual del navegador y la guarda
 * en reports/screenshots con un nombre basado en el escenario de prueba.
 * @param {import('selenium-webdriver').WebDriver} driver
 * @param {string} scenarioName - nombre descriptivo del escenario (sin espacios raros)
 */
async function takeScreenshot(driver, scenarioName) {
  const safeName = scenarioName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const timestamp = Date.now();
  const filePath = path.join(SCREENSHOT_DIR, `${safeName}-${timestamp}.png`);

  const image = await driver.takeScreenshot();
  fs.writeFileSync(filePath, image, "base64");

  return filePath;
}

module.exports = { takeScreenshot };