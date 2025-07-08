const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getStorage } = require('firebase-admin/storage');

const db = admin.firestore();

exports.deleteInvoice = functions.firestore
  .document('invoices/{invoiceId}')
  .onDelete(async (snap, context) => {
    const invoice = snap.data();
    const invoiceId = context.params.invoiceId;

    const bucket = getStorage().bucket();
    const filePath = `invoices/${invoice.userId}/${invoiceId}.pdf`;
    await bucket.file(filePath).delete().catch(err => {
      console.warn(`Failed to delete PDF: ${filePath}`, err.message);
    });
  });
