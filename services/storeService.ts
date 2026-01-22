import { Product, ProductCondition, ProductCategory } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'brechodarosi_products',
  ORDERS: 'brechodarosi_orders'
};

const SEED_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Jaqueta Jeans Vintage 90s',
    description: 'Achado especial! Essa jaqueta jeans dos anos 90 é perfeita para dar aquele UP no look. Lavagem clara e corte oversized que nunca sai de moda. O jeans é grosso e resistente - desses que você usa por anos!\n\nEstado: Garimpado e aprovado pela Rosi ✓',
    price: 120.00,
    originalPrice: 160.00,
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
    description: 'Achado especial! Essa bolsa transversal de couro legítimo é perfeita para dar aquele UP no look.\n\nDetalhes: Couro caramelo autêntico com marcas do tempo que contam história\nEstado: Garimpado e aprovado pela Rosi ✓',
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
    description: 'Aquele básico que não pode faltar no guarda-roupa! Vestido leve com estampa floral delicada, perfeito para dias quentes. Cintura marcada e saia fluida criam um visual romântico e confortável.\n\nPeça atemporal, versátil e em ótimo estado.',
    price: 65.00,
    originalPrice: 89.90,
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
    description: 'Coturno clássico preto com solado tratorado - aquela peça coringa que salva qualquer look! Combina desde vestidos delicados até calças rasgadas.\n\nUma peça com história que vai longe com você. Quando você encontra um achadinho desses, é pra levar! 💚',
    price: 150.00,
    size: '37',
    condition: ProductCondition.FAIR,
    category: ProductCategory.SHOES,
    imageUrl: 'https://picsum.photos/id/103/500/500',
    available: true,
    createdAt: Date.now() - 30000
  },
  {
    id: '5',
    title: 'Blusa Branca Básica',
    description: 'Aquele básico que não pode faltar no guarda-roupa. Blusa branca em tecido fresquinho, perfeita para o dia a dia.\n\nTamanho: M\nCondição: Excelente\n\nPeça atemporal, versátil e em ótimo estado.',
    price: 45.00,
    size: 'M',
    condition: ProductCondition.EXCELLENT,
    category: ProductCategory.CLOTHING,
    imageUrl: 'https://picsum.photos/id/365/500/500',
    available: true,
    createdAt: Date.now() - 40000
  },
  {
    id: '6',
    title: 'Colar Dourado Vintage',
    description: 'Achado especial! Esse colar vintage dourado é perfeito para dar aquele UP no look.\n\nDetalhes: Dourado vintage com pingente delicado, ótimo para compor visuais elegantes\nEstado: Garimpado e aprovado pela Rosi ✓',
    price: 38.00,
    size: 'Único',
    condition: ProductCondition.GOOD,
    category: ProductCategory.ACCESSORIES,
    imageUrl: 'https://picsum.photos/id/399/500/500',
    available: true,
    createdAt: Date.now() - 50000
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