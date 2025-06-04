const { defineConfig } = require("cypress");
const fs = require("fs");

module.exports = defineConfig({
  screenshotOnRunFailure: true,
  e2e: {
    setupNodeEvents(on) {
      on("task", {
        logFailure({ url, errorMessage, screenshot }) {
          let failures = [];
          if (fs.existsSync("failures.json")) {
            failures = JSON.parse(fs.readFileSync("failures.json"));
          }

          if (!failures.find(f => f.url === url)) {
            failures.push({ url, errorMessage, screenshot });
            fs.writeFileSync("failures.json", JSON.stringify(failures, null, 2));
          }
          return null;
        },
      });
    },
  },
});
