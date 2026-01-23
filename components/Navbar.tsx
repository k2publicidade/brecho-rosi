import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Home, Package, Grid } from 'lucide-react';
import { motion } from 'framer-motion';
import { StoreContext } from '../App';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { cart, isAdmin, toggleAdmin } = useContext(StoreContext);
  const location = useLocation();

  const navItems = [
    { name: 'Início', url: '/', icon: Home },
    { name: 'Catálogo', url: '/catalog', icon: Grid },
    { name: 'Rastrear', url: '/tracking', icon: Package },
  ];

  return (
    <>
      {/* Header com Logo, Navbar Tubelight e Carrinho */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex justify-between items-center gap-4 md:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <Logo
              size="sm"
              className="transition-transform group-hover:scale-105"
              animated={true}
            />
          </Link>

          {/* Tubelight Navigation - Centro */}
          <div className="flex-1 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-white/95 border border-gray-200 backdrop-blur-xl py-1 px-1 rounded-full shadow-md">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.url;

                return (
                  <Link
                    key={item.name}
                    to={item.url}
                    className={`relative cursor-pointer text-sm font-semibold px-4 md:px-6 py-2 rounded-full transition-colors ${
                      isActive
                        ? 'text-chic-olive'
                        : 'text-gray-600 hover:text-chic-olive'
                    }`}
                  >
                    <span className="hidden md:inline relative z-10">{item.name}</span>
                    <span className="md:hidden relative z-10">
                      <Icon size={18} strokeWidth={2.5} />
                    </span>

                    {/* Efeito Tubelight Animado */}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-tubelight"
                        className="absolute inset-0 bg-gray-50 rounded-full -z-0"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      >
                        {/* Luz superior (tubelight effect) */}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-chic-olive rounded-full">
                          <div className="absolute w-10 h-4 bg-chic-olive/20 rounded-full blur-sm -top-1 -left-1" />
                          <div className="absolute w-6 h-3 bg-chic-olive/30 rounded-full blur-[2px] -top-0.5 left-1" />
                        </div>
                      </motion.div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Ações (Desktop) */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <button
              onClick={toggleAdmin}
              className={`hidden md:block transition-colors ${isAdmin ? 'text-chic-olive' : 'text-gray-600 hover:text-chic-olive'}`}
              title={isAdmin ? 'Modo Admin Ativo' : 'Ativar Modo Admin'}
            >
              <User size={20} strokeWidth={1.5} />
            </button>

            {/* Cart Icon - Visible on Mobile & Desktop */}
            <Link
              to="/cart"
              className="relative text-gray-600 hover:text-chic-olive transition-colors group p-1"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-chic-olive text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer para compensar navbar fixa */}
      <div className="h-16 md:h-20" />

      {/* Link Admin adicional se ativo */}
      {isAdmin && (
        <Link
          to="/admin"
          className="fixed bottom-6 right-6 z-40 bg-chic-olive text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:bg-chic-dark transition-all hover:scale-105 flex items-center gap-2"
        >
          <User size={16} />
          Admin
        </Link>
      )}
    </>
  );
};
