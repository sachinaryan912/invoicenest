const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const { getStorage } = require('firebase-admin/storage');

admin.initializeApp();
const db = admin.firestore();

exports.generateInvoicePDF = functions.firestore
  .document('invoices/{invoiceId}')
  .onCreate(async (snap, context) => {
    const invoice = snap.data();
    const invoiceId = context.params.invoiceId;

    const doc = new jsPDF();
    doc.setFontSize(18).text('Invoice', 14, 22);
    doc.setFontSize(12).text(`Client: ${invoice.clientDetails.name}`, 14, 32);

    const rows = invoice.items.map(item => [
      item.description,
      item.quantity,
      `₹${item.price}`,
      `₹${item.quantity * item.price}`
    ]);

    doc.autoTable({
      head: [['Description', 'Qty', 'Price', 'Total']],
      body: rows,
      startY: 40
    });

    doc.text(`Total: ₹${invoice.total}`, 14, doc.lastAutoTable.finalY + 10);

    const pdfBuffer = doc.output('arraybuffer');
    const bucket = getStorage().bucket();

    const file = bucket.file(`invoices/${invoice.userId}/${invoiceId}.pdf`);
    await file.save(Buffer.from(pdfBuffer), {
      metadata: { contentType: 'application/pdf' }
    });

    await db.collection('invoices').doc(invoiceId).update({
      pdfUrl: `https://storage.googleapis.com/${bucket.name}/invoices/${invoice.userId}/${invoiceId}.pdf`
    });
  });
