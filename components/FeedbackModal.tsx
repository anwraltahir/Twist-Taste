import React, { useState } from 'react';
import { X, Star, Send, MessageSquareQuote, ThumbsUp, Sparkles, Loader2 } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    type: 'suggestion',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("يرجى اختيار تقييم بالنجوم");
      return;
    }
    setIsSubmitting(true);
    const typeLabels: Record<string, string> = {
      suggestion: 'اقتراح ✨',
      praise: 'شكر وتقدير 👍',
      complaint: 'ملاحظة/شكوى 💬'
    };
    const whatsappMessage = `*👋 مشاركة رأي جديد من الموقع*
    
*التقييم:* ${rating}/5 ${Array(rating).fill('⭐').join('')}
*الاسم:* ${formData.name || 'فاعل خير'}
*نوع المشاركة:* ${typeLabels[formData.type] || 'عام'}

*نص الرسالة:*
${formData.message}

------------------
تم الإرسال من خلال نموذج المقترحات في موقع Twist.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setIsSuccess(false);
      setRating(0);
      setFormData({ name: '', type: 'suggestion', message: '' });
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={handleClose} />
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="absolute top-0 left-0 w-full h-32 bg-primary-600 rounded-b-[50%] scale-x-150 -translate-y-16 -z-0"></div>
        {!isSuccess ? (
          <div className="relative z-10 flex flex-col h-full max-h-[90vh]">
            <div className="p-6 pb-2 text-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-lg mx-auto mb-4 flex items-center justify-center text-primary-600"><MessageSquareQuote size={32} /></div>
              <h2 className="text-2xl font-black text-gray-800 mb-1">رأيك يهمنا</h2>
              <p className="text-gray-500 text-sm font-medium">ساعدنا لنقدم لك تجربة أشهى وأفضل</p>
              <button onClick={handleClose} className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5 overflow-y-auto">
              <div className="flex flex-col items-center gap-2 py-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">قيم تجربتك</label>
                <div className="flex gap-2" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} className="transition-transform hover:scale-110 focus:outline-none">
                      <Star size={32} className={`transition-colors ${star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' : 'text-gray-200 fill-gray-50'}`} />
                    </button>
                  ))}
                </div>
                <span className="text-sm font-bold text-primary-600 h-5">
                  {rating === 5 ? 'ممتاز! 😍' : rating === 4 ? 'جيد جداً 😊' : rating === 3 ? 'جيد 🙂' : rating === 2 ? 'مقبول 😐' : rating === 1 ? 'سيء 😞' : ''}
                </span>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">الاسم (اختياري)</label><input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all" placeholder="ضيفنا العزيز" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">نوع الملاحظة</label>
                  <div className="flex gap-2">
                    {[ { id: 'suggestion', label: 'اقتراح', icon: Sparkles }, { id: 'praise', label: 'شكر', icon: ThumbsUp }, { id: 'complaint', label: 'ملاحظة', icon: MessageSquareQuote }].map((type) => (
                      <button key={type.id} type="button" onClick={() => setFormData({...formData, type: type.id})} className={`flex-1 py-3 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-all ${formData.type === type.id ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-600/20' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}><type.icon size={14} /> {type.label}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5"><label className="text-sm font-bold text-gray-700">رسالتك</label><textarea required rows={4} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all resize-none" placeholder="اكتب ملاحظاتك هنا..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} /></div>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? <><Loader2 className="animate-spin" /> جاري التحويل...</> : <><Send size={18} /> إرسال عبر واتساب</>}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-bounce"><ThumbsUp size={48} /></div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">شكراً لمشاركتك!</h3>
            <p className="text-gray-500 font-medium max-w-xs mx-auto mb-8">نقدر وقتك ورأيك. ملاحظاتك تساعدنا في تقديم الأفضل دائماً في Twist.</p>
            <button onClick={handleClose} className="px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">إغلاق</button>
          </div>
        )}
      </div>
    </div>
  );
};