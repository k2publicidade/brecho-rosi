import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { ArrowRight, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  // Calculate discount percentage if original price exists and is higher
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block h-full animate-fade-in"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both'
      }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-gray-100 mb-4">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Badges */}
        <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
           <div className="bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-chic-dark rounded-full shadow-sm">
             {product.size}
           </div>
        </div>

        {/* Promotion Badge */}
        {product.available && hasDiscount && (
          <div className="absolute top-4 right-4 bg-chic-olive text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full shadow-md flex items-center gap-1 animate-pulse">
            <Tag size={12} fill="currentColor" />
            {discountPercent}% OFF
          </div>
        )}

        {/* Sold Out Overlay */}
        {!product.available && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-chic-dark text-white px-5 py-2 text-sm font-bold uppercase tracking-wider rounded-full shadow-lg transform -rotate-6">
              Vendido
            </span>
          </div>
        )}
        
        {/* Hover Action */}
        {product.available && (
           <div className="absolute bottom-4 right-4 bg-white text-chic-dark p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
             <ArrowRight size={20} />
           </div>
        )}
      </div>
      
      <div className="px-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-serif text-lg font-bold text-chic-dark group-hover:text-chic-olive transition-colors line-clamp-1 pr-2">
            {product.title}
          </h3>
          <div className="text-right">
             {hasDiscount && (
               <span className="block text-[10px] text-gray-400 line-through font-medium">
                 {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.originalPrice!)}
               </span>
             )}
             <span className={`font-semibold ${hasDiscount ? 'text-chic-olive' : 'text-chic-dark'}`}>
               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
             </span>
          </div>
        </div>
        <p className="text-sm text-gray-500">{product.category} • {product.condition}</p>
      </div>
    </Link>
  );
};