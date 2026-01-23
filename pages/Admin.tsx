import React, { useContext, useState } from 'react';
import { StoreContext } from '../App';
import { ProductCategory, ProductCondition, Product, OrderStatus, DeliveryMethod } from '../types';
import { generateProductDescription } from '../services/geminiService';
import { Sparkles, Trash2, Package, ShoppingBag, Plus, Edit3, Image as ImageIcon, MapPin, CreditCard } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export const Admin: React.FC = () => {
  const { products, orders, addProduct, deleteProduct, updateOrderStatus, isAdmin, signOutAdmin } = useContext(StoreContext);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  // Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    title: '',
    description: '',
    price: 0,
    originalPrice: 0,
    size: '',
    condition: ProductCondition.EXCELLENT,
    category: ProductCategory.CLOTHING,
    available: true,
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Status Edit State
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>(OrderStatus.PENDING_PAYMENT);

  const inputClass = "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-chic-dark/10 focus:border-chic-dark focus:bg-white block p-3 transition-all outline-none placeholder:text-gray-400";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1";

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Helper: Get available statuses based on delivery method
  const getAvailableStatuses = (method: DeliveryMethod) => {
    const common = [OrderStatus.PENDING_PAYMENT, OrderStatus.PAID, OrderStatus.PREPARING, OrderStatus.CANCELLED];
    if (method === DeliveryMethod.DELIVERY) {
      return [...common, OrderStatus.SHIPPED, OrderStatus.DELIVERED];
    } else {
      return [...common, OrderStatus.READY_FOR_PICKUP, OrderStatus.PICKED_UP];
    }
  };

  const handleStatusUpdate = (orderId: string) => {
    updateOrderStatus(orderId, newStatus);
    setEditingOrderId(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateDescription = async () => {
    if (!newProduct.title || !newProduct.category) {
      alert("Preencha pelo menos o título e a categoria para gerar a descrição.");
      return;
    }
    setIsGenerating(true);
    const desc = await generateProductDescription(
      newProduct.title!,
      newProduct.condition!,
      newProduct.category!,
      `Tamanho ${newProduct.size}, Preço R$${newProduct.price}`
    );
    setNewProduct(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price || !imagePreview) {
      alert("Preencha os campos obrigatórios e adicione uma imagem.");
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      title: newProduct.title!,
      description: newProduct.description || '',
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice) || undefined,
      size: newProduct.size || 'Único',
      condition: newProduct.condition as ProductCondition,
      category: newProduct.category as ProductCategory,
      imageUrl: imagePreview,
      available: true,
      createdAt: Date.now()
    };

    addProduct(product);
    
    // Reset form
    setNewProduct({
      title: '',
      description: '',
      price: 0,
      originalPrice: 0,
      size: '',
      condition: ProductCondition.EXCELLENT,
      category: ProductCategory.CLOTHING,
      available: true,
    });
    setImagePreview('');
    alert("Produto cadastrado com sucesso!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Painel Administrativo</h1>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1.5 rounded-xl">
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${activeTab === 'products' ? 'bg-white text-chic-dark shadow' : 'text-gray-500 hover:text-gray-700 shadow-none'}`}
            >
              Produtos
            </button>
            <button 
               onClick={() => setActiveTab('orders')}
               className={`px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${activeTab === 'orders' ? 'bg-white text-chic-dark shadow' : 'text-gray-500 hover:text-gray-700 shadow-none'}`}
            >
              Pedidos
            </button>
          </div>
          <button
            onClick={signOutAdmin}
            className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-300 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>

      {activeTab === 'products' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add Product Form */}
          <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-chic-dark">
              <div className="bg-chic-dark text-white p-2 rounded-lg">
                <Plus size={18} /> 
              </div>
              Novo Produto
            </h2>
            <form onSubmit={handleAddProduct} className="space-y-5">
              {/* Image Upload */}
              <div className="group relative border-2 border-dashed border-gray-200 rounded-2xl h-56 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-chic-dark/30 transition-all cursor-pointer overflow-hidden">
                 <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                 {imagePreview ? (
                   <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-opacity group-hover:opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-lg">Alterar foto</span>
                    </div>
                   </>
                 ) : (
                   <div className="text-center text-gray-400 group-hover:text-chic-dark transition-colors">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-100">
                        <ImageIcon size={20} />
                     </div>
                     <span className="text-sm font-medium">Clique para adicionar foto</span>
                   </div>
                 )}
              </div>

              <div>
                <label className={labelClass}>Título do Produto</label>
                <input 
                  type="text" 
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                  className={inputClass}
                  placeholder="Ex: Jaqueta Jeans Vintage 90s"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className={labelClass}>Preço (Por)</label>
                    <input 
                      type="number" 
                      value={newProduct.price || ''}
                      onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                      className={inputClass}
                      placeholder="0.00"
                    />
                 </div>
                 <div>
                    <label className={labelClass}>Preço Antigo (De)</label>
                    <input 
                      type="number" 
                      value={newProduct.originalPrice || ''}
                      onChange={(e) => setNewProduct({...newProduct, originalPrice: Number(e.target.value)})}
                      className={inputClass}
                      placeholder="Opcional"
                    />
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className={labelClass}>Tamanho</label>
                   <input 
                     type="text" 
                     value={newProduct.size}
                     onChange={(e) => setNewProduct({...newProduct, size: e.target.value})}
                     className={inputClass}
                     placeholder="Ex: M"
                   />
                </div>
                 <div>
                    <label className={labelClass}>Categoria</label>
                    <div className="relative">
                        <select 
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value as ProductCategory})}
                        className={`${inputClass} appearance-none cursor-pointer`}
                        >
                        {Object.values(ProductCategory).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                    </div>
                 </div>
              </div>

              <div>
                 <label className={labelClass}>Condição</label>
                 <div className="relative">
                     <select 
                     value={newProduct.condition}
                     onChange={(e) => setNewProduct({...newProduct, condition: e.target.value as ProductCondition})}
                     className={`${inputClass} appearance-none cursor-pointer`}
                     >
                     {Object.values(ProductCondition).map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                         <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                     </div>
                 </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                   <label className={labelClass}>Descrição</label>
                   <button 
                    type="button" 
                    onClick={handleGenerateDescription}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 text-[10px] bg-purple-50 text-purple-600 px-2 py-1 rounded-full font-bold hover:bg-purple-100 disabled:opacity-50 transition-colors"
                   >
                     <Sparkles size={10} /> {isGenerating ? 'Criando mágica...' : 'Gerar com IA'}
                   </button>
                </div>
                <textarea 
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows={4}
                  className={inputClass}
                  placeholder="Descreva os detalhes, avarias e história da peça..."
                />
              </div>

              <button type="submit" className="w-full bg-chic-dark text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl mt-2 active:scale-95">
                Cadastrar Produto
              </button>
            </form>
          </div>

          {/* Product List */}
          <div className="lg:col-span-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-chic-dark">
              <div className="bg-gray-100 text-chic-dark p-2 rounded-lg">
                 <ShoppingBag size={18} />
              </div> 
              Inventário ({products.length})
            </h2>
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-400 uppercase text-xs font-bold border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Produto</th>
                      <th className="px-6 py-4">Preço</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img src={product.imageUrl} className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                            <div>
                              <div className="font-bold text-gray-900 line-clamp-1">{product.title}</div>
                              <div className="text-gray-400 text-xs mt-0.5">{product.category} • {product.size}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-700">
                          {product.originalPrice && product.originalPrice > product.price ? (
                              <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 line-through">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.originalPrice)}</span>
                                <span className="text-chic-olive">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</span>
                              </div>
                          ) : (
                              new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)
                          )}
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${product.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                             {product.available ? <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"/> : null}
                             {product.available ? 'Disponível' : 'Vendido'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => deleteProduct(product.id)}
                            className="text-gray-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                            title="Remover"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {products.length === 0 && (
                 <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                    <Package size={48} className="mb-4 opacity-20" />
                    <p>Nenhum produto cadastrado.</p>
                 </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Orders Tab */
        <div>
           <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-chic-dark">
              <div className="bg-gray-100 text-chic-dark p-2 rounded-lg">
                 <Package size={18} /> 
              </div>
              Pedidos ({orders.length})
            </h2>
            <div className="grid gap-6">
              {orders.slice().reverse().map(order => (
                <div key={order.id} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 pb-6 border-b border-gray-50">
                    <div>
                       <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-xl font-serif">#{order.id.slice(-6)}</span>
                          <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-bold ${order.status === OrderStatus.CANCELLED ? 'bg-red-50 text-red-600' : order.status === OrderStatus.DELIVERED || order.status === OrderStatus.PICKED_UP ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                            {order.status}
                          </span>
                       </div>
                       <p className="text-sm text-gray-400 flex items-center gap-1.5">
                         <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                         {new Date(order.date).toLocaleString('pt-BR')}
                       </p>
                    </div>
                    <div className="text-right mt-4 md:mt-0 flex flex-col md:flex-row items-end md:items-center gap-6">
                       <div className="text-right">
                          <p className="font-bold text-xl text-chic-dark">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                          </p>
                          <div className="flex items-center gap-2 justify-end text-xs text-gray-400 uppercase font-bold tracking-wider">
                            <span className="flex items-center gap-1"><CreditCard size={12} /> {order.paymentMethod}</span>
                            <span>•</span>
                            <span>{order.method === DeliveryMethod.PICKUP ? 'Retirada' : 'Entrega'}</span>
                          </div>
                       </div>
                       
                       {/* Status Edit Controls */}
                       {editingOrderId === order.id ? (
                          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                            <select 
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                              className="text-sm p-2 border-none bg-transparent font-medium focus:ring-0 cursor-pointer"
                            >
                              {getAvailableStatuses(order.method).map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            <button onClick={() => handleStatusUpdate(order.id)} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-green-700">Salvar</button>
                            <button onClick={() => setEditingOrderId(null)} className="text-xs text-gray-400 hover:text-gray-600 px-2">X</button>
                          </div>
                       ) : (
                          <button 
                            onClick={() => { setEditingOrderId(order.id); setNewStatus(order.status); }}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-chic-dark font-bold bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-xl transition-colors"
                          >
                            <Edit3 size={16} /> <span className="hidden md:inline">Atualizar</span>
                          </button>
                       )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className={labelClass}>Cliente</h4>
                      <p className="font-bold text-gray-900 text-lg mb-1">{order.customerName}</p>
                      <p className="text-sm text-gray-500 mb-3">{order.customerContact}</p>
                      {order.address && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 flex gap-2 items-start">
                          <div className="mt-0.5 text-chic-olive"><MapPin size={14} /></div>
                          <div>{order.address} <br/> <span className="text-gray-400 text-xs">{order.zipCode}</span></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className={labelClass}>Itens</h4>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm group">
                            <span className="text-gray-700 font-medium group-hover:text-chic-dark transition-colors">{item.title}</span>
                            <span className="text-gray-400">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wide">
                         <span>Frete</span>
                         <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.shippingCost)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                 <div className="bg-gray-50 p-12 text-center rounded-[2rem] border border-dashed border-gray-200 text-gray-400">
                   Nenhum pedido realizado ainda.
                 </div>
              )}
            </div>
        </div>
      )}
    </div>
  );
};
