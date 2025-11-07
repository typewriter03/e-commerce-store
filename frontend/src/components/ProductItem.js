import React from 'react';

const ProductItem = ({ product, onAddToCart }) => {
  return (
    <div className="product-item">
      <img src={product.image} alt={product.name} />
      <h4 title={product.name}>{product.name}</h4>
      <p>${product.price}</p>
      <button onClick={() => onAddToCart({ productId: product.id, qty: 1 })}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductItem;