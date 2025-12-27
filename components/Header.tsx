import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg shadow-sm border-b border-primary-100">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="flex flex-col items-start">
            <h1 className="text-2xl md:text-3xl font-serif-logo font-black text-primary-700 leading-none tracking-tight group-hover:scale-105 transition-transform duration-300">
              Twist & Taste
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
               <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
               <span className="text-[9px] text-primary-400 font-black uppercase tracking-[0.3em] mr-1">
                 Premium Bakery
               </span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenCart}
          className="relative p-3 bg-primary-50 hover:bg-primary-100 rounded-2xl transition-all group active:scale-90"
          aria-label="سلة التسوق"
        >
          <ShoppingCart className="text-primary-700 group-hover:scale-110 transition-transform" size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-accent-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full animate-pulse shadow-lg border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};