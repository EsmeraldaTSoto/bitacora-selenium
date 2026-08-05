const { By, until } = require("selenium-webdriver");
const assert = require("assert");
const { buildDriver } = require("../helpers/driver");
const { takeScreenshot } = require("../helpers/screenshot");
const { loginAsAdmin } = require("../helpers/login");
const { pause } = require("../helpers/pause");
const { hasNoHorizontalOverflow } = require("../helpers/layout");
const { BASE_URL } = require("../config");

/**
 * Historia de usuario 2: Crear tarea
 * Como usuario, quiero anotar una nueva tarea con titulo y descripcion
 * para llevar registro de mis pendientes.
 */
describe("Historia 2 - Crear tarea", function () {
  let driver;

  beforeEach(async function () {
    driver = await buildDriver();
    await loginAsAdmin(driver, BASE_URL);
    await pause(driver);
  });

  afterEach(async function () {
    if (!driver) return;
    const status = this.currentTest.state === "passed" ? "OK" : "FALLO";
    await pause(driver);
    await takeScreenshot(driver, `${status}-${this.currentTest.title}`);
    await driver.quit();
  });

  it("[Camino feliz] Crear tarea con titulo y descripcion la agrega a la lista", async function () {
    await driver.findElement(By.id("title")).sendKeys("Comprar leche");
    await pause(driver);
    await driver.findElement(By.id("description")).sendKeys("En el supermercado");
    await pause(driver);
    await driver.findElement(By.id("submit-btn")).click();
    await pause(driver);

    const taskList = await driver.wait(
      until.elementLocated(By.id("task-list")),
      5000
    );
    await driver.wait(until.elementTextContains(taskList, "Comprar leche"), 5000);
    await pause(driver);

    const listText = await taskList.getText();
    assert.ok(listText.includes("Comprar leche"), "La tarea deberia aparecer en la lista");
    assert.ok(listText.includes("En el supermercado"), "La descripcion deberia aparecer en la lista");
  });

  it("[Negativa] Titulo vacio muestra error y no crea la tarea", async function () {
    await driver.findElement(By.id("submit-btn")).click();
    await pause(driver);

    const errorEl = await driver.wait(
      until.elementIsVisible(driver.findElement(By.css('[data-testid="task-error"]'))),
      5000
    );
    const errorText = await errorEl.getText();
    await pause(driver);

    assert.strictEqual(errorText, 'El campo "titulo" es obligatorio.');

    const emptyState = await driver.findElement(By.id("empty-state"));
    const isEmptyVisible = await emptyState.isDisplayed();
    assert.ok(isEmptyVisible, "El estado vacio deberia seguir visible, ninguna tarea se creo");
  });

  it("[Limites] Titulo muy largo (200+ caracteres) se crea sin romper la vista", async function () {
    const longTitle = "a".repeat(220);
    await driver.findElement(By.id("title")).sendKeys(longTitle);
    await pause(driver);
    await driver.findElement(By.id("submit-btn")).click();
    await pause(driver);

    const taskList = await driver.wait(
      until.elementLocated(By.id("task-list")),
      5000
    );
    await driver.wait(until.elementTextContains(taskList, "a".repeat(20)), 15000);
    await pause(driver);

    const listText = await taskList.getText();
    assert.ok(listText.includes(longTitle), "La tarea con titulo largo deberia crearse y mostrarse completa");

    const noOverflow = await hasNoHorizontalOverflow(driver);
    assert.ok(noOverflow, "El titulo largo no deberia generar scroll horizontal ni romper la vista");
  });
});