import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartContext from '../context/CartContext';

const Header = () => {
  const { cartItems } = useContext(CartContext);

  // Calculate total number of items
  const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="App-header">
      <h1>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Vibe Commerce
        </Link>
      </h1>
      <Link to="/cart" style={{ color: 'white', textDecoration: 'none' }}>
        Cart ({itemCount})
      </Link>
    </header>
  );
};

export default Header;