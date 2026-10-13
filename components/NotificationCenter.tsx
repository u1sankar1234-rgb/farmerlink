
import React from 'react';
import { Notification } from '../types';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onMarkAsRead, onClose }) => {
  return (
    <div className="absolute top-16 right-0 w-80 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="p-4 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
        <h3 className="font-bold text-slate-900 dark:text-white serif">Notifications</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto opacity-20"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <p className="text-sm">All caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-700">
            {notifications.map(n => (
              <div 
                key={n.id} 
                onClick={() => onMarkAsRead(n.id)}
                className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors ${!n.read ? 'bg-[#5A5A40]/5 dark:bg-[#5A5A40]/10' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className={`text-sm font-bold serif ${!n.read ? 'text-[#5A5A40]' : 'text-slate-700 dark:text-slate-300'}`}>{n.title}</p>
                  {!n.read && <div className="w-2 h-2 bg-[#5A5A40] rounded-full"></div>}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium">{n.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {notifications.length > 0 && (
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 text-center">
          <button className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider hover:underline serif">Clear All</button>
        </div>
      )}
    </div>
  );
};
