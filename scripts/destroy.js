const fs = require("fs");

// To prevent accidental usage, do not include
// this script as an NPM command.

const DATA_ROOT = process.env.DATA_ROOT ?? "data";

fs.rmSync(DATA_ROOT, { recursive: true });
