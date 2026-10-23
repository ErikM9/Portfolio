const { defineConfig } = require('cypress')

/* The specs run against baseUrl, so the site must be running on port 3000 first */
module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    /* Headless Chrome on a CI runner finds no mouse and shows the card buttons as on a phone, so it is told it has one */
    setupNodeEvents(on) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push(
            '--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4'
          )
        }
        return launchOptions
      })
    },
  },
})