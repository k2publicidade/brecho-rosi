import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Home, Package, Grid } from 'lucide-react';
import { StoreContext } from '../App';

export const Navbar: React.FC = () => {
  const { cart, isAdmin, toggleAdmin } = useContext(StoreContext);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Início' },
    { path: '/catalog', label: 'Catálogo' },
    { path: '/tracking', label: 'Rastrear' },
  ];

  const mobileTabs = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/catalog', icon: Grid, label: 'Catálogo' },
    { path: '/tracking', icon: Package, label: 'Rastrear' },
  ];

  return (
    <>
      {/* Desktop & Mobile Header */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-serif text-xl md:text-2xl font-bold text-chic-dark tracking-tight group-hover:opacity-80 transition-opacity">
              EcoChic<span className="text-chic-olive">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`text-sm font-medium transition-colors hover:text-chic-olive ${
                  location.pathname === link.path ? 'text-chic-olive' : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium text-chic-olive">
                Admin
              </Link>
            )}
          </div>

          {/* Icons (Desktop Only mostly, Mobile Cart stays) */}
          <div className="flex items-center gap-4 md:gap-6">
            <button className="hidden md:block text-gray-600 hover:text-chic-olive transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </button>
            
            <button 
              onClick={toggleAdmin}
              className={`hidden md:block transition-colors ${isAdmin ? 'text-chic-olive' : 'text-gray-600 hover:text-chic-olive'}`}
            >
              <User size={20} strokeWidth={1.5} />
            </button>

            {/* Cart Icon - Visible on Mobile & Desktop */}
            <Link to="/cart" className="relative text-gray-600 hover:text-chic-olive transition-colors group p-1">
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cart.length > 0 && (
                <span className="absolute top-0 -right-1 bg-chic-olive text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm animate-bounce">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (App Style) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 pb-safe pt-2 px-6 z-50 flex justify-between items-end shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        {mobileTabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link 
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center gap-1 p-3 w-16 transition-all duration-300 ${isActive ? '-translate-y-1' : ''}`}
            >
              <tab.icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 1.5} 
                className={`transition-colors duration-300 ${isActive ? 'text-chic-olive' : 'text-gray-400'}`} 
              />
              <span className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? 'text-chic-dark' : 'text-gray-400'}`}>
                {tab.label}
              </span>
              {isActive && <div className="w-1 h-1 bg-chic-olive rounded-full mt-1"></div>}
            </Link>
          );
        })}
        
        {/* Admin Tab for Mobile */}
        <button 
          onClick={toggleAdmin}
          className={`flex flex-col items-center gap-1 p-3 w-16 transition-all duration-300 ${isAdmin ? '-translate-y-1' : ''}`}
        >
          <User 
             size={24} 
             strokeWidth={isAdmin ? 2.5 : 1.5}
             className={`transition-colors duration-300 ${isAdmin ? 'text-chic-olive' : 'text-gray-400'}`} 
          />
          <span className={`text-[10px] font-medium transition-colors duration-300 ${isAdmin ? 'text-chic-dark' : 'text-gray-400'}`}>
             {isAdmin ? 'Admin' : 'Perfil'}
          </span>
          {isAdmin && <div className="w-1 h-1 bg-chic-olive rounded-full mt-1"></div>}
        </button>
      </div>
    </>
  );
};