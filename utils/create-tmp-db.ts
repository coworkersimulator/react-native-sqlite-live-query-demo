import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";

(async () => {
  const migrations = readFileSync(
    "./assets/db/migrations-client/01-initialize.sql",
    "utf-8",
  );
  await mkdir("tmp", { recursive: true });
  const client = createClient({
    url: "file:tmp/tmp.db",
  });
  await client.executeMultiple(migrations);
  client.close();
})();
