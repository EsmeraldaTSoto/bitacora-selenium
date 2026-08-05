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

  
  await driver.executeScript("window.localStorage.removeItem('bitacora_tasks');");
  await driver.navigate().refresh();
  await driver.wait(until.elementLocated(By.id("task-form")), 10000);
}

module.exports = { loginAsAdmin };