
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { FeedItem } from './components/FeedItem';
import { AdminDashboard } from './components/AdminDashboard';
import { FarmerDashboard } from './components/FarmerDashboard';
import { Checkout } from './components/Checkout';
import { OrderHistory } from './components/OrderHistory';
import { Login } from './components/Login';
import { 
  User, 
  Product, 
  CartItem, 
  Order, 
  Message,
  Review,
  UserRole,
  Notification
} from './types';
import { MOCK_PRODUCTS, MOCK_USER, MOCK_FARMER } from './constants';
import { generateProductDescription, simulateChatResponse, summarizeFeedbackReport } from './services/geminiService';

const App: React.FC = () => {
  // Start with null user and 'auth' page as requested
  const [currentPage, setCurrentPage] = useState('auth');
  const [user, setUser] = useState<User | null>(null);
  
  // Initialization from localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('farmerlink_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('farmerlink_products', JSON.stringify(products));
  }, [products]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.cartQuantity), 0), [cart]);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('farmerlink_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ORD-7721',
        consumerId: 'u1',
        farmerId: 'f1',
        items: [
          { ...MOCK_PRODUCTS[0], cartQuantity: 2 },
          { ...MOCK_PRODUCTS[1], cartQuantity: 1 }
        ],
        total: 200.00,
        status: 'DELIVERED',
        date: '2024-03-05',
        address: '123 Green Lane, Eco City',
        phone: '9876543210',
        hasFeedback: true
      },
      {
        id: 'ORD-8832',
        consumerId: 'u1',
        farmerId: 'f2',
        items: [
          { ...MOCK_PRODUCTS[2], cartQuantity: 1 }
        ],
        total: 180.00,
        status: 'SHIPPED',
        date: '2024-03-10',
        address: '123 Green Lane, Eco City',
        phone: '9876543210',
        hasFeedback: false
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('farmerlink_orders', JSON.stringify(orders));
  }, [orders]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const [newChatText, setNewChatText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('auth');
    setCart([]);
  };

  // Cart operations
  const addToCart = (product: Product) => {
    if (!user) {
      setCurrentPage('auth');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item);
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
    alert(`Added ${product.name} to cart!`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.cartQuantity + delta);
        return { ...item, cartQuantity: newQty };
      }
      return item;
    }));
  };

  const addNotification = (title: string, message: string, type: Notification['type'] = 'SYSTEM') => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      userId: user?.id || 'guest',
      title,
      message,
      date: new Date().toLocaleTimeString(),
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handlePlaceOrder = (address: string, phone: string) => {
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      consumerId: user?.id || 'guest',
      farmerId: cart[0].farmerId,
      items: [...cart],
      total: cartTotal,
      status: 'PENDING',
      date: new Date().toLocaleDateString(),
      address,
      phone,
      hasFeedback: false,
      trackingNumber: `TRK-${Math.random().toString(36).substring(7).toUpperCase()}`
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setCurrentPage('orders');
    addNotification('Order Placed!', `Your order ${newOrder.id} has been received by the farmer.`, 'ORDER');
  };

  const sendMessage = async () => {
    if (!newChatText.trim() || !user) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: activeChatId || 'f1',
      text: newChatText,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setNewChatText("");

    // Simulate Farmer Response
    const response = await simulateChatResponse(newChatText, "the product");
    const farmMsg: Message = {
      id: (Date.now() + 1).toString(),
      senderId: activeChatId || 'f1',
      receiverId: user.id,
      text: response,
      timestamp: Date.now() + 1
    };
    setMessages(prev => [...prev, farmMsg]);
  };

  const handleDeliveryReceived = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'DELIVERED' } : o));
    addNotification('Delivery Confirmed', `Order ${orderId} has been marked as delivered.`, 'ORDER');
  };

  const submitFeedback = (orderId: string, comment: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const newReview: Review = {
      id: Date.now().toString(),
      userId: user?.id || 'u1',
      userName: user?.name || 'Anonymous',
      rating: 4, // Default for demo
      comment: comment || "Great fresh produce!",
      date: new Date().toLocaleDateString()
    };

    setProducts(prev => prev.map(p => p.id === order.items[0].id ? { ...p, reviews: [...p.reviews, newReview] } : p));
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, hasFeedback: true } : o));
    addNotification('Feedback Received', 'Thank you for your review!', 'SYSTEM');
  };

  const handleForwardReview = (review: Review, farmerId: string) => {
    addNotification('Review Forwarded', `Negative review from ${review.userName} has been forwarded to the farmer.`, 'SYSTEM');
    // In a real app, this would send a notification to the farmer
  };

  const handleAddProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
    addNotification('Product Listed', `${product.name} is now live on the marketplace.`, 'SYSTEM');
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    addNotification('Product Updated', `${updatedProduct.name} has been updated.`, 'SYSTEM');
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    if (product) {
      addNotification('Product Deleted', `${product.name} has been removed from your listings.`, 'SYSTEM');
    }
  };

  const handleUpdateProfile = (name: string, bio: string, location: string) => {
    if (user) {
      const oldName = user.name;
      const updatedUser = { ...user, name, bio, location };
      setUser(updatedUser);
      
      // Save to localStorage
      const savedUsers = JSON.parse(localStorage.getItem('farmerlink_users') || '{}');
      savedUsers[user.email] = updatedUser;
      localStorage.setItem('farmerlink_users', JSON.stringify(savedUsers));
      
      // Update the name on their products if it changed
      if (name !== oldName) {
        setProducts(prev => prev.map(p => p.farmerId === user.id ? { ...p, farmerName: name } : p));
      }
      
      addNotification('Profile Updated', 'Your farmer profile has been updated.', 'SYSTEM');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderContent = () => {
    // Force Auth page if not logged in
    if (!user && currentPage !== 'auth') {
      setCurrentPage('auth');
      return null;
    }

    switch (currentPage) {
      case 'auth':
        return <Login onLogin={(u) => { 
          setUser(u); 
          if (u.role === 'ADMIN') {
            setCurrentPage('admin-dashboard');
          } else if (u.role === 'FARMER') {
            setCurrentPage('farmer-dashboard');
          } else {
            setCurrentPage('feed');
          }
        }} />;

      case 'feed':
        return (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-center max-w-2xl mx-auto gap-8 mb-12 mt-4 relative">
              {/* Header Title */}
              <div className="absolute left-0">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Feed</h1>
              </div>

              {/* Categories */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar w-full md:w-auto mx-auto pl-24 md:pl-0">
                {['All', 'Vegetables', 'Grains', 'Fruits'].map(cat => {
                  const isActive = (cat === 'All' && searchQuery === '') || searchQuery === cat;
                  return (
                    <button 
                      key={cat} 
                      onClick={() => setSearchQuery(cat === 'All' ? "" : cat)}
                      className={`px-5 py-1.5 rounded-full text-[13px] font-medium transition-all flex-shrink-0 border 
                        ${isActive 
                          ? 'bg-[#4CAF50] border-[#4CAF50] text-white shadow-lg' 
                          : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-12">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(p => (
                    <FeedItem 
                      key={p.id} 
                      product={p} 
                      onAddToCart={addToCart}
                      onProfileClick={(prod) => {
                        setSelectedFarmerId(prod.farmerId);
                        setCurrentPage('farmer-profile');
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-[24px] border border-dashed border-white/20">
                    <p className="text-gray-300 font-medium">No harvests found matching your search.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'cart':
        return (
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-12 serif">Your Harvest Box</h1>
            {cart.length === 0 ? (
              <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="w-24 h-24 bg-[#f7fbf9] dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 serif">Your box is empty</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-10 serif italic">Looks like you haven't added any fresh produce yet.</p>
                <button 
                  onClick={() => setCurrentPage('feed')}
                  className="bg-[#5A5A40] text-white px-10 py-4 rounded-full font-bold hover:opacity-90 transition-all shadow-lg shadow-olive/10"
                >
                  Explore Market
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                  {cart.map(item => (
                    <div key={item.id} className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-6 group">
                      <img src={item.image} className="w-24 h-24 rounded-2xl object-cover group-hover:scale-105 transition-transform" alt={item.name} />
                      <div className="flex-grow">
                        <h3 className="font-bold text-slate-900 dark:text-white serif text-lg">{item.name}</h3>
                        <p className="text-sm text-slate-400 serif italic">₹{item.price}/{item.unit}</p>
                      </div>
                      <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 rounded-2xl p-2">
                        <button 
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-[#5A5A40] shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                        <span className="font-bold text-slate-800 dark:text-slate-200 w-6 text-center">{item.cartQuantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-[#5A5A40] shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <p className="font-bold text-slate-900 dark:text-white serif text-lg">₹{(item.price * item.cartQuantity).toFixed(2)}</p>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs font-bold text-red-400 hover:text-red-500 mt-1 serif italic"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-[40px] p-8 shadow-sm border border-slate-100 dark:border-slate-700 h-fit sticky top-28">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 serif">Order Summary</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 serif italic">
                      <span>Subtotal</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 serif italic">
                      <span>Delivery</span>
                      <span className="text-[#5A5A40] font-bold">FREE</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                      <span className="font-bold text-slate-900 dark:text-white text-lg serif">Total</span>
                      <span className="font-bold text-slate-900 dark:text-white text-2xl serif">₹{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setCurrentPage('checkout')}
                    className="w-full bg-[#5A5A40] hover:opacity-90 text-white font-bold py-5 rounded-[24px] transition-all shadow-lg shadow-olive/10 serif text-lg"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'checkout':
        return (
          <Checkout 
            cart={cart}
            total={cartTotal}
            onPlaceOrder={handlePlaceOrder}
            onCancel={() => setCurrentPage('cart')}
          />
        );

      case 'farmer-dashboard':
        return (
          <FarmerDashboard 
            user={user!}
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProfile={handleUpdateProfile}
            onGenerateReport={async () => {
              setIsLoading(true);
              const farmerProds = products.filter(p => p.farmerId === user?.id);
              const allReviews = farmerProds.flatMap(p => p.reviews);
              const summary = await summarizeFeedbackReport(allReviews);
              setReport(summary);
              setIsLoading(false);
            }}
            report={report}
          />
        );

      case 'admin-dashboard':
        return (
          <AdminDashboard 
            products={products}
            onForwardReview={handleForwardReview}
          />
        );

      case 'farmer-profile':
        if (!selectedFarmerId) return null;
        
        // Ensure we load the correct farmer, mock it out using products feed since we don't have a direct users list
        const farmerProducts = products.filter(p => p.farmerId === selectedFarmerId);
        const farmerName = farmerProducts.length > 0 ? farmerProducts[0].farmerName : 'Farmer';
        
        return (
          <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
              <div className="h-32 bg-[#5A5A40] relative">
                <div className="absolute -bottom-12 left-8">
                  <img src={`https://i.pravatar.cc/150?u=${selectedFarmerId}`} className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-800 shadow-lg object-cover" alt="avatar" />
                </div>
              </div>
              <div className="pt-16 pb-8 px-8 flex justify-between items-start">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white serif">{farmerName}</h1>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Local Organic Farm
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 max-w-2xl italic">
                    Providing fresh and sustainably grown harvests directly to your table. We believe in high-quality farming.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white serif">Farm Offerings</h2>
              <div className="max-w-3xl mx-auto space-y-12">
                {farmerProducts.map(p => (
                  <FeedItem 
                    key={p.id} 
                    product={p} 
                    onAddToCart={addToCart}
                    onProfileClick={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'order-history':
        return (
          <OrderHistory 
            orders={orders}
            onNavigate={setCurrentPage}
          />
        );


      case 'orders':
        return (
          <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-12 serif">Delivery Tracking</h1>
            <div className="space-y-12">
              {orders.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-700">
                  <p className="text-slate-400 font-medium serif italic">No orders placed yet.</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-slate-800 rounded-[40px] p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-12">
                    <div className="md:w-1/3 space-y-6">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.id}</span>
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === 'DELIVERED' ? 'bg-[#5A5A40]/10 text-[#5A5A40]' : 'bg-[#f7fbf9] dark:bg-slate-900 text-[#5A5A40] border border-[#5A5A40]/10'}`}>
                           {order.status}
                         </span>
                      </div>
                    <div className="relative pl-10 space-y-8">
                       <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-50 dark:bg-slate-700"></div>
                       <div className="relative">
                          <div className={`absolute -left-10 w-8 h-8 rounded-full border-4 border-white dark:border-slate-800 shadow-sm flex items-center justify-center ${order.status === 'PENDING' ? 'bg-[#5A5A40] animate-pulse' : 'bg-[#5A5A40]'}`}>
                             {order.status !== 'PENDING' && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                          <p className="text-sm font-bold serif dark:text-white">Order Received</p>
                          <p className="text-[10px] text-slate-400 serif italic">{order.date}</p>
                       </div>
                       <div className="relative">
                          <div className={`absolute -left-10 w-8 h-8 rounded-full border-4 border-white dark:border-slate-800 shadow-sm flex items-center justify-center ${order.status === 'SHIPPED' ? 'bg-[#5A5A40] animate-pulse' : order.status === 'DELIVERED' ? 'bg-[#5A5A40]' : 'bg-slate-100 dark:bg-slate-700'}`}>
                             {order.status === 'DELIVERED' && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                          <p className="text-sm font-bold serif dark:text-white">In Transit</p>
                          <p className="text-[10px] text-slate-400 serif italic">Heading to your location</p>
                       </div>
                       <div className="relative">
                          <div className={`absolute -left-10 w-8 h-8 rounded-full border-4 border-white dark:border-slate-800 shadow-sm flex items-center justify-center ${order.status === 'DELIVERED' ? 'bg-[#5A5A40]' : 'bg-slate-100 dark:bg-slate-700'}`}>
                             {order.status === 'DELIVERED' && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                          <p className="text-sm font-bold serif dark:text-white">Delivered</p>
                          <p className="text-[10px] text-slate-400 serif italic">At your doorstep</p>
                       </div>
                    </div>
                  </div>
                  <div className="flex-grow bg-[#f7fbf9] dark:bg-slate-900/50 rounded-[32px] p-8 flex flex-col border border-slate-50 dark:border-slate-700">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-6 serif text-lg">Items Summary</h4>
                    <div className="flex-grow space-y-4">
                       {order.items.map(item => (
                         <div key={item.id} className="flex justify-between text-sm serif italic">
                           <span className="text-slate-600 dark:text-slate-400">{item.cartQuantity}x {item.name}</span>
                           <span className="font-bold text-slate-900 dark:text-white">₹{(item.price * item.cartQuantity).toFixed(2)}</span>
                         </div>
                       ))}
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-6">
                       <div className="flex justify-between font-bold text-xl serif">
                         <span className="text-slate-900 dark:text-white">Total Paid</span>
                         <span className="text-[#5A5A40]">₹{order.total.toFixed(2)}</span>
                       </div>
                       
                       {order.status !== 'DELIVERED' && (
                         <button 
                            onClick={() => handleDeliveryReceived(order.id)}
                            className="w-full bg-[#5A5A40] text-white font-bold py-4 rounded-2xl shadow-lg shadow-olive/10 hover:opacity-90 transition-all serif"
                          >
                            Confirm Delivery Received
                          </button>
                       )}

                       {order.status === 'DELIVERED' && !order.hasFeedback && (
                         <div className="space-y-4">
                           <textarea 
                             className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/10 serif italic text-slate-900 dark:text-white" 
                             placeholder="How was the produce? Leave feedback for the farmer..."
                           />
                           <button 
                              onClick={() => submitFeedback(order.id, "")}
                              className="w-full bg-[#F27D26] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-100 hover:opacity-90 transition-all serif"
                            >
                              Submit Rating & Feedback
                            </button>
                         </div>
                       )}

                       {order.hasFeedback && (
                         <div className="text-center p-3 bg-[#5A5A40]/10 text-[#5A5A40] rounded-xl text-sm font-bold serif">
                           Thanks for your feedback!
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              ))
            )}
            </div>
          </div>
        );

      default:
        return <div>Module coming soon!</div>;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      {/* Global Background Image with slight blur */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/bg-home.jpg")',
          filter: 'blur(3px) brightness(0.6)',
          transform: 'scale(1.05)'
        }}
      />
      {currentPage !== 'auth' && (
        <Navbar 
          user={user} 
          cartCount={cart.reduce((a, c) => a + c.cartQuantity, 0)} 
          notifications={notifications}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
          onMarkAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
      )}
      <main className="flex-grow transition-colors duration-300 relative">
        {renderContent()}
      </main>

      {/* Floating Cart Button for Mobile */}
      {cart.length > 0 && currentPage === 'feed' && (
        <button 
          onClick={() => setCurrentPage('cart')}
          className="fixed bottom-6 right-6 bg-[#5A5A40] text-white p-4 rounded-full shadow-2xl z-40 md:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </button>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#5A5A40] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-bold text-[#5A5A40] serif">Please wait...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
