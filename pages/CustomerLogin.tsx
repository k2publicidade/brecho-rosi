import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../App';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, User } from 'lucide-react';

export const CustomerLogin: React.FC = () => {
  const { customerUser, signInCustomer, signUpCustomer } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customerUser) {
      const target = (location.state as { from?: string } | null)?.from ?? '/cliente/perfil';
      navigate(target, { replace: true });
    }
  }, [customerUser, navigate, location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signInCustomer(form.email, form.password);
      } else {
        await signUpCustomer(form.email, form.password);
        setNotice('Se o e-mail precisar de confirmação, verifique sua caixa de entrada.');
      }
    } catch {
      setError('Não foi possível autenticar. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 md:px-6 py-10 pb-24">
      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100">
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2 text-center">Área da Cliente</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Acompanhe seus pedidos e estatísticas reais.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-chic-dark/10 focus:border-chic-dark focus:bg-white block p-3 pl-11 transition-all outline-none placeholder:text-gray-400"
                placeholder="seuemail@email.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Senha</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-chic-dark/10 focus:border-chic-dark focus:bg-white block p-3 pl-11 transition-all outline-none placeholder:text-gray-400"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          {(error || notice) && (
            <div className={`text-xs font-medium rounded-xl px-4 py-3 ${error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
              {error || notice}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-chic-dark text-white font-bold hover:bg-black transition-all disabled:opacity-60"
          >
            {loading ? 'Acessando...' : mode === 'signin' ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setMode(prev => prev === 'signin' ? 'signup' : 'signin')}
          className="w-full text-sm text-gray-500 hover:text-chic-dark transition-colors mt-4"
        >
          {mode === 'signin' ? 'Ainda não tem conta? Criar conta' : 'Já tem conta? Entrar'}
        </button>
        <div className="text-center mt-6 text-sm text-gray-500">
          <Link to="/tracking" className="text-chic-olive font-semibold hover:text-chic-dark">
            Acompanhar pedido sem login
          </Link>
        </div>
      </div>
    </div>
  );
};
