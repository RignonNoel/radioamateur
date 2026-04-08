import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    allowCypressEnv: false,
    expose: {
        // Add here  env variables to Cypress tests
    },
    },
});