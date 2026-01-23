export enum ProductCondition {
  NEW_WITH_TAGS = 'Novo com Etiqueta',
  EXCELLENT = 'Excelente',
  GOOD = 'Bom',
  FAIR = 'Com Marcas de Uso'
}

export enum ProductCategory {
  CLOTHING = 'Roupas',
  ACCESSORIES = 'Acessórios',
  SHOES = 'Calçados',
  DECOR = 'Decoração'
}

export enum DeliveryMethod {
  PICKUP = 'Retirada no Local',
  DELIVERY = 'Entrega'
}

export enum PaymentMethod {
  PIX = 'Pix',
  CREDIT_CARD = 'Cartão de Crédito/Débito',
  CASH = 'Dinheiro'
}

export enum OrderStatus {
  PENDING_PAYMENT = 'Aguardando Pagamento',
  PAID = 'Pagamento Confirmado',
  PREPARING = 'Em Preparação',
  SHIPPED = 'Enviado', // For Delivery
  READY_FOR_PICKUP = 'Pronto para Retirada', // For Pickup
  DELIVERED = 'Entregue', // For Delivery
  PICKED_UP = 'Retirado', // For Pickup
  CANCELLED = 'Cancelado'
}

export interface TrackingEvent {
  status: OrderStatus;
  date: string;
  note?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number; // Added for promotions
  size: string;
  condition: ProductCondition;
  category: ProductCategory;
  imageUrl: string;
  available: boolean;
  createdAt: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerContact: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  method: DeliveryMethod;
  paymentMethod: PaymentMethod;
  address?: string;
  zipCode?: string;
  status: OrderStatus;
  trackingHistory: TrackingEvent[];
  date: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
}

export interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  isAdmin: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (customerName: string, contact: string, method: DeliveryMethod, paymentMethod: PaymentMethod, address?: string, zipCode?: string, shippingCost?: number) => string;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  signInAdmin: (email: string, password: string) => Promise<void>;
  signOutAdmin: () => Promise<void>;
}
