const { Resend } = require('resend');

exports.handler = async (event) => {
  // GET - test ci funkcia zije
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, message: 'send-email function is alive' })
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
    console.error('[send-email] Missing fields:', { to: !!to, subject: !!subject, message: !!message });
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Chýbajú povinné polia: to, subject, message' })
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[send-email] RESEND_API_KEY is not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'RESEND_API_KEY nie je nakonfigurovaný' })
    };
  }

  console.log('[send-email] Sending via Resend to:', to, '| Subject:', subject);

  try {
    const resend = new Resend(apiKey);
    const htmlBody = message.replace(/\n/g, '<br>');

    const { data: result, error } = await resend.emails.send({
      from: 'STRIKER Wärmetechnologie <info@striker-energy.de>',
      to: [to],
      subject,
      text: message,
      html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.8;color:#222">${htmlBody}</div>`
    });

    if (error) {
      console.error('[send-email] Resend error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: error.message })
      };
    }

    console.log('[send-email] Sent OK. ID:', result.id, '| To:', to);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, sentTo: to, messageId: result.id })
    };

  } catch (err) {
    console.error('[send-email] Unexpected error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
