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

module.exports = { sendWelcomeEmail };
