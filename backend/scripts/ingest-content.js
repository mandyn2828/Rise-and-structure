const fs = require('fs');
const path = require('path');
const db = require('../src/db');
const { v4: uuidv4 } = require('uuid');

async function runIngestion() {
  console.log('Starting content ingestion...');
  
  // In Render, we'll use the local content folder if CONTENT_DIR isn't set
  const localContent = path.join(__dirname, '..', 'content');
  const contentDir = process.env.CONTENT_DIR || (fs.existsSync(localContent) ? localContent : '/home/team/shared/content');
  
  if (!fs.existsSync(contentDir)) {
    console.warn(`Content directory not found: ${contentDir}. Skipping ingestion.`);
    return;
  }

  async function ingestPillar(pillar) {
    const pillarDir = path.join(contentDir, pillar);
    if (!fs.existsSync(pillarDir)) return;

    const files = fs.readdirSync(pillarDir).filter(f => f.endsWith('.md') && !f.includes('OVERVIEW'));

    for (const file of files) {
      const filePath = path.join(pillarDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const match = file.match(/^(\d+)([ab])?-(.+)\.md$/);
      if (!match) continue;

      const dayOfWeek = parseInt(match[1]);
      const weekType = match[2] ? match[2].toUpperCase() : 'A';
      const slug = match[3];

      const titleMatch = content.match(/^# (.+)$/m);
      const title = titleMatch ? titleMatch[1] : slug;

      const difficulties = ['starter', 'builder', 'thriver'];

      for (const diff of difficulties) {
        try {
          await db.query(`
            INSERT INTO daily_content (id, pillar, day_of_week, week_type, title, body, difficulty, slug)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT(day_of_week, week_type, pillar, difficulty) DO UPDATE SET
              title = EXCLUDED.title,
              body = EXCLUDED.body,
              slug = EXCLUDED.slug
          `, [uuidv4(), pillar, dayOfWeek, weekType, title, content, diff, `${pillar}-${diff}-${file}`]);
          console.log(`Ingested ${pillar}/${file} for ${diff}`);
        } catch (err) {
          console.error(`Error ingesting ${file}:`, err.message);
        }
      }
    }
  }

  const pillars = ['wellness', 'mindset', 'finance'];
  for (const pillar of pillars) {
    await ingestPillar(pillar);
  }

  // Ingest Courses
  const coursesDir = path.join(contentDir, 'courses');
  console.log(`Checking for courses in: ${coursesDir}`);
  if (fs.existsSync(coursesDir)) {
    const courseFiles = fs.readdirSync(coursesDir).filter(f => f.endsWith('-blueprint.md'));
    console.log(`Found ${courseFiles.length} course blueprints`);
    for (const file of courseFiles) {
      const content = fs.readFileSync(path.join(coursesDir, file), 'utf8');
      const slugMatch = content.match(/\*\*Slug:\*\* (.+)/);
      const priceMatch = content.match(/\*\*Price:\*\* \$(\d+)/);
      const titleMatch = content.match(/^# (.+) —/m);

      if (slugMatch && priceMatch && titleMatch) {
        const slug = slugMatch[1].trim();
        const priceCents = parseInt(priceMatch[1]) * 100;
        const title = titleMatch[1].trim();
        const difficulty = 'all'; // Default

        await db.query(`
          INSERT INTO courses (id, slug, title, description, price_cents, difficulty)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT(slug) DO UPDATE SET
            title = EXCLUDED.title,
            price_cents = EXCLUDED.price_cents
        `, [uuidv4(), slug, title, content, priceCents, difficulty]);
        console.log(`Ingested course: ${title}`);
      }
    }
  }

  console.log('Ingestion complete.');
}

// Run if script is executed directly
if (require.main === module) {
  runIngestion().then(() => {
    console.log('Exiting...');
    process.exit(0);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = runIngestion;
