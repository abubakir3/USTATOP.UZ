import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, MasterProfile } from '../types';
import { MasterCard } from '../components/MasterCard';
import {
  Briefcase,
  Search,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  ArrowRight,
  Heart,
  DollarSign,
  MapPin,
  Calendar,
  XCircle,
} from 'lucide-react';

interface CustomerDashboardProps {
  onNavigate: (tab: string, param?: any) => void;
  onViewMaster: (master: MasterProfile) => void;
  onStartChat: (master: MasterProfile) => void;
  onRequestOrder: (master: MasterProfile) => void;
  onOpenReviewModal: (order: Order) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onNavigate,
  onViewMaster,
  onStartChat,
  onRequestOrder,
  onOpenReviewModal,
}) => {
  const {
    currentUser,
    orders,
    masters,
    favorites,
    updateOrderStatus,
    acceptProposedPrice,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'favorites'>('all');

  // Customer orders
  const myOrders = orders.filter((o) => o.customerId === currentUser?.id);
  const activeOrders = myOrders.filter((o) => ['yangi', 'korib_chiqilmoqda', 'qabul_qilindi', 'kelishilgan', 'jarayonda'].includes(o.status));
  const completedOrders = myOrders.filter((o) => o.status === 'yakunlandi');

  // Saved masters
  const savedMasters = masters.filter((m) => favorites.includes(m.userId));

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'yangi':
        return <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">Yangi so‘rov</span>;
      case 'korib_chiqilmoqda':
        return <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">Ko‘rib chiqilmoqda (Narx taklifi)</span>;
      case 'qabul_qilindi':
      case 'kelishilgan':
        return <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold">Qabul qilindi</span>;
      case 'jarayonda':
        return <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">Jarayonda</span>;
      case 'yakunlandi':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">Yakunlandi</span>;
      case 'bekor_qilindi':
        return <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold">Bekor qilindi</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Mijoz kabineti</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Xush kelibsiz, {currentUser?.name}!
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm">
            Buyurtmalaringiz, saqlangan ustalar va xabarlarni shu yerdan kuzatib boring.
          </p>
        </div>

        {/* Quick Action buttons */}
        <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
          <button
            onClick={() => onNavigate('masters')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-blue-700 font-bold rounded-xl text-xs sm:text-sm shadow-md hover:bg-blue-50 transition-all cursor-pointer whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            <span>Usta topish</span>
          </button>
          <button
            onClick={() => onNavigate('messages')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600/60 border border-white/20 hover:bg-blue-600 text-white font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chatlarim</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Jami buyurtmalar</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{myOrders.length}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Faol jarayondagilar</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">{activeOrders.length}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Yakunlanganlar</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{completedOrders.length}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Saqlangan ustalar</span>
          <span className="text-2xl font-black text-rose-500 mt-1 block">{savedMasters.length}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Barcha buyurtmalar ({myOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            activeTab === 'active' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Faol buyurtmalar ({activeOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            activeTab === 'completed' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Yakunlanganlar ({completedOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
            activeTab === 'favorites' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Saqlangan ustalar ({savedMasters.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'favorites' ? (
        /* Saved Masters */
        <div>
          {savedMasters.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">Hozircha saqlangan ustalar yo‘q</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Usta kartalaridagi yurakcha belgisini bosib, yoqtirgan ustalaringizni bu yerda saqlashingiz mumkin.
              </p>
              <button
                onClick={() => onNavigate('masters')}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
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
      ) : (
        /* Orders List */
        <div className="space-y-4">
          {myOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">Hozircha buyurtmalaringiz yo‘q</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Siz hali birorta usta xizmatiga murojaat qilmadingiz. Usta topib, ilk buyurtmangizni yuboring.
              </p>
              <button
                onClick={() => onNavigate('masters')}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Usta topish
              </button>
            </div>
          ) : (
            (activeTab === 'all'
              ? myOrders
              : activeTab === 'active'
              ? activeOrders
              : completedOrders
            ).map((order) => {
              const master = masters.find((m) => m.userId === order.masterId);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:border-blue-300 transition-all space-y-4"
                >
                  {/* Top row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={order.masterAvatar}
                        alt={order.masterName}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 cursor-pointer"
                        onClick={() => master && onViewMaster(master)}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3
                            onClick={() => master && onViewMaster(master)}
                            className="font-bold text-slate-900 text-base hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            {order.masterName}
                          </h3>
                          <span className="text-xs text-slate-400">• {order.masterProfession}</span>
                        </div>
                        <span className="text-xs font-semibold text-blue-600 block mt-0.5">
                          {order.serviceTitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Problem & Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="md:col-span-2 space-y-2">
                      <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">
                        <strong className="text-slate-900 block mb-1">Muammo tavsifi:</strong>
                        {order.description}
                      </p>

                      {/* Location & Time */}
                      <div className="flex flex-wrap gap-4 text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {order.city}, {order.district}, {order.address}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {order.preferredDate} ({order.preferredTime})
                        </span>
                      </div>
                    </div>

                    {/* Pricing box */}
                    <div className="bg-slate-50 p-3.5 rounded-xl flex flex-col justify-between space-y-2">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Kutilgan byudjet:</span>
                        <span className="text-sm font-bold text-slate-800">
                          {order.budget ? `${order.budget.toLocaleString()} so‘m` : 'Kelishiladi'}
                        </span>
                      </div>

                      {order.proposedPrice && (
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                          <span className="text-[10px] text-amber-800 font-bold block">
                            Usta taklif qilgan narx:
                          </span>
                          <span className="text-base font-black text-amber-900">
                            {order.proposedPrice.toLocaleString()} so‘m
                          </span>
                          {order.status === 'korib_chiqilmoqda' && (
                            <button
                              onClick={() => acceptProposedPrice(order.id)}
                              className="w-full mt-2 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-sm transition-colors"
                            >
                              Narxni qabul qilish
                            </button>
                          )}
                        </div>
                      )}

                      {order.finalPrice && (
                        <div>
                          <span className="text-[11px] text-emerald-700 font-medium block">
                            Kelishilgan yakuniy narx:
                          </span>
                          <span className="text-base font-extrabold text-emerald-700">
                            {order.finalPrice.toLocaleString()} so‘m
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400">
                      Yuborilgan sana: {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
                    </span>

                    <div className="flex items-center gap-2">
                      {master && (
                        <button
                          onClick={() => onStartChat(master)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-xs font-semibold transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Usta bilan chat
                        </button>
                      )}

                      {order.status === 'yakunlandi' && !order.hasReview && (
                        <button
                          onClick={() => onOpenReviewModal(order)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-colors"
                        >
                          <Star className="w-3.5 h-3.5 fill-white" />
                          Baho berish
                        </button>
                      )}

                      {order.status === 'yakunlandi' && order.hasReview && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Baho berilgan
                        </span>
                      )}

                      {['yangi', 'korib_chiqilmoqda'].includes(order.status) && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'bekor_qilindi', 'Mijoz tomonidan bekor qilindi')}
                          className="flex items-center gap-1 text-xs text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl font-medium transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Bekor qilish
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
