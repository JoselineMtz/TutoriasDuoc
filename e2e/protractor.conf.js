exports.config = {
    directConnect: true,
    chromeDriver: 'C:/Users/DUOC/Desktop/appproyecto/drivers/chromedriver.exe', // Ruta del chromedriver
    capabilities: {
      browserName: 'chrome',
      chromeOptions: {
        args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
      }
    },
    specs: ['C:/Users/DUOC/Desktop/appproyecto/e2e/specs/login-e2e-spec.js'], // El archivo de prueba que quieres ejecutar
    framework: 'jasmine',
    
    jasmineNodeOpts: {
      defaultTimeoutInterval: 90000, // Aumenta el tiempo de espera a 30 segundos
    },
  
    onPrepare: () => {
      browser.manage().timeouts().implicitlyWait(10000); // Aumenta el tiempo de espera implícito
    }
  };
  