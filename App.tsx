import React, { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboard } from './components/AdminDashboard';
import { FeedbackModal } from './components/FeedbackModal'; 
import { MessageCircle, Settings, ArrowLeft, ShoppingBag, ChevronDown, Star } from 'lucide-react';
import { WHATSAPP_NUMBER, AppSettings } from './types';

const App: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    resetToDefault 
  } = useProducts();

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('twist_settings');
    return saved ? JSON.parse(saved) : {
      logoUrl: '/logo.png',
      heroImageUrl: '/hero-image.png'
    };
  });

  // Save settings when they change
  React.useEffect(() => {
    localStorage.setItem('twist_settings', JSON.stringify(settings));
    // Reset error states when URLs change
    setHeroLogoError(false);
    setHeroImageError(false);
  }, [settings]);

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
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false); 
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  
  // State to handle image loading errors
  const [heroLogoError, setHeroLogoError] = useState(false);
  const [heroImageError, setHeroImageError] = useState(false);

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
    <div className="min-h-screen flex flex-col font-sans bg-primary-50 selection:bg-accent-500 selection:text-white">
      <Header 
        logoUrl={settings.logoUrl}
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)} 
      />

      {/* Modern Hero Section - Updated for Artisanal Twist Logo */}
      <section className="relative w-full min-h-[90vh] md:h-[85vh] flex flex-col md:flex-row items-center bg-primary-50 overflow-hidden">
        
        {/* Background Decorative Blobs - Updated colors for the warm theme */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-accent-100/40 rounded-full blur-3xl opacity-60 animate-pulse"></div>
           <div className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] bg-primary-200/30 rounded-full blur-3xl opacity-60"></div>
           <div className="absolute bottom-0 right-[20%] w-[30%] h-[30%] bg-accent-50/40 rounded-full blur-3xl opacity-50"></div>
        </div>

        {/* Content Side */}
        <div className="w-full md:w-1/2 px-6 md:px-16 py-12 md:py-0 z-10 flex flex-col items-start justify-center h-full text-right dir-rtl">
           
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-accent-100 rounded-full shadow-sm mb-8 animate-fade-in">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
              </span>
              <span className="text-xs font-bold text-gray-600 tracking-wide">نكهة تلتوي في الذاكرة</span>
           </div>

           {/* Hero Logo with Fallback */}
           <div className="mb-6 animate-fade-in-up">
             {!heroLogoError ? (
               <img 
                 src={settings.logoUrl} 
                 alt="Twist Logo" 
                 onError={() => setHeroLogoError(true)}
                 className="h-32 md:h-48 w-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
               />
             ) : (
               <div className="flex flex-col items-start">
                 <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin-slow"></div>
                 </div>
                 <h1 className="text-7xl md:text-8xl font-black text-primary-500 font-serif leading-tight drop-shadow-sm">
                   Twist
                 </h1>
               </div>
             )}
           </div>

           <h2 className="text-3xl md:text-5xl font-black text-gray-800 leading-[1.2] mb-6 animate-fade-in-up delay-100">
             عالم <span className="text-primary-500 relative inline-block">
               المذاق الأصيل
               <svg className="absolute w-full h-3 -bottom-1 right-0 text-accent-500/30" viewBox="0 0 200 9" fill="none"><path d="M2.00025 6.99997C25.7201 5.04571 120.762 1.50007 197.986 6.99997" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
             </span> <br/>
             والحلويات الفاخرة
           </h2>

           <p className="text-lg text-gray-500 font-medium mb-8 leading-relaxed max-w-lg animate-fade-in-up delay-200">
             في Twist، نجمع بين عراقة المذاق وحداثة الابتكار لنقدم لكم تجربة فريدة من الحلويات والمعجنات التي تُصنع بكل حب وشغف.
           </p>

           <div className="flex flex-wrap items-center gap-4 animate-fade-in-up delay-300">
              <button 
                onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary-500/30 hover:bg-primary-600 hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                <span>ابدأ التسوق</span>
                <ShoppingBag size={20} />
              </button>
              
              <button 
                 onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                 className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-white hover:text-primary-500 transition-colors border-2 border-transparent hover:border-primary-100"
              >
                تواصل معنا
              </button>
           </div>

           <div className="mt-10 flex items-center gap-4 animate-fade-in-up delay-300">
              <div className="flex -space-x-3 space-x-reverse">
                 {[1,2,3,4].map(i => (
                   <img key={i} src={`https://i.pravatar.cc/100?img=${i+25}`} alt="Customer" className="w-10 h-10 rounded-full border-2 border-white ring-2 ring-primary-100" />
                 ))}
              </div>
              <div className="flex flex-col">
                 <div className="flex text-yellow-400 text-xs gap-0.5">
                   <Star className="fill-current" size={12} />
                   <Star className="fill-current" size={12} />
                   <Star className="fill-current" size={12} />
                   <Star className="fill-current" size={12} />
                   <Star className="fill-current" size={12} />
                 </div>
                 <span className="text-xs font-bold text-gray-400 mt-0.5">أكثر من 500+ عميل سعيد</span>
              </div>
           </div>
        </div>

        {/* Image Side - Hero Image */}
        <div className="relative w-full md:w-1/2 h-[50vh] md:h-full">
           <div className="absolute inset-0 md:left-0 md:right-auto md:w-[110%] md:h-full bg-white md:rounded-br-[4rem] overflow-hidden shadow-2xl">
              <img 
                src={!heroImageError ? settings.heroImageUrl : "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1200&auto=format&fit=crop"} 
                onError={() => setHeroImageError(true)}
                alt="Twist Artisanal Sweets" 
                className="w-full h-full object-cover animate-slow-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-50 via-transparent to-transparent md:bg-gradient-to-r md:from-primary-50 md:via-transparent md:to-transparent opacity-90 md:opacity-100"></div>
           </div>
           
           {/* Floating Badge */}
           <div className="hidden md:flex absolute bottom-20 left-20 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl shadow-primary-100 border border-white items-center gap-4 animate-bounce-slow max-w-[240px]">
              <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-2xl shadow-inner">
                🥐
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">معجنات طازجة</p>
                <p className="text-xs text-primary-500 font-bold">تُخبز يومياً بكل حب ✨</p>
              </div>
           </div>
        </div>
      </section>

      {/* Category Filter */}
      <div id="menu" className="container mx-auto px-4 py-12 sticky top-[80px] z-30 bg-primary-50/95 backdrop-blur-xl -mx-4 md:mx-auto transition-all">
        <div className="flex flex-col items-center gap-8">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-black text-primary-600">قائمة السعادة</h3>
            <p className="text-gray-400 text-sm font-bold">اختر ما يحلو لك من ألذ ابتكاراتنا</p>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar justify-start md:justify-center w-full px-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-10 py-4 rounded-2xl whitespace-nowrap font-black transition-all text-sm md:text-base border-2 shadow-sm ${
                  activeCategory === cat
                    ? 'bg-primary-500 border-primary-500 text-white shadow-xl shadow-primary-500/30 scale-105'
                    : 'bg-white border-primary-100 text-gray-400 hover:border-primary-300 hover:text-primary-500'
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
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-primary-200">
            <ShoppingBag size={64} className="mx-auto text-primary-200 mb-4" />
            <p className="text-primary-400 font-bold text-xl">لا توجد منتجات في هذا القسم حالياً.</p>
          </div>
        )}
      </main>

      {/* Checkout Floating Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[45] p-4 md:p-8 flex justify-center pointer-events-none">
          <div className="w-full max-w-4xl bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_25px_60px_rgba(255,85,0,0.15)] rounded-[2.5rem] p-6 flex items-center justify-between pointer-events-auto animate-bounce-in-up">
            <div className="flex items-center gap-6">
              <div className="bg-primary-500 p-5 rounded-3xl hidden sm:flex text-white shadow-lg shadow-primary-500/20">
                <ShoppingBag size={32} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-primary-400 font-black uppercase tracking-[0.2em]">إجمالي الطلب</span>
                <span className="text-3xl font-black text-primary-600">{cartTotal} <small className="text-sm font-bold">ر.ق</small></span>
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-6">
            {!heroLogoError ? (
               <img src={settings.logoUrl} onError={() => setHeroLogoError(true)} alt="Twist Logo" className="h-24 w-auto object-contain" />
            ) : (
               <span className="font-serif-logo text-4xl font-black text-gray-800">Twist</span>
            )}
          </div>
          <p className="text-primary-400 text-sm font-bold mb-8">حيث يلتوي الطعم ليصنع حكاية مذاق فريدة</p>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary-400 to-accent-400 mx-auto rounded-full mb-12 shadow-inner"></div>
          
          <div className="flex justify-center gap-8 mb-12">
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">تواصل معنا</p>
              <p className="text-sm font-bold text-gray-700" dir="ltr">+974 3382 4737</p>
            </div>
            <div className="text-center border-x border-primary-50 px-8">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">موقعنا</p>
              <p className="text-sm font-bold text-gray-700">الدوحة، قطر</p>
            </div>
          </div>

          <p className="text-xs text-gray-400 font-medium">© {new Date().getFullYear()} Twist. صُنع بكل إتقان</p>
          
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
        <span className="absolute right-full mr-5 bg-white text-gray-700 px-5 py-3 rounded-2xl shadow-2xl text-sm font-black opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none border border-primary-50 scale-90 group-hover:scale-100">
          هل تحتاج مساعدة؟
        </span>
      </button>

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

      <FeedbackModal 
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <AdminDashboard 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onAdd={addProduct}
        onEdit={updateProduct}
        onDelete={deleteProduct}
        onReset={resetToDefault}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    </div>
  );
};

export default App;