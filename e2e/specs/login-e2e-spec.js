const EC = protractor.ExpectedConditions;

it('debería cargar la página de inicio correctamente', async () => {
  await browser.get('http://localhost:8100/home');

  const usernameInput = element(by.css('ion-item:nth-of-type(1) ion-input input'));
  await browser.wait(EC.elementToBeClickable(usernameInput), 10000);
  await usernameInput.sendKeys('yu.roman');

  const passwordInput = element(by.css('ion-item:nth-of-type(2) ion-input input'));
  await browser.wait(EC.elementToBeClickable(passwordInput), 10000);
  await passwordInput.sendKeys('passyu');

  const loginButton = element(by.xpath("//ion-button[contains(., 'Iniciar Sesión')]"));
  await browser.wait(EC.elementToBeClickable(loginButton), 10000);
  await loginButton.click();

  // Espera hasta que la URL contenga '/user-dashboard'
  await browser.wait(EC.urlContains('/user-dashboard'), 10000);
  const url = await browser.getCurrentUrl();
  expect(url).toContain('/user-dashboard');

  // Mensaje en la consola al final
  console.log('✅ Prueba exitosa: La redirección al dashboard se realizó correctamente.');
});
