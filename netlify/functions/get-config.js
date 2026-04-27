exports.handler = async () => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: "striker-sales.firebaseapp.com",
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: "striker-sales.firebasestorage.app",
      messagingSenderId: process.env.FIREBASE_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    })
  };
};
