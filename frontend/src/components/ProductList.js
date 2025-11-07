// /frontend/src/components/ProductList.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ProductItem from './ProductItem';
import CartContext from '../context/CartContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItemToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`${API_URL}/products`);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* --- ADD THIS HERO SECTION --- */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fff', 
        borderRadius: '8px', 
        marginBottom: '20px', 
        border: '1px solid var(--border-color)' 
      }}>
        <h2>Welcome to Vibe Commerce</h2>
        <p>Browse our exclusive collection of apparel and accessories.</p>
      </div>

      <h2>All Products</h2>
      
      {/* Use the new spinner */}
      {loading && <div className="loader"></div>} 
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {!loading && !error && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              onAddToCart={addItemToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;