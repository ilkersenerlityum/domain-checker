const { defineConfig } = require("cypress");
const fs = require("fs");

module.exports = defineConfig({
  screenshotOnRunFailure: true,
  e2e: {
    setupNodeEvents(on) {
      on("task", {
        logFailure({ url, errorMessage, screenshot }) {
          let failures = [];
          const filePath = "failures.json";
          try {
            if (fs.existsSync(filePath)) {
              failures = JSON.parse(fs.readFileSync(filePath));
            }
          } catch (err) {
            // Dosya okuma hatası olursa yeni başlat
            failures = [];
          }

          if (!failures.find(f => f.url === url)) {
            failures.push({ url, errorMessage, screenshot });
            fs.writeFileSync(filePath, JSON.stringify(failures, null, 2));
          }

          return null;
        },
        clearFailures() {
          const filePath = "failures.json";
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          return null;
        }
      });
    }
  }
});