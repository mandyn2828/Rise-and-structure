const { Pool } = require('pg');
const Database = require('better-sqlite3');
const path = require('path');

let pool = null;
let sqliteDb = null;

if (process.env.DATABASE_URL) {
  console.log('Connecting to PostgreSQL...');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
} else {
  console.log('Falling back to SQLite...');
  const dbPath = path.join(__dirname, '..', 'database', 'dev.db');
  sqliteDb = new Database(dbPath);
}

module.exports = {
  query: async (text, params) => {
    if (pool) {
      return pool.query(text, params);
    } else {
      // SQLite shim
      const sqliteSql = text.replace(/\$\d+/g, '?');
      const stmt = sqliteDb.prepare(sqliteSql);
      if (text.trim().toLowerCase().startsWith('select')) {
        const rows = stmt.all(...(params || []));
        return { rows, rowCount: rows.length };
      } else {
        const result = stmt.run(...(params || []));
        return { rowCount: result.changes, rows: [] };
      }
    }
  },
  // Specialized helpers to match lead's suggested pattern
  get: async (text, params) => {
    if (pool) {
      const res = await pool.query(text, params);
      return res.rows[0];
    } else {
      const sqliteSql = text.replace(/\$\d+/g, '?');
      return sqliteDb.prepare(sqliteSql).get(...(params || []));
    }
  },
  all: async (text, params) => {
    if (pool) {
      const res = await pool.query(text, params);
      return res.rows;
    } else {
      const sqliteSql = text.replace(/\$\d+/g, '?');
      return sqliteDb.prepare(sqliteSql).all(...(params || []));
    }
  },
  exec: async (text) => {
    if (pool) {
      // PG doesn't support multiple statements in query() easily without some settings,
      // but usually for schema migration it's fine if it's one block.
      // However, PG prefers one statement at a time for safety.
      // For now, we'll try it as is.
      return pool.query(text);
    } else {
      return sqliteDb.exec(text);
    }
  },
  close: async () => {
    if (pool) {
      await pool.end();
    } else {
      sqliteDb.close();
    }
  }
};
