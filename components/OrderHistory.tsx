
import React from 'react';
import { Order } from '../types';

interface OrderHistoryProps {
  orders: Order[];
  onNavigate: (page: string) => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, onNavigate }) => {
  const completedOrders = orders.filter(o => o.status === 'DELIVERED');
  const activeOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-5xl font-bold text-slate-900 dark:text-white serif">Order History</h1>
        <button 
          onClick={() => onNavigate('feed')}
          className="text-[#5A5A40] font-bold hover:underline serif italic"
        ><b> Back to Marketplace</b>
         
        </button>
      </div>

      <div className="space-y-16">
        {/* Active Orders Section */}
        {activeOrders.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 serif border-b pb-2 dark:border-slate-700">Active Orders</h2>
            <div className="grid grid-cols-1 gap-6">
              {activeOrders.map(order => (
                <div key={order.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-[32px] p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#5A5A40]/10 rounded-2xl flex items-center justify-center text-[#5A5A40]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{order.id}</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white serif">{order.items.length} Items • ₹{order.total.toFixed(2)}</p>
                      <p className="text-xs text-slate-500 serif italic">Ordered on {order.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-orange-100 text-orange-600 border border-orange-200">
                      {order.status}
                    </span>
                    <button 
                      onClick={() => onNavigate('orders')}
                      className="bg-[#5A5A40] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-olive/10 hover:opacity-90 transition-all serif"
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Completed Orders Section */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 serif border-b pb-2 dark:border-slate-700">Past Orders</h2>
          {completedOrders.length === 0 ? (
            <div className="text-center py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-[32px] border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-slate-400 font-medium serif italic">No completed orders yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {completedOrders.map(order => (
                <div key={order.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-[32px] p-8 shadow-sm border border-slate-100 dark:border-slate-700 group hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.id}</span>
                        <span className="px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-600 border border-emerald-200">
                          COMPLETED
                        </span>
                      </div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white serif">₹{order.total.toFixed(2)}</p>
                      <p className="text-xs text-slate-500 serif italic">Delivered on {order.date}</p>
                    </div>
                    <button 
                      onClick={() => onNavigate('feed')}
                      className="text-sm font-bold text-[#5A5A40] hover:underline serif italic"
                    >
                      Order Again
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {order.items.map(item => (
                      <div key={item.id} className="space-y-2">
                        <img src={item.image} className="w-full aspect-square object-cover rounded-xl border border-slate-100 dark:border-slate-700" alt={item.name} />
                        <p className="text-[10px] font-bold text-slate-900 dark:text-white truncate serif">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
