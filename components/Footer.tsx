import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-chic-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <Logo
              size="md"
              className="mb-4 brightness-0 invert"
              animated={false}
            />
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Moda sustentável com estilo único. Descubra peças exclusivas que
              contam histórias e valorizam o consumo consciente.
            </p>

            {/* Redes Sociais */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com/brechodarosi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-chic-olive transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com/brechodarosi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-chic-olive transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="mailto:contato@brechodarosi.com.br"
                className="text-gray-300 hover:text-chic-olive transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">
              Links Rápidos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-chic-olive transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  className="text-gray-300 hover:text-chic-olive transition-colors"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  to="/tracking"
                  className="text-gray-300 hover:text-chic-olive transition-colors"
                >
                  Rastrear Pedido
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-gray-300 hover:text-chic-olive transition-colors"
                >
                  Carrinho
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-chic-olive" />
                <span>São Paulo, SP<br />Brasil</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-chic-olive" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-chic-olive" />
                <span>contato@brechodarosi.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Brechó da Rosi. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
