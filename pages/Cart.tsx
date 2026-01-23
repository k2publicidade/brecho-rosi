import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../App';
import { DeliveryMethod, PaymentMethod } from '../types';
import { Trash2, Store, CheckCircle, Truck, Calculator, ArrowRight, User, Mail, MapPin, CreditCard, Banknote, QrCode, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateShippingQuote } from '../services/shippingService';
import { createStripeCheckoutSession, updateOrderStripeSession } from '../services/storeService';

// PremiumInput Component - Separado para evitar re-criação
const PremiumInput = ({
  label,
  icon: Icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string, icon?: React.ElementType }) => (
  <div className="group">
    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-chic-dark transition-colors">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-chic-dark transition-colors">
          <Icon size={18} />
        </div>
      )}
      <input
        {...props}
        className={`w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-2xl focus:ring-2 focus:ring-chic-dark/10 focus:border-chic-dark focus:bg-white block p-4 transition-all outline-none placeholder:text-gray-300 ${Icon ? 'pl-12' : ''}`}
      />
    </div>
  </div>
);

export const Cart: React.FC = () => {
  const { cart, removeFromCart, placeOrder, clearCart } = useContext(StoreContext);
  
  const [method, setMethod] = useState<DeliveryMethod>(DeliveryMethod.PICKUP);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.PIX);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    city: '',
    zip: ''
  });
  
  // Shipping State
  const [shippingCost, setShippingCost] = useState(0);
  const [deliveryDays, setDeliveryDays] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isShippingCalculated, setIsShippingCalculated] = useState(false);
  const [lastOrderCode, setLastOrderCode] = useState('');
  const [confirmedPaymentMethod, setConfirmedPaymentMethod] = useState<PaymentMethod | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shippingCost;

  // Reset shipping if cart changes or method changes to pickup
  useEffect(() => {
    if (method === DeliveryMethod.PICKUP) {
      setShippingCost(0);
      setIsShippingCalculated(true); // Pickup doesn't need calc
    } else {
      setIsShippingCalculated(false);
      setShippingCost(0);
    }
  }, [method, cart.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // Máscara inteligente para Contato (WhatsApp ou Email)
    if (name === 'contact') {
      const isEmail = /[a-zA-Z@]/.test(value);
      if (!isEmail) {
        const nums = value.replace(/\D/g, '').slice(0, 11); // Limita a 11 dígitos

        if (nums.length === 0) newValue = '';
        else if (nums.length <= 2) newValue = `(${nums}`;
        else if (nums.length <= 6) newValue = `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
        else if (nums.length <= 10) newValue = `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`;
        else newValue = `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
      }
    }

    // Máscara para CEP
    if (name === 'zip') {
      const nums = value.replace(/\D/g, '').slice(0, 8); // Limita a 8 dígitos

      if (nums.length > 5) newValue = `${nums.slice(0, 5)}-${nums.slice(5)}`;
      else newValue = nums;
      
      setIsShippingCalculated(false);
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleCalculateShipping = async () => {
    const cleanCep = formData.zip.replace(/\D/g, '');
    if (!cleanCep || cleanCep.length < 8) {
      alert("Por favor, digite um CEP válido (8 dígitos).");
      return;
    }
    
    setIsCalculating(true);
    try {
      const quote = await calculateShippingQuote(cleanCep, cart);
      setShippingCost(quote.price);
      setDeliveryDays(quote.days);
      setIsShippingCalculated(true);
    } catch {
      alert("Erro ao calcular frete. Verifique o CEP.");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (method === DeliveryMethod.DELIVERY && !isShippingCalculated) {
      alert("Por favor, calcule o frete antes de finalizar.");
      return;
    }

    const fullAddress = method === DeliveryMethod.DELIVERY 
      ? `${formData.address}, ${formData.city} - CEP: ${formData.zip}`
      : undefined;
    
    const orderId = placeOrder(
      formData.name, 
      formData.contact, 
      method, 
      paymentMethod,
      fullAddress, 
      formData.zip,
      shippingCost
    );

    if (paymentMethod === PaymentMethod.CREDIT_CARD) {
      try {
        const successUrl = `${window.location.origin}/#/tracking?orderId=${orderId}`;
        const cancelUrl = `${window.location.origin}/#/cart?orderId=${orderId}`;
        const session = await createStripeCheckoutSession({
          orderId,
          customerName: formData.name,
          customerContact: formData.contact,
          items: cart.map(item => ({
            title: item.title,
            price: item.price,
            quantity: item.quantity
          })),
          shippingCost,
          successUrl,
          cancelUrl
        });

        if (session?.sessionId) {
          await updateOrderStripeSession(orderId, session.sessionId);
        }
        if (session?.url) {
          window.location.href = session.url;
          return;
        }
      } catch (error) {
        console.error(error);
        alert("Não foi possível iniciar o pagamento no cartão.");
      }
    }
    
    setLastOrderCode(orderId);
    setConfirmedPaymentMethod(paymentMethod);
    setTimeout(() => {
        clearCart();
        window.scrollTo(0, 0);
    }, 500);
  };

  if (lastOrderCode) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-24 animate-fade-in">
        <div className="bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden">
          <div className="bg-chic-dark text-white p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="bg-green-500 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2">Pedido Recebido!</h2>
            <p className="text-gray-300 text-lg">Agora é só finalizar o pagamento.</p>
          </div>

          <div className="p-8 md:p-12 space-y-8">
             <div className="text-center">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">Código do Pedido</p>
                <p className="text-5xl font-serif font-bold text-chic-olive tracking-tight mb-6">#{lastOrderCode.slice(-6)}</p>
                <p className="text-gray-600 max-w-md mx-auto">
                  Sua reserva está feita! As peças ficam reservadas por 24h.
                </p>
             </div>

             {/* Payment Instructions */}
             <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
               <h3 className="font-bold text-chic-dark mb-4 flex items-center gap-2">
                 {confirmedPaymentMethod === PaymentMethod.PIX && <QrCode size={20} />}
                 {confirmedPaymentMethod === PaymentMethod.CREDIT_CARD && <CreditCard size={20} />}
                 {confirmedPaymentMethod === PaymentMethod.CASH && <Banknote size={20} />}
                 Pagamento via {confirmedPaymentMethod}
               </h3>

               {confirmedPaymentMethod === PaymentMethod.PIX && (
                 <div className="space-y-4">
                    <p className="text-sm text-gray-600">Copie a chave Pix abaixo para realizar o pagamento:</p>
                    <div className="flex items-center gap-2 bg-white border border-gray-200 p-3 rounded-xl">
                       <code className="flex-1 font-mono text-sm text-gray-800 truncate">pix@ecochic.com.br</code>
                       <button className="text-chic-olive font-bold text-xs uppercase hover:bg-green-50 p-2 rounded-lg transition-colors">
                         <Copy size={16} />
                       </button>
                    </div>
                    <p className="text-xs text-gray-500 bg-blue-50 text-blue-700 p-3 rounded-xl">
                      Envie o comprovante para nosso WhatsApp para agilizar o envio!
                    </p>
                 </div>
               )}

               {confirmedPaymentMethod === PaymentMethod.CREDIT_CARD && (
                 <p className="text-sm text-gray-600">
                   Se o pagamento não abrir automaticamente, volte e tente novamente para gerar o link seguro.
                 </p>
               )}

               {confirmedPaymentMethod === PaymentMethod.CASH && (
                 <p className="text-sm text-gray-600">
                   Pagamento em dinheiro no ato. Caso precise de troco, avise nossa equipe pelo WhatsApp.
                 </p>
               )}
             </div>

             <div className="flex flex-col gap-3">
                <Link to="/tracking" className="w-full py-4 bg-chic-dark text-white rounded-2xl font-bold text-center hover:bg-black transition-all shadow-lg">
                  Acompanhar Pedido
                </Link>
                <Link to="/" className="w-full py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold text-center hover:border-chic-dark hover:text-chic-dark transition-all">
                  Voltar para a Loja
                </Link>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <div className="inline-block p-8 bg-gray-50 rounded-full mb-8">
           <Store size={48} className="text-gray-300" />
        </div>
        <h2 className="text-4xl font-serif font-bold mb-4 text-chic-dark">Sua sacolinha está vazia</h2>
        <p className="text-gray-500 mb-10 text-lg">Que tal dar uma olhada nos tesouros que chegaram no ateliêr hoje?</p>
        <Link to="/catalog" className="inline-block px-10 py-4 bg-chic-olive text-white rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-chic-olive/20">
          Ver Achadinhos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-32">
      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 md:mb-12 text-chic-dark">Fechar Sacolinha</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* Left Col: Items */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            Seus Garimpos <span className="bg-gray-100 text-chic-dark text-xs py-1 px-3 rounded-full ml-auto">{cart.length} itens</span>
          </h2>
          <div className="space-y-6 mb-10">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 md:gap-6 items-center group">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-serif font-bold text-lg text-chic-dark truncate pr-4">{item.title}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full -mr-2">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 mb-2">{item.size} • {item.condition}</p>
                  <p className="font-bold text-chic-dark">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
             <div className="flex justify-between mb-3 text-gray-500 text-sm">
               <span>Subtotal</span>
               <span className="font-medium text-chic-dark">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
             </div>
             <div className="flex justify-between mb-6 text-gray-500 text-sm">
               <span>Entrega ({method === DeliveryMethod.PICKUP ? 'Retirada' : 'Envio'})</span>
               <span className="font-medium text-chic-dark">{shippingCost === 0 ? (method === DeliveryMethod.DELIVERY && !isShippingCalculated ? '--' : 'Grátis') : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shippingCost)}</span>
             </div>
             
             <div className="h-px bg-gray-100 mb-6"></div>

             <div className="flex justify-between text-2xl font-serif font-bold text-chic-dark">
               <span>Total</span>
               <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
             </div>
          </div>
        </div>

        {/* Right Col: Form */}
        <div className="lg:col-span-5 order-1 lg:order-2">
          <form onSubmit={handleSubmit} className="space-y-8 sticky top-24">
            
            {/* Step 1: Customer Details */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
               <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-chic-olive/10 text-chic-olive flex items-center justify-center text-sm">1</span>
                  Quem é você?
               </h2>
               <div className="space-y-5">
                 <PremiumInput 
                    label="Nome" 
                    icon={User}
                    name="name" 
                    placeholder="Seu nome"
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required
                 />
                 <PremiumInput 
                    label="WhatsApp ou Email" 
                    icon={Mail}
                    name="contact" 
                    placeholder="(00) 00000-0000 para contato"
                    value={formData.contact} 
                    onChange={handleInputChange} 
                    required
                 />
               </div>
            </div>

            {/* Step 2: Delivery Method */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-chic-olive/10 text-chic-olive flex items-center justify-center text-sm">2</span>
                  Entrega
               </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <label className={`cursor-pointer relative overflow-hidden border rounded-2xl p-4 flex flex-col items-center gap-3 transition-all duration-300 ${method === DeliveryMethod.PICKUP ? 'border-chic-dark bg-chic-dark text-white shadow-lg' : 'border-gray-200 bg-white hover:border-chic-dark/30 text-gray-500'}`}>
                  <input 
                    type="radio" 
                    name="method" 
                    value={DeliveryMethod.PICKUP} 
                    checked={method === DeliveryMethod.PICKUP} 
                    onChange={() => setMethod(DeliveryMethod.PICKUP)}
                    className="hidden" 
                  />
                  <Store size={24} className={method === DeliveryMethod.PICKUP ? 'text-white' : 'text-gray-400'} />
                  <div className="text-center z-10">
                     <span className="block font-bold text-xs md:text-sm">Retirar</span>
                     <span className={`text-[10px] font-bold uppercase tracking-wider ${method === DeliveryMethod.PICKUP ? 'text-white/70' : 'text-green-600'}`}>Grátis</span>
                  </div>
                </label>

                <label className={`cursor-pointer relative overflow-hidden border rounded-2xl p-4 flex flex-col items-center gap-3 transition-all duration-300 ${method === DeliveryMethod.DELIVERY ? 'border-chic-dark bg-chic-dark text-white shadow-lg' : 'border-gray-200 bg-white hover:border-chic-dark/30 text-gray-500'}`}>
                  <input 
                    type="radio" 
                    name="method" 
                    value={DeliveryMethod.DELIVERY} 
                    checked={method === DeliveryMethod.DELIVERY} 
                    onChange={() => setMethod(DeliveryMethod.DELIVERY)}
                    className="hidden" 
                  />
                  <Truck size={24} className={method === DeliveryMethod.DELIVERY ? 'text-white' : 'text-gray-400'} />
                  <div className="text-center z-10">
                     <span className="block font-bold text-xs md:text-sm">Correios</span>
                     <span className={`text-[10px] font-bold uppercase tracking-wider ${method === DeliveryMethod.DELIVERY ? 'text-white/70' : 'text-gray-400'}`}>Rápido</span>
                  </div>
                </label>
              </div>

              {/* Address & Calculation */}
              {method === DeliveryMethod.DELIVERY && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex gap-3 items-end">
                      <div className="flex-1">
                          <PremiumInput 
                             label="CEP"
                             name="zip"
                             placeholder="00000-000"
                             value={formData.zip}
                             onChange={handleInputChange}
                             required
                          />
                      </div>
                      <button 
                        type="button" 
                        onClick={handleCalculateShipping}
                        disabled={isCalculating || formData.zip.replace(/\D/g, '').length !== 8}
                        className="bg-gray-900 text-white h-[54px] w-[54px] rounded-2xl hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-lg"
                      >
                        {isCalculating ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Calculator size={20} />}
                      </button>
                  </div>
                  
                  {isShippingCalculated && (
                     <div className="space-y-5 pt-4 border-t border-gray-100 animate-fade-in">
                        <div className="flex items-center gap-3 text-sm text-green-700 bg-green-50/50 border border-green-100 p-4 rounded-2xl">
                           <CheckCircle size={18} className="shrink-0" />
                           <span className="font-medium">Entrega estimada: {deliveryDays} dias úteis.</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                           <div className="col-span-1">
                              <PremiumInput 
                                label="Estado"
                                name="city"
                                placeholder="UF"
                                value="SP"
                                readOnly
                                className="bg-gray-100 text-gray-500 cursor-not-allowed"
                              />
                           </div>
                           <div className="col-span-2">
                              <PremiumInput 
                                label="Cidade"
                                name="city"
                                placeholder="Sua cidade"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                              />
                           </div>
                        </div>
                        
                        <PremiumInput 
                          label="Endereço Completo"
                          icon={MapPin}
                          name="address"
                          placeholder="Rua, Número, Complemento"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                     </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
               <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-chic-olive/10 text-chic-olive flex items-center justify-center text-sm">3</span>
                  Pagamento
               </h2>
               <div className="space-y-3">
                  {[
                    { id: PaymentMethod.PIX, icon: QrCode, label: 'Pix', sub: 'Aprovação Imediata' },
                    { id: PaymentMethod.CREDIT_CARD, icon: CreditCard, label: 'Cartão', sub: 'Pagamento online' },
                    { id: PaymentMethod.CASH, icon: Banknote, label: 'Dinheiro', sub: 'Pagamento na entrega' }
                  ].map((pay) => (
                    <label 
                      key={pay.id}
                      className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all duration-200 ${
                        paymentMethod === pay.id 
                        ? 'border-chic-dark bg-gray-50 ring-1 ring-chic-dark/5' 
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                       <input 
                         type="radio" 
                         name="payment" 
                         value={pay.id}
                         checked={paymentMethod === pay.id}
                         onChange={() => setPaymentMethod(pay.id)}
                         className="hidden"
                       />
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-colors ${
                         paymentMethod === pay.id ? 'bg-chic-dark text-white' : 'bg-gray-100 text-gray-500'
                       }`}>
                          <pay.icon size={20} />
                       </div>
                       <div>
                          <span className={`block font-bold text-sm ${paymentMethod === pay.id ? 'text-chic-dark' : 'text-gray-700'}`}>{pay.label}</span>
                          <span className="text-xs text-gray-400">{pay.sub}</span>
                       </div>
                       <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                         paymentMethod === pay.id ? 'border-chic-dark' : 'border-gray-300'
                       }`}>
                          {paymentMethod === pay.id && <div className="w-2.5 h-2.5 rounded-full bg-chic-dark"></div>}
                       </div>
                    </label>
                  ))}
               </div>
            </div>

            <button 
               type="submit" 
               disabled={method === DeliveryMethod.DELIVERY && !isShippingCalculated}
               className="w-full bg-chic-olive text-white py-5 rounded-[2rem] font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl shadow-chic-olive/20 hover:shadow-2xl hover:shadow-chic-olive/30 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 active:scale-95 duration-300"
            >
              <span>Confirmar Pedido</span>
              <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
