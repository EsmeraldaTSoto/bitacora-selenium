const { By, until } = require("selenium-webdriver");
const assert = require("assert");
const { buildDriver } = require("../helpers/driver");
const { takeScreenshot } = require("../helpers/screenshot");
const { loginAsAdmin } = require("../helpers/login");
const { pause } = require("../helpers/pause");
const { hasNoHorizontalOverflow } = require("../helpers/layout");
const { BASE_URL } = require("../config");

/**
 * Historia de usuario 3: Editar tarea
 * Como usuario, quiero modificar el titulo o la descripcion de una tarea
 * existente para corregir o actualizar su informacion.
 */
describe("Historia 3 - Editar tarea", function () {
  let driver;

  /**
   * Crea una tarea base para poder editarla en cada test.
   */
  async function createBaseTask(title, description) {
    await driver.findElement(By.id("title")).sendKeys(title);
    await pause(driver);
    await driver.findElement(By.id("description")).sendKeys(description);
    await pause(driver);
    await driver.findElement(By.id("submit-btn")).click();
    await pause(driver);
    await driver.wait(until.elementLocated(By.css('[data-testid="task-edit"]')), 5000);
  }

  beforeEach(async function () {
    driver = await buildDriver();
    await loginAsAdmin(driver, BASE_URL);
    await pause(driver);
    await createBaseTask("Comprar leche", "En el supermercado");
  });

  afterEach(async function () {
    if (!driver) return;
    const status = this.currentTest.state === "passed" ? "OK" : "FALLO";
    await pause(driver);
    await takeScreenshot(driver, `${status}-${this.currentTest.title}`);
    await driver.quit();
  });

  it("[Camino feliz] Editar titulo y descripcion actualiza la tarea", async function () {
    await driver.findElement(By.css('[data-testid="task-edit"]')).click();
    await pause(driver);

    const titleInput = await driver.findElement(By.id("title"));
    await titleInput.clear();
    await titleInput.sendKeys("Comprar pan");
    await pause(driver);

    const descriptionInput = await driver.findElement(By.id("description"));
    await descriptionInput.clear();
    await descriptionInput.sendKeys("En la panaderia");
    await pause(driver);

    await driver.findElement(By.id("submit-btn")).click();
    await pause(driver);

    const taskList = await driver.wait(until.elementLocated(By.id("task-list")), 5000);
    await driver.wait(until.elementTextContains(taskList, "Comprar pan"), 5000);
    await pause(driver);

    const listText = await taskList.getText();
    assert.ok(listText.includes("Comprar pan"), "La tarea deberia mostrar el nuevo titulo");
    assert.ok(listText.includes("En la panaderia"), "La tarea deberia mostrar la nueva descripcion");
    assert.ok(!listText.includes("Comprar leche"), "El titulo anterior no deberia seguir apareciendo");
  });

  it("[Negativa] Borrar el titulo al editar muestra error y no guarda cambios", async function () {
    await driver.findElement(By.css('[data-testid="task-edit"]')).click();
    await pause(driver);

    const titleInput = await driver.findElement(By.id("title"));
    await titleInput.clear();
    await pause(driver);

    await driver.findElement(By.id("submit-btn")).click();
    await pause(driver);

    const errorEl = await driver.wait(
      until.elementIsVisible(driver.findElement(By.css('[data-testid="task-error"]'))),
      5000
    );
    const errorText = await errorEl.getText();
    await pause(driver);

    assert.strictEqual(errorText, 'El campo "titulo" es obligatorio.');

    const taskList = await driver.findElement(By.id("task-list"));
    const listText = await taskList.getText();
    assert.ok(listText.includes("Comprar leche"), "La tarea original deberia seguir sin cambios");
  });

  it("[Limites] Editar la descripcion a un texto muy largo se guarda sin romper la vista", async function () {
    await driver.findElement(By.css('[data-testid="task-edit"]')).click();
    await pause(driver);

    const longDescription = "b".repeat(220);
    const descriptionInput = await driver.findElement(By.id("description"));
    await descriptionInput.clear();
    await descriptionInput.sendKeys(longDescription);
    await pause(driver);

    await driver.findElement(By.id("submit-btn")).click();
    await pause(driver);

    const taskList = await driver.wait(until.elementLocated(By.id("task-list")), 5000);
    await driver.wait(until.elementTextContains(taskList, "b".repeat(20)), 15000);
    await pause(driver);

    const listText = await taskList.getText();
    assert.ok(listText.includes(longDescription), "La descripcion larga deberia guardarse completa");

    const noOverflow = await hasNoHorizontalOverflow(driver);
    assert.ok(noOverflow, "La descripcion larga no deberia generar scroll horizontal ni romper la vista");
  });
});