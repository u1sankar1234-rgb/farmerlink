
import React, { useState } from 'react';
import { Product, Review, User } from '../types';

interface AdminDashboardProps {
  products: Product[];
  onForwardReview: (review: Review, farmerId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, onForwardReview }) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'products' | 'users'>('reports');

  const allReviews = products.flatMap(p => p.reviews.map(r => ({ ...r, productName: p.name, farmerId: p.farmerId })));
  const reportedReviews = allReviews.filter(r => r.rating <= 2 || r.isReported);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white serif">Admin Control Center</h1>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all serif ${activeTab === 'reports' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#5A5A40]' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Reports & Reviews
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all serif ${activeTab === 'products' ? 'bg-white dark:bg-slate-700 shadow-sm text-[#5A5A40]' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Manage Products
          </button>
        </div>
      </div>

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
              <h2 className="font-bold text-slate-800 dark:text-slate-200 serif">Flagged Reviews ({reportedReviews.length})</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Reviews with low ratings or reported by users</p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {reportedReviews.map((review, idx) => (
                <div key={idx} className="p-6 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm dark:text-slate-200 serif">{review.userName}</span>
                      <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-bold serif">Rating: {review.rating}/5</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 serif">{review.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic serif">"{review.comment}"</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider serif">Product: {review.productName}</p>
                  </div>
                  <button 
                    onClick={() => onForwardReview(review, review.farmerId)}
                    className="bg-[#5A5A40] hover:opacity-90 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-lg shadow-olive/10 serif"
                  >
                    Forward to Farmer
                  </button>
                </div>
              ))}
              {reportedReviews.length === 0 && (
                <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                  No flagged reviews at the moment.
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-4 serif">Total Sales</h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-white serif">₹42,850</p>
              <p className="text-xs text-[#5A5A40] font-bold mt-2 serif">+12% from last week</p>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-4 serif">Active Farmers</h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-white serif">24</p>
              <p className="text-xs text-[#5A5A40] font-bold mt-2 serif">4 new this month</p>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-4 serif">Pending Payouts</h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-white serif">₹8,200</p>
              <p className="text-xs text-orange-500 font-bold mt-2 serif">Due in 2 days</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Farmer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {products.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                      <span className="font-bold text-sm dark:text-slate-200">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{p.farmerName}</td>
                  <td className="px-6 py-4 text-sm font-bold dark:text-slate-200">₹{p.price}</td>
                  <td className="px-6 py-4 text-sm dark:text-slate-400">{p.quantity} {p.unit}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-[#5A5A40]/10 text-[#5A5A40] text-[10px] font-bold rounded-full uppercase serif">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
