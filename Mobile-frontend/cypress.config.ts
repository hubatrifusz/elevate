import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8100',
    viewportWidth: 375,  // iPhone X width
    viewportHeight: 812, // iPhone X height
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
