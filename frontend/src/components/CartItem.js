import React from 'react';

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} />
      <div className="cart-item-details">
        <p><strong>{item.name}</strong></p>
        <p>Qty: {item.qty} | Price: ${item.price}</p>
      </div>
      <button onClick={() => onRemove(item.id)}>Remove</button>
    </div>
  );
};

export default CartItem;