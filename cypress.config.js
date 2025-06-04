const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {},
});
export default defineConfig({
  e2e: {
    screenshotOnRunFailure: true,
    video: false
  }
})
