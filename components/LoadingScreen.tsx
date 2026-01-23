import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo com animação pulsante */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Logo size="xl" animated={true} />
        </motion.div>

        {/* Texto de carregamento */}
        <motion.p
          className="mt-8 text-chic-dark font-serif text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Preparando sua experiência...
        </motion.p>

        {/* Barra de progresso animada */}
        <div className="mt-4 w-48 mx-auto h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-chic-olive"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    </div>
  );
};
