const functions = require('firebase-functions');
const generateInvoicePDF = require('./generateInvoicePDF');
const handleStripeWebhook = require('./handleStripeWebhook');
const deleteInvoice = require('./deleteInvoice');

exports.generateInvoicePDF = generateInvoicePDF.generateInvoicePDF;
exports.handleStripeWebhook = functions.https.onRequest(handleStripeWebhook);
exports.deleteInvoice = deleteInvoice.deleteInvoice;
