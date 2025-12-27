import React, { useState, useRef } from 'react';
import { X, Mail, MapPin, Phone, User, Loader2, ArrowRight, CheckCircle2, ClipboardList, ShoppingCart, ChevronLeft, Download, PartyPopper } from 'lucide-react';
import { OrderDetails, CartItem } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import emailjs from '@emailjs/browser';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  onSuccess: () => void;
}

type CheckoutStep = 'details' | 'review' | 'success';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  onSuccess
}) => {
  const [step, setStep] = useState<CheckoutStep>('details');
  const [formData, setFormData] = useState<OrderDetails>({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };

  const handlePrevStep = () => {
    setStep('details');
  };

  const handleSubmit = async () => {
    setIsProcessing(true);

    try {
      // 1. Generate and Download PDF
      if (invoiceRef.current) {
        const canvas = await html2canvas(invoiceRef.current, {
          scale: 2,
          useCORS: true
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`TwistAndTaste_Invoice_${Date.now()}.pdf`);
      }

      // 2. EmailJS Logic
      // IMPORTANT: Replace these with your actual keys from EmailJS.com
      const EMAILJS_SERVICE_ID = "service_xxxxxxx"; 
      const EMAILJS_TEMPLATE_ID = "template_xxxxxxx";
      const EMAILJS_PUBLIC_KEY = "user_xxxxxxxxxxxxxx";

      const orderSummary = cartItems.map(item => `${item.name} (${item.quantity}x)`).join(', ');

      if (EMAILJS_SERVICE_ID !== "service_xxxxxxx") {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_address: formData.address,
            order_details: orderSummary,
            order_total: `${cartTotal} ر.ق`,
            order_notes: formData.notes || 'لا يوجد ملاحظات',
            reply_to: 'customer_email@example.com' // You could add an email field to formData if needed
          },
          EMAILJS_PUBLIC_KEY
        );
      }

      // 3. Move to Success step instead of redirecting
      setStep('success');
      onSuccess(); // Clear the cart
    } catch (error) {
      console.error("Error processing order:", error);
      alert("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseSuccess = () => {
    onClose();
    setTimeout(() => setStep('details'), 300); // Reset for next time
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all"
        onClick={!isProcessing && step !== 'success' ? onClose : undefined}
      />
      
      <div className="relative bg-white w-full max-w-lg h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-in-bottom md:animate-fade-in-up">
        
        {step !== 'success' ? (
          <>
            {/* Header with Progress Bar */}
            <div className="bg-white border-b border-gray-100 p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  {step === 'details' ? (
                    <><User className="text-primary-500" size={24} /> بيانات الطلب</>
                  ) : (
                    <><ClipboardList className="text-primary-500" size={24} /> مراجعة الطلب</>
                  )}
                </h2>
                {!isProcessing && (
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                    <X size={24} />
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-2 px-1">
                <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step === 'details' ? 'bg-primary-500' : 'bg-green-500'}`}></div>
                <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step === 'review' ? 'bg-primary-500' : 'bg-gray-100'}`}></div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {step === 'details' ? (
                <form id="details-form" onSubmit={handleNextStep} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">الاسم الكامل</label>
                    <div className="relative">
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                      <input
                        type="text" required disabled={isProcessing}
                        className="w-full pr-12 pl-4 py-4 rounded-2xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all bg-gray-50/50"
                        placeholder="أدخل اسمك الكريم"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">رقم الهاتف</label>
                    <div className="relative">
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                      <input
                        type="tel" required disabled={isProcessing} dir="ltr"
                        className="w-full pr-12 pl-4 py-4 rounded-2xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all bg-gray-50/50 text-right"
                        placeholder="00974xxxxxxxx"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">عنوان التوصيل</label>
                    <div className="relative">
                      <MapPin className="absolute right-4 top-6 text-gray-300" size={20} />
                      <textarea
                        required rows={2} disabled={isProcessing}
                        className="w-full pr-12 pl-4 py-4 rounded-2xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all resize-none bg-gray-50/50"
                        placeholder="المدينة، الحي، رقم المنزل..."
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">ملاحظات إضافية</label>
                    <textarea
                      rows={2} disabled={isProcessing}
                      className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all resize-none bg-gray-50/50"
                      placeholder="هل تود إضافة أي تعليمات خاصة؟"
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>
                </form>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-primary-50 rounded-3xl p-6 border border-primary-100">
                    <h4 className="font-bold text-primary-900 mb-4 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-accent-500" /> ملخص البيانات
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-primary-100/50 pb-2">
                        <span className="text-gray-500 font-medium">الاسم:</span>
                        <span className="font-bold text-gray-800">{formData.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-primary-100/50 pb-2">
                        <span className="text-gray-500 font-medium">الهاتف:</span>
                        <span className="font-bold text-gray-800" dir="ltr">{formData.phone}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-500 font-medium">العنوان:</span>
                        <span className="font-bold text-gray-800 leading-relaxed">{formData.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 px-1 flex items-center gap-2">
                      <ShoppingCart size={18} className="text-primary-500" /> تفاصيل الطلب
                    </h4>
                    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden divide-y divide-gray-50 shadow-sm">
                      {cartItems.map((item, idx) => (
                        <div key={idx} className="p-4 flex items-center gap-4">
                          <img src={item.image} className="w-12 h-12 rounded-xl object-cover shrink-0 bg-gray-50" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-800 truncate text-sm">{item.name}</p>
                            <p className="text-xs text-gray-400">{item.quantity} × {item.price} ر.ق</p>
                          </div>
                          <div className="text-sm font-black text-primary-600">
                            {item.price * item.quantity} ر.ق
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-white">
              <div className="flex justify-between items-center mb-6 px-1">
                <span className="text-gray-500 font-bold">المجموع النهائي:</span>
                <span className="text-3xl font-black text-primary-600">{cartTotal} ر.ق</span>
              </div>

              <div className="flex gap-3">
                {step === 'review' && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isProcessing}
                    className="w-20 bg-gray-100 text-gray-500 py-4 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center"
                  >
                    <ArrowRight size={24} />
                  </button>
                )}
                
                <button
                  type={step === 'details' ? 'submit' : 'button'}
                  form={step === 'details' ? 'details-form' : undefined}
                  onClick={step === 'review' ? handleSubmit : undefined}
                  disabled={isProcessing}
                  className={`flex-1 font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                    step === 'details' 
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-600/20' 
                      : 'bg-primary-700 text-white hover:bg-primary-800 shadow-primary-700/20'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" />
                      <span>جاري إرسال الطلب...</span>
                    </>
                  ) : step === 'details' ? (
                    <>
                      <span>مراجعة الطلب</span>
                      <ChevronLeft size={20} />
                    </>
                  ) : (
                    <>
                      <Mail size={22} />
                      <span>تأكيد وإرسال الفاتورة</span>
                    </>
                  )}
                </button>
              </div>
              
              <p className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
                سيتم إرسال الطلب إلى بريدنا الإلكتروني وتوليد فاتورة PDF قابلة للتحميل فوراً
              </p>
            </div>
          </>
        ) : (
          /* Success Screen */
          <div className="p-12 text-center flex flex-col items-center gap-6 animate-fade-in">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 animate-bounce">
              <PartyPopper size={48} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-gray-900">تم الطلب بنجاح!</h2>
              <p className="text-gray-500 font-medium">شكراً لثقتكم بمخبز Twist & Taste. تم إرسال طلبكم بنجاح وتم تحميل الفاتورة في جهازكم.</p>
            </div>
            
            <div className="w-full bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">رقم الطلب:</span>
                <span className="font-bold text-primary-600">#{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">طريقة الإرسال:</span>
                <span className="font-bold text-gray-700 flex items-center gap-1"><Mail size={14} /> البريد الإلكتروني</span>
              </div>
            </div>

            <button
              onClick={handleCloseSuccess}
              className="w-full bg-primary-600 text-white font-bold py-4 rounded-2xl hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 active:scale-95"
            >
              العودة للمتجر
            </button>
          </div>
        )}

        {/* Hidden Invoice Template for PDF Generation */}
        <div className="absolute -z-50 top-0 left-0 w-[800px] opacity-0 pointer-events-none">
          <div ref={invoiceRef} className="bg-white p-12 font-sans text-gray-800 border border-gray-200">
            <div className="flex justify-between items-center border-b-2 border-primary-50 pb-8 mb-8">
              <div>
                <h1 className="text-5xl font-black text-primary-600 mb-2 font-serif-logo">Twist & Taste</h1>
                <p className="text-primary-400 font-bold uppercase tracking-widest text-xs">Premium Bakery & Sweets</p>
              </div>
              <div className="text-left text-sm text-gray-400">
                <p className="font-bold text-gray-800">فاتورة طلب #INV-{Date.now().toString().slice(-6)}</p>
                <p>تاريخ: {new Date().toLocaleDateString('ar-QA')}</p>
              </div>
            </div>

            <div className="mb-10 grid grid-cols-2 gap-8">
              <div className="p-6 bg-primary-50 rounded-3xl border border-primary-100">
                <h3 className="font-bold text-lg mb-4 text-primary-700 border-b border-primary-100 pb-2 flex items-center gap-2">
                  <User size={16} /> بيانات العميل
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-primary-300 font-bold">الاسم:</span> {formData.name}</p>
                  <p><span className="text-primary-300 font-bold">الهاتف:</span> {formData.phone}</p>
                  <p><span className="text-primary-300 font-bold">العنوان:</span> {formData.address}</p>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-gray-700 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <ClipboardList size={16} /> ملاحظات
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed italic">
                  {formData.notes || 'لا توجد ملاحظات خاصة لهذا الطلب.'}
                </p>
              </div>
            </div>

            <table className="w-full mb-12">
              <thead>
                <tr className="bg-primary-600 text-white">
                  <th className="text-right py-4 px-6 rounded-r-2xl">المنتج</th>
                  <th className="text-center py-4 px-6">الكمية</th>
                  <th className="text-center py-4 px-6">سعر الوحدة</th>
                  <th className="text-left py-4 px-6 rounded-l-2xl">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cartItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-6 px-6 font-bold text-gray-800">{item.name}</td>
                    <td className="text-center py-6 px-6 font-medium text-gray-500">{item.quantity}</td>
                    <td className="text-center py-6 px-6 font-medium text-gray-500">{item.price} ر.ق</td>
                    <td className="text-left py-6 px-6 font-black text-primary-600">{item.price * item.quantity} ر.ق</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col items-end gap-2">
               <div className="w-64 bg-primary-50 p-6 rounded-3xl border-2 border-primary-100">
                  <div className="flex justify-between items-center text-gray-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest">المجموع الكلي</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-3xl font-black text-primary-600">{cartTotal}</span>
                    <span className="text-sm font-bold text-primary-400 mb-1">ريال قطري</span>
                  </div>
               </div>
               <p className="text-[10px] text-gray-400 font-bold mr-4">جميع الأسعار تشمل رسوم التوصيل والضرائب</p>
            </div>
            
            <div className="mt-20 pt-10 border-t border-gray-100 flex justify-between items-center">
              <div className="text-center">
                <div className="w-24 h-24 border-2 border-primary-100 rounded-2xl mb-2 mx-auto flex items-center justify-center">
                   <div className="w-16 h-16 bg-primary-100 rounded-lg"></div>
                </div>
                <p className="text-[10px] text-gray-300 font-bold">ختم المتجر</p>
              </div>
              <div className="text-left space-y-1">
                <p className="text-sm font-bold text-primary-600">شكراً لثقتكم بنا</p>
                <p className="text-xs text-gray-400">للاستفسارات: 97433824737+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};