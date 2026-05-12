const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { to, subject, message } = data;

  if (!to || !subject || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Chýbajú povinné polia: to, subject, message' })
    };
  }

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'SMTP nie je nakonfigurovaný na serveri' })
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });

    const htmlBody = message.replace(/\n/g, '<br>');

    const info = await transporter.sendMail({
      from: `"STRIKER Wärmetechnologie" <${user}>`,
      to,
      subject,
      text: message,
      html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.8;color:#222">${htmlBody}</div>`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        sentTo: to,
        messageId: info.messageId
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      }),
    };
  }
};
