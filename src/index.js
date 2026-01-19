import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; // ✅ ADD THIS

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>          {/* ✅ ADD THIS */}
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>         {/* ✅ ADD THIS */}
  </React.StrictMode>
);

reportWebVitals();
