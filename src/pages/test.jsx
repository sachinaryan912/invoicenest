 {invoices.length === 0 ? (
          <p className="text-gray-600">No invoices found.</p>
        ) : (
          <ul className="space-y-6">
            {invoices.map(invoice => (
              <li key={invoice.id} className="p-4 border padding-design rounded-md shadow-sm text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    {invoice.logo && (
                      <img
                        src={invoice.logo}
                        alt="Logo"
                        className="h-24 w-24 object-contain "
                      />
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Invoice No: <strong>{invoice.invoiceNumber || 'N/A'}</strong></p>
                      <h3 className="text-lg font-semibold text-gray-800">{invoice.clientDetails?.name || 'Unnamed Client'}</h3>
                      <p className="text-sm text-gray-500"></p>
                    <div className='padding-design'>
                      <p className="text-sm ">Invoice No: <strong>{invoice.invoiceNumber || 'N/A'}</strong></p>
                      <h2 className="text-lg font-semibold ">
                        {invoice.items.length > 0
                          ? invoice.items.map((item) => item.projectName).join(', ')
                          : "None"}
                      </h2>
                      <p className="text-sm ">
                        Date: {invoice.createdAt?.seconds ? new Date(invoice.createdAt.seconds * 1000).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleDownload(invoice.id)}
                      className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleGeneratePDF(invoice)}
                      className="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Generate PDF
                    </button>
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="px-4 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>

                {/* Hidden printable PDF template */}
                <div
                  id={`invoice-${invoice.id}`}
                  style={{
                    display: 'none',
                    width: '800px',
                    backgroundColor: '#ffffff',
                    padding: '40px',
                    color: '#000',
                    fontFamily: 'Arial, sans-serif',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {invoice.logo && (
                      <img src={invoice.logo} alt="Logo" style={{ height: '60px', objectFit: 'contain' }} />
                    )}
                    <div style={{ textAlign: 'right' }}>
                      <h2 style={{ fontSize: '24px', marginBottom: '5px' }}>INVOICE</h2>
                      <p><strong>Invoice No:</strong> {invoice.invoiceNumber || 'N/A'}</p>
                      <p><strong>Date:</strong> {invoice.createdAt?.seconds ? new Date(invoice.createdAt.seconds * 1000).toLocaleDateString() : ''}</p>
                    </div>
                  </div>

                  <div style={{ marginTop: '30px' }}>
                    <p><strong>Bill To:</strong></p>
                    <p>{invoice.clientDetails?.name}</p>
                    {invoice.clientDetails?.email && <p>{invoice.clientDetails.email}</p>}
                  </div>

                  <table style={{ width: '100%', marginTop: '30px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f3f4f6' }}>
                        <th style={thStyle}>Description</th>
                        <th style={thStyle}>Qty</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items?.map((item, index) => (
                        <tr key={index}>
                          <td style={tdStyle}>{item.description}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>{item.quantity}</td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>
                            {invoice.currency === 'USD' ? '$' : '₹'}{item.price.toFixed(2)}
                          </td>
                          <td style={{ ...tdStyle, textAlign: 'right' }}>
                            {invoice.currency === 'USD' ? '$' : '₹'}{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ marginTop: '30px', textAlign: 'right' }}>
                    <p>Subtotal: {invoice.currency === 'USD' ? '$' : '₹'}{invoice.subtotal?.toFixed(2)}</p>
                    <p>Tax ({invoice.tax || 0}%): {invoice.currency === 'USD' ? '$' : '₹'}{((invoice.subtotal || 0) * (invoice.tax || 0) / 100).toFixed(2)}</p>
                    <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      Total: {invoice.currency === 'USD' ? '$' : '₹'}{invoice.total?.toFixed(2)}
                    </p>
                  </div>
                  {/* --- Branding Footer --- */}
                  <div style={{ marginTop: '40px', borderTop: '1px dashed #ccc', paddingTop: '10px', textAlign: 'center', fontSize: '12px', color: '#999' }}>
                    Made with <strong>AryanTechWorld</strong>
                  </div>

                </div>
                </div>
              </li>
            ))}
          </ul>
        )}