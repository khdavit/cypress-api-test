import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'https://dummyjson.com',
    supportFile: false
  },
});
