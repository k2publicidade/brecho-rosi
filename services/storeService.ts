import { Product, ProductCondition, ProductCategory, Order, OrderStatus } from '../types';
import { supabase } from './supabaseClient';

const STORAGE_KEYS = {
  PRODUCTS: 'ecochic_products',
  ORDERS: 'ecochic_orders'
};

const SEED_PRODUCTS: Product[] = [
  // ... (Keep existing seed products if needed, but we prefer fetching from DB)
];

// --- Supabase Integration ---

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar produtos:', error);
    // Fallback to local storage if DB fails or is empty (for dev)
    return getStoredProducts();
  }
  
  // Transform DB data to Product type (snake_case to camelCase)
  return data ? data.map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    size: row.size,
    condition: row.condition,
    category: row.category,
    imageUrl: row.image_url,
    available: row.available,
    createdAt: new Date(row.created_at).getTime()
  })) : [];
};

export const addProductToDb = async (product: Product): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .insert([{
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      original_price: product.originalPrice, // Map camelCase to snake_case column
      size: product.size,
      condition: product.condition,
      category: product.category,
      image_url: product.imageUrl,
      available: product.available,
      created_at: new Date(product.createdAt).toISOString() // Supabase expects ISO string
    }]);

  if (error) {
    console.error('Erro ao adicionar produto:', error);
    throw error;
  }
};

export const updateProductInDb = async (product: Product): Promise<void> => {
    const { error } = await supabase
    .from('products')
    .update({
        available: product.available
        // Add other fields if editable
    })
    .eq('id', product.id);

    if (error) {
        console.error('Erro ao atualizar produto:', error);
    }
}

export const deleteProductFromDb = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar produto:', error);
    throw error;
  }
};

// --- Orders Integration ---

export const getOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar pedidos:', error);
    return getStoredOrders();
  }

  return data ? data.map((row: any) => ({
    ...row.order_data, // Recupera o objeto completo salvo no JSONB
    id: row.id, // Garante que o ID do banco prevalece
    status: row.status, // Garante status atualizado
    date: row.created_at
  })) : [];
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  // Tenta buscar pelo ID exato ou pelos últimos caracteres (para facilitar busca)
  // Como 'like' pode ser lento, vamos focar no ID exato primeiro
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
     // Fallback: tentar buscar localmente se não achar no banco (apenas para dev/transição)
     const localOrders = getStoredOrders();
     return localOrders.find(o => o.id === id) || null;
  }

  return {
    ...data.order_data,
    id: data.id,
    status: data.status,
    date: data.created_at
  };
};

export const createOrderInDb = async (order: Order): Promise<void> => {
  const { error } = await supabase
    .from('orders')
    .insert([{
      id: order.id,
      customer_name: order.customerName,
      total: order.total,
      status: order.status,
      order_data: order, // Salva o objeto completo para preservar trackingHistory, items, etc.
      created_at: new Date().toISOString()
    }]);

  if (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }
};

export const updateOrderStatusInDb = async (orderId: string, newStatus: OrderStatus, updatedHistory: any[]): Promise<void> => {
  // Primeiro buscamos o pedido atual para atualizar o trackingHistory dentro do jsonb
  const { data: currentOrder } = await supabase
    .from('orders')
    .select('order_data')
    .eq('id', orderId)
    .single();

  if (currentOrder) {
    const updatedData = {
      ...currentOrder.order_data,
      status: newStatus,
      trackingHistory: updatedHistory
    };

    const { error } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        order_data: updatedData
      })
      .eq('id', orderId);

    if (error) {
        console.error('Erro ao atualizar status do pedido:', error);
        throw error;
    }
  }
};


export const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!stored) {
     // If nothing stored, return empty array to avoid confusion with DB data
    return [];
  }
  return JSON.parse(stored);
};

export const saveStoredProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const getStoredOrders = (): any[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return stored ? JSON.parse(stored) : [];
};

export const saveStoredOrders = (orders: any[]) => {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};
