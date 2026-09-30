import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Colorway, CartItem } from '../types/vault';
import { PRODUCTS } from '../data/mockProducts';

interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warn';
}

interface VaultContextType {
  products: Product[];
  activeProduct: Product;
  setActiveProduct: (p: Product) => void;
  
  activeColorway: Colorway;
  setActiveColorway: (c: Colorway) => void;
  
  activeAngleIndex: number;
  setActiveAngleIndex: (idx: number) => void;
  
  isAutoRotating: boolean;
  setIsAutoRotating: (auto: boolean) => void;
  
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, colorway: Colorway, size: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  
  // Promo
  promoCode: string;
  discountPercent: number;
  applyPromoCode: (code: string) => boolean;
  
  // Accounting
  subtotal: number;
  discountAmount: number;
  total: number;
  
  // Checkout Order Complete
  isOrderSuccessModalOpen: boolean;
  setIsOrderSuccessModalOpen: (open: boolean) => void;
  lastOrderDetails: { orderId: string; total: number; itemsCount: number } | null;
  checkout: () => void;
  
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'info' | 'warn') => void;
}

const VaultContext = createContext<VaultContextType | null>(null);

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(PRODUCTS);
  const [activeProduct, setActiveProduct] = useState<Product>(PRODUCTS[0]);
  const [activeColorway, setActiveColorway] = useState<Colorway>(PRODUCTS[0].colorways[0]);
  const [activeAngleIndex, setActiveAngleIndex] = useState<number>(0);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('horizonvault_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const [isOrderSuccessModalOpen, setIsOrderSuccessModalOpen] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState<{ orderId: string; total: number; itemsCount: number } | null>(null);

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warn' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Sync Colorway on Product Change
  useEffect(() => {
    setActiveColorway(activeProduct.colorways[0]);
    setActiveAngleIndex(0);
  }, [activeProduct.id]);

  // Auto 360 Spin loop when enabled
  useEffect(() => {
    if (!isAutoRotating) return;
    const count = activeColorway.angleImages.length;
    const interval = setInterval(() => {
      setActiveAngleIndex(prev => (prev + 1) % count);
    }, 1800);
    return () => clearInterval(interval);
  }, [isAutoRotating, activeColorway]);

  // LocalStorage Cart Sync
  useEffect(() => {
    localStorage.setItem('horizonvault_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, colorway: Colorway, size: number) => {
    const itemId = `${product.id}-${colorway.id}-${size}`;
    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item => item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: itemId, product, selectedColorway: colorway, selectedSize: size, quantity: 1 }];
    });

    showToast(`Added ${product.name} (${colorway.name}, Size ${size}) to Cart!`, 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Item removed from cart', 'warn');
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === cartItemId) {
        const nextQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: nextQty };
      }
      return item;
    }));
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'APEX2026' || clean === 'HORIZON20') {
      setPromoCode(clean);
      setDiscountPercent(20);
      showToast('🎉 Promo code applied: 20% OFF your entire order!', 'success');
      return true;
    } else {
      showToast('❌ Invalid promo code. Try APEX2026', 'warn');
      return false;
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = +(Math.max(0, subtotal - discountAmount)).toFixed(2);

  const checkout = () => {
    if (cart.length === 0) return;
    const orderId = `HZ-${Math.floor(100000 + Math.random() * 900000)}`;
    const itemsCount = cart.reduce((sum, i) => sum + i.quantity, 0);

    setLastOrderDetails({
      orderId,
      total,
      itemsCount
    });

    setCart([]);
    setIsCartOpen(false);
    setIsOrderSuccessModalOpen(true);
  };

  return (
    <VaultContext.Provider
      value={{
        products,
        activeProduct,
        setActiveProduct,
        activeColorway,
        setActiveColorway,
        activeAngleIndex,
        setActiveAngleIndex,
        isAutoRotating,
        setIsAutoRotating,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        promoCode,
        discountPercent,
        applyPromoCode,
        subtotal,
        discountAmount,
        total,
        isOrderSuccessModalOpen,
        setIsOrderSuccessModalOpen,
        lastOrderDetails,
        checkout,
        toasts,
        showToast
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};
