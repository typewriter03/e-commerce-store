import React, { useContext, useState } from 'react';
import CartContext from '../context/CartContext';
import CartItem from './CartItem';

const CartDisplay = ({ setReceipt }) => { 
  const { cartItems, total, removeItemFromCart, checkout } = useContext(CartContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please fill in your name and email');
      return;
    }

    const receiptData = await checkout({ name, email }); 

    console.log('--- RECEIVED FROM CHECKOUT ---', receiptData);

    if (receiptData) {
      setReceipt(receiptData); 
      setName('');
      setEmail('');
    } else {
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <CartItem
              key={item._id || item.id} 
              item={item}
              onRemove={removeItemFromCart}
            />
          ))
        )}
      </div>
      <hr />
      <h3>Total: ${total}</h3>

      {cartItems.length > 0 && (
        <>
          <h2>Checkout</h2>
          <form onSubmit={handleCheckout} className="checkout-form">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">
              Place Order
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CartDisplay;