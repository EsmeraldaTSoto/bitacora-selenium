const { Builder, logging } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

/**
 * Crea y devuelve una instancia del WebDriver de Chrome.
 * Por defecto corre en modo headless (sin ventana visible).
 * Para verlo ejecutarse en pantalla (util para grabar el video demostrativo),
 * correr las pruebas con la variable de entorno HEADLESS=false.
 */
async function buildDriver() {
  const options = new chrome.Options();

  const headless = process.env.HEADLESS !== "false";
  if (headless) {
    options.addArguments("--headless=new");
  }
  options.addArguments("--window-size=1280,900");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments("--disable-gpu");

  const prefs = new logging.Preferences();
  prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
  options.setLoggingPrefs(prefs);

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  return driver;
}

module.exports = { buildDriver };