
import React, { useState } from 'react';
import { User, Notification } from '../types';
import { NotificationCenter } from './NotificationCenter';

interface NavbarProps {
  user: User | null;
  cartCount: number;
  notifications: Notification[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onMarkAsRead: (id: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  cartCount, 
  notifications, 
  onNavigate, 
  onLogout,
  onMarkAsRead,
  isDarkMode,
  toggleDarkMode
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent px-6 lg:px-12 py-5 flex items-center justify-between transition-colors duration-300">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => user ? onNavigate('feed') : onNavigate('auth')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <span className="text-[22px] font-bold text-[#4CAF50] tracking-tight hidden sm:inline">FarmerLink</span>
      </div>

      <div className="flex items-center gap-6 lg:gap-8">
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[15px] font-bold text-white">
          <button onClick={() => onNavigate('feed')} className="hover:text-[#4CAF50] transition-colors drop-shadow-md">Feed</button>
          
          {user?.role === 'FARMER' && (
            <button onClick={() => onNavigate('farmer-dashboard')} className="hover:text-[#4CAF50] transition-colors drop-shadow-md">Profile</button>
          )}

          {user?.role === 'ADMIN' && (
            <button onClick={() => onNavigate('admin-dashboard')} className="hover:text-[#4CAF50] transition-colors drop-shadow-md">Admin</button>
          )}
          
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="hover:text-[#4CAF50] transition-colors drop-shadow-md flex items-center gap-1">
              Notifications
            </button>
            {showNotifications && (
              <NotificationCenter 
                notifications={notifications} 
                onMarkAsRead={onMarkAsRead}
                onClose={() => setShowNotifications(false)}
              />
            )}
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>

          <button onClick={() => onNavigate('order-history')} className="hover:text-[#4CAF50] transition-colors drop-shadow-md">Orders</button>
        </div>

        <div className="flex items-center gap-5">
          <button 
            onClick={() => onNavigate('cart')} 
            className="relative flex items-center gap-2 text-white hover:text-[#4CAF50] font-bold text-[15px] transition-colors drop-shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -left-3 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {!user ? (
            <button 
              onClick={() => onNavigate('auth')}
              className="bg-[#4CAF50] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-[15px] hover:bg-[#45a049] transition-all drop-shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
              Login
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <img src={user.avatar} className="w-9 h-9 rounded-full border border-white/20 shadow-sm" alt="avatar" />
              <button 
                onClick={onLogout}
                className="text-white hover:text-red-400 font-bold text-sm bg-black/20 px-3 py-1.5 rounded-md hover:bg-black/40 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
