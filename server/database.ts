import { PHASE_PRODUCTION_BUILD } from "next/constants";
import Database from "better-sqlite3";
import path from "path";

export function newDatabaseConnection(): Database.Database {
  // Foreign key constraints are enabled by default in better-sqlite3.
  const db = new Database(path.join("data", "data.db"));
  // Enable write ahead logging (WAL) for performance.
  db.pragma("journal_mode = WAL");
  return db;
}

// Only load database at runtime.
export const DB =
  process.env.NEXT_PHASE == PHASE_PRODUCTION_BUILD
    ? (undefined as any as Database.Database)
    : newDatabaseConnection();

// The provided database connection must be used.
export async function asyncTransaction<T>(
  f: (db: Database.Database) => Promise<T>,
): Promise<T> {
  const db = newDatabaseConnection();
  db.exec("BEGIN");
  try {
    const data = await f(db);
    db.exec("COMMIT");
    return data;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
