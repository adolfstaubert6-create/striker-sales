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
    console.error('[send-email] Missing fields:', { to: !!to, subject: !!subject, message: !!message });
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Chýbajú povinné polia: to, subject, message' })
    };
  }

  const host = process.env.SMTP_HOST || 'smtp.ionos.de';
  const port = 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  console.log('[send-email] Config:', {
    host,
    port,
    user: user || 'MISSING',
    pass: pass ? '***set***' : 'MISSING',
    to,
    subject
  });

  if (!user || !pass) {
    console.error('[send-email] SMTP env vars missing');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'SMTP nie je nakonfigurovaný na serveri' })
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: 587,
      secure: false,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });

    const htmlBody = message.replace(/\n/g, '<br>');

    const info = await transporter.sendMail({
      from: `"STRIKER Wärmetechnologie" <${user}>`,
      to,
      subject,
      text: message,
      html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.8;color:#222">${htmlBody}</div>`,
    });

    console.log('[send-email] Sent OK. MessageId:', info.messageId);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, sentTo: to, messageId: info.messageId }),
    };
  } catch (error) {
    console.error('[send-email] SMTP error:', error.message, '| Code:', error.code);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message, code: error.code }),
    };
  }
};
