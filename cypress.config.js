const { defineConfig } = require("cypress");
const fs = require("fs");

module.exports = defineConfig({
  screenshotOnRunFailure: true,
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        logFailure({ url }) {
          const failures = fs.existsSync("failures.json")
            ? JSON.parse(fs.readFileSync("failures.json"))
            : [];
          failures.push({ url });
          fs.writeFileSync("failures.json", JSON.stringify(failures, null, 2));
          return null;
        },
      });
    },
  },
});
