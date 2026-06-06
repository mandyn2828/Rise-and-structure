const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = process.env.DATABASE_URL || path.join(__dirname, '..', 'database', 'dev.db');
const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

console.log(`Using database at ${dbPath}`);

// Run Schema
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);
console.log('Schema initialized.');

// Check if content exists
const contentCount = db.prepare('SELECT COUNT(*) as count FROM daily_content').get().count;

if (contentCount === 0) {
  console.log('No content found. Running ingestion...');
  try {
    const ingest = require('./ingest-content.js');
    if (typeof ingest === 'function') {
      ingest();
    } else {
      console.log('Ingest script did not export a function, assuming it ran on require.');
    }
  } catch (err) {
    console.error('Failed to run ingestion:', err.message);
  }
} else {
  console.log(`Content already present (${contentCount} items). Skipping ingestion.`);
}

db.close();
console.log('Migration and seeding check complete.');
