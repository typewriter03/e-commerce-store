import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';


const API_URL = 'http://localhost:5001/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // --- Fetch initial cart state from backend ---
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/cart`);
        setCartItems(data.cartItems);
        setTotal(data.total);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    fetchCart();
  }, []);

  // --- Helper function to update state ---
  const updateCartState = (data) => {
    setCartItems(data.cartItems);
    setTotal(data.total);
  };

  // --- Add item to cart ---
  const addItemToCart = async (item) => {
    try {
      // item object is { productId, qty }
      const { data } = await axios.post(`${API_URL}/cart`, item);
      updateCartState(data);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  // --- Remove item from cart ---
  const removeItemFromCart = async (id) => {
    try {
      const { data } = await axios.delete(`${API_URL}/cart/${id}`);
      updateCartState(data); 
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  // --- Mock Checkout ---
  const checkout = async (userData) => {
    try {
      const { data: receipt } = await axios.post(`${API_URL}/checkout`, {
     
      user: userData, 
      
    });
      
      console.log('Receipt:', receipt);
      
      
      setCartItems([]);
      setTotal(0);
      return receipt; 
    } catch (error) {
      console.error('Error during checkout:', error);
      return null; 
    }
  };

  // --- Clear Cart 
  const clearCart = () => {
    
    setCartItems([]);
    setTotal(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        addItemToCart,
        removeItemFromCart,
        clearCart,
        checkout, 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;