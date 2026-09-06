import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import test from "node:test";

const PORT = 18765;
const BASE_URL = `http://127.0.0.1:${PORT}`;

test("the retired listen URLs permanently redirect to the canonical homepage", async (t) => {
  const server = spawn(process.execPath, ["server.mjs"], {
    cwd: new URL("..", import.meta.url),
    env: { ...process.env, PORT: String(PORT) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  t.after(() => server.kill());

  await Promise.race([
    once(server.stdout, "data"),
    once(server, "exit").then(([code]) => {
      throw new Error(`Production server exited before startup with code ${code}`);
    }),
  ]);

  for (const path of ["/listen", "/listen/", "/tsp", "/tsp/"]) {
    const response = await fetch(`${BASE_URL}${path}`, { redirect: "manual" });
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("location"), "https://ourheadwaters.ca/");
  }
});