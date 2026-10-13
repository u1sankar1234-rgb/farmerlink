import React, { useState } from 'react';
import { User, UserRole } from '../types';


interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authRole, setAuthRole] = useState<UserRole>('CONSUMER');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const computedRole = authEmail.includes('admin') ? 'ADMIN' : authRole;
      const userId = computedRole === 'ADMIN' ? 'admin1' : computedRole === 'FARMER' ? 'f1' : 'u1';
      
      // Check for saved user data
      const savedUsers = JSON.parse(localStorage.getItem('farmerlink_users') || '{}');
      let currentUser = savedUsers[authEmail];

      if (!currentUser) {
        currentUser = {
          id: userId,
          name: authMode === 'login' ? (computedRole === 'ADMIN' ? 'System Admin' : computedRole === 'FARMER' ? 'Sarah Jenkins' : 'John Doe') : authName,
          email: authEmail,
          role: computedRole,
          avatar: `https://i.pravatar.cc/150?u=${authEmail}`,
          bio: "",
          location: ""
        };
        // Always save the user on first access (login or register)
        savedUsers[authEmail] = currentUser;
        localStorage.setItem('farmerlink_users', JSON.stringify(savedUsers));
      }
      
      onLogin(currentUser);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-black font-sans">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <img src="/bg-home.jpg" alt="Farm Background" className="h-full w-full object-cover blur-[8px] opacity-40 brightness-75 scale-105" />
      </div>
      
      {/* Top Navbar specifically for Auth Page */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span className="text-2xl font-bold text-[#4CAF50]">FarmerLink</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[15px] text-white font-medium">
          <button 
            onClick={() => setAuthMode('login')}
            className="bg-[#4CAF50] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#45a049] transition-colors flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
            Login
          </button>
        </div>
      </div>

      {/* Auth Card Content */}
      <div className="relative z-10 w-full max-w-md mt-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[40px] shadow-2xl px-8 py-10 sm:px-10 sm:py-12">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 bg-[#4CAF50] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#4CAF50]/20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-gray-400 text-base">Login to your FarmerLink account</p>
        </div>

        {/* Enhanced Role Selection Buttons - symmetric and balanced */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button 
            onClick={() => setAuthRole('CONSUMER')}
            className={`flex flex-col items-center justify-center py-6 rounded-3xl border-2 transition-all duration-300 gap-3 group ${
              authRole === 'CONSUMER' 
              ? 'border-[#4CAF50] bg-[#4CAF50]/10 text-white shadow-lg shadow-[#4CAF50]/10' 
              : 'border-white/5 bg-white/5 text-gray-500 hover:bg-white/10 hover:border-white/10'
            }`}
          >
            <div className={`transition-colors ${authRole === 'CONSUMER' ? 'text-[#4CAF50]' : 'text-gray-600 group-hover:text-gray-400'}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span className={`text-sm font-bold ${authRole === 'CONSUMER' ? 'text-white' : 'text-gray-500'}`}>Consumer</span>
          </button>

          <button 
            onClick={() => setAuthRole('FARMER')}
            className={`flex flex-col items-center justify-center py-6 rounded-3xl border-2 transition-all duration-300 gap-3 group ${
              authRole === 'FARMER' 
              ? 'border-[#4CAF50] bg-[#4CAF50]/10 text-white shadow-lg shadow-[#4CAF50]/10' 
              : 'border-white/5 bg-white/5 text-gray-500 hover:bg-white/10 hover:border-white/10'
            }`}
          >
            <div className={`transition-colors ${authRole === 'FARMER' ? 'text-[#4CAF50]' : 'text-gray-600 group-hover:text-gray-400'}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            </div>
            <span className={`text-sm font-bold ${authRole === 'FARMER' ? 'text-white' : 'text-gray-500'}`}>Farmer</span>
          </button>
        </div>

        <div className="">
          {authMode === 'login' ? (
          <>
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    Email Address
                  </label>
                  <input 
                    required
                    type="email" 
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white text-[15px] focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50] outline-none transition-all placeholder:text-gray-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      Password
                    </label>
                    <a href="#" className="text-xs text-[#4CAF50] hover:underline">Forgot?</a>
                  </div>
                  <input 
                    required
                    type="password" 
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white text-[15px] focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50] outline-none transition-all placeholder:text-gray-500 tracking-widest"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-3.5 rounded-lg transition-colors shadow-lg shadow-green-900/30 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Login'}
                {!isLoading && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account? <span onClick={() => setAuthMode('register')} className="text-[#4CAF50] cursor-pointer hover:underline font-semibold">Register</span>
              </p>
            </div>
          </>
        ) : (
          <>
            <form onSubmit={handleAuth} className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Full Name
                </label>
                <input 
                  required
                  type="text" 
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white text-[15px] focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50] outline-none transition-all placeholder:text-gray-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  Email Address
                </label>
                <input 
                  required
                  type="email" 
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white text-[15px] focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50] outline-none transition-all placeholder:text-gray-500"
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Password
                  </label>
                  <input 
                    required
                    type="password" 
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white text-[15px] focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50] outline-none transition-all placeholder:text-gray-500 tracking-widest"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    Phone Number
                  </label>
                  <input 
                    type="tel"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white text-[15px] focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50] outline-none transition-all placeholder:text-gray-500"
                    placeholder="+91..."
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                  Delivery Address
                </label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white text-[15px] focus:ring-1 focus:ring-[#4CAF50] focus:border-[#4CAF50] outline-none transition-all placeholder:text-gray-500"
                  placeholder="Enter your full address"
                />
              </div>


              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-3.5 rounded-lg transition-colors shadow-lg shadow-green-900/30 flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Account'}
                {!isLoading && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                Already have an account? <span onClick={() => setAuthMode('login')} className="text-[#4CAF50] cursor-pointer hover:underline font-semibold">Login</span>
              </p>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
};
