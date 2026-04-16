import React, { useState } from 'react';
import { ShoppingCart, MessageSquareQuote } from 'lucide-react';

interface HeaderProps {
  logoUrl: string;
  cartCount: number;
  onOpenCart: () => void;
  onOpenFeedback: () => void;
}

export const Header: React.FC<HeaderProps> = ({ logoUrl, cartCount, onOpenCart, onOpenFeedback }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg shadow-sm border-b border-primary-100">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="flex flex-col items-start">
            {/* Logo Image with Text Fallback */}
            {!logoError ? (
              <img 
                src={logoUrl} 
                alt="Twist" 
                onError={() => setLogoError(true)}
                className="h-12 md:h-16 w-auto object-contain hover:scale-105 transition-transform duration-300 drop-shadow-sm" 
              />
            ) : (
              <h1 className="font-serif text-3xl font-black text-primary-500 tracking-tight">
                Twist
              </h1>
            )}
            
            <div className="flex items-center gap-1.5 mt-1">
               <div className="w-1.5 h-1.5 rounded-full bg-accent-500"></div>
               <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mr-1">
                 Artisanal & Fine
               </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenFeedback}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-2xl hover:bg-primary-100 transition-colors text-xs font-bold border border-primary-200"
            title="أضف مقترح أو تعليق"
          >
            <MessageSquareQuote size={16} />
            <span>شاركنا رأيك</span>
          </button>

          <button
            onClick={onOpenFeedback}
            className="sm:hidden p-3 bg-primary-50 text-primary-600 rounded-2xl hover:bg-primary-100 transition-colors"
          >
            <MessageSquareQuote size={20} />
          </button>

          <button
            onClick={onOpenCart}
            className="relative p-3 bg-white border border-primary-100 hover:border-primary-300 rounded-2xl transition-all group active:scale-90 shadow-sm"
            aria-label="سلة التسوق"
          >
            <ShoppingCart className="text-primary-600 group-hover:scale-110 transition-transform" size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full animate-bounce shadow-md border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};