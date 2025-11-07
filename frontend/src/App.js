import React from 'react';
import ProductList from './components/ProductList'; 
import CartDisplay from './components/CartDisplay'; 
import ReceiptModal from './components/ReceiptModal'; 
import { CartProvider } from './context/CartContext'; 
import './App.css'; 

function App() {
  const [receipt, setReceipt] = React.useState(null);

  return (
    <CartProvider>
      <div className="App">
        <header className="App-header">
          <h1>Vibe Commerce Store</h1>
        </header>
        
        <div className="main-layout">
          <div className="product-container">
            <ProductList />
          </div>
          <div className="cart-container">
            {/* Pass state setters for the modal */}
            <CartDisplay setReceipt={setReceipt} />
          </div>
        </div>

        {receipt && <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />}
      </div>
    </CartProvider>
  );
}

export default App;