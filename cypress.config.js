const { defineConfig } = require("cypress");
const fs = require("fs");

module.exports = defineConfig({
  screenshotOnRunFailure: true,
  e2e: {
    setupNodeEvents(on) {
      on("task", {
        logFailure({ url }) {
          const file = "failures.json";
          const failures = fs.existsSync(file)
            ? JSON.parse(fs.readFileSync(file))
            : [];
          if (!failures.find((f) => f.url === url)) {
            failures.push({ url });
            fs.writeFileSync(file, JSON.stringify(failures, null, 2));
          }
          return null;
        },
      });
    },
  },
});
