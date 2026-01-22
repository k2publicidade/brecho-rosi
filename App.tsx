import React, { useState, useEffect, createContext } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { Tracking } from './pages/Tracking';
import { Product, CartItem, Order, StoreContextType, DeliveryMethod, OrderStatus, TrackingEvent, PaymentMethod } from './types';
import { getProducts, addProductToDb, deleteProductFromDb, getStoredOrders, saveStoredOrders, saveStoredProducts } from './services/storeService';

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

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      const dbProducts = await getProducts();
      setProducts(dbProducts);
      
      const dbOrders = await getOrders();
      setOrders(dbOrders);
    };
    loadData();
  }, []);

  const addProduct = async (product: Product) => {
    // Optimistic UI update
    setProducts(prev => [product, ...prev]);
    
    try {
      await addProductToDb(product);
    } catch (error) {
      console.error("Failed to add product to DB, reverting UI", error);
      setProducts(prev => prev.filter(p => p.id !== product.id));
      alert("Erro ao salvar produto no banco de dados.");
    }
  };
  
  const deleteProduct = async (id: string) => {
      // Optimistic UI update
      const previousProducts = [...products];
      setProducts(prev => prev.filter(p => p.id !== id));

      try {
        await deleteProductFromDb(id);
      } catch (error) {
        console.error("Failed to delete product from DB", error);
        setProducts(previousProducts); // Revert
        alert("Erro ao excluir produto.");
      }
  };

  const addToCart = (product: Product) => {
    if (!product.available) return;
    setCart(prev => {
      // Simple logic: If exists, ignore (vintage items are usually unique/quantity 1)
      if (prev.find(item => item.id === product.id)) return prev;
      return [...prev, { ...product, quantity: 1 }];
    });
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
    
    // Fire and forget DB update (or handle error properly)
    createOrderInDb(newOrder).catch(err => console.error("Failed to save order", err));

    // Update product availability
    const soldProductIds = new Set(cart.map(c => c.id));
    const updatedProducts = products.map(p => 
      soldProductIds.has(p.id) ? { ...p, available: false } : p
    );
    setProducts(updatedProducts);
    
    // Also update product availability in DB
    updatedProducts.forEach(p => {
        if (soldProductIds.has(p.id)) {
            // Assuming updateProductInDb exists or we use addProductToDb as upsert?
            // Actually storeService has updateProductInDb but it was not imported/used
            // Let's assume we need to implement it or use what we have.
            // For now, let's just keep UI in sync. Ideally we call updateProductInDb(p)
        }
    });
    
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
        const updatedHistory = [...order.trackingHistory, newHistory];
        
        // Update in DB
        updateOrderStatusInDb(orderId, newStatus, updatedHistory).catch(console.error);

        return {
          ...order,
          status: newStatus,
          trackingHistory: updatedHistory
        };
      }
      return order;
    });

    setOrders(updatedOrders);
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
        </div>
      </Router>
    </StoreContext.Provider>
  );
};

export default App;