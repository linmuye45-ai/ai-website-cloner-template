import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const MIGRATIONS_DIR = path.join(__dirname);

export function getAppliedMigrations(db: Database.Database): number[] {
  const rows = db
    .prepare("SELECT version FROM schema_migrations ORDER BY version ASC")
    .all() as { version: number }[];
  return rows.map((r) => r.version);
}

export function getAvailableMigrations(): { version: number; sql: string }[] {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  return files.map((f) => {
    const match = f.match(/^(\d+)_.*\.sql$/);
    const version = match ? parseInt(match[1], 10) : 0;
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, f), "utf8");
    return { version, sql };
  });
}

export function runMigrations(db: Database.Database): { applied: number[]; skipped: number[] } {
  // Ensure schema_migrations table exists
  db.prepare(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`
  ).run();

  const applied = getAppliedMigrations(db);
  const available = getAvailableMigrations();
  const appliedSet = new Set(applied);

  const newlyApplied: number[] = [];
  const skipped: number[] = [];

  const tx = db.transaction(() => {
    for (const { version, sql } of available) {
      if (appliedSet.has(version)) {
        skipped.push(version);
        continue;
      }
      db.exec(sql);
      newlyApplied.push(version);
    }
  });

  tx();
  return { applied: newlyApplied, skipped };
}
