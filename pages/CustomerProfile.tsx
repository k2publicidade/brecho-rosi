import React, { useContext, useMemo } from 'react';
import { StoreContext } from '../App';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { ChartBar, LogOut, Package, Store as StoreIcon, Truck } from 'lucide-react';
import { DeliveryMethod } from '../types';

export const CustomerProfile: React.FC = () => {
  const { customerUser, orders, signOutCustomer } = useContext(StoreContext);
  const location = useLocation();
  const customerId = customerUser?.id ?? '';

  const customerOrders = useMemo(() => {
    if (!customerId) {
      return [];
    }
    return orders.filter(order => order.customerId === customerId);
  }, [orders, customerId]);

  const stats = useMemo(() => {
    const totalOrders = customerOrders.length;
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
    const deliveryCount = customerOrders.filter(order => order.method === DeliveryMethod.DELIVERY).length;
    const pickupCount = customerOrders.filter(order => order.method === DeliveryMethod.PICKUP).length;
    const lastOrderDate = customerOrders.reduce((latest, order) => {
      if (!latest) return order.date;
      return new Date(order.date) > new Date(latest) ? order.date : latest;
    }, '');
    const categoryCounts = customerOrders.reduce((acc: Record<string, number>, order) => {
      order.items.forEach(item => {
        acc[item.category] = (acc[item.category] || 0) + item.quantity;
      });
      return acc;
    }, {});
    const categoryEntries = Object.entries(categoryCounts) as Array<[string, number]>;
    const favoriteCategory = categoryEntries.sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
    return { totalOrders, totalSpent, deliveryCount, pickupCount, lastOrderDate, favoriteCategory };
  }, [customerOrders]);

  if (!customerUser) {
    return <Navigate to="/cliente/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 pb-24">
      <div className="bg-white border border-gray-100 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-gray-200/50">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-chic-dark">Perfil da Cliente</h1>
            <p className="text-gray-500 text-sm">Conectada como {customerUser.email}</p>
          </div>
          <button
            onClick={signOutCustomer}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition-colors"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase mb-2">
              <ChartBar size={14} />
              Pedidos
            </div>
            <p className="text-2xl font-serif font-bold text-chic-dark">{stats.totalOrders}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase mb-2">
              <ChartBar size={14} />
              Total Investido
            </div>
            <p className="text-2xl font-serif font-bold text-chic-dark">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalSpent)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase mb-2">
              <Truck size={14} />
              Entregas
            </div>
            <p className="text-2xl font-serif font-bold text-chic-dark">{stats.deliveryCount}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase mb-2">
              <StoreIcon size={14} />
              Retiradas
            </div>
            <p className="text-2xl font-serif font-bold text-chic-dark">{stats.pickupCount}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Última compra</span>
            <span className="font-medium text-gray-700">
              {stats.lastOrderDate ? new Date(stats.lastOrderDate).toLocaleDateString('pt-BR') : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-500">Categoria favorita</span>
            <span className="font-medium text-gray-700">{stats.favoriteCategory}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-bold text-chic-dark">Meus pedidos</h2>
          <Link to="/catalog" className="text-sm text-chic-olive font-semibold hover:text-chic-dark">
            Ver catálogo
          </Link>
        </div>

        {customerOrders.length === 0 ? (
          <div className="bg-gray-50 p-8 text-center rounded-[2rem] border border-dashed border-gray-200 text-gray-400">
            Você ainda não tem pedidos vinculados ao seu login.
          </div>
        ) : (
          <div className="space-y-4">
            {customerOrders.map(order => (
              <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Pedido</p>
                    <p className="text-lg font-serif font-bold text-chic-dark">#{order.id.slice(-6)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString('pt-BR')} • {order.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-bold text-chic-dark">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                    </p>
                    <Link
                      to={`/tracking?orderId=${order.id}`}
                      className="inline-flex items-center gap-2 text-sm text-chic-olive font-semibold hover:text-chic-dark mt-2"
                    >
                      <Package size={14} />
                      Rastrear pedido
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
