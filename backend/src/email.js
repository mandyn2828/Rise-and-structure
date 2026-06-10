const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendWelcomeEmail(email, fullName) {
  try {
    await resend.emails.send({
      from: 'Rise & Structure <noreply@riseandstructure.com>',
      to: email,
      subject: 'Welcome to Rise & Structure — Your Rebuild Starts Now',
      html: `<p>Hi ${fullName || 'there'},</p>
      <p>Welcome to Rise & Structure. Your daily guidance system is ready.</p>
      <p><a href="https://www.riseandstructure.com/dashboard">Go to your dashboard</a></p>
      <p>— The Rise & Structure Team</p>`
    });
  } catch (error) {
    console.error('Email send failed:', error);
  }
}

async function sendDailyReminder(email, fullName, tasks) {
  try {
    const taskListHtml = tasks.map(t => `<li><strong>${t.title}</strong> (${t.pillar})</li>`).join('');
    await resend.emails.send({
      from: 'Rise & Structure <noreply@riseandstructure.com>',
      to: email,
      subject: "Your Daily Rebuild — Today's Tasks",
      html: `
        <p>Hi ${fullName || 'there'},</p>
        <p>Here is your structure for today:</p>
        <ul>${taskListHtml}</ul>
        <p><a href="https://www.riseandstructure.com/dashboard">Start your session</a></p>
        <p>— The Rise & Structure Team</p>
      `
    });
  } catch (error) {
    console.error('Reminder email send failed:', error);
  }
}

module.exports = { sendWelcomeEmail, sendDailyReminder };
