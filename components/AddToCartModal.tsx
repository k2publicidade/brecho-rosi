import React from 'react';
import { Product } from '../types';
import { X } from 'lucide-react';

interface AddToCartModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToCartModal: React.FC<AddToCartModalProps> = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">Produto Adicionado!</h2>
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-20 h-20 object-cover rounded-md"
          />
          <div>
            <h3 className="font-semibold">{product.title}</h3>
            <p className="text-chic-olive font-bold">
              {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Continuar Comprando
          </button>
          <a 
            href="#/cart"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-chic-olive text-white rounded-md hover:bg-opacity-90 text-center"
          >
            Ir para o Carrinho
          </a>
        </div>
      </div>
    </div>
  );
};
