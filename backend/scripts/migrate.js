const fs = require('fs');
const path = require('path');
const db = require('../src/db');

async function runMigration() {
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  
  console.log('Running migrations...');
  
  // Run Schema
  const schema = fs.readFileSync(schemaPath, 'utf8');
  await db.exec(schema);
  console.log('Schema initialized.');
  
  // Check if content exists
  const result = await db.get('SELECT COUNT(*) as count FROM daily_content');
  const contentCount = parseInt(result.count);
  
  if (contentCount === 0) {
    console.log('No content found. Running ingestion...');
    try {
      const ingest = require('./ingest-content.js');
      if (typeof ingest === 'function') {
        await ingest();
      }
    } catch (err) {
      console.error('Failed to run ingestion:', err.message);
    }
  } else {
    console.log(`Content already present (${contentCount} items). Skipping ingestion.`);
  }
  
  console.log('Migration and seeding check complete.');
}

if (require.main === module) {
  runMigration().then(() => {
    console.log('Done.');
    process.exit(0);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = runMigration;
