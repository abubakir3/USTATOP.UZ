import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { Star, X, Send } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, order }) => {
  const { addReview, showToast } = useApp();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Iltimos, sharh matnini yozing', 'error');
      return;
    }

    addReview(order.id, rating, comment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/40">
          <div className="flex items-center gap-3">
            <img
              src={order.masterAvatar}
              alt={order.masterName}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-200"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-base">{order.masterName}ga baho bering</h3>
              <p className="text-xs text-slate-500">{order.serviceTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Star selector */}
          <div className="text-center">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Xizmat sifatini baholang
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-slate-300 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-sm font-bold text-slate-700 mt-2 block">
              {rating === 5 && '⭐️⭐️⭐️⭐️⭐️ A‘lo darajada!'}
              {rating === 4 && '⭐️⭐️⭐️⭐️ Juda yaxshi'}
              {rating === 3 && '⭐️⭐️⭐️ Qoniqarli'}
              {rating === 2 && '⭐️⭐️ Yaxshi emas'}
              {rating === 1 && '⭐️ Qoniqarsiz'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Fikringiz (boshqa mijozlar uchun foydali bo‘ladi) *
            </label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Usta o‘z vaqtida keldimi? Ish sifatidan qoniqdingizmi? Narxi qanday bo‘ldi?"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-700 font-medium rounded-xl text-sm hover:bg-slate-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20"
            >
              <Send className="w-4 h-4" />
              Sharh qoldirish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
