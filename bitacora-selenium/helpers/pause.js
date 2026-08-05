/**
 * Pausa la ejecucion por SLOWMO milisegundos 
 * Si SLOWMO no esta definido, no pausa nada (pruebas corren a velocidad normal).
 * @param {import('selenium-webdriver').WebDriver} driver
 */
async function pause(driver) {
  const ms = parseInt(process.env.SLOWMO || "0", 10);
  if (ms > 0) {
    await driver.sleep(ms);
  }
}

module.exports = { pause };