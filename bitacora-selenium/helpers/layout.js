/**
 * Verifica que la pagina no tenga overflow horizontal, es decir, que el
 * contenido no se desborde y genere una barra de scroll lateral.
 * Se usa en las pruebas de "limites" para confirmar que un texto muy largo
 * no rompe visualmente la vista.
 * @param {import('selenium-webdriver').WebDriver} driver
 * @returns {Promise<boolean>} true si NO hay overflow horizontal
 */
async function hasNoHorizontalOverflow(driver) {
  const { scrollWidth, clientWidth } = await driver.executeScript(
    "return { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth };"
  );
  return scrollWidth <= clientWidth;
}

module.exports = { hasNoHorizontalOverflow };