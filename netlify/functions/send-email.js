exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    const { to, subject, message } = data;

    console.log("SEND MAIL:", to, subject);

    // Tu zatiaľ len simulácia
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed" })
    };
  }
};
