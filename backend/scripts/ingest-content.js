const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');

function runIngestion() {
  const dbPath = process.env.DATABASE_URL || path.join(__dirname, '..', 'database', 'dev.db');
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const db = new Database(dbPath);

  // Initialize schema
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);

  // In Render, we'll use the local content folder if CONTENT_DIR isn't set
  const localContent = path.join(__dirname, '..', 'content');
  const contentDir = process.env.CONTENT_DIR || (fs.existsSync(localContent) ? localContent : '/home/team/shared/content');
  
  if (!fs.existsSync(contentDir)) {
    console.warn(`Content directory not found: ${contentDir}. Skipping ingestion.`);
    return;
  }

  function ingestPillar(pillar) {
    const pillarDir = path.join(contentDir, pillar);
    if (!fs.existsSync(pillarDir)) return;

    const files = fs.readdirSync(pillarDir).filter(f => f.endsWith('.md') && !f.includes('OVERVIEW'));

    files.forEach(file => {
      const filePath = path.join(pillarDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const match = file.match(/^(\d+)([ab])?-(.+)\.md$/);
      if (!match) return;

      const dayOfWeek = parseInt(match[1]);
      const weekType = match[2] ? match[2].toUpperCase() : 'A';
      const slug = match[3];

      const titleMatch = content.match(/^# (.+)$/m);
      const title = titleMatch ? titleMatch[1] : slug;

      const difficulties = ['starter', 'builder', 'thriver'];

      difficulties.forEach(diff => {
        try {
          db.prepare(`
            INSERT INTO daily_content (id, pillar, day_of_week, week_type, title, body, difficulty, slug)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(day_of_week, week_type, pillar, difficulty) DO UPDATE SET
              title = excluded.title,
              body = excluded.body,
              slug = excluded.slug
          `).run(uuidv4(), pillar, dayOfWeek, weekType, title, content, diff, `${pillar}-${diff}-${file}`);
          console.log(`Ingested ${pillar}/${file} for ${diff}`);
        } catch (err) {
          console.error(`Error ingesting ${file}:`, err.message);
        }
      });
    });
  }

  ['wellness', 'mindset', 'finance'].forEach(ingestPillar);

  // Ingest Courses
  const coursesDir = path.join(contentDir, 'courses');
  console.log(`Checking for courses in: ${coursesDir}`);
  if (fs.existsSync(coursesDir)) {
    const courseFiles = fs.readdirSync(coursesDir).filter(f => f.endsWith('-blueprint.md'));
    console.log(`Found ${courseFiles.length} course blueprints`);
    courseFiles.forEach(file => {
      const content = fs.readFileSync(path.join(coursesDir, file), 'utf8');
      const slugMatch = content.match(/\*\*Slug:\*\* (.+)/);
      const priceMatch = content.match(/\*\*Price:\*\* \$(\d+)/);
      const titleMatch = content.match(/^# (.+) —/m);

      if (slugMatch && priceMatch && titleMatch) {
        const slug = slugMatch[1].trim();
        const priceCents = parseInt(priceMatch[1]) * 100;
        const title = titleMatch[1].trim();
        const difficulty = 'all'; // Default

        db.prepare(`
          INSERT INTO courses (id, slug, title, description, price_cents, difficulty)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(slug) DO UPDATE SET
            title = excluded.title,
            price_cents = excluded.price_cents
        `).run(uuidv4(), slug, title, content, priceCents, difficulty);
        console.log(`Ingested course: ${title}`);
      }
    });
  }

  console.log('Ingestion complete.');
  db.close();
}

// Run if script is executed directly
if (require.main === module) {
  runIngestion();
}

module.exports = runIngestion;
