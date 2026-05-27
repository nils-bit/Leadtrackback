import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "https://leadtrackback.vercel.app",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
