const { By, until } = require("selenium-webdriver");
const assert = require("assert");
const { buildDriver } = require("../helpers/driver");
const { takeScreenshot } = require("../helpers/screenshot");
const { loginAsAdmin } = require("../helpers/login");
const { pause } = require("../helpers/pause");
const { BASE_URL } = require("../config");

/**
 * Historia de usuario 5: Buscar y filtrar tareas
 * Como usuario, quiero buscar por texto y filtrar por estado
 * (todas/pendientes/completadas) para encontrar tareas especificas
 * rapidamente.
 */
describe("Historia 5 - Buscar y filtrar tareas", function () {
  let driver;

  /**
   * Crea una tarea con el titulo indicado y espera a que aparezca en la lista.
   */
  async function createTask(title) {
    await driver.findElement(By.id("title")).sendKeys(title);
    await pause(driver);
    await driver.findElement(By.id("submit-btn")).click();
    await pause(driver);
    const taskList = await driver.findElement(By.id("task-list"));
    await driver.wait(until.elementTextContains(taskList, title), 10000);
  }

  beforeEach(async function () {
    driver = await buildDriver();
    await loginAsAdmin(driver, BASE_URL);
    await pause(driver);
    await createTask("Comprar leche");
    await createTask("Llamar al dentista");
  });

  afterEach(async function () {
    if (!driver) return;
    const status = this.currentTest.state === "passed" ? "OK" : "FALLO";
    await pause(driver);
    await takeScreenshot(driver, `${status}-${this.currentTest.title}`);
    await driver.quit();
  });

  it("[Camino feliz] Buscar un termino existente muestra solo las tareas que coinciden", async function () {
    await driver.findElement(By.css('[data-testid="task-search"]')).sendKeys("leche");
    await pause(driver);

    const taskList = await driver.findElement(By.id("task-list"));
    await driver.wait(async () => {
      const text = await taskList.getText();
      return !text.includes("Llamar al dentista");
    }, 5000);
    await pause(driver);

    const listText = await taskList.getText();
    assert.ok(listText.includes("Comprar leche"), "Deberia mostrar la tarea que coincide con la busqueda");
    assert.ok(!listText.includes("Llamar al dentista"), "No deberia mostrar tareas que no coinciden");
  });

  it("[Negativa] Buscar un termino inexistente no muestra ninguna tarea", async function () {
    await driver.findElement(By.css('[data-testid="task-search"]')).sendKeys("xyz123");
    await pause(driver);

    const emptyState = await driver.wait(
      until.elementIsVisible(driver.findElement(By.id("empty-state"))),
      5000
    );
    await pause(driver);
    const emptyText = await emptyState.getText();

    assert.ok(
      emptyText.includes("Nada coincide con tu búsqueda o filtro"),
      "Deberia mostrar el mensaje de que no hay coincidencias"
    );

    const taskList = await driver.findElement(By.id("task-list"));
    const listText = await taskList.getText();
    assert.strictEqual(listText.trim(), "", "La lista no deberia mostrar ninguna tarea");
  });

  it("[Limites] Buscar con un solo caracter muestra todas las coincidencias parciales", async function () {
    await driver.findElement(By.css('[data-testid="task-search"]')).sendKeys("a");
    await pause(driver);

    const taskList = await driver.findElement(By.id("task-list"));
    await pause(driver);
    const listText = await taskList.getText();

    
    assert.ok(listText.includes("Comprar leche"), "Deberia incluir tareas que contienen la letra buscada");
    assert.ok(listText.includes("Llamar al dentista"), "Deberia incluir tareas que contienen la letra buscada");

    const resultsCount = await driver.findElement(By.id("results-count"));
    const resultsText = await resultsCount.getText();
    assert.ok(resultsText.includes("2"), "El contador de resultados deberia reflejar las 2 coincidencias");
  });
});