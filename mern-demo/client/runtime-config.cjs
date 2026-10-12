const fs = require("node:fs");
const path = require("node:path");

const config = {
  apiUrl: process.env.VITE_API_URL?.trim() || "",
};

fs.writeFileSync(
  path.join(__dirname, "dist", "runtime-config.js"),
  `window.__APP_CONFIG__ = ${JSON.stringify(config)};\n`,
);
