
import React, { useState } from 'react';
import { Product, User } from '../types';
import { generateProductDescription } from '../services/geminiService';

interface FarmerDashboardProps {
  user: User;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateProfile: (name: string, bio: string, location: string) => void;
  onGenerateReport: () => void;
  report: string | null;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ 
  user, 
  products, 
  onAddProduct, 
  onUpdateProduct,
  onDeleteProduct,
  onUpdateProfile,
  onGenerateReport,
  report 
}) => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newBio, setNewBio] = useState(user.bio || "");
  const [newLocation, setNewLocation] = useState(user.location || "");
  const [newName, setNewName] = useState(user.name || "");
  
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodQuantity, setProdQuantity] = useState("");
  const [prodUnit, setProdUnit] = useState("kg");
  const [prodCategory, setProdCategory] = useState("Vegetables");
  const [prodImage, setProdImage] = useState("");
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProdImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: `p-${Date.now()}`,
      farmerId: user.id,
      farmerName: user.name,
      name: prodName,
      description: "Generating description...",
      price: parseFloat(prodPrice),
      unit: prodUnit,
      quantity: parseFloat(prodQuantity) || 0,
      category: prodCategory,
      image: prodImage || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
      rating: 5,
      reviews: [],
      likes: 0
    };

    setIsGeneratingDesc(true);
    const desc = await generateProductDescription(prodName, prodCategory);
    product.description = desc;
    setIsGeneratingDesc(false);

    onAddProduct(product);
    setIsAddingProduct(false);
    resetForm();
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updatedProduct: Product = {
      ...editingProduct,
      name: prodName,
      price: parseFloat(prodPrice),
      unit: prodUnit,
      quantity: parseFloat(prodQuantity) || 0,
      category: prodCategory,
      image: prodImage,
    };

    // Only regenerate description if name or category changed
    if (prodName !== editingProduct.name || prodCategory !== editingProduct.category) {
      setIsGeneratingDesc(true);
      const desc = await generateProductDescription(prodName, prodCategory);
      updatedProduct.description = desc;
      setIsGeneratingDesc(false);
    }

    onUpdateProduct(updatedProduct);
    setEditingProduct(null);
    resetForm();
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdPrice(product.price.toString());
    setProdQuantity(product.quantity.toString());
    setProdUnit(product.unit);
    setProdCategory(product.category);
    setProdImage(product.image);
  };

  const resetForm = () => {
    setProdName("");
    setProdPrice("");
    setProdQuantity("");
    setProdUnit("kg");
    setProdCategory("Vegetables");
    setProdImage("");
  };

  const farmerProducts = products.filter(p => p.farmerId === user.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      {/* Profile Section */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
        <div className="h-32 bg-[#5A5A40] relative">
          <div className="absolute -bottom-12 left-8">
            <img src={user.avatar} className="w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-800 shadow-lg object-cover" alt="avatar" />
          </div>
        </div>
        <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-4 flex-grow">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white serif">{user.name}</h1>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {user.location || "Location not set"}
              </div>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl italic mt-2 mb-4">
                {user.bio || "No bio added yet. Tell consumers about your farm!"}
              </p>
            </div>
            
            <button 
              onClick={() => { resetForm(); setIsAddingProduct(true); }}
              className="bg-[#5A5A40] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-olive/10 hover:opacity-90 transition-all serif"
            >
              + Add Product
            </button>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="flex-1 md:flex-none bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {isEditingProfile && (
          <div className="px-8 pb-8 pt-4 border-t border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                <input 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-slate-900 dark:text-white"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Location</label>
                <input 
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-slate-900 dark:text-white"
                  placeholder="e.g. Green Valley, California"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Bio</label>
                <textarea 
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-slate-900 dark:text-white"
                  placeholder="Tell your story..."
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditingProfile(false)} className="px-4 py-2 text-sm font-bold text-slate-500">Cancel</button>
              <button 
                onClick={() => { onUpdateProfile(newName, newBio, newLocation); setIsEditingProfile(false); }}
                className="bg-[#5A5A40] text-white px-6 py-2 rounded-lg font-bold text-sm serif"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Report Section */}
      <div className="bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md rounded-3xl p-8 text-white relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5A5A40]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1 serif">AI Performance Insights</h2>
              <p className="text-slate-400 text-sm serif italic">Analyze your reviews and sales data with Gemini AI</p>
            </div>
            <button 
              onClick={onGenerateReport}
              className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all serif"
            >
              Generate New Report
            </button>
          </div>
          {report ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{report}</p>
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-white/10 rounded-2xl">
              <p className="text-slate-500 text-sm italic">No report generated yet. Click the button above to start.</p>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white serif">Your Marketplace Feed</h2>
          <span className="text-sm font-bold text-slate-400">{farmerProducts.length} Products Active</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmerProducts.map(p => (
            <div key={p.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden group">
              <div className="aspect-square relative overflow-hidden">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-[#5A5A40] shadow-sm serif">
                  ₹{p.price}/{p.unit}
                </div>
                <div className="absolute top-3 left-3 flex gap-2">
                  <button 
                    onClick={() => startEdit(p)}
                    className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-[#5A5A40] hover:bg-[#5A5A40] hover:text-white transition-all shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                  </button>
                  <button 
                    onClick={() => { if(confirm('Delete this product?')) onDeleteProduct(p.id)}}
                    className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 dark:text-white mb-1 serif">{p.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{p.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700">
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-red-400"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      {p.likes}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      {p.reviews.length}
                    </span>
                  </div>
                  <button onClick={() => startEdit(p)} className="text-xs font-bold text-[#5A5A40] hover:underline serif">Edit Listing</button>
                </div>
              </div>
            </div>
          ))}
          {farmerProducts.length === 0 && (
            <div className="col-span-full py-24 text-center bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-slate-400 font-medium">You haven't listed any products yet.</p>
              <button onClick={() => setIsAddingProduct(true)} className="text-[#5A5A40] font-bold mt-2 hover:underline serif">Add your first harvest</button>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal (Add/Edit) */}
      {(isAddingProduct || editingProduct) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-[#5A5A40] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold serif italic">{editingProduct ? 'Update Harvest' : 'List New Harvest'}</h3>
              <button onClick={() => { setIsAddingProduct(false); setEditingProduct(null); resetForm(); }} className="hover:rotate-90 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Product Name</label>
                <input 
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-slate-900 dark:text-white"
                  placeholder="e.g. Organic Strawberries"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Product Price (₹)</label>
                <input 
                  required
                  type="number"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-slate-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Quantity</label>
                  <input 
                    required
                    type="number"
                    value={prodQuantity}
                    onChange={(e) => setProdQuantity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-slate-900 dark:text-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Unit</label>
                  <select 
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-slate-900 dark:text-white"
                  >
                    <option value="kg">kg</option>
                    <option value="gram">gram</option>
                    <option value="piece">piece</option>
                    <option value="dozen">dozen</option>
                    <option value="bunch">bunch</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                <select 
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-slate-900 dark:text-white"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains">Grains</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Product Image</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#5A5A40] file:text-white hover:file:opacity-90"
                  />
                  {prodImage && (
                    <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                      <img src={prodImage} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                </div>
              </div>
              <button 
                disabled={isGeneratingDesc || (!prodImage && !editingProduct)}
                type="submit"
                className="w-full bg-[#5A5A40] text-white font-bold py-4 rounded-xl shadow-lg shadow-olive/10 hover:opacity-90 transition-all disabled:opacity-50 serif"
              >
                {isGeneratingDesc ? "AI Processing Description..." : (editingProduct ? "Save Changes" : "Post to Feed")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
