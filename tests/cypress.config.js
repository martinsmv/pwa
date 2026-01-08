const { defineConfig } = require("cypress");

module.exports = defineConfig({
    video: true,
    screenshotOnRunFailure: true,

    reporter: "mochawesome",
    reporterOptions: {
        reportDir: "reports",
        overwrite: false,
        html: false,
        json: true
    },

    e2e: {
        baseUrl: "http://localhost:5173",
        specPattern: "e2e/**/*.cy.js",
        supportFile: "support/e2e.js",
        defaultCommandTimeout: 8000
    }
});