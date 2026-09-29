import React from 'react';
import { MasterProfile } from '../types';
import { Star, ShieldCheck, MapPin, Briefcase, Heart, MessageSquare, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MasterCardProps {
  master: MasterProfile;
  onViewProfile: (master: MasterProfile) => void;
  onStartChat: (master: MasterProfile) => void;
  onRequestOrder: (master: MasterProfile) => void;
}

export const MasterCard: React.FC<MasterCardProps> = ({
  master,
  onViewProfile,
  onStartChat,
  onRequestOrder,
}) => {
  const { toggleFavorite, isFavorite } = useApp();
  const favorited = isFavorite(master.userId);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Availability & Favorite row */}
      <div className="p-5 pb-3 flex items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={master.avatar}
            alt={master.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-blue-100 transition-all"
          />
          {master.isAvailable ? (
            <span
              title="Bugun ishlayapti"
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full ring-1 ring-emerald-200"
            />
          ) : (
            <span
              title="Hozirda band"
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 border-2 border-white rounded-full ring-1 ring-amber-200"
            />
          )}
        </div>

        {/* Header Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h3
              onClick={() => onViewProfile(master)}
              className="font-bold text-slate-900 text-lg hover:text-blue-600 transition-colors truncate cursor-pointer flex items-center gap-1.5"
            >
              {master.name}
              {master.isVerified && (
                <span title="Tasdiqlangan mutaxassis" className="inline-flex items-center">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 inline-block" />
                </span>
              )}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(master.userId);
              }}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-colors shrink-0"
              title={favorited ? 'Saqlanganlardan o‘chirish' : 'Saqlab qo‘yish'}
            >
              <Heart
                className={`w-5 h-5 transition-transform active:scale-125 ${
                  favorited ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
            </button>
          </div>

          <p className="text-xs font-semibold text-blue-600 truncate mt-0.5">
            {master.profession}
          </p>

          {/* Rating & reviews */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-sm font-bold text-slate-900">{master.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-500">({master.reviewCount} ta sharh)</span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-600 font-medium">
              {master.completedOrdersCount || 0}+ buyurtma
            </span>
          </div>
        </div>
      </div>

      {/* Meta details */}
      <div className="px-5 py-2.5 space-y-1.5 text-xs text-slate-600 border-t border-slate-100/80 bg-slate-50/40">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-600 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {master.city}, {master.district}
          </span>
          <span className="flex items-center gap-1 font-medium text-slate-700 shrink-0">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            {master.experienceYears} yil tajriba
          </span>
        </div>
      </div>

      {/* Bio excerpt */}
      <div className="px-5 py-3 text-xs text-slate-600 line-clamp-2 leading-relaxed flex-1">
        {master.bio}
      </div>

      {/* Services tags */}
      {master.additionalServices && master.additionalServices.length > 0 && (
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {master.additionalServices.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
            >
              {tag}
            </span>
          ))}
          {master.additionalServices.length > 3 && (
            <span className="text-[11px] text-slate-400 font-medium">
              +{master.additionalServices.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer with Price and Buttons */}
      <div className="p-4 pt-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <div>
          <span className="text-[11px] text-slate-500 block leading-tight">Boshlang‘ich narx</span>
          <span className="text-base font-bold text-slate-900">
            {master.startingPrice.toLocaleString()} <span className="text-xs font-normal text-slate-500">so‘mdan</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onStartChat(master)}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
            title="Xabar yozish"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewProfile(master)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
          >
            <span>Profil</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
