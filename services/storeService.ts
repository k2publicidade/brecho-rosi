import { Product, ProductCondition, ProductCategory } from '../types';
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

// --- Local Storage (Legacy/Fallback) ---

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
