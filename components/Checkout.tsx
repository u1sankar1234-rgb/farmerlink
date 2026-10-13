
import React, { useState } from 'react';
import { CartItem } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  total: number;
  onPlaceOrder: (address: string, phone: string) => void;
  onCancel: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ cart, total, onPlaceOrder, onCancel }) => {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      onPlaceOrder(address, phone);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white serif">Checkout</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 serif">Delivery Information</h3>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Delivery Address</label>
                <textarea 
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-slate-900 dark:text-white"
                  placeholder="Street, Apartment, City, State, ZIP"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number</label>
                <input 
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-slate-900 dark:text-white"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 serif">Payment Method</h3>
              
              <div className="space-y-3">
                <div className="relative group">
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`w-full flex items-center gap-3 p-4 border-2 rounded-2xl transition-all ${paymentMethod === 'ONLINE' ? 'border-[#4CAF50] bg-[#4CAF50]/5' : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'ONLINE' ? 'bg-[#4CAF50] text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-bold serif ${paymentMethod === 'ONLINE' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Online Payment</p>
                      <p className="text-[10px] text-[#4CAF50] font-bold uppercase serif">UPI / QR Code</p>
                    </div>
                    {paymentMethod === 'ONLINE' && (
                      <div className="ml-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4CAF50]"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    )}
                  </button>
                  
                  {paymentMethod === 'ONLINE' && (
                    <div className="mt-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-inner-sm animate-in fade-in slide-in-from-top-2">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                          <img 
                            src="/scan-to-pay.png" 
                            alt="Scan to Pay" 
                            className="w-full max-w-[280px] h-auto rounded-lg"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">UPI ID</p>
                          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-700">
                            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200">u1sankar1234-1@okhdfcbank</span>
                            <button 
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText("u1sankar1234-1@okhdfcbank");
                                alert("UPI ID copied!");
                              }}
                              className="text-[#4CAF50] hover:text-[#45a049]"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 italic">Scan QR code or use UPI ID to complete payment</p>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`w-full flex items-center gap-3 p-4 border-2 rounded-2xl transition-all ${paymentMethod === 'COD' ? 'border-[#4CAF50] bg-[#4CAF50]/5' : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'COD' ? 'bg-[#4CAF50] text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-bold serif ${paymentMethod === 'COD' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Cash on Delivery</p>
                    <p className="text-[10px] text-[#4CAF50] font-bold uppercase serif">Pay when you receive</p>
                  </div>
                  {paymentMethod === 'COD' && (
                    <div className="ml-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4CAF50]"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </button>
              </div>
              
              <p className="text-[10px] text-slate-400 text-center">Your payment information is never stored on our servers.</p>
            </div>

            <div className="flex gap-4">
              <button 
                type="button"
                onClick={onCancel}
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
              >
                Back to Cart
              </button>
              <button 
                disabled={isProcessing}
                type="submit"
                className="flex-[2] bg-[#5A5A40] text-white font-bold py-4 rounded-2xl shadow-lg shadow-olive/10 hover:opacity-90 transition-all disabled:opacity-50 serif"
              >
                {isProcessing ? "Processing Payment..." : `Pay ₹${total.toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b dark:border-slate-700 pb-4 serif">Order Summary</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <img src={item.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{item.cartQuantity} x ₹{item.price}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">₹{(item.price * item.cartQuantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <div className="flex justify-between text-slate-500 dark:text-slate-400 text-sm">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400 text-sm serif">
                <span>Delivery Fee</span>
                <span className="text-[#5A5A40] font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-xl font-extrabold text-slate-900 dark:text-white pt-2 serif">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="bg-[#5A5A40]/5 dark:bg-[#5A5A40]/10 p-6 rounded-3xl border border-[#5A5A40]/10 flex gap-4 items-start backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#5A5A40]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-[#5A5A40] serif">FarmerLink Guarantee</p>
              <p className="text-xs text-[#5A5A40]/80 dark:text-[#5A5A40]/60 leading-relaxed serif italic">If your produce isn't fresh or as described, we'll refund your order immediately. No questions asked.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
