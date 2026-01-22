import { Product, ProductCondition, ProductCategory } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'ecochic_products',
  ORDERS: 'ecochic_orders'
};

const SEED_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Jaqueta Jeans Vintage 90s',
    description: 'Uma peça icônica dos anos 90, com lavagem clara e corte oversized. Perfeita para compor looks despojados e cheios de personalidade. O jeans é grosso e resistente, garantindo durabilidade.',
    price: 120.00,
    originalPrice: 160.00, // Promoção example
    size: 'M',
    condition: ProductCondition.EXCELLENT,
    category: ProductCategory.CLOTHING,
    imageUrl: 'https://picsum.photos/id/338/500/500',
    available: true,
    createdAt: Date.now()
  },
  {
    id: '2',
    title: 'Bolsa de Couro Caramelo',
    description: 'Bolsa transversal em couro legítimo na cor caramelo. Possui marcas do tempo que adicionam charme e autenticidade à peça. Ideal para o dia a dia.',
    price: 85.50,
    size: 'Único',
    condition: ProductCondition.GOOD,
    category: ProductCategory.ACCESSORIES,
    imageUrl: 'https://picsum.photos/id/331/500/500',
    available: true,
    createdAt: Date.now() - 10000
  },
  {
    id: '3',
    title: 'Vestido Floral Romântico',
    description: 'Vestido leve com estampa floral delicada. Ótimo para dias de primavera. Cintura marcada e saia fluida.',
    price: 65.00,
    originalPrice: 89.90, // Promoção example
    size: 'P',
    condition: ProductCondition.EXCELLENT,
    category: ProductCategory.CLOTHING,
    imageUrl: 'https://picsum.photos/id/342/500/500',
    available: true,
    createdAt: Date.now() - 20000
  },
  {
    id: '4',
    title: 'Bota Coturno Preta',
    description: 'Coturno clássico preto, solado tratorado. Uma peça coringa que combina com tudo, desde vestidos até calças rasgadas.',
    price: 150.00,
    size: '37',
    condition: ProductCondition.FAIR,
    category: ProductCategory.SHOES,
    imageUrl: 'https://picsum.photos/id/103/500/500',
    available: true,
    createdAt: Date.now() - 30000
  }
];

export const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    return SEED_PRODUCTS;
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