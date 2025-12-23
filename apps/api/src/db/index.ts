import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = path.resolve("dev.sqlite");
export const sqlite = new Database(dbPath);

const schemaPath = path.resolve("schema.sql");
const schemaSql = fs.readFileSync(schemaPath, "utf-8");
sqlite.exec(schemaSql);

export function nowIso() {
  return new Date().toISOString();
}
