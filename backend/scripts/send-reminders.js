const dotenv = require('dotenv');
const path = require('path');
const db = require('../src/db');
const { sendDailyReminder } = require('../src/email');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function runReminders() {
  console.log('Starting daily reminders...');
  
  const now = new Date();
  const dayOfWeek = now.getDay();
  const weekType = (Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000)) % 2 === 0) ? 'A' : 'B';

  const activeUsers = await db.all('SELECT id, email, full_name, tier FROM users WHERE subscription_status = $1', ['active']);
  console.log(`Found ${activeUsers.length} active users.`);

  for (const user of activeUsers) {
    try {
      const tasks = await db.all(`
        SELECT title, pillar 
        FROM daily_content 
        WHERE day_of_week = $1 AND week_type = $2 AND difficulty = $3
      `, [dayOfWeek, weekType, user.tier]);

      if (tasks.length > 0) {
        await sendDailyReminder(user.email, user.full_name, tasks);
        console.log(`Sent reminder to ${user.email}`);
      }
    } catch (err) {
      console.error(`Failed to send reminder to ${user.email}:`, err);
    }
  }

  console.log('Daily reminders complete.');
  await db.close();
}

runReminders().catch(async (err) => {
  console.error(err);
  await db.close();
  process.exit(1);
});
