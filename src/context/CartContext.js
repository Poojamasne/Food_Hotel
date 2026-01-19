import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // API Headers
  const getHeaders = React.useCallback(() => {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }, []);

  // Sync local cart with server when user logs in
  const syncCartWithServer = React.useCallback(async (localCart) => {
    if (!getToken() || localCart.length === 0) return;
    
    try {
      setSyncLoading(true);
      for (const item of localCart) {
        await fetch('https://backend-hotel-management.onrender.com/api/cart/add', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            productId: item.id,
            quantity: item.quantity
          })
        });
      }
      // Clear local cart after syncing
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error syncing cart with server:', error);
    } finally {
      setSyncLoading(false);
    }
  }, [getHeaders]);

  // Fetch cart from API on mount
  useEffect(() => {
    const fetchCart = async () => {
      const token = getToken();
      
      if (token) {
        // User is logged in - fetch from API
        try {
          setLoading(true);
          const response = await fetch('https://backend-hotel-management.onrender.com/api/cart', {
            headers: getHeaders()
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              // Transform API response
              const transformedItems = data.data.map(item => ({
                id: item.product_id || item.id,
                name: item.product_name || item.name,
                price: item.price || item.product_price,
                originalPrice: item.original_price || item.price,
                description: item.description || '',
                image: item.image || '',
                type: item.type || 'veg',
                category: item.category || '',
                quantity: item.quantity || 1
              }));
              setCartItems(transformedItems);
              
              // Check if there's a local cart to sync
              const savedCart = localStorage.getItem('cart');
              if (savedCart) {
                const localCart = JSON.parse(savedCart);
                if (localCart.length > 0) {
                  await syncCartWithServer(localCart);
                  // Refresh cart from API after syncing
                  await fetchCart();
                }
              }
            }
          }
        } catch (error) {
          console.error('Error fetching cart from API:', error);
          // Fallback to localStorage
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            const localCart = JSON.parse(savedCart);
            setCartItems(localCart);
          }
        } finally {
          setLoading(false);
        }
      } else {
        // User is not logged in - use localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const localCart = JSON.parse(savedCart);
            setCartItems(localCart);
          } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            setCartItems([]);
          }
        }
        setLoading(false);
      }
    };

    fetchCart();
  }, [getHeaders, syncCartWithServer]);

  // Save to localStorage and update count
  useEffect(() => {
    const token = getToken();
    if (!token && !loading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
    const totalCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    setCartCount(totalCount);
  }, [cartItems, loading]);

  const addToCart = async (item, quantity = 1) => {
    const token = getToken();
    
    if (token) {
      // Use API
      try {
        const response = await fetch('https://backend-hotel-management.onrender.com/api/cart/add', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            productId: item.id,
            quantity: quantity
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Refresh cart from API
            const refreshResponse = await fetch('https://backend-hotel-management.onrender.com/api/cart', {
              headers: getHeaders()
            });
            if (refreshResponse.ok) {
              const cartData = await refreshResponse.json();
              if (cartData.success) {
                const transformedItems = cartData.data.map(cartItem => ({
                  id: cartItem.product_id || cartItem.id,
                  name: cartItem.product_name || cartItem.name,
                  price: cartItem.price || cartItem.product_price,
                  originalPrice: cartItem.original_price || cartItem.price,
                  description: cartItem.description || '',
                  image: cartItem.image || '',
                  type: cartItem.type || 'veg',
                  category: cartItem.category || '',
                  quantity: cartItem.quantity || 1
                }));
                setCartItems(transformedItems);
                return true;
              }
            }
          }
        }
        return false;
      } catch (error) {
        console.error('Error adding to cart via API:', error);
        // Fallback to local state
        updateLocalCart(item, quantity, 'add');
        return false;
      }
    } else {
      // Use local state if no token
      updateLocalCart(item, quantity, 'add');
      return true;
    }
  };

  const updateLocalCart = (item, quantity, action = 'add') => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { 
                ...cartItem, 
                quantity: action === 'add' ? cartItem.quantity + quantity : quantity 
              }
            : cartItem
        );
      } else {
        return [...prevItems, { 
          ...item, 
          quantity,
          description: item.description || '',
          image: item.image || '',
          type: item.type || 'veg',
          category: item.category || ''
        }];
      }
    });
  };

  const removeFromCart = async (id) => {
    const token = getToken();
    
    if (token) {
      try {
        const response = await fetch(`https://backend-hotel-management.onrender.com/api/cart/remove/${id}`, {
          method: 'DELETE',
          headers: getHeaders()
        });

        if (response.ok) {
          setCartItems(prevItems => prevItems.filter(item => item.id !== id));
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error removing from cart via API:', error);
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        return false;
      }
    } else {
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      return true;
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    const token = getToken();
    
    if (token) {
      try {
        const response = await fetch('https://backend-hotel-management.onrender.com/api/cart/update', {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({
            productId: id,
            quantity: quantity
          })
        });

        if (response.ok) {
          setCartItems(prevItems =>
            prevItems.map(item =>
              item.id === id ? { ...item, quantity } : item
            )
          );
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error updating cart via API:', error);
        updateLocalCart({ id }, quantity, 'update');
        return false;
      }
    } else {
      updateLocalCart({ id }, quantity, 'update');
      return true;
    }
  };

  const clearCart = async () => {
    const token = getToken();
    
    if (token) {
      try {
        const response = await fetch('https://backend-hotel-management.onrender.com/api/cart/clear', {
          method: 'DELETE',
          headers: getHeaders()
        });

        if (response.ok) {
          setCartItems([]);
          localStorage.removeItem('cart');
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error clearing cart via API:', error);
        setCartItems([]);
        localStorage.removeItem('cart');
        return false;
      }
    } else {
      setCartItems([]);
      localStorage.removeItem('cart');
      return true;
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  const getItemCount = (id) => {
    const item = cartItems.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      loading: loading || syncLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};