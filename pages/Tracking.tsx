import React, { useContext, useState } from 'react';
import { StoreContext } from '../App';
import { Search, Package, MapPin, CheckCircle, Clock, Truck, Store, ArrowRight } from 'lucide-react';
import { OrderStatus, DeliveryMethod } from '../types';

export const Tracking: React.FC = () => {
  const { orders } = useContext(StoreContext);
  const [searchId, setSearchId] = useState('');
  const [foundOrder, setFoundOrder] = useState<any | null>(null);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const order = orders.find(o => o.id === searchId || o.id.endsWith(searchId));
    if (order) {
      setFoundOrder(order);
    } else {
      setFoundOrder(null);
      setError('Poxa, vizinha, não encontramos esse código. Confere se está certinho?');
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_PAYMENT: return <Clock size={20} />;
      case OrderStatus.PAID: return <CheckCircle size={20} />;
      case OrderStatus.PREPARING: return <Package size={20} />;
      case OrderStatus.SHIPPED: return <Truck size={20} />;
      case OrderStatus.DELIVERED: return <MapPin size={20} />;
      case OrderStatus.READY_FOR_PICKUP: return <Store size={20} />;
      case OrderStatus.PICKED_UP: return <CheckCircle size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const getProgressColor = (currentStatus: OrderStatus, stepStatus: OrderStatus) => {
    const statusOrderDelivery = [
      OrderStatus.PENDING_PAYMENT, 
      OrderStatus.PAID, 
      OrderStatus.PREPARING, 
      OrderStatus.SHIPPED, 
      OrderStatus.DELIVERED
    ];

    const statusOrderPickup = [
        OrderStatus.PENDING_PAYMENT, 
        OrderStatus.PAID, 
        OrderStatus.PREPARING, 
        OrderStatus.READY_FOR_PICKUP, 
        OrderStatus.PICKED_UP
    ];

    const flow = foundOrder?.method === DeliveryMethod.DELIVERY ? statusOrderDelivery : statusOrderPickup;
    const currentIndex = flow.indexOf(currentStatus);
    const stepIndex = flow.indexOf(stepStatus);

    if (currentIndex >= stepIndex) return 'bg-chic-dark text-white border-chic-dark shadow-lg shadow-chic-dark/20';
    return 'bg-white text-gray-300 border-gray-100';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-32">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-chic-dark mb-4">Onde está meu garimpo?</h1>
        <p className="text-gray-500 text-lg">Acompanhe o caminho da sua peça favorita até você.</p>
      </div>

      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-16 relative group">
        <div className="absolute inset-0 bg-chic-olive/5 rounded-full blur-xl group-hover:bg-chic-olive/10 transition-colors"></div>
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Digite o código (ex: 174092...)"
          className="relative w-full pl-8 pr-16 py-5 bg-white border border-gray-200 rounded-full shadow-lg shadow-gray-200/50 text-lg focus:ring-4 focus:ring-chic-olive/10 focus:border-chic-dark focus:outline-none transition-all placeholder:text-gray-400"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-chic-dark text-white w-12 h-12 rounded-full hover:bg-black transition-all flex items-center justify-center shadow-md active:scale-95 disabled:opacity-50"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <ArrowRight size={24} />}
        </button>
      </form>

      {error && (
        <div className="max-w-md mx-auto p-4 bg-red-50 text-red-600 rounded-2xl text-center mb-8 border border-red-100 animate-fade-in text-sm font-medium">
          {error}
        </div>
      )}

      {foundOrder && (
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gray-50/50 p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">Pedido #{foundOrder.id.slice(-6)}</h2>
              <p className="text-sm text-gray-500 mt-1">Realizado em {new Date(foundOrder.date).toLocaleDateString()}</p>
            </div>
            <div className="text-center md:text-right">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-white text-chic-dark shadow-sm border border-gray-100">
                <span className="w-2 h-2 rounded-full bg-chic-olive animate-pulse"></span>
                {foundOrder.status}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-10">
            {/* Timeline */}
            <div className="mb-12">
               <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
                  {/* Vertical line for mobile, Horizontal for desktop */}
                  <div className="absolute left-[1.125rem] top-4 bottom-4 w-0.5 bg-gray-100 md:left-4 md:right-4 md:top-[1.125rem] md:h-0.5 md:w-auto -z-10"></div>
                  
                  {(foundOrder.method === DeliveryMethod.DELIVERY ? [
                      { s: OrderStatus.PENDING_PAYMENT, label: 'Aguardando' },
                      { s: OrderStatus.PAID, label: 'Pago' },
                      { s: OrderStatus.PREPARING, label: 'Preparando' },
                      { s: OrderStatus.SHIPPED, label: 'Enviado' },
                      { s: OrderStatus.DELIVERED, label: 'Entregue' }
                  ] : [
                      { s: OrderStatus.PENDING_PAYMENT, label: 'Aguardando' },
                      { s: OrderStatus.PAID, label: 'Pago' },
                      { s: OrderStatus.PREPARING, label: 'Preparando' },
                      { s: OrderStatus.READY_FOR_PICKUP, label: 'Pronto' },
                      { s: OrderStatus.PICKED_UP, label: 'Retirado' }
                  ]).map((step, idx) => (
                    <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-3 bg-white md:bg-transparent pr-4 md:pr-0 py-1 md:py-0">
                       <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 z-10 ${getProgressColor(foundOrder.status, step.s)}`}>
                          {getStatusIcon(step.s)}
                       </div>
                       <span className={`text-xs md:text-sm font-bold uppercase tracking-wide transition-colors ${foundOrder.status === step.s ? 'text-chic-dark' : 'text-gray-400'}`}>{step.label}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Tracking History List */}
            <div className="bg-gray-50 rounded-3xl p-6 md:p-8 mb-8">
               <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
                 <Clock size={16} /> Linha do Tempo
               </h3>
               <div className="space-y-8">
                 {foundOrder.trackingHistory.slice().reverse().map((event: any, idx: number) => (
                   <div key={idx} className="relative pl-8 border-l-2 border-gray-200 last:border-0 pb-1">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-chic-dark"></div>
                      <div className="transform -translate-y-1.5">
                        <p className="font-bold text-gray-900 text-lg leading-none mb-1">{event.status}</p>
                        <p className="text-xs text-gray-400 font-medium mb-2">{new Date(event.date).toLocaleString('pt-BR')}</p>
                        {event.note && <p className="text-sm text-gray-600 bg-white p-3 rounded-xl inline-block shadow-sm border border-gray-100">"{event.note}"</p>}
                      </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Order Details Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
               <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Destino</h4>
                  {foundOrder.method === DeliveryMethod.DELIVERY ? (
                     <div className="flex items-start gap-3">
                        <div className="mt-1 text-chic-olive"><MapPin size={20} /></div>
                        <p className="text-gray-800 font-medium leading-relaxed">{foundOrder.address}</p>
                     </div>
                  ) : (
                     <div className="flex items-start gap-3">
                       <div className="mt-1 text-chic-olive"><Store size={20} /></div>
                       <p className="text-gray-800 font-medium leading-relaxed">
                         <span className="font-bold block text-lg mb-1">Loja Brechó do Mariléia</span>
                         Jardim Mariléia<br/>
                         Rio das Ostras - RJ
                       </p>
                     </div>
                  )}
               </div>
               <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Valores</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(foundOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Frete</span>
                        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(foundOrder.shippingCost)}</span>
                    </div>
                    <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between font-serif font-bold text-2xl text-chic-dark">
                        <span>Total</span>
                        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(foundOrder.total)}</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};