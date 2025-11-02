import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

/**
 * Cart Context Provider
 * Manages shopping cart state with localStorage persistence
 */
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  /**
   * Add product to cart
   * @param {Object} product - Product object
   * @param {number} quantity - Quantity to add (default: 1)
   */
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product_id === product.id);

      if (existingItem) {
        // Update quantity if item already exists
        return prevCart.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [
          ...prevCart,
          {
            product_id: product.id,
            name: product.name,
            price: product.price,
            image_path: product.image_path,
            quantity: quantity
          }
        ];
      }
    });
  };

  /**
   * Remove product from cart
   * @param {number} productId - Product ID to remove
   */
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
  };

  /**
   * Update product quantity in cart
   * @param {number} productId - Product ID
   * @param {number} quantity - New quantity
   */
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product_id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  /**
   * Clear entire cart
   */
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  /**
   * Get total number of items in cart
   */
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * Get total price of cart
   */
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Hook to use cart context
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

