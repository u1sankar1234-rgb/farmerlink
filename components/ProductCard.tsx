
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  return (
    <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 flex flex-col">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider serif">
          {product.category}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 serif">{product.name}</h3>
          <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            {product.rating}
          </div>
        </div>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2 min-h-[2rem]">
          {product.description}
        </p>

        <div className="flex items-center gap-1 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">{product.farmerName}</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-[#5A5A40] serif">₹{product.price.toFixed(2)}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">/{product.unit}</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => onViewDetails(product)}
              className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            <button 
              onClick={() => onAddToCart(product)}
              className="bg-[#5A5A40]/10 text-[#5A5A40] p-2 rounded-lg hover:bg-[#5A5A40] hover:text-white transition-all duration-300 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
