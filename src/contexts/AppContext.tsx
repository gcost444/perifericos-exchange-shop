
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface AppContextType {
  cartItems: CartItem[];
  wishlistItems: number[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: number) => void;
  toggleWishlist: (productId: number) => void;
  getCartItemsCount: () => number;
  isInWishlist: (productId: number) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);

  const addToCart = (product: any) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.salePrice,
        quantity: 1,
        image: product.image
      }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const toggleWishlist = (productId: number) => {
    setWishlistItems(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.includes(productId);
  };

  return (
    <AppContext.Provider value={{
      cartItems,
      wishlistItems,
      addToCart,
      removeFromCart,
      toggleWishlist,
      getCartItemsCount,
      isInWishlist
    }}>
      {children}
    </AppContext.Provider>
  );
};
