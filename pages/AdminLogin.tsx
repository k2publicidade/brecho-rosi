import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { isAdmin, signInAdmin } = useContext(StoreContext);
  const navigate = useNavigate();
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, navigate]);

  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      await signInAdmin(authForm.email, authForm.password);
      setAuthForm({ email: '', password: '' });
    } catch {
      setAuthError('Email ou senha inválidos.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 md:px-6 py-10 pb-24">
      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100">
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6 text-center">Login Administrativo</h1>
        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={authForm.email}
                onChange={handleAuthChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-chic-dark/10 focus:border-chic-dark focus:bg-white block p-3 pl-11 transition-all outline-none placeholder:text-gray-400"
                placeholder="seuemail@rosidesign.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Senha</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={authForm.password}
                onChange={handleAuthChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-chic-dark/10 focus:border-chic-dark focus:bg-white block p-3 pl-11 transition-all outline-none placeholder:text-gray-400"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          {authError && (
            <div className="text-sm text-red-500 font-bold text-center">{authError}</div>
          )}
          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-3 rounded-xl bg-chic-dark text-white font-bold hover:bg-black transition-all disabled:opacity-60"
          >
            {authLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};
