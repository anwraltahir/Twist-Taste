import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, Trash } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQty: (id: number, delta: number) => void;
  total: number;
  onCheckout: () => void;
  onClear: () => void; // Added onClear prop
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemove,
  onUpdateQty,
  total,
  onCheckout,
  onClear
}) => {
  if (!isOpen) return null;

  const handleClearAll = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في مسح السلة بالكامل؟')) {
      onClear();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute left-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl flex flex-col animate-slide-in-left">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-primary-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-primary-600" />
            <h2 className="text-lg font-bold">سلة المشتريات</h2>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="text-xs text-red-500 font-bold hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 border border-red-100"
              >
                <Trash size={14} />
                <span>مسح الكل</span>
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingBag size={64} className="opacity-20" />
              <p className="text-lg">السلة فارغة حالياً</p>
              <button 
                onClick={onClose}
                className="text-primary-500 font-bold hover:underline"
              >
                تصفح المنتجات
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative group">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-20 h-20 object-cover rounded-lg shrink-0 border border-gray-50"
                />
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-gray-900 line-clamp-1 text-sm md:text-base">{item.name}</h3>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1 shrink-0"
                      title="حذف من السلة"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex items-end justify-between mt-2">
                    <div className="flex flex-col">
                      <span className="text-primary-600 font-black text-lg">{item.price * item.quantity} ر.ق</span>
                      <span className="text-[10px] text-gray-400 font-medium">({item.price} ر.ق / قطعة)</span>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-gray-100">
                      <button 
                        onClick={() => item.quantity > 1 ? onUpdateQty(item.id, -1) : onRemove(item.id)}
                        className={`p-1.5 rounded-lg transition-all ${item.quantity <= 1 ? 'text-red-500 hover:bg-red-50' : 'text-gray-600 hover:bg-white shadow-sm'}`}
                        title={item.quantity <= 1 ? "حذف" : "تقليل"}
                      >
                        {item.quantity <= 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                      </button>
                      <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="p-1.5 hover:bg-white text-gray-600 rounded-lg shadow-sm transition-all border border-transparent hover:border-gray-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">المجموع النهائي</span>
                <span className="text-2xl font-black text-primary-600">{total} ر.ق</span>
              </div>
              <div className="text-xs text-gray-400 font-medium">
                {items.reduce((acc, item) => acc + item.quantity, 0)} قطعة في السلة
              </div>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-primary-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary-600/20 hover:bg-primary-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
            >
              <span>إتمام عملية الطلب</span>
              <div className="w-px h-4 bg-white/20"></div>
              <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};