import React, { useState, useEffect, createContext } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { AdminLogin } from './pages/AdminLogin';
import { CustomerLogin } from './pages/CustomerLogin';
import { CustomerProfile } from './pages/CustomerProfile';
import { Tracking } from './pages/Tracking';
import { AddToCartModal } from './components/AddToCartModal';
import { Product, CartItem, Order, StoreContextType, DeliveryMethod, OrderStatus, TrackingEvent, PaymentMethod, CustomerUser } from './types';
import { 
  getProducts, 
  addProductToDb, 
  updateProductInDb,
  deleteProductFromDb, 
  getOrders, 
  createOrderInDb, 
  updateOrderStatusInDb 
} from './services/storeService';
import { supabase, supabaseConfigured } from './services/supabaseClient';

// Default value for context
const defaultContext: StoreContextType = {
  products: [],
  cart: [],
  orders: [],
  isAdmin: false,
  customerUser: null,
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  placeOrder: () => "",
  updateOrderStatus: () => {},
  addProduct: () => {},
  deleteProduct: () => {},
  signInAdmin: async () => {},
  signOutAdmin: async () => {},
  signInCustomer: async () => {},
  signUpCustomer: async () => {},
  signOutCustomer: async () => {}
};

export const StoreContext = createContext<StoreContextType>(defaultContext);

const allowedAdminEmails = (import.meta.env.VITE_ADMIN_EMAILS ?? '')
  .split(',')
  .map((email: string) => email.trim().toLowerCase())
  .filter(Boolean);

const isAllowedAdminEmail = (email?: string | null) => {
  if (!email) return false;
  if (allowedAdminEmails.length === 0) return false;
  return allowedAdminEmails.includes(email.toLowerCase());
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(null);

  // Estado do modal de adicionar ao carrinho
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        const sessionEmail = data.session?.user?.email;
        const allowed = !!data.session && isAllowedAdminEmail(sessionEmail);
        setIsAdmin(allowed);
        if (data.session?.user) {
          setCustomerUser({ id: data.session.user.id, email: data.session.user.email });
        } else {
          setCustomerUser(null);
        }
      }
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionEmail = session?.user?.email;
      const allowed = !!session && isAllowedAdminEmail(sessionEmail);
      setIsAdmin(allowed);
      if (session?.user) {
        setCustomerUser({ id: session.user.id, email: session.user.email });
      } else {
        setCustomerUser(null);
      }
    });
    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
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
      customerId: customerUser?.id,
      customerEmail: customerUser?.email ?? null,
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
        updateProductInDb(p).catch(console.error);
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

  const signInAdmin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
    const sessionEmail = data.session?.user?.email;
    if (!isAllowedAdminEmail(sessionEmail)) {
      await supabase.auth.signOut();
      throw new Error('Admin não autorizado');
    }
  };

  const signOutAdmin = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const signInCustomer = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
  };

  const signUpCustomer = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      throw error;
    }
  };

  const signOutCustomer = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  return (
    <StoreContext.Provider value={{
      products,
      cart,
      orders,
      isAdmin,
      customerUser,
      addToCart,
      removeFromCart,
      clearCart,
      placeOrder,
      updateOrderStatus,
      addProduct,
      deleteProduct,
      signInAdmin,
      signOutAdmin,
      signInCustomer,
      signUpCustomer,
      signOutCustomer
    }}>
      <Router>
        <div className="min-h-screen bg-vintage-50 text-gray-800 font-sans selection:bg-vintage-300 selection:text-vintage-900">
          <Navbar />
          {!supabaseConfigured && (
            <div className="bg-red-50 text-red-700 text-sm font-semibold text-center py-3 px-4 border-b border-red-100">
              Configuração do Supabase ausente. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env e reinicie o servidor.
            </div>
          )}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/cliente/login" element={<CustomerLogin />} />
            <Route path="/cliente/perfil" element={<CustomerProfile />} />
            <Route path="/tracking" element={<Tracking />} />
          </Routes>

          {/* Footer */}
          <Footer />

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
