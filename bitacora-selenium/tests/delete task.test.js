const { By, until } = require("selenium-webdriver");
const assert = require("assert");
const { buildDriver } = require("../helpers/driver");
const { takeScreenshot } = require("../helpers/screenshot");
const { loginAsAdmin } = require("../helpers/login");
const { pause } = require("../helpers/pause");
const { BASE_URL } = require("../config");

/**
 * Historia de usuario 4: Eliminar tarea
 * Como usuario, quiero eliminar una tarea para quitar pendientes
 * que ya no necesito.
 */
describe("Historia 4 - Eliminar tarea", function () {
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
  });

  afterEach(async function () {
    if (!driver) return;
    const status = this.currentTest.state === "passed" ? "OK" : "FALLO";
    await pause(driver);
    await takeScreenshot(driver, `${status}-${this.currentTest.title}`);
    await driver.quit();
  });

  it("[Camino feliz] Eliminar y confirmar quita la tarea y recalcula estadisticas", async function () {
    await createTask("Comprar leche");
    await createTask("Llamar al dentista");

    
    const deleteBtnForDentista = await driver.findElement(
      By.xpath('//li[contains(., "Llamar al dentista")]//button[@data-testid="task-delete"]')
    );
    await deleteBtnForDentista.click();
    await pause(driver);

    const alert = await driver.wait(until.alertIsPresent(), 5000);
    await pause(driver);
    await alert.accept();
    await pause(driver);

    const taskList = await driver.findElement(By.id("task-list"));
    await driver.wait(async () => {
      const text = await taskList.getText();
      return !text.includes("Llamar al dentista") && text.includes("Comprar leche");
    }, 8000);
    await pause(driver);

    const listText = await taskList.getText();
    assert.ok(!listText.includes("Llamar al dentista"), "La tarea eliminada no deberia seguir en la lista");
    assert.ok(listText.includes("Comprar leche"), "La otra tarea deberia permanecer sin cambios");

    const statsLabel = await driver.findElement(By.id("stats-label"));
    const statsText = await statsLabel.getText();
    assert.ok(statsText.includes("0 de 1"), "Las estadisticas deberian recalcularse tras eliminar");
  });

  it("[Negativa] Eliminar y cancelar deja la tarea sin cambios", async function () {
    await createTask("Comprar leche");

    await driver.findElement(By.css('[data-testid="task-delete"]')).click();
    await pause(driver);

    const alert = await driver.wait(until.alertIsPresent(), 5000);
    await pause(driver);
    await alert.dismiss();
    await pause(driver);

    const taskList = await driver.findElement(By.id("task-list"));
    const listText = await taskList.getText();
    assert.ok(listText.includes("Comprar leche"), "La tarea deberia permanecer en la lista tras cancelar");
  });

  it("[Limites] Eliminar la ultima tarea existente muestra el estado vacio", async function () {
    await createTask("Comprar leche");

    await driver.findElement(By.css('[data-testid="task-delete"]')).click();
    await pause(driver);

    const alert = await driver.wait(until.alertIsPresent(), 5000);
    await pause(driver);
    await alert.accept();
    await pause(driver);

    const emptyState = await driver.wait(
      until.elementIsVisible(driver.findElement(By.id("empty-state"))),
      5000
    );
    await pause(driver);
    const emptyText = await emptyState.getText();

    assert.ok(
      emptyText.includes("La bitácora está en blanco"),
      "Deberia mostrar el mensaje de estado vacio, no un error"
    );
  });
});