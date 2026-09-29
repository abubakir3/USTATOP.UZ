import React from 'react';
import { useApp } from '../context/AppContext';
import { MasterProfile } from '../types';
import { MasterCard } from '../components/MasterCard';
import { Heart, Search, ArrowRight } from 'lucide-react';

interface FavoritesPageProps {
  onViewMaster: (master: MasterProfile) => void;
  onStartChat: (master: MasterProfile) => void;
  onRequestOrder: (master: MasterProfile) => void;
  onNavigate: (tab: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  onViewMaster,
  onStartChat,
  onRequestOrder,
  onNavigate,
}) => {
  const { masters, favorites } = useApp();

  const savedMasters = masters.filter((m) => favorites.includes(m.userId));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>Tanlangan mutaxassislar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Saqlangan ustalar ({savedMasters.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Siz yoqtirgan va keyinroq murojaat qilish uchun saqlab qo‘ygan ustalar ro‘yxati
          </p>
        </div>

        <button
          onClick={() => onNavigate('masters')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <span>Ko‘proq usta qidirish</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {savedMasters.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-slate-900">
              Hozircha saqlangan ustalar yo‘q
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Qidiruv paytida usta kartalaridagi yurakcha (♡) belgisini bosing va o‘zingizga ma‘qul kelgan ustalarni keyinroq tez topish uchun bu yerda saqlang.
            </p>
          </div>
          <button
            onClick={() => onNavigate('masters')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            Ustalarni ko‘rish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedMasters.map((master) => (
            <MasterCard
              key={master.userId}
              master={master}
              onViewProfile={onViewMaster}
              onStartChat={onStartChat}
              onRequestOrder={onRequestOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
};
