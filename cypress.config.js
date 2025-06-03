const { defineConfig } = require("cypress");
const fs = require("fs");

module.exports = defineConfig({
  screenshotOnRunFailure: true,
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        logFailure({ url, errorMessage }) {
          const file = "failures.json";
          const failures = fs.existsSync(file)
            ? JSON.parse(fs.readFileSync(file))
            : [];
          failures.push({ url, errorMessage });
          fs.writeFileSync(file, JSON.stringify(failures, null, 2));
          return null;
        },
      });
    },
  },
});
