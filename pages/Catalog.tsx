import React, { useContext, useState, useMemo, useEffect } from 'react';
import { StoreContext } from '../App';
import { ProductCard } from '../components/ProductCard';
import { ProductCategory, ProductCondition } from '../types';
import { Search, ChevronDown, Filter, X } from 'lucide-react';

export const Catalog: React.FC = () => {
  const { products } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  
  // Price Filter States
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({ min: 0, max: 10000 });
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);

  // Calculate actual min/max from products
  const { globalMin, globalMax } = useMemo(() => {
    if (products.length === 0) return { globalMin: 0, globalMax: 1000 };
    const prices = products.map(p => p.price);
    return {
      globalMin: Math.floor(Math.min(...prices)),
      globalMax: Math.ceil(Math.max(...prices))
    };
  }, [products]);

  // Initialize range when products load
  useEffect(() => {
    setPriceRange({ min: globalMin, max: globalMax });
  }, [globalMin, globalMax]);

  const availableSizes = useMemo(() => {
    const sizes = new Set(products.map(p => p.size));
    return Array.from(sizes);
  }, [products]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSize = selectedSize === 'all' || product.size === selectedSize;
    const matchesCondition = selectedCondition === 'all' || product.condition === selectedCondition;
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;

    return matchesSearch && matchesCategory && matchesSize && matchesPrice && matchesCondition;
  });

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), priceRange.max - 1);
    setPriceRange(prev => ({ ...prev, min: val }));
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), priceRange.min + 1);
    setPriceRange(prev => ({ ...prev, max: val }));
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedCondition('all');
    setSearchTerm('');
    setPriceRange({ min: globalMin, max: globalMax });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-24 min-h-screen" onClick={() => isPriceFilterOpen && setIsPriceFilterOpen(false)}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
         <div>
           <h1 className="text-3xl md:text-4xl font-serif font-bold text-chic-dark mb-2">Achadinhos do Mariléia</h1>
           <p className="text-gray-500 text-sm md:text-base">Peças únicas esperando por uma nova vizinha.</p>
         </div>
      </div>

      {/* Toolbar - Sticky with better mobile stacking */}
      <div className="sticky top-16 md:top-24 z-30 bg-white/90 backdrop-blur-xl py-4 mb-8 -mx-4 px-4 md:-mx-6 md:px-6 border-b border-gray-100 shadow-sm md:shadow-none">
         <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative w-full group">
               <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-chic-dark transition-colors" size={20} />
               <input 
                 type="text" 
                 placeholder="O que você procura hoje, vizinha?" 
                 className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:border-chic-dark focus:bg-white focus:outline-none transition-all text-sm shadow-sm placeholder:text-gray-400"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            
            {/* Filters Row */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 pr-4">
               
               {/* Categories */}
               <div className="flex gap-2">
                 <button 
                   onClick={() => setSelectedCategory('all')}
                   className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === 'all' ? 'bg-chic-dark text-white border-chic-dark' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                 >
                   Todas
                 </button>
                 {Object.values(ProductCategory).map(cat => (
                   <button 
                     key={cat}
                     onClick={() => setSelectedCategory(cat)}
                     className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-chic-dark text-white border-chic-dark' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>
               
               <div className="w-px h-6 bg-gray-200 mx-1 shrink-0"></div>

               {/* Price Filter Dropdown */}
               <div className="relative shrink-0" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold border transition-all ${isPriceFilterOpen || (priceRange.min > globalMin || priceRange.max < globalMax) ? 'border-chic-dark text-chic-dark bg-gray-50' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                  >
                    <span className="whitespace-nowrap">
                       Preço
                    </span>
                    <ChevronDown size={14} className={`transition-transform ${isPriceFilterOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isPriceFilterOpen && (
                    <div className="absolute top-full right-auto left-0 md:left-auto md:right-0 mt-3 w-72 md:w-80 bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 p-6 z-40 animate-fade-in">
                       <div className="flex justify-between items-center mb-6">
                          <span className="font-serif font-bold text-chic-dark">Faixa</span>
                          <span className="text-[10px] font-bold text-chic-olive bg-green-50 px-2 py-1 rounded-full">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(priceRange.min)} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(priceRange.max)}
                          </span>
                       </div>
                       
                       <div className="space-y-6">
                          <div>
                            <input 
                              type="range" 
                              min={globalMin} 
                              max={globalMax} 
                              value={priceRange.min} 
                              onChange={handleMinChange}
                              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-chic-dark"
                            />
                          </div>
                          <div>
                            <input 
                              type="range" 
                              min={globalMin} 
                              max={globalMax} 
                              value={priceRange.max} 
                              onChange={handleMaxChange}
                              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-chic-dark"
                            />
                          </div>
                       </div>
                       
                       <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                          <button 
                            onClick={() => setPriceRange({ min: globalMin, max: globalMax })}
                            className="text-xs text-gray-400 hover:text-chic-dark"
                          >
                            Limpar
                          </button>
                          <button 
                            onClick={() => setIsPriceFilterOpen(false)}
                            className="bg-chic-dark text-white text-xs font-bold px-4 py-2 rounded-full"
                          >
                            Aplicar
                          </button>
                       </div>
                    </div>
                  )}
               </div>

               {/* Condition Select (New) */}
               <div className="relative shrink-0">
                 <select 
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className={`px-5 py-2.5 bg-white border rounded-full text-xs font-bold focus:outline-none focus:border-chic-dark cursor-pointer appearance-none pr-8 transition-all ${selectedCondition !== 'all' ? 'border-chic-dark text-chic-dark bg-gray-50' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                 >
                    <option value="all">Condição</option>
                    {Object.values(ProductCondition).map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 <ChevronDown size={14} className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
               </div>

               {/* Size Select */}
               <div className="relative shrink-0">
                 <select 
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className={`px-5 py-2.5 bg-white border rounded-full text-xs font-bold focus:outline-none focus:border-chic-dark cursor-pointer appearance-none pr-8 transition-all ${selectedSize !== 'all' ? 'border-chic-dark text-chic-dark bg-gray-50' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                 >
                    <option value="all">Tam</option>
                    {availableSizes.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
                 <ChevronDown size={14} className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
               </div>
            </div>
         </div>
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-8 md:gap-y-12">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 animate-fade-in">
           <div className="inline-flex bg-gray-50 p-6 rounded-full mb-6 text-gray-300">
             <Filter size={40} />
           </div>
           <h3 className="text-xl font-serif font-bold text-chic-dark mb-2">Nada encontrado</h3>
           <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">Tente ajustar os filtros, vizinha. Sempre chega novidade!</p>
           <button 
             onClick={resetFilters}
             className="px-6 py-3 bg-chic-dark text-white rounded-full text-sm font-medium hover:bg-black transition-all shadow-lg shadow-gray-200"
           >
             Limpar Filtros
           </button>
        </div>
      )}
    </div>
  );
};