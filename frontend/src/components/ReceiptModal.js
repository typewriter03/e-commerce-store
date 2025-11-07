// /frontend/src/components/ReceiptModal.js


const ReceiptModal = ({ receipt, onClose }) => {
  
  if (!receipt || !receipt.receiptId) {
    
    return null;
  }

  
  const receiptId = receipt.receiptId || 'N/A';
  const userName = receipt.user?.name || 'Guest';
  const userEmail = receipt.user?.email || 'No email';
  const total = (typeof receipt.total === 'number' ? receipt.total : 0).toFixed(2);
  
  
  let timestamp = 'Invalid Date';
  if (receipt.createdAt) {
    timestamp = new Date(receipt.createdAt).toLocaleString();
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <h3>Checkout Successful!</h3>
        <p><strong>Receipt ID:</strong> {receiptId}</p>
        <p><strong>Billed To:</strong> {userName} ({userEmail})</p>
        <p><strong>Timestamp:</strong> {timestamp}</p>
        <hr />
        <h4>Items:</h4>
        {receipt.items && receipt.items.length > 0 ? (
          receipt.items.map(item => (
            <div key={item.id}>
              <p>{item.name} (Qty: {item.qty})</p>
            </div>
          ))
        ) : (
          <p>No items were recorded.</p>
        )}
        <hr />
        <p><strong>Total Paid:</strong> ${total}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </>
  );
};

export default ReceiptModal;