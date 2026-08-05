const { By, until } = require("selenium-webdriver");
const { pause } = require("./pause");

/**
 * Realiza el flujo de login con las credenciales validas y espera a que
 * cargue la vista principal (task-form). Se usa como paso previo en las
 * pruebas de las demas historias, ya que todas requieren sesion iniciada.
 * @param {import('selenium-webdriver').WebDriver} driver
 * @param {string} baseUrl
 */
async function loginAsAdmin(driver, baseUrl) {
  await driver.get(`${baseUrl}/login.html`);
  await driver.wait(until.elementLocated(By.id("username")), 10000);
  await pause(driver);
  await driver.findElement(By.id("username")).sendKeys("admin");
  await pause(driver);
  await driver.findElement(By.id("password")).sendKeys("admin123");
  await pause(driver);
  await driver.findElement(By.id("login-btn")).click();
  await pause(driver);
  await driver.wait(until.elementLocated(By.id("task-form")), 10000);

  // Limpia cualquier tarea que haya quedado guardada de ejecuciones
  // anteriores (por ejemplo, si el perfil de Chrome no es efimero),
  // para que cada prueba parta siempre de una lista vacia.
  await driver.executeScript("window.localStorage.removeItem('bitacora_tasks');");
  await driver.navigate().refresh();
  await driver.wait(until.elementLocated(By.id("task-form")), 10000);
}

module.exports = { loginAsAdmin };