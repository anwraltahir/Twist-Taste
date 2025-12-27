import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { X, Plus, Edit2, Trash2, Upload, Image as ImageIcon, RotateCcw, Lock, CheckCircle2, AlertTriangle, Link as LinkIcon, Info, HelpCircle } from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAdd: (p: Omit<Product, 'id'>) => void;
  onEdit: (p: Product) => void;
  onDelete: (id: number) => void;
  onReset: () => void;
}

const DEFAULT_PASSWORD = "1234";

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  onAdd,
  onEdit,
  onDelete,
  onReset
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [imageTab, setImageTab] = useState<'url' | 'upload'>('url');
  const [showStorageInfo, setShowStorageInfo] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'حلويات',
    description: '',
    image: ''
  });

  useEffect(() => {
    setImagePreviewError(false);
  }, [formData.image, imageTab]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === DEFAULT_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("كلمة المرور غير صحيحة");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 300 * 1024) {
        alert("حجم الصورة كبير جداً! للرفع المباشر يرجى اختيار صورة أقل من 300 كيلوبايت، أو استخدم 'رابط صورة' للصور الكبيرة.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: 0, category: 'حلويات', description: '', image: '' });
    setImageTab('url');
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setImageTab(product.image?.startsWith('data:') ? 'upload' : 'url');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      alert("يرجى إدخال اسم المنتج.");
      return;
    }

    if (!formData.image?.trim() || imagePreviewError) {
      alert("يرجى التأكد من وضع صورة صالحة للمنتج.");
      return;
    }

    const productData = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category || 'أخرى',
        description: formData.description || '',
        image: formData.image
    };

    try {
        if (editingProduct) {
            onEdit({ ...productData, id: editingProduct.id });
        } else {
            onAdd(productData);
        }
        setIsFormOpen(false);
    } catch (err) {
        alert("حدث خطأ أثناء حفظ المنتج. قد تكون الذاكرة ممتلئة إذا كنت ترفع صوراً كبيرة.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-900/90 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative">
            <button onClick={onClose} className="absolute left-4 top-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
            <div className="text-center mb-6">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Lock className="text-primary-600" size={32} /></div>
                <h2 className="text-2xl font-bold text-gray-800">لوحة التحكم</h2>
                <p className="text-gray-500 text-sm">أدخل كلمة المرور للمتابعة (1234)</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
                <input 
                    type="password" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 outline-none text-center text-lg tracking-widest"
                    placeholder="••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    autoFocus
                />
                <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors">دخول</button>
            </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">إدارة المنتجات</h2>
            <span className="bg-primary-100 text-primary-700 text-[10px] md:text-xs px-2 py-1 rounded-full font-bold">{products.length}</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
            <button onClick={() => setShowStorageInfo(!showStorageInfo)} className="text-primary-600 bg-primary-50 p-2 rounded-lg hover:bg-primary-100 transition-colors" title="معلومات التخزين">
                <HelpCircle size={18} />
            </button>
            <button onClick={onReset} className="text-red-500 hover:bg-red-50 flex items-center gap-1 text-[10px] md:text-sm px-2 md:px-4 py-2 rounded-xl transition-colors font-bold border border-red-100">
                <RotateCcw size={14} />
                <span className="hidden sm:inline">تصفير</span>
            </button>
            <button onClick={onClose} className="bg-gray-100 text-gray-500 hover:bg-gray-200 p-2 rounded-full transition-colors"><X size={20} /></button>
        </div>
      </header>

      {showStorageInfo && (
        <div className="bg-primary-600 text-white p-4 animate-fade-in text-xs flex items-start gap-3">
            <Info className="shrink-0" size={18} />
            <div className="space-y-1">
                <p className="font-bold">نصيحة تقنية لضمان سرعة المتجر:</p>
                <p>استخدم "روابط الصور" بدلاً من الرفع المباشر للملفات. مساحة المتصفح محدودة، والروابط تضمن لك إضافة عدد غير محدود من المنتجات دون بطء في التحميل.</p>
                <button onClick={() => setShowStorageInfo(false)} className="underline font-bold mt-1">فهمت ذلك</button>
            </div>
        </div>
      )}

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-end mb-6">
                <button onClick={openAddForm} className="w-full md:w-auto bg-primary-600 text-white px-6 py-4 md:py-3 rounded-2xl shadow-lg hover:bg-primary-700 flex items-center justify-center gap-2 font-bold transition-all active:scale-95">
                    <Plus size={20} /><span>إضافة منتج جديد</span>
                </button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                        <tr>
                            <th className="p-4 w-24">الصورة</th>
                            <th className="p-4">المنتج</th>
                            <th className="p-4">السعر</th>
                            <th className="p-4">القسم</th>
                            <th className="p-4 w-32 text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <img 
                                      src={product.image} 
                                      alt="" 
                                      className="w-12 h-12 rounded-lg object-cover border bg-gray-50"
                                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/150?text=Err"; }}
                                    />
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-gray-800">{product.name}</div>
                                    <div className="text-xs text-gray-400 truncate max-w-[200px]">{product.description}</div>
                                </td>
                                <td className="p-4 text-primary-600 font-bold">{product.price} ر.ق</td>
                                <td className="p-4"><span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{product.category}</span></td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-2">
                                        <button onClick={() => openEditForm(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                                        <button onClick={() => onDelete(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View (Fix for button visibility) */}
            <div className="md:hidden space-y-4">
                {products.map(product => (
                    <div key={product.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <img 
                            src={product.image} 
                            alt="" 
                            className="w-16 h-16 rounded-xl object-cover border bg-gray-50 shrink-0"
                            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/150?text=Err"; }}
                        />
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-gray-800 truncate text-sm">{product.name}</div>
                            <div className="text-primary-600 font-bold text-sm">{product.price} ر.ق</div>
                            <div className="mt-1">
                                <span className="bg-gray-50 text-gray-400 text-[10px] px-2 py-0.5 rounded-full border border-gray-100">{product.category}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => openEditForm(product)} className="p-3 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 active:scale-90 transition-all">
                                <Edit2 size={18} />
                            </button>
                            <button onClick={() => onDelete(product.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 active:scale-90 transition-all">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
            <div className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-slide-in-bottom md:animate-fade-in">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-primary-50/50 sticky top-0 z-10 backdrop-blur-md">
                    <h3 className="text-lg font-bold text-primary-900">{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
                    <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600 p-1"><X size={24} /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5">
                    {/* Image Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-gray-700">صورة المنتج</label>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button 
                                    type="button"
                                    onClick={() => setImageTab('url')}
                                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${imageTab === 'url' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'}`}
                                >
                                    <LinkIcon size={12} /> رابط
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setImageTab('upload')}
                                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${imageTab === 'upload' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500'}`}
                                >
                                    <Upload size={12} /> رفع
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border-2 border-dashed border-gray-200">
                            <div className="w-28 h-28 bg-white rounded-2xl overflow-hidden shadow-inner border border-gray-200 relative group flex items-center justify-center shrink-0">
                                {formData.image && !imagePreviewError ? (
                                    <img 
                                      src={formData.image} 
                                      alt="Preview" 
                                      className="w-full h-full object-cover" 
                                      onError={() => setImagePreviewError(true)}
                                    />
                                ) : (
                                    <div className="text-gray-300 flex flex-col items-center gap-2">
                                        {imagePreviewError ? <AlertTriangle className="text-red-300" size={28} /> : <ImageIcon size={28} />}
                                        <span className="text-[9px] font-bold text-center px-2">
                                            {imagePreviewError ? 'الصورة غير صالحة' : 'لا توجد صورة'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="w-full">
                                {imageTab === 'url' ? (
                                    <div className="space-y-2">
                                        <input 
                                            type="text"
                                            placeholder="ضع رابط الصورة هنا (Unsplash/Imgur)..."
                                            className={`w-full text-xs p-3.5 border rounded-xl outline-none transition-all focus:ring-2 ${imagePreviewError ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-primary-100'}`}
                                            value={formData.image?.startsWith('data:') ? '' : formData.image}
                                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <button 
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full bg-white border border-gray-200 p-3.5 rounded-xl text-[10px] font-bold text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <Upload size={14} /> اختر صورة من الهاتف
                                        </button>
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </div>
                                )}
                                {formData.image && !imagePreviewError && (
                                    <div className="flex items-center gap-1 text-[10px] text-green-600 justify-center font-bold mt-2">
                                        <CheckCircle2 size={12} /><span>الصورة جاهزة للمعاينة</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-500 mr-1 uppercase">اسم المنتج</label>
                            <input type="text" required placeholder="مثال: كنافة بالقشطة" className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-primary-500 bg-white shadow-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-500 mr-1 uppercase">السعر (ر.ق)</label>
                            <input type="number" required placeholder="0.00" className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-primary-500 bg-white shadow-sm" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-500 mr-1 uppercase">التصنيف</label>
                        <div className="relative">
                            <select className="w-full p-4 border border-gray-200 rounded-xl outline-none bg-white shadow-sm appearance-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                <option value="حلويات">حلويات</option>
                                <option value="معجنات">معجنات</option>
                                <option value="موالح">موالح</option>
                                <option value="مشروبات">مشروبات</option>
                                <option value="أخرى">أخرى</option>
                            </select>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-500 mr-1 uppercase">وصف مختصر</label>
                        <textarea rows={2} placeholder="صف مكونات المنتج أو مميزاته..." className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-primary-500 resize-none bg-white shadow-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>

                    <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-100 mt-4">
                        <button type="submit" className="w-full bg-primary-600 text-white font-bold py-4 rounded-2xl hover:bg-primary-700 transition-all shadow-lg active:scale-[0.98] text-lg">
                            {editingProduct ? 'تحديث البيانات' : 'إضافة إلى القائمة'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

// Simple helper icon for the select dropdown
const ChevronDown = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);
