const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// Non-destructively initialize data root.
const DATA_ROOT = process.env.DATA_ROOT ?? "data";
fs.mkdirSync(path.join(DATA_ROOT, "posts"), { recursive: true });

// Open database.
const DB = new Database(path.join(DATA_ROOT, "data.db"));
module.exports = { DB };

function getAllMigrations() {
  const migrations = [];
  for (const name of fs.readdirSync("./migrations")) {
    const index = parseInt(name);
    if (!isNaN(index)) migrations.push(index);
  }

  return new Uint32Array(migrations).sort();
}

if (require.main === module) {
  const userVersion = DB.pragma("user_version", { simple: true });
  console.log(`Current database version: ${userVersion}`);

  for (const index of getAllMigrations()) {
    const migrationPath = path.join("migrations", `${index}.js`);
    if (index <= userVersion) {
      console.log(`Skipping: ${migrationPath}`);
      continue;
    }

    // Execute migration.
    console.log(`Applying migration: ${migrationPath}`);
    require(path.join(process.cwd(), migrationPath));
    DB.pragma(`user_version = ${index}`);
  }
}
