import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, ServiceItem, PortfolioItem } from '../types';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Star,
  Users,
  Eye,
  Plus,
  Trash2,
  Edit,
  ShieldCheck,
  AlertCircle,
  MessageSquare,
  DollarSign,
  MapPin,
  Calendar,
  XCircle,
  Send,
  ImagePlus,
  Power,
} from 'lucide-react';

interface MasterDashboardProps {
  onNavigate: (tab: string, param?: any) => void;
  onOpenSetupWizard: () => void;
}

export const MasterDashboard: React.FC<MasterDashboardProps> = ({
  onNavigate,
  onOpenSetupWizard,
}) => {
  const {
    currentUser,
    currentMasterProfile,
    orders,
    reviews,
    conversations,
    updateMasterProfile,
    toggleMasterAvailability,
    addMasterService,
    deleteMasterService,
    addMasterPortfolio,
    deleteMasterPortfolio,
    submitMasterVerification,
    updateOrderStatus,
    proposeOrderPrice,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'services' | 'portfolio' | 'verification' | 'settings'>('orders');

  // New Service Modal State
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceUnit, setNewServiceUnit] = useState<ServiceItem['priceUnit']>('xizmat');
  const [newServiceDuration, setNewServiceDuration] = useState('1 soat');

  // New Portfolio Modal State
  const [showAddPortfolioModal, setShowAddPortfolioModal] = useState(false);
  const [newPortfolioTitle, setNewPortfolioTitle] = useState('');
  const [newPortfolioDesc, setNewPortfolioDesc] = useState('');
  const [newPortfolioImage, setNewPortfolioImage] = useState(
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
  );

  // Propose Price Modal State
  const [proposeModalOrder, setProposeModalOrder] = useState<Order | null>(null);
  const [proposedPriceInput, setProposedPriceInput] = useState('');

  // Verification Form State
  const [docType, setDocType] = useState('Pasport va mutaxassislik sertifikati');
  const [docNumber, setDocNumber] = useState('');

  if (!currentUser || currentUser.role !== 'master') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Siz usta profiliga kirmagansiz</h2>
        <p className="text-sm text-slate-500">Iltimos, usta sifatida tizimga kiring yoki ro‘yxatdan o‘ting.</p>
        <button
          onClick={() => onNavigate('login')}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Kirish sahifasi
        </button>
      </div>
    );
  }

  const masterOrders = orders.filter((o) => o.masterId === currentUser.id);
  const newRequests = masterOrders.filter((o) => ['yangi', 'korib_chiqilmoqda'].includes(o.status));
  const activeOrders = masterOrders.filter((o) => ['qabul_qilindi', 'kelishilgan', 'jarayonda'].includes(o.status));
  const completedOrders = masterOrders.filter((o) => o.status === 'yakunlandi');

  const unreadMessagesCount = conversations
    .filter((c) => c.masterId === currentUser.id)
    .reduce((sum, c) => sum + (c.unreadCountForMaster || 0), 0);

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    addMasterService({
      name: newServiceName,
      description: newServiceDesc,
      price: Number(newServicePrice) || 50000,
      priceUnit: newServiceUnit,
      estimatedDuration: newServiceDuration || '1 soat',
    });

    setNewServiceName('');
    setNewServiceDesc('');
    setNewServicePrice('');
    setShowAddServiceModal(false);
  };

  const handleCreatePortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolioTitle.trim()) return;

    addMasterPortfolio({
      title: newPortfolioTitle,
      description: newPortfolioDesc,
      imageUrl: newPortfolioImage,
    });

    setNewPortfolioTitle('');
    setNewPortfolioDesc('');
    setShowAddPortfolioModal(false);
  };

  const handleProposePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposeModalOrder || !proposedPriceInput) return;

    proposeOrderPrice(proposeModalOrder.id, Number(proposedPriceInput));
    setProposeModalOrder(null);
    setProposedPriceInput('');
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber.trim()) {
      showToast('Hujjat seriya va raqamini kiriting', 'error');
      return;
    }
    submitMasterVerification(docType, docNumber);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Availability Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentMasterProfile?.avatar || currentUser.profileImage}
            alt={currentUser.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-blue-100"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {currentUser.name}
              </h1>
              {currentMasterProfile?.isVerified && (
                <span title="Tasdiqlangan usta" className="inline-flex items-center">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-blue-600">
              {currentMasterProfile?.profession || 'Professional Mutaxassis'}
            </p>
            <p className="text-xs text-slate-500">
              {currentMasterProfile?.city}, {currentMasterProfile?.district}
            </p>
          </div>
        </div>

        {/* Availability Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 w-full sm:w-auto">
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block uppercase tracking-wider">
                Ish holati:
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                {currentMasterProfile?.isAvailable ? (
                  <span className="text-emerald-600 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    Bugun ishlayapman
                  </span>
                ) : (
                  <span className="text-amber-600 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Hozirda bandman
                  </span>
                )}
              </span>
            </div>

            <button
              onClick={() => toggleMasterAvailability(!currentMasterProfile?.isAvailable)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                currentMasterProfile?.isAvailable
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {currentMasterProfile?.isAvailable ? "Band qilish" : "Ishga tushirish"}
            </button>
          </div>

          <button
            onClick={onOpenSetupWizard}
            className="w-full sm:w-auto px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            Profilni to‘liq sozlash
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium block">Yangi so‘rovlar</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">{newRequests.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium block">Faol buyurtmalar</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{activeOrders.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium block">Yakunlanganlar</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{completedOrders.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium block">O‘qilmagan xabarlar</span>
          <span className="text-2xl font-black text-indigo-600 mt-1 block">{unreadMessagesCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium block">O‘rtacha reyting</span>
          <span className="text-2xl font-black text-amber-500 mt-1 block flex items-center gap-1">
            ★ {currentMasterProfile?.rating.toFixed(1) || '5.0'}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium block">Sharhlar soni</span>
          <span className="text-2xl font-black text-slate-800 mt-1 block">
            {currentMasterProfile?.reviewCount || 0} ta
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 cursor-pointer ${
            activeTab === 'orders' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Buyurtmalar ({masterOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 cursor-pointer ${
            activeTab === 'services' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Xizmatlarim ({currentMasterProfile?.services.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 cursor-pointer ${
            activeTab === 'portfolio' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Portfolio ({currentMasterProfile?.portfolio.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'verification' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Tasdiqlash holati
        </button>
      </div>

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {masterOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
              <Clock className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">Hozircha buyurtmalar yo‘q</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Mijozlar sizga buyurtma yuborishganda bu yerda paydo bo‘ladi va bildirishnoma olasiz.
              </p>
            </div>
          ) : (
            masterOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:border-blue-300 transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-blue-600 block uppercase tracking-wider">
                      {order.serviceTitle}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                      Mijoz: {order.customerName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tel: <strong className="text-slate-800">{order.customerPhone}</strong>
                    </p>
                  </div>

                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'yangi'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'jarayonda'
                          ? 'bg-indigo-100 text-indigo-800'
                          : order.status === 'yakunlandi'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'bekor_qilindi'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status === 'yangi' && 'Yangi so‘rov'}
                      {order.status === 'korib_chiqilmoqda' && 'Narx taklifingiz kutilmoqda'}
                      {order.status === 'qabul_qilindi' && 'Qabul qilindi'}
                      {order.status === 'jarayonda' && 'Jarayonda'}
                      {order.status === 'yakunlandi' && 'Yakunlangan'}
                      {order.status === 'bekor_qilindi' && 'Bekor qilingan'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="md:col-span-2 space-y-2">
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <span className="font-bold text-slate-900 block mb-1">Mijoz tavsifi:</span>
                      <p className="text-slate-700 leading-relaxed">{order.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {order.city}, {order.district}, {order.address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Qulay vaqt: {order.preferredDate} ({order.preferredTime})
                      </span>
                    </div>
                  </div>

                  {/* Financials */}
                  <div className="bg-slate-50 p-3.5 rounded-xl space-y-2">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Mijoz byudjeti:</span>
                      <span className="text-sm font-bold text-slate-800">
                        {order.budget ? `${order.budget.toLocaleString()} so‘m` : 'Ko‘rsatilmagan'}
                      </span>
                    </div>

                    {order.proposedPrice && (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <span className="text-[10px] text-amber-800 font-bold block">
                          Siz taklif qilgan narx:
                        </span>
                        <span className="text-sm font-bold text-amber-900">
                          {order.proposedPrice.toLocaleString()} so‘m
                        </span>
                      </div>
                    )}

                    {order.finalPrice && (
                      <div>
                        <span className="text-[11px] text-emerald-700 font-medium block">
                          Yakuniy kelishilgan narx:
                        </span>
                        <span className="text-base font-extrabold text-emerald-700">
                          {order.finalPrice.toLocaleString()} so‘m
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Master Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => onNavigate('messages')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:text-blue-600 text-xs font-semibold"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Mijoz bilan chat
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    {order.status === 'yangi' && (
                      <>
                        <button
                          onClick={() => {
                            setProposeModalOrder(order);
                            setProposedPriceInput(order.budget ? String(order.budget) : '100000');
                          }}
                          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Narx taklif qilish
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'qabul_qilindi')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Qabul qilish
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'bekor_qilindi', 'Usta tomonidan rad etildi')}
                          className="px-3 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-xl text-xs font-medium transition-colors"
                        >
                          Rad etish
                        </button>
                      </>
                    )}

                    {['qabul_qilindi', 'kelishilgan'].includes(order.status) && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'jarayonda')}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Ishni boshlash (Jarayonda)
                      </button>
                    )}

                    {order.status === 'jarayonda' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'yakunlandi')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-emerald-600/20"
                      >
                        ✓ Ishni yakunlash
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Services Management */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Mening xizmatlarim</h2>
              <p className="text-xs text-slate-500">Mijozlarga taklif etayotgan xizmatlaringiz ro‘yxati</p>
            </div>
            <button
              onClick={() => setShowAddServiceModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Yangi xizmat qo‘shish
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentMasterProfile?.services.map((srv) => (
              <div
                key={srv.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{srv.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{srv.description}</p>
                  <span className="text-[11px] text-slate-400 mt-2 block">
                    Taxminiy vaqt: {srv.estimatedDuration}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-base font-extrabold text-blue-600">
                    {srv.price.toLocaleString()} so‘m / {srv.priceUnit}
                  </span>
                  <button
                    onClick={() => deleteMasterService(srv.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Xizmatni o‘chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Portfolio */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Portfolio (Mening ishlarim)</h2>
              <p className="text-xs text-slate-500">Bajarilgan ishlaringiz fotosuratlarini qo‘shing</p>
            </div>
            <button
              onClick={() => setShowAddPortfolioModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Rasm qo‘shish
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentMasterProfile?.portfolio.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col"
              >
                <div className="h-44 overflow-hidden relative">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => deleteMasterPortfolio(item.id)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-rose-600 text-white rounded-full transition-colors"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Verification */}
      {activeTab === 'verification' && (
        <div className="max-w-2xl bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Usta hisobini tasdiqlash (Verifikatsiya)</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Tasdiqlangan ustalar profillarida maxsus ishonch nishoni (ko‘k tasdiq) paydo bo‘ladi va qidiruvda yuqoriroq chiqadi.
              </p>
            </div>
          </div>

          {/* Current status */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Tasdiqlash holati:</span>
            {currentMasterProfile?.verificationStatus === 'verified' && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tasdiqlangan mutaxassis
              </span>
            )}
            {currentMasterProfile?.verificationStatus === 'pending' && (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Moderator tomonidan kutilmoqda
              </span>
            )}
            {currentMasterProfile?.verificationStatus === 'rejected' && (
              <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" />
                Rad etilgan (qayta topshiring)
              </span>
            )}
            {(!currentMasterProfile?.verificationStatus || currentMasterProfile?.verificationStatus === 'none') && (
              <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-semibold">
                Hujjat topshirilmagan
              </span>
            )}
          </div>

          {/* Form */}
          {currentMasterProfile?.verificationStatus !== 'verified' && (
            <form onSubmit={handleVerificationSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Hujjat turi
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Pasport va mutaxassislik sertifikati">Pasport va mutaxassislik sertifikati</option>
                  <option value="Yakka tartibdagi tadbirkor (YTT) guvohnomasi">YTT guvohnomasi</option>
                  <option value="Haydovchilik guvohnomasi va texnik pasport">Haydovchilik guvohnomasi</option>
                  <option value="Kollej yoki OTM kasbiy diplomi">Kasbiy ta‘lim diplomi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Hujjat seriya va raqami *
                </label>
                <input
                  type="text"
                  required
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="Masalan: AA 1234567"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Tasdiqlash uchun yuborish
              </button>
            </form>
          )}
        </div>
      )}

      {/* MODAL: Propose Price */}
      {proposeModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Yangi narx taklif qilish</h3>
            <p className="text-xs text-slate-500">
              {proposeModalOrder.serviceTitle} bo‘yicha o‘z narxingizni kiriting:
            </p>

            <form onSubmit={handleProposePriceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Narx (so‘mda):
                </label>
                <input
                  type="number"
                  required
                  value={proposedPriceInput}
                  onChange={(e) => setProposedPriceInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setProposeModalOrder(null)}
                  className="flex-1 py-2 px-3 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                >
                  Yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Service */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Yangi xizmat qo‘shish</h3>
            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Xizmat nomi *</label>
                <input
                  type="text"
                  required
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="Masalan: Kranni almashtirish"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tavsif</label>
                <textarea
                  rows={2}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Xizmat haqida qisqacha ma'lumot"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Narxi (so‘m)</label>
                  <input
                    type="number"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    placeholder="Masalan: 60 000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">O‘lchov birligi</label>
                  <select
                    value={newServiceUnit}
                    onChange={(e) => setNewServiceUnit(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="xizmat">xizmatiga</option>
                    <option value="soat">soatiga</option>
                    <option value="m²">m² ga</option>
                    <option value="nuqta">nuqtasiga</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Taxminiy davomiyligi</label>
                <input
                  type="text"
                  value={newServiceDuration}
                  onChange={(e) => setNewServiceDuration(e.target.value)}
                  placeholder="Masalan: 1 soat"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="flex-1 py-2 px-3 border border-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Qo‘shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Portfolio */}
      {showAddPortfolioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Portfolio rasmi qo‘shish</h3>
            <form onSubmit={handleCreatePortfolio} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ish sarlavhasi *</label>
                <input
                  type="text"
                  required
                  value={newPortfolioTitle}
                  onChange={(e) => setNewPortfolioTitle(e.target.value)}
                  placeholder="Masalan: Toshkent Siti kvartirasidagi montaj"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Qisqacha tavsif</label>
                <textarea
                  rows={2}
                  value={newPortfolioDesc}
                  onChange={(e) => setNewPortfolioDesc(e.target.value)}
                  placeholder="Qanday ish bajarildi?"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rasm havolasi (URL)</label>
                <input
                  type="text"
                  value={newPortfolioImage}
                  onChange={(e) => setNewPortfolioImage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="mt-2 h-28 rounded-xl overflow-hidden border border-slate-200">
                  <img src={newPortfolioImage} alt="preview" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPortfolioModal(false)}
                  className="flex-1 py-2 px-3 border border-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
