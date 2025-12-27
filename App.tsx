import React, { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboard } from './components/AdminDashboard';
import { MessageCircle, Settings, ArrowLeft, ShoppingBag, ChevronDown } from 'lucide-react';
import { WHATSAPP_NUMBER } from './types';

const App: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    resetToDefault 
  } = useProducts();

  const { 
    items, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartTotal,
    cartCount 
  } = useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('الكل');

  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = activeCategory === 'الكل' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleDirectWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-primary-50">
      <Header cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* Hero Section with New Premium Image */}
      <section className="relative h-[85vh] md:h-[90vh] flex items-center justify-center px-4 overflow-hidden bg-primary-100">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=2000&auto=format&fit=crop" 
            alt="Twist and Taste Premium Pastries" 
            className="w-full h-full object-cover brightness-[0.85] contrast-[1.05] scale-100 animate-slow-zoom"
          />
          {/* Professional Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-primary-50"></div>
          <div className="absolute inset-0 bg-primary-900/10 mix-blend-overlay"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/20 backdrop-blur-2xl border border-white/30 text-white text-xs md:text-sm font-black tracking-widest uppercase shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
            مخبوزات طازجة يومياً
          </div>
          
          <div className="space-y-2">
            <h2 className="text-7xl md:text-9xl font-serif-logo font-black text-white mb-2 tracking-tighter drop-shadow-2xl">
              Twist & Taste
            </h2>
            <div className="h-1.5 w-32 bg-accent-500 mx-auto rounded-full shadow-lg shadow-accent-500/50"></div>
          </div>
          
          <p className="text-xl md:text-3xl text-white font-bold mb-10 leading-relaxed max-w-2xl mx-auto drop-shadow-lg">
            نجمع لكم بين فن المعجنات العصرية 
            <br className="hidden md:block" />
            والطعم الأصيل الذي لا يُنسى ✨
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
            <button 
              onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto bg-primary-500 text-white px-14 py-5 rounded-2xl font-black hover:bg-primary-600 transition-all shadow-2xl shadow-primary-500/40 hover:shadow-primary-500/60 active:scale-95 text-xl flex items-center justify-center gap-3"
            >
              <ShoppingBag size={24} />
              <span>اكتشف المنيو</span>
            </button>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50 hidden md:block">
            <ChevronDown size={32} />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <div id="menu" className="container mx-auto px-4 py-12 sticky top-[68px] z-30 bg-primary-50/95 backdrop-blur-xl -mx-4 md:mx-auto">
        <div className="flex flex-col items-center gap-8">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-black text-primary-700">قائمة الأصناف</h3>
            <p className="text-primary-400 text-sm font-bold">اختر ما يحلو لك من ألذ مأكولاتنا</p>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar justify-start md:justify-center w-full px-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-10 py-4 rounded-2xl whitespace-nowrap font-black transition-all text-sm md:text-base border-2 shadow-sm ${
                  activeCategory === cat
                    ? 'bg-primary-500 border-primary-500 text-white shadow-xl shadow-primary-500/30 scale-105'
                    : 'bg-white border-primary-100 text-primary-400 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <main className="container mx-auto px-4 py-12 pb-40 flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAdd={addToCart} 
            />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-primary-100">
            <ShoppingBag size={64} className="mx-auto text-primary-100 mb-4" />
            <p className="text-primary-300 font-bold text-xl">لا توجد منتجات في هذا القسم حالياً.</p>
          </div>
        )}
      </main>

      {/* Checkout Floating Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[45] p-4 md:p-8 flex justify-center pointer-events-none">
          <div className="w-full max-w-4xl bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_25px_60px_rgba(139,94,52,0.2)] rounded-[2.5rem] p-6 flex items-center justify-between pointer-events-auto animate-bounce-in-up">
            <div className="flex items-center gap-6">
              <div className="bg-primary-500 p-5 rounded-3xl hidden sm:flex text-white shadow-lg shadow-primary-500/20">
                <ShoppingBag size={32} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-primary-400 font-black uppercase tracking-[0.2em]">إجمالي الطلب</span>
                <span className="text-3xl font-black text-primary-700">{cartTotal} <small className="text-sm font-bold">ر.ق</small></span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              className="bg-accent-500 text-white px-12 py-5 rounded-[1.8rem] font-black hover:bg-accent-600 transition-all shadow-2xl shadow-accent-500/30 flex items-center gap-4 group active:scale-95"
            >
              <div className="bg-white/25 px-4 py-1.5 rounded-xl text-sm font-black">{cartCount}</div>
              <span className="text-lg">مراجعة الفاتورة</span>
              <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-primary-100 py-20 text-center mt-auto relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif-logo font-black text-primary-600 mb-2">Twist & Taste</h2>
          <p className="text-primary-300 text-sm font-bold mb-8">حيث يلتوي العجين ليصنع حكاية مذاق فريدة</p>
          <div className="w-20 h-1.5 bg-primary-100 mx-auto rounded-full mb-12 shadow-inner"></div>
          
          <div className="flex justify-center gap-8 mb-12">
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">تواصل معنا</p>
              <p className="text-sm font-bold text-primary-700" dir="ltr">+974 3382 4737</p>
            </div>
            <div className="text-center border-x border-primary-50 px-8">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">موقعنا</p>
              <p className="text-sm font-bold text-primary-700">الدوحة، قطر</p>
            </div>
          </div>

          <p className="text-xs text-gray-400 font-medium">© {new Date().getFullYear()} Twist & Taste. صُنع بكل إتقان</p>
          
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="mt-10 text-[10px] text-gray-300 hover:text-primary-500 transition-colors flex items-center gap-1 mx-auto font-bold uppercase tracking-widest group"
          >
            <Settings size={14} className="group-hover:rotate-90 transition-transform" />
            <span>نظام الإدارة</span>
          </button>
        </div>
      </footer>

      {/* Floating Support Button */}
      <button
        onClick={handleDirectWhatsApp}
        className={`fixed ${cartCount > 0 ? 'bottom-32 md:bottom-40' : 'bottom-10'} right-10 z-40 bg-[#25D366] text-white p-6 rounded-full shadow-2xl hover:bg-[#128C7E] transition-all hover:scale-110 flex items-center justify-center group shadow-green-500/30`}
      >
        <MessageCircle size={36} />
        <span className="absolute right-full mr-5 bg-white text-primary-700 px-5 py-3 rounded-2xl shadow-2xl text-sm font-black opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none border border-primary-50 scale-90 group-hover:scale-100">
          هل تحتاج مساعدة؟
        </span>
      </button>

      {/* Modals & Drawers */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        onRemove={removeFromCart}
        onUpdateQty={updateQuantity}
        total={cartTotal}
        onCheckout={handleCheckout}
        onClear={clearCart}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={items}
        cartTotal={cartTotal}
        onSuccess={clearCart}
      />

      <AdminDashboard 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onAdd={addProduct}
        onEdit={updateProduct}
        onDelete={deleteProduct}
        onReset={resetToDefault}
      />
    </div>
  );
};

export default App;