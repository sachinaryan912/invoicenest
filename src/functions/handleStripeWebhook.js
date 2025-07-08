const stripe = require('stripe')('your-secret-key'); // 🔐 replace this securely
const admin = require('firebase-admin');
admin.initializeApp();

module.exports = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      'your-webhook-secret'
    );
  } catch (err) {
    console.error('⚠️ Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;

    await admin.firestore().collection('users').doc(userId).update({
      isPremium: true
    });
  }

  res.json({ received: true });
};
