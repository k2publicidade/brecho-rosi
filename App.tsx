import React, { useState, useEffect, createContext } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { Tracking } from './pages/Tracking';
import { AddToCartModal } from './components/AddToCartModal';
import { Product, CartItem, Order, StoreContextType, DeliveryMethod, OrderStatus, TrackingEvent, PaymentMethod } from './types';
import { getStoredProducts, saveStoredProducts, getStoredOrders, saveStoredOrders } from './services/storeService';

// Default value for context
const defaultContext: StoreContextType = {
  products: [],
  cart: [],
  orders: [],
  isAdmin: false,
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  placeOrder: () => "",
  updateOrderStatus: () => {},
  addProduct: () => {},
  deleteProduct: () => {},
  toggleAdmin: () => {}
};

export const StoreContext = createContext<StoreContextType>(defaultContext);

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Estado do modal de adicionar ao carrinho
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
  }, []);

  const addToCart = (product: Product) => {
    if (!product.available) return;

    const alreadyInCart = cart.find(item => item.id === product.id);

    if (!alreadyInCart) {
      setCart(prev => [...prev, { ...product, quantity: 1 }]);
      // Abre o modal com animação
      setModalProduct(product);
      setIsModalOpen(true);
    } else {
      // Se já está no carrinho, apenas mostra o modal
      setModalProduct(product);
      setIsModalOpen(true);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (customerName: string, contact: string, method: DeliveryMethod, paymentMethod: PaymentMethod, address?: string, zipCode?: string, shippingCost: number = 0) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    
    const initialHistory: TrackingEvent = {
      status: OrderStatus.PENDING_PAYMENT,
      date: new Date().toISOString(),
      note: 'Pedido realizado'
    };

    const newOrder: Order = {
      id: Date.now().toString(),
      customerName,
      customerContact: contact,
      items: [...cart],
      subtotal: subtotal,
      shippingCost: shippingCost,
      total: subtotal + shippingCost,
      method,
      paymentMethod,
      address,
      zipCode,
      status: OrderStatus.PENDING_PAYMENT,
      trackingHistory: [initialHistory],
      date: new Date().toISOString()
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);

    // Update product availability
    const soldProductIds = new Set(cart.map(c => c.id));
    const updatedProducts = products.map(p => 
      soldProductIds.has(p.id) ? { ...p, available: false } : p
    );
    setProducts(updatedProducts);
    saveStoredProducts(updatedProducts);
    
    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const newHistory: TrackingEvent = {
          status: newStatus,
          date: new Date().toISOString(),
          note
        };
        return {
          ...order,
          status: newStatus,
          trackingHistory: [...order.trackingHistory, newHistory]
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);
  };

  const addProduct = (product: Product) => {
    const updated = [product, ...products];
    setProducts(updated);
    saveStoredProducts(updated);
  };

  const deleteProduct = (productId: string) => {
    const updated = products.filter(p => p.id !== productId);
    setProducts(updated);
    saveStoredProducts(updated);
  };

  const toggleAdmin = () => setIsAdmin(!isAdmin);

  return (
    <StoreContext.Provider value={{
      products,
      cart,
      orders,
      isAdmin,
      addToCart,
      removeFromCart,
      clearCart,
      placeOrder,
      updateOrderStatus,
      addProduct,
      deleteProduct,
      toggleAdmin
    }}>
      <Router>
        <div className="min-h-screen bg-vintage-50 text-gray-800 font-sans selection:bg-vintage-300 selection:text-vintage-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/tracking" element={<Tracking />} />
          </Routes>

          {/* Modal de Adicionar ao Carrinho */}
          <AddToCartModal
            product={modalProduct}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </Router>
    </StoreContext.Provider>
  );
};

export default App;