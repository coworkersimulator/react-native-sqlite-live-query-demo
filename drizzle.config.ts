import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  dbCredentials: {
    url: "file:tmp/tmp.db", // Targets the in-memory SQLite instance
  },
});
