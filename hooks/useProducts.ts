import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../constants';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage or Fallback to Constants
  useEffect(() => {
    const savedProductsStr = localStorage.getItem('twist_taste_products');
    let finalProducts: Product[] = [...INITIAL_PRODUCTS];

    if (savedProductsStr) {
      try {
        const savedProducts: Product[] = JSON.parse(savedProductsStr);
        
        // Filter out default products from saved list to avoid duplicates
        // and only keep those added by the user (IDs > 100 for example, but checking existence is better)
        const customProducts = savedProducts.filter(sp => 
          !INITIAL_PRODUCTS.some(ip => ip.id === sp.id)
        );

        // Combine INITIAL_PRODUCTS (from code) with custom ones (from storage)
        // This ensures updates to code-based products reflect immediately
        finalProducts = [...INITIAL_PRODUCTS, ...customProducts];
        
        // Fix any potentially broken image links in custom products
        finalProducts = finalProducts.map(p => {
          const isBrokenLocalPath = p.image && !p.image.startsWith('http') && !p.image.startsWith('data:');
          if (isBrokenLocalPath) {
            return {
              ...p,
              image: `https://via.placeholder.com/800x600?text=${encodeURIComponent(p.name)}`
            };
          }
          return p;
        });
      } catch (e) {
        console.error("Failed to parse products", e);
        finalProducts = INITIAL_PRODUCTS;
      }
    }
    
    setProducts(finalProducts);
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever products change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('twist_taste_products', JSON.stringify(products));
      } catch (error) {
        console.error("Failed to save products to local storage", error);
        if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
          alert("تنبيه: مساحة التخزين ممتلئة! يرجى حذف بعض المنتجات التي تحتوي على صور مرفوعة يدوياً، واستخدم روابط خارجية بدلاً منها.");
        }
      }
    }
  }, [products, isLoaded]);

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    setProducts(prev => [
      { ...product, id: Date.now() }, 
      ...prev
    ]);
  }, []);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  }, []);

  const deleteProduct = useCallback((id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  }, []);

  const resetToDefault = useCallback(() => {
    if (window.confirm('سيتم حذف جميع التعديلات واستعادة المنتجات الأصلية. هل أنت متأكد؟')) {
      setProducts(INITIAL_PRODUCTS);
      localStorage.removeItem('twist_taste_products');
    }
  }, []);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefault
  };
};