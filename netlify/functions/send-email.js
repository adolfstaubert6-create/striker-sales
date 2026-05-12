console.log("send-email function loaded");

const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  // GET - test ci funkcia zije
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, message: "send-email function is alive" })
    };
  }

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

  const host = process.env.SMTP_HOST || 'smtp.ionos.de';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  console.log('[send-email] Config:', { host, user: user || 'MISSING', pass: pass ? 'SET' : 'MISSING', to });

  if (!user || !pass) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'SMTP nie je nakonfigurovaný' })
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: 587,
      secure: false,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
      socketTimeout: 15000
    });

    const info = await transporter.sendMail({
      from: `"STRIKER Wärmetechnologie" <${user}>`,
      to,
      subject,
      text: message,
      html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.8">${message.replace(/\n/g, '<br>')}</div>`
    });

    console.log('[send-email] Sent OK:', info.messageId);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, sentTo: to, messageId: info.messageId })
    };

  } catch (error) {
    console.error('[send-email] Error:', error.message, error.code);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message, code: error.code })
    };
  }
};
