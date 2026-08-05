const { By, until } = require("selenium-webdriver");
const assert = require("assert");
const { buildDriver } = require("../helpers/driver");
const { takeScreenshot } = require("../helpers/screenshot");
const { pause } = require("../helpers/pause");
const { BASE_URL } = require("../config");

/**
 * Historia de usuario 1: Iniciar sesion
 * Como usuario, quiero iniciar sesion con usuario y contraseña
 * para acceder a mi cuaderno de tareas.
 */
describe("Historia 1 - Iniciar sesion", function () {
  let driver;

  beforeEach(async function () {
    driver = await buildDriver();
    await driver.get(`${BASE_URL}/login.html`);
    await driver.wait(until.elementLocated(By.id("username")), 10000);
    await pause(driver);
  });

  afterEach(async function () {
    if (!driver) return;
    const status = this.currentTest.state === "passed" ? "OK" : "FALLO";
    await pause(driver);
    await takeScreenshot(driver, `${status}-${this.currentTest.title}`);
    await driver.quit();
  });

  it("[Camino feliz] Login valido redirige a index.html", async function () {
    await driver.findElement(By.id("username")).sendKeys("admin");
    await pause(driver);
    await driver.findElement(By.id("password")).sendKeys("admin123");
    await pause(driver);
    await driver.findElement(By.id("login-btn")).click();
    await pause(driver);

    try {
      
      await driver.wait(until.elementLocated(By.id("task-form")), 10000);
    } catch (waitError) {
      const currentUrl = await driver.getCurrentUrl();
      const logs = await driver.manage().logs().get("browser").catch(() => []);
      console.log("\n  >> DIAGNOSTICO: URL actual tras el click ->", currentUrl);
      console.log("  >> DIAGNOSTICO: errores de consola del navegador ->", JSON.stringify(logs, null, 2));
      throw waitError;
    }

    const taskForm = await driver.findElement(By.id("task-form"));
    const isDisplayed = await taskForm.isDisplayed();
    await pause(driver);
    assert.ok(isDisplayed, "Deberia mostrar la vista principal de tareas tras login valido");
  });

  it("[Negativa] Credenciales incorrectas muestra error", async function () {
    await driver.findElement(By.id("username")).sendKeys("admin");
    await pause(driver);
    await driver.findElement(By.id("password")).sendKeys("wrongpass");
    await pause(driver);
    await driver.findElement(By.id("login-btn")).click();
    await pause(driver);

    const errorEl = await driver.wait(
      until.elementIsVisible(driver.findElement(By.id("login-error"))),
      5000
    );
    const errorText = await errorEl.getText();
    await pause(driver);
    assert.strictEqual(errorText, "Usuario o contraseña incorrectos.");
  });

  it("[Negativa] Campos vacios muestra error de obligatoriedad", async function () {
    await driver.findElement(By.id("login-btn")).click();
    await pause(driver);

    const errorEl = await driver.wait(
      until.elementIsVisible(driver.findElement(By.id("login-error"))),
      5000
    );
    const errorText = await errorEl.getText();
    await pause(driver);
    assert.strictEqual(errorText, "Usuario y contraseña son obligatorios.");
  });

  it("[Limites] Usuario por debajo del minimo (3 caracteres) muestra error de longitud", async function () {
    await driver.findElement(By.id("username")).sendKeys("abc");
    await pause(driver);
    await driver.findElement(By.id("password")).sendKeys("admin123");
    await pause(driver);
    await driver.findElement(By.id("login-btn")).click();
    await pause(driver);

    const errorEl = await driver.wait(
      until.elementIsVisible(driver.findElement(By.id("login-error"))),
      5000
    );
    const errorText = await errorEl.getText();
    await pause(driver);
    assert.strictEqual(
      errorText,
      "Usuario y contraseña deben tener al menos 4 caracteres."
    );
  });

  it("[Limites] Usuario por encima del maximo (21 caracteres) muestra error de longitud", async function () {
    const longUsername = "a".repeat(21);
    await driver.findElement(By.id("username")).sendKeys(longUsername);
    await pause(driver);
    await driver.findElement(By.id("password")).sendKeys("admin123");
    await pause(driver);
    await driver.findElement(By.id("login-btn")).click();
    await pause(driver);

    const errorEl = await driver.wait(
      until.elementIsVisible(driver.findElement(By.id("login-error"))),
      5000
    );
    const errorText = await errorEl.getText();
    await pause(driver);
    assert.strictEqual(
      errorText,
      "Usuario y contraseña no pueden superar los 20 caracteres."
    );
  });
});