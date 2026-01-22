import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../App';
import { ShoppingBag, ArrowLeft, Ruler, Tag, AlertCircle, Share2, Heart } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useContext(StoreContext);
  const [product, setProduct] = useState(products.find(p => p.id === id));

  useEffect(() => {
    setProduct(products.find(p => p.id === id));
  }, [id, products]);

  if (!product) {
    return <div className="p-20 text-center text-gray-500">Produto não encontrado.</div>;
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-sm font-medium text-gray-500 hover:text-chic-dark mb-8 transition-colors group"
      >
        <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Section */}
        <div className="relative">
          <div className="rounded-[2.5rem] overflow-hidden aspect-[4/5] bg-gray-100 shadow-sm">
             <img 
               src={product.imageUrl} 
               alt={product.title} 
               className="w-full h-full object-cover"
             />
          </div>
          {!product.available && (
             <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-[2.5rem]">
                <span className="bg-chic-dark text-white px-8 py-4 text-2xl font-serif font-bold tracking-widest rounded-full shadow-2xl transform -rotate-6">
                  VENDIDO
                </span>
             </div>
          )}
          {product.available && hasDiscount && (
             <div className="absolute top-6 right-6 bg-chic-olive text-white px-4 py-2 rounded-full font-bold shadow-lg animate-bounce">
                Oportunidade!
             </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center">
          <div className="mb-2 flex items-center gap-3">
             <span className="text-sm font-bold tracking-wider text-chic-olive uppercase">{product.category}</span>
             <span className="w-1 h-1 rounded-full bg-gray-300"></span>
             <span className="text-sm text-gray-500">{product.condition}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-chic-dark mb-6 leading-tight">
            {product.title}
          </h1>

          <div className="text-3xl font-medium text-gray-900 mb-8 flex items-baseline gap-3">
            <span className={hasDiscount ? 'text-chic-olive font-bold' : 'text-chic-dark'}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </span>
            {hasDiscount && (
               <span className="text-lg text-gray-400 font-normal line-through decoration-1">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.originalPrice!)}
               </span>
            )}
          </div>

          <div className="prose prose-lg text-gray-600 mb-10 leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-4 mb-10">
             <div className="flex items-center gap-3 px-5 py-3 border border-gray-200 rounded-full">
                <Ruler size={18} className="text-chic-olive" />
                <div>
                   <span className="text-xs text-gray-400 uppercase font-bold block">Tamanho</span>
                   <span className="font-semibold text-chic-dark">{product.size}</span>
                </div>
             </div>
             <div className="flex items-center gap-3 px-5 py-3 border border-gray-200 rounded-full">
                <Tag size={18} className="text-chic-olive" />
                <div>
                   <span className="text-xs text-gray-400 uppercase font-bold block">ID</span>
                   <span className="font-semibold text-chic-dark">#{product.id}</span>
                </div>
             </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => addToCart(product)}
              disabled={!product.available}
              className={`flex-1 py-4 px-8 rounded-full flex items-center justify-center gap-3 font-bold text-lg transition-all ${
                product.available 
                ? 'bg-chic-dark hover:bg-black text-white shadow-lg shadow-gray-200' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag size={20} />
              {product.available ? 'Adicionar à Sacola' : 'Item Indisponível'}
            </button>
            
            <button className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-chic-olive hover:text-chic-olive hover:bg-green-50 transition-all">
               <Heart size={20} />
            </button>
          </div>

          <div className="mt-8 flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
             <AlertCircle size={20} className="text-gray-400 mt-0.5 shrink-0" />
             <p className="text-sm text-gray-500 leading-relaxed">
               <strong>Peça Única:</strong> Ao comprar em brechós, você contribui para um consumo mais consciente. Garantimos a qualidade e higienização de todas as peças.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};