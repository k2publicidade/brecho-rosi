import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { StoreContext } from '../App';
import { ProductCard } from '../components/ProductCard';

export const Home: React.FC = () => {
  const { products } = useContext(StoreContext);
  const featuredProducts = products.filter(p => p.available).slice(0, 5); // Increased to 5 for scroll effect

  return (
    <div className="pb-24"> {/* Added padding bottom for mobile nav */}
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 md:pt-20 md:pb-32 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-20">
          
          {/* Mobile: Image First (Standard App Pattern) */}
          <div className="md:hidden w-full relative mb-4">
             <div className="relative rounded-[2rem] overflow-hidden shadow-xl aspect-[4/4]">
                <img 
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2274&auto=format&fit=crop" 
                  alt="Vintage Store Vibe" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                   <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-chic-olive" />
                      <span className="text-xs font-bold uppercase tracking-widest">Jardim Mariléia</span>
                   </div>
                   <p className="font-serif text-2xl">Moda com afeto.</p>
                </div>
             </div>
          </div>

          {/* Hero Content */}
          <div className="md:w-1/2 relative z-10 text-center md:text-left">
            <div className="hidden md:flex items-center gap-2 mb-6">
               <span className="h-px w-8 bg-chic-olive"></span>
               <span className="text-chic-olive font-bold uppercase tracking-widest text-xs">Do Bairro Para o Bairro</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-semibold text-chic-dark leading-[1.1] md:leading-[0.95] mb-4 md:mb-8">
              Bem-vinda ao <br className="hidden md:block"/>
              Brechó da <span className="text-chic-olive">Rosi</span>
            </h1>
            
            <p className="text-gray-600 mb-8 max-w-md mx-auto md:mx-0 leading-relaxed text-sm md:text-lg">
              Aquele achadinho que você ama está aqui, pertinho de você. Curadoria feita com carinho pela Rosi para as vizinhas mais estilosas do Jardim Mariléia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link to="/catalog" className="px-8 py-4 bg-chic-olive text-white rounded-full font-medium hover:bg-opacity-90 transition-all hover:shadow-lg hover:shadow-chic-olive/20 flex items-center justify-center gap-2 active:scale-95">
                Ver Achadinhos <ArrowRight size={18} />
              </Link>
            </div>

            {/* Stats (Desktop Only) */}
            <div className="hidden md:flex mt-16 items-center gap-12">
               <div>
                 <p className="text-3xl font-bold font-serif text-chic-dark">Local</p>
                 <p className="text-sm text-gray-500 font-medium">Jardim Mariléia</p>
               </div>
               <div className="w-px h-10 bg-gray-200"></div>
               <div>
                 <p className="text-3xl font-bold font-serif text-chic-dark">100%</p>
                 <p className="text-sm text-gray-500 font-medium">Curadoria Afetiva</p>
               </div>
            </div>
          </div>

          {/* Desktop Image */}
          <div className="hidden md:block md:w-1/2 relative">
             <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/3] group">
                <img 
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2274&auto=format&fit=crop" 
                  alt="Vintage Store Vibe" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-white/50 transition-colors border border-white/50">
                      <div className="w-12 h-12 bg-chic-olive rounded-full flex items-center justify-center shadow-lg">
                        <Play size={20} fill="white" className="text-white ml-1" />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Featured Products - Horizontal Scroll for Mobile (App Style) */}
      <section className="py-12 md:py-24 bg-chic-cream/50">
        <div className="max-w-7xl mx-auto">
          <div className="px-6 flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif font-semibold text-chic-dark">
                Chegou no Bairro
              </h2>
              <p className="text-gray-500 text-sm md:text-lg mt-1">
                As novidades que acabaram de entrar na arara.
              </p>
            </div>
            <Link to="/catalog" className="text-sm font-bold text-chic-olive flex items-center gap-1">
              Ver tudo <ArrowRight size={14} />
            </Link>
          </div>

          {/* Desktop Grid / Mobile Snap Scroll */}
          <div className="
            flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-8 no-scrollbar
            md:grid md:grid-cols-4 md:gap-8 md:overflow-visible md:pb-0
          ">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="min-w-[85%] sm:min-w-[45%] md:min-w-0 snap-center">
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy / Features (Simplified for Mobile) */}
      <section className="py-12 md:py-24 px-4 md:px-6">
         <div className="max-w-7xl mx-auto bg-chic-dark text-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-chic-olive/5 blur-3xl"></div>
            
            <div className="grid md:grid-cols-2 gap-12 relative z-10">
               <div>
                  <h2 className="text-3xl md:text-5xl font-serif mb-4 md:mb-6">A história por trás do garimpo</h2>
                  <p className="text-gray-400 text-sm md:text-lg leading-relaxed mb-8">
                     Sou a Rosi, apaixonada por moda e garimpo há anos. Criei este brechó para compartilhar com as vizinhas do Jardim Mariléia peças especiais que encontro. Cada achadinho passa pela minha curadoria afetiva, garantindo qualidade, preço justo e estilo atemporal.
                  </p>
                  <div className="flex gap-8">
                     <div>
                        <h4 className="text-2xl md:text-3xl font-serif text-chic-olive font-bold mb-1">Vizinhas</h4>
                        <p className="text-xs md:text-sm text-gray-400">Felizes</p>
                     </div>
                     <div>
                        <h4 className="text-2xl md:text-3xl font-serif text-chic-olive font-bold mb-1">Moda</h4>
                        <p className="text-xs md:text-sm text-gray-400">Circular</p>
                     </div>
                  </div>
               </div>
               <div className="hidden md:grid grid-cols-2 gap-4">
                  <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" className="rounded-3xl w-full h-full object-cover translate-y-8" />
                  <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" className="rounded-3xl w-full h-full object-cover -translate-y-8" />
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};