import React, { useState } from 'react';
import { MasterProfile, ServiceItem } from '../types';
import { useApp } from '../context/AppContext';
import {
  Star,
  ShieldCheck,
  MapPin,
  Briefcase,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  Heart,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  X,
} from 'lucide-react';

interface MasterProfilePageProps {
  master: MasterProfile;
  onStartChat: (master: MasterProfile) => void;
  onRequestOrder: (master: MasterProfile, service?: ServiceItem) => void;
  onOpenReport: (master: MasterProfile) => void;
  onBack: () => void;
}

export const MasterProfilePage: React.FC<MasterProfilePageProps> = ({
  master,
  onStartChat,
  onRequestOrder,
  onOpenReport,
  onBack,
}) => {
  const { reviews, toggleFavorite, isFavorite, showToast } = useApp();
  const favorited = isFavorite(master.userId);

  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'portfolio' | 'reviews' | 'hours'>('about');
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [selectedPortfolioImage, setSelectedPortfolioImage] = useState<string | null>(null);

  // Reviews for this master
  const masterReviews = reviews.filter((r) => r.masterId === master.userId);

  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = masterReviews.filter((r) => Math.round(r.rating) === stars).length;
    const percentage = masterReviews.length > 0 ? (count / masterReviews.length) * 100 : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Back */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <span>← Barcha ustalarga qaytish</span>
        </button>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={master.avatar}
                alt={master.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-blue-50 shadow-md"
              />
              {master.isAvailable ? (
                <span
                  title="Bugun ishlayapti"
                  className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full ring-2 ring-emerald-200"
                />
              ) : (
                <span
                  title="Hozirda band"
                  className="absolute bottom-1 right-1 w-5 h-5 bg-amber-500 border-2 border-white rounded-full ring-2 ring-amber-200"
                />
              )}
            </div>

            {/* Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {master.name}
                </h1>
                {master.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Tasdiqlangan
                  </span>
                )}
                {master.isAvailable ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                    Bugun ishlayapti
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                    Band
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base font-semibold text-blue-600">
                {master.profession}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 pt-1">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{master.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">
                    ({master.reviewCount} ta sharh)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{master.city}, {master.district}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span>{master.experienceYears} yil tajriba</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => toggleFavorite(master.userId)}
              className={`p-3 rounded-2xl border transition-colors ${
                favorited
                  ? 'border-rose-200 bg-rose-50 text-rose-500'
                  : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
              title="Saqlab qo‘yish"
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={() => setShowPhoneModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              <span>Telefon qilish</span>
            </button>

            <button
              onClick={() => onStartChat(master)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Xabar yozish</span>
            </button>

            <button
              onClick={() => onRequestOrder(master)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              <span>Buyurtma berish</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 mt-8 pt-6 border-t border-slate-100 overflow-x-auto no-scrollbar text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-xl transition-colors shrink-0 cursor-pointer ${
              activeTab === 'about'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Men haqimda
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-xl transition-colors shrink-0 cursor-pointer ${
              activeTab === 'services'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Xizmatlarim ({master.services.length})
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-xl transition-colors shrink-0 cursor-pointer ${
              activeTab === 'portfolio'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Portfolio ({master.portfolio.length})
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`px-4 py-2 rounded-xl transition-colors shrink-0 cursor-pointer ${
              activeTab === 'hours'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Ish vaqti & Hudud
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl transition-colors shrink-0 cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Fikrlar ({masterReviews.length})
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* TAB: Men haqimda */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Men haqimda</h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                  {master.bio}
                </p>

                {master.additionalServices && master.additionalServices.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Qo‘shimcha ko‘nikmalar
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {master.additionalServices.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Preview of Services */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">Asosiy xizmatlar</h2>
                  <button
                    onClick={() => setActiveTab('services')}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Barchasini ko‘rish →
                  </button>
                </div>

                <div className="space-y-3">
                  {master.services.slice(0, 3).map((srv) => (
                    <div
                      key={srv.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{srv.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{srv.description}</p>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          Taxminiy vaqt: {srv.estimatedDuration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <span className="text-sm font-bold text-slate-900">
                          {srv.price.toLocaleString()} so‘m / {srv.priceUnit}
                        </span>
                        <button
                          onClick={() => onRequestOrder(master, srv)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
                        >
                          Tanlash
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Xizmatlarim */}
          {activeTab === 'services' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Taklif etilayotgan xizmatlar</h2>
              <div className="space-y-4">
                {master.services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-base">{srv.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{srv.description}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {srv.estimatedDuration}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                          Boshlanish narxi
                        </span>
                        <span className="text-base font-extrabold text-slate-900">
                          {srv.price.toLocaleString()} so‘m
                        </span>
                        <span className="text-xs text-slate-500 block">/ {srv.priceUnit}</span>
                      </div>
                      <button
                        onClick={() => onRequestOrder(master, srv)}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer whitespace-nowrap"
                      >
                        Buyurtma berish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Portfolio */}
          {activeTab === 'portfolio' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Bajarilgan ishlar (Portfolio)</h2>
                <p className="text-xs text-slate-500">Usta tomonidan avval bajarilgan real ishlar fotosuratlari</p>
              </div>

              {master.portfolio.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Hozircha portfolio suratlari yuklanmagan.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {master.portfolio.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPortfolioImage(item.imageUrl)}
                      className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col hover:shadow-lg transition-all"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <ExternalLink className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="p-4 space-y-1">
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        {item.description && (
                          <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                        )}
                        {item.completedDate && (
                          <span className="text-[10px] text-slate-400 block pt-1">
                            Yakunlangan sana: {item.completedDate}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Ish vaqti */}
          {activeTab === 'hours' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Ish jadvali va Hudud</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 font-bold">Hafta kuni</th>
                      <th className="py-2.5 font-bold">Holat</th>
                      <th className="py-2.5 font-bold">Ish vaqti</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Object.entries(master.workingHours).map(([day, schedule]) => (
                      <tr key={day} className="hover:bg-slate-50/50">
                        <td className="py-3 font-semibold text-slate-800">{day}</td>
                        <td className="py-3">
                          {schedule.working ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Ish kuni
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                              Dam olish kuni
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-slate-600">
                          {schedule.working ? `${schedule.start} — ${schedule.end}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">Xizmat ko‘rsatish hududi</h3>
                <p className="text-xs text-slate-600">
                  Asosiy joylashuv: <strong className="text-slate-800">{master.city}, {master.district}</strong>
                </p>
                <p className="text-xs text-slate-600">
                  Xizmat ko‘rsatish radiusi: <strong className="text-slate-800">{master.serviceRadius} km gacha</strong>
                </p>
              </div>
            </div>
          )}

          {/* TAB: Fikrlar va Sharhlar */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Mijozlar fikrlari</h2>
                  <p className="text-xs text-slate-500">
                    Barcha sharhlar faqat ishni yakunlagan haqiqiy mijozlar tomonidan qoldiriladi
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-slate-900">
                    {master.rating.toFixed(1)}
                  </span>
                  <div>
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">
                      {masterReviews.length} ta sharh asosida
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating distribution progress bars */}
              <div className="space-y-2 max-w-md">
                {ratingDistribution.map((row) => (
                  <div key={row.stars} className="flex items-center gap-2 text-xs">
                    <span className="w-12 text-slate-600 font-semibold">{row.stars} yulduz</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${row.percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-slate-400">{row.count}</span>
                  </div>
                ))}
              </div>

              {/* Reviews list */}
              <div className="space-y-4 pt-4">
                {masterReviews.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    Hozircha sharhlar yo‘q. Birinchi bo‘lib buyurtma bering!
                  </div>
                ) : (
                  masterReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              rev.customerAvatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                            }
                            alt={rev.customerName}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                              {rev.customerName}
                            </h4>
                            <span className="text-[10px] text-slate-400">
                              {new Date(rev.createdAt).toLocaleDateString('uz-UZ')}
                            </span>
                          </div>
                        </div>

                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {rev.comment}
                      </p>

                      {rev.masterReply && (
                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                          <span className="font-bold text-blue-600">Ustaning javobi:</span>
                          <p className="text-slate-600">{rev.masterReply}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Quick info & Report */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base">Usta haqida qisqacha</h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Mutaxassislik:</span>
                <span className="font-bold text-slate-800">{master.profession}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Umumiy tajriba:</span>
                <span className="font-bold text-slate-800">{master.experienceYears} yil</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Yakunlangan ishlar:</span>
                <span className="font-bold text-slate-800">{master.completedOrdersCount} ta</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">O‘rtacha reyting:</span>
                <span className="font-bold text-amber-500">★ {master.rating.toFixed(1)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Boshlang‘ich narx:</span>
                <span className="font-bold text-slate-900">{master.startingPrice.toLocaleString()} so‘mdan</span>
              </div>
            </div>

            <button
              onClick={() => onRequestOrder(master)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Ushbu ustaga buyurtma berish
            </button>
          </div>

          {/* Report button */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
            <button
              onClick={() => onOpenReport(master)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 font-medium transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Profil bo‘yicha shikoyat qilish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Phone Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Phone className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{master.name}</h3>
              <p className="text-xs text-slate-500">{master.profession}</p>
            </div>
            <div className="p-4 bg-slate-100 rounded-xl text-lg font-black text-slate-900 tracking-wider">
              {master.phone}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(master.phone);
                  showToast('Telefon raqami nusxalandi!', 'success');
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors"
              >
                Nusxalash
              </button>
              <button
                onClick={() => setShowPhoneModal(false)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Lightbox Modal */}
      {selectedPortfolioImage && (
        <div
          onClick={() => setSelectedPortfolioImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedPortfolioImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedPortfolioImage}
              alt="portfolio"
              className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
