import React, { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingBag, ImageOff, Loader2 } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const [count, setCount] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset states when the image changes
  useEffect(() => {
    setImageError(false);
    setIsLoading(true);
  }, [product.image]);

  const handleAdd = () => {
    onAdd(product, count);
    setIsAdded(true);
    setCount(1);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => (prev > 1 ? prev - 1 : 1));

  // Fallback placeholder image
  const fallbackImage = `https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=800&auto=format&fit=crop`;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-primary-100 flex flex-col h-full transform hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
        {isLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        )}

        {!imageError ? (
          <img
            src={product.image || fallbackImage}
            alt={product.name}
            onLoad={() => setIsLoading(false)}
            onError={() => {
                setImageError(true);
                setIsLoading(false);
            }}
            className={`w-full h-full object-cover transition-all duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'} group-hover:scale-110`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 flex-col gap-2 bg-gray-50">
            <ImageOff size={40} className="text-gray-200" />
            <span className="text-xs font-bold text-gray-400">نعتذر، الصورة غير متوفرة</span>
          </div>
        )}
        
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm z-20">
          {product.category}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{product.name}</h3>
          <span className="text-lg font-bold text-primary-600 whitespace-nowrap">{product.price} ر.ق</span>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between bg-primary-50 p-2 rounded-xl">
            <span className="text-xs font-bold text-gray-500 px-1">الكمية:</span>
            <div className="flex items-center gap-3">
              <button onClick={decrement} className="w-8 h-8 rounded-full bg-white text-primary-600 shadow-sm flex items-center justify-center disabled:opacity-50">
                <Minus size={16} />
              </button>
              <span className="font-bold text-lg w-6 text-center">{count}</span>
              <button onClick={increment} className="w-8 h-8 rounded-full bg-white text-primary-600 shadow-sm flex items-center justify-center">
                <Plus size={16} />
              </button>
            </div>
          </div>
        
          <button
            onClick={handleAdd}
            className={`w-full font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
              isAdded ? 'bg-green-500 text-white' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg'
            }`}
          >
            {isAdded ? (
              <><ShoppingBag size={18} /><span>تمت الإضافة!</span></>
            ) : (
              <><Plus size={18} /><span>أضف للسلة ({product.price * count} ر.ق)</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};