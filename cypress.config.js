const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {},
});
screenshotOnRunFailure: true
const fs = require("fs");
module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        logFailure({ url, errorMessage }) {
          const failures = JSON.parse(fs.existsSync("failures.json") ? fs.readFileSync("failures.json") : "[]");
          failures.push({ url, errorMessage });
          fs.writeFileSync("failures.json", JSON.stringify(failures, null, 2));
          return null;
        },
      });
    },
  },
};
