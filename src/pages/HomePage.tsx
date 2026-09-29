import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MasterProfile } from '../types';
import { MasterCard } from '../components/MasterCard';
import {
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Clock,
  Star,
  ArrowRight,
  Wrench,
  Zap,
  Wind,
  Laptop,
  Hammer,
  Package,
  Cpu,
  Layers,
  Sparkle,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string, param?: any) => void;
  onViewMaster: (master: MasterProfile) => void;
  onStartChat: (master: MasterProfile) => void;
  onRequestOrder: (master: MasterProfile) => void;
  onOpenAIDiagnose: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onViewMaster,
  onStartChat,
  onRequestOrder,
  onOpenAIDiagnose,
}) => {
  const { masters } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('masters', { search: searchQuery });
  };

  const categories = [
    { name: 'Santexnik', icon: Wrench, count: '140+ usta', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { name: 'Elektrik', icon: Zap, count: '190+ usta', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { name: 'Konditsioner ustasi', icon: Wind, count: '85+ usta', color: 'bg-sky-50 text-sky-600 border-sky-200' },
    { name: 'Kompyuter ustasi', icon: Laptop, count: '110+ usta', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    { name: 'Quruvchi va pardozchi', icon: Hammer, count: '230+ usta', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { name: 'Mebel ustasi', icon: Package, count: '95+ usta', color: 'bg-orange-50 text-orange-600 border-orange-200' },
    { name: 'Maishiy texnika ustasi', icon: Cpu, count: '120+ usta', color: 'bg-rose-50 text-rose-600 border-rose-200' },
    { name: 'Boshqa', icon: Layers, count: '60+ usta', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  ];

  // Top masters (sorted by rating and review count)
  const topMasters = [...masters].sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount).slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-white pt-8 sm:pt-16 pb-12 sm:pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>O‘zbekistondagi #1 Usta va Mijozlar Platformasi</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Kerakli ustani <span className="text-blue-600">tez va oson</span> toping
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Uy, ofis va biznesingiz uchun ishonchli ustalarni toping, solishtiring va ular bilan bevosita bog‘laning.
            </p>

            {/* Main Search Box */}
            <div className="pt-2 max-w-2xl mx-auto">
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white p-2 rounded-2xl shadow-xl shadow-blue-500/10 border border-slate-200/90 flex flex-col sm:flex-row items-center gap-2"
              >
                <div className="flex-1 flex items-center gap-3 px-3 w-full">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Qanday usta kerak? (Masalan: santexnik, kran ta'miri, elektrik...)"
                    className="w-full py-2.5 text-sm sm:text-base text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer whitespace-nowrap"
                >
                  Usta topish
                </button>
              </form>

              {/* AI Helper Callout */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-xs text-slate-500">Muammoni qanday ifodalashni bilmayapsizmi?</span>
                <button
                  type="button"
                  onClick={onOpenAIDiagnose}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Qaysi usta kerakligini aniqlash (AI)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Popular Categories Grid */}
          <div className="mt-14 sm:mt-20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Ommabop xizmatlar</h2>
                <p className="text-xs sm:text-sm text-slate-500">Eng ko‘p chaqiriladigan mutaxassisliklar</p>
              </div>
              <button
                onClick={() => onNavigate('categories')}
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Barcha xizmatlar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
              {categories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onNavigate('masters', { category: cat.name })}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all flex flex-col items-center text-center group cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform ${cat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {cat.name}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">{cat.count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Qulay va shaffof</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Qanday ishlaydi?</h2>
          <p className="text-slate-600 text-sm sm:text-base">
            UstaTop orqali usta topish va buyurtma berish 4 ta oddiy qadamdan iborat
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:shadow-md transition-shadow relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Xizmatni tanlang</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Santexnik, elektrik yoki boshqa sohadagi muammoni belgilang yoki qidiruv orqali toping.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:shadow-md transition-shadow relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Ustalarni solishtiring</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Haqiqiy mijozlar sharhlari, reyting, narxlar va portfolio ishlarini ko‘rib chiqing.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:shadow-md transition-shadow relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Usta bilan bog‘laning</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ichki chat orqali yozishing, muammo rasmini yuboring yoki to‘g‘ridan-to‘g‘ri buyurtma bering.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:shadow-md transition-shadow relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-black text-lg flex items-center justify-center mb-4">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Ishni yakunlang va baho bering</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ish sifatli bajarilgach, buyurtmani tasdiqlang va ustaga adolatli baho bering.
            </p>
          </div>
        </div>
      </section>

      {/* Top Ustalar Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Eng yuqori baholangan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Top ustalar</h2>
            <p className="text-xs sm:text-sm text-slate-500">Mijozlar tomonidan eng ko‘p ijobiy fikr olgan mutaxassislar</p>
          </div>
          <button
            onClick={() => onNavigate('masters')}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl text-sm transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>Barcha ustalarni ko‘rish ({masters.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topMasters.map((m) => (
            <MasterCard
              key={m.userId}
              master={m}
              onViewProfile={onViewMaster}
              onStartChat={onStartChat}
              onRequestOrder={onRequestOrder}
            />
          ))}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden relative">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Xavfsizlik va Sifat
            </span>
            <h2 className="text-2xl sm:text-4xl font-black">
              Biz faqat tekshirilgan va tajribali ustalarni tavsiya qilamiz
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Platformamizdagi har bir tasdiqlangan usta shaxsiy pasport va malaka sertifikatlarini taqdim etadi. Ochiq baholash tizimi esa sifatni kafolatlaydi.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('masters')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-500/30 cursor-pointer"
              >
                Hozir usta chaqirish
              </button>
              <button
                onClick={() => onNavigate('register', { defaultRole: 'master' })}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-all border border-white/20 cursor-pointer"
              >
                Usta sifatida ro‘yxatdan o‘tish
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
