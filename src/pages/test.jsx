{showModal && (
  <div className="invoice-wrapper">
    <div className="invoice-overlay"></div>
    <div className="invoice-content flex items-center justify-center">

      <div className="bg-white bg-opacity-95 rounded-lg w-full max-w-4xl p-6 relative shadow-xl">
        {/* Close Button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
        >
          ✖
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Add Project Details
        </h2>

        {/* Table */}
        <div className="border rounded overflow-x-auto bg-white bg-opacity-90">
          <div className="grid grid-cols-5 sm:grid-cols-5 xs:grid-cols-3 bg-gray-100 text-gray-700 font-semibold py-2 px-3 text-sm sm:text-base">
            <div className="col-span-2 xs:col-span-2">Project Name</div>
            <div className="hidden sm:block">Qty</div>
            <div className="hidden sm:block">Price</div>
            <div className="hidden sm:block">Total</div>
            <div className="text-center">Action</div>
          </div>

          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-5 sm:grid-cols-5 xs:grid-cols-3 items-center px-3 py-2 border-t gap-2 text-sm sm:text-base">
              <input
                className="border p-1 bg-white text-black rounded col-span-2 xs:col-span-2"
                value={item.projectName || ''}
                placeholder="Project"
                onChange={(e) => handleItemChange(index, 'projectName', e.target.value)}
              />
              <input
                type="number"
                className="border p-1 rounded hidden sm:block"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              />
              <input
                type="number"
                className="border p-1 rounded hidden sm:block"
                value={item.price}
                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
              />
              <div className="text-right pr-2 hidden sm:block">
                {currencySymbol}{(item.price * item.quantity).toFixed(2)}
              </div>
              <button
                onClick={() => removeItem(index)}
                className="text-red-600 text-sm"
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        {/* Add Item & Totals */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 gap-4">
          <button
            onClick={() => setItems([...items, { projectName: '', quantity: 1, price: 0 }])}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ➕ Add Another
          </button>

          <div className="text-right bg-white bg-opacity-90 p-4 rounded shadow-md w-full sm:w-auto">
            <p>Subtotal: {currencySymbol}{subtotal.toFixed(2)}</p>
            <p>Tax ({tax}%): {currencySymbol}{taxAmount.toFixed(2)}</p>
            <p className="font-semibold text-lg">Total: {currencySymbol}{total.toFixed(2)}</p>
          </div>
        </div>

        {/* Save & Close */}
        <button
          onClick={() => setShowModal(false)}
          className="mt-6 w-full px-4 py-3 bg-green-600 text-white font-semibold text-center rounded hover:bg-green-700 transition duration-200"
        >
          ✅ Save & Close
        </button>
      </div>
    </div>
  </div>
)}
