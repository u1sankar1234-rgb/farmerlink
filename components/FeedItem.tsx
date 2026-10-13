import React, { useState } from 'react';
import { Product } from '../types';

interface FeedItemProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onProfileClick?: (p: Product) => void;
}

export const FeedItem: React.FC<FeedItemProps> = ({ product, onAddToCart, onProfileClick }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-[#1a1c1a]/60 backdrop-blur-md border border-white/10 rounded-[24px] overflow-hidden max-w-2xl mx-auto mb-10 shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 p-5">
        <div 
          className="w-10 h-10 rounded-full bg-[#4CAF50] flex items-center justify-center text-white font-bold cursor-pointer shadow-lg outline outline-2 outline-white/20"
          onClick={() => onProfileClick && onProfileClick(product)}
        >
          {product.farmerName.charAt(0)}
        </div>
        <div 
          className="cursor-pointer flex-grow"
          onClick={() => onProfileClick && onProfileClick(product)}
        >
          <p className="text-[15px] font-bold text-white leading-tight">{product.farmerName}</p>
          <p className="text-xs text-gray-400 mt-0.5">2 hours ago</p>
        </div>
      </div>

      {/* Image */}
      <div className="w-full relative">
        <img src={product.image} className="w-full object-cover max-h-[450px]" alt={product.name} />
      </div>

      {/* Actions */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-5">
            <button onClick={() => setLiked(!liked)} className={liked ? "text-red-500" : "text-white hover:text-red-400 transition-colors"}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
            <button className="text-white hover:text-gray-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
          </div>
          <button onClick={() => onAddToCart(product)} className="text-[#4CAF50] hover:text-[#45a049] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          </button>
        </div>

        <div className="text-[14px] font-bold text-white">
          {product.likes + (liked ? 1 : 0)} likes
        </div>
        
        <div className="text-[14px] text-gray-200 leading-relaxed">
          <span className="font-bold text-white mr-2">{product.farmerName}</span>
          {product.description}
        </div>
      </div>
    </div>
  );
};
