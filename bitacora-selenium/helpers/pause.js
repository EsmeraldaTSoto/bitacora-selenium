/**
 * Pausa la ejecucion por SLOWMO milisegundos (definido por variable de entorno).
 * Util para grabar el video demostrativo, donde se necesita que cada paso
 * sea visible en pantalla en vez de ejecutarse en milisegundos.
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