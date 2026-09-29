import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Users,
  Wrench,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  BarChart3,
  Calendar,
  Lock,
  Unlock,
  Check,
  Trash2,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    currentUser,
    users,
    masters,
    orders,
    reviews,
    reports,
    adminApproveVerification,
    adminRejectVerification,
    toggleUserSuspension,
    resolveReport,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stats' | 'verification' | 'users' | 'reports' | 'orders'>('stats');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');

  // Verification requests
  const pendingVerifications = masters.filter((m) => m.verificationStatus === 'pending');

  // Filtered users
  const filteredUsers = users.filter((u) => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.phone.includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  const totalUsers = users.length;
  const totalMasters = masters.length;
  const totalCustomers = users.filter((u) => u.role === 'customer').length;
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === 'yakunlandi').length;
  const activeOrders = orders.filter((o) => ['yangi', 'jarayonda', 'qabul_qilindi'].includes(o.status)).length;
  const totalReviews = reviews.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <ShieldCheck className="w-8 h-8 text-purple-300" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-purple-200">
              Boshqaruv markazi
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">Admin Dashboard</h1>
            <p className="text-purple-200 text-xs sm:text-sm">
              Platforma foydalanuvchilari, ustalar verifikatsiyasi va shikoyatlarni boshqaring.
            </p>
          </div>
        </div>

        {pendingVerifications.length > 0 && (
          <button
            onClick={() => setActiveTab('verification')}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer animate-bounce"
          >
            <span>{pendingVerifications.length} ta tasdiqlash arizasi kutmoqda</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 cursor-pointer ${
            activeTab === 'stats' ? 'bg-purple-700 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Statistika & Ko‘rsatkichlar
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 cursor-pointer relative ${
            activeTab === 'verification' ? 'bg-purple-700 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Ustalar verifikatsiyasi
          {pendingVerifications.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-bold">
              {pendingVerifications.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 cursor-pointer ${
            activeTab === 'users' ? 'bg-purple-700 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Foydalanuvchilar ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 cursor-pointer relative ${
            activeTab === 'reports' ? 'bg-purple-700 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Shikoyatlar ({reports.filter((r) => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 cursor-pointer ${
            activeTab === 'orders' ? 'bg-purple-700 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Buyurtmalar ({orders.length})
        </button>
      </div>

      {/* TAB: STATS */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block">Jami foydalanuvchilar</span>
              <span className="text-3xl font-black text-slate-900 mt-1 block">{totalUsers}</span>
              <span className="text-[11px] text-emerald-600 mt-1 block font-medium">↑ +14% bu oyda</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block">Ro‘yxatdan o‘tgan ustalar</span>
              <span className="text-3xl font-black text-blue-600 mt-1 block">{totalMasters}</span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {masters.filter((m) => m.isVerified).length} ta tasdiqlangan
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block">Jami buyurtmalar</span>
              <span className="text-3xl font-black text-indigo-600 mt-1 block">{totalOrders}</span>
              <span className="text-[11px] text-emerald-600 mt-1 block font-medium">
                {completedOrders} ta yakunlangan
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block">Mijozlar sharhlari</span>
              <span className="text-3xl font-black text-amber-500 mt-1 block">{totalReviews}</span>
              <span className="text-[11px] text-slate-500 mt-1 block">O‘rtacha 4.9★</span>
            </div>
          </div>

          {/* Simple Visual Chart Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Toifalar bo‘yicha ustalar taqsimoti</h3>
            <div className="space-y-3">
              {[
                { label: 'Santexnik', count: 32, pct: 32, color: 'bg-blue-600' },
                { label: 'Elektrik', count: 28, pct: 28, color: 'bg-amber-500' },
                { label: 'Quruvchi va pardozchi', count: 22, pct: 22, color: 'bg-emerald-600' },
                { label: 'Konditsioner ustasi', count: 18, pct: 18, color: 'bg-sky-500' },
                { label: 'Maishiy texnika ustasi', count: 14, pct: 14, color: 'bg-rose-500' },
                { label: 'Boshqa mutaxassislar', count: 10, pct: 10, color: 'bg-purple-600' },
              ].map((c) => (
                <div key={c.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{c.label}</span>
                    <span>{c.count} ta usta ({c.pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: VERIFICATION QUEUE */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Ustalikni tasdiqlash uchun kelib tushgan arizalar
            </h2>
            <span className="text-xs text-slate-500">{pendingVerifications.length} ta ariza</span>
          </div>

          {pendingVerifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              Kutilayotgan tasdiqlash arizalari mavjud emas.
            </div>
          ) : (
            pendingVerifications.map((m) => (
              <div
                key={m.userId}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200"
                  />
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base">{m.name}</h3>
                    <p className="text-xs text-blue-600 font-semibold">{m.profession}</p>
                    <p className="text-xs text-slate-500">
                      Joylashuv: {m.city}, {m.district} • Tajriba: {m.experienceYears} yil
                    </p>
                    {m.verificationDocuments && (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 mt-2">
                        <strong>Hujjat:</strong> {m.verificationDocuments.docType} (Raqam: {m.verificationDocuments.docNumber})
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => adminApproveVerification(m.userId)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Tasdiqlash
                  </button>
                  <button
                    onClick={() => adminRejectVerification(m.userId)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    Rad etish
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB: USERS LIST */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Foydalanuvchilarni ism, telefon yoki email orqali qidiring..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none"
              >
                <option value="all">Barcha rollar</option>
                <option value="customer">Faqat Mijozlar</option>
                <option value="master">Faqat Ustalar</option>
                <option value="admin">Administratorlar</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5 font-bold">Foydalanuvchi</th>
                    <th className="p-3.5 font-bold">Rol</th>
                    <th className="p-3.5 font-bold">Telefon</th>
                    <th className="p-3.5 font-bold">Email</th>
                    <th className="p-3.5 font-bold">Holat</th>
                    <th className="p-3.5 font-bold text-right">Harakat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={u.profileImage}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-900">{u.name}</span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'master'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {u.role === 'admin' ? 'Admin' : u.role === 'master' ? 'Usta' : 'Mijoz'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600">{u.phone}</td>
                      <td className="p-3.5 text-slate-500">{u.email}</td>
                      <td className="p-3.5">
                        {u.isSuspended ? (
                          <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full text-[10px]">
                            Bloklangan
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                            Faol
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => toggleUserSuspension(u.id)}
                            className={`p-1.5 rounded-lg text-xs font-semibold ${
                              u.isSuspended
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                            title={u.isSuspended ? 'Blokdan chiqarish' : 'Bloklash'}
                          >
                            {u.isSuspended ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Foydalanuvchilar shikoyatlari</h2>

          {reports.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              Hech qanday shikoyat kelib tushmagan.
            </div>
          ) : (
            reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-bold text-xs">
                      {rep.reason}
                    </span>
                    <span className="text-xs text-slate-500">
                      Shikoyatchi: <strong>{rep.reporterName}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(rep.createdAt).toLocaleDateString('uz-UZ')}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                  <strong className="block text-slate-900 mb-1">
                    Shikoyat obyekti: {rep.targetName}
                  </strong>
                  <p>{rep.details}</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  {rep.status === 'pending' ? (
                    <button
                      onClick={() => resolveReport(rep.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                    >
                      Ko‘rib chiqildi va yopildi
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-600 font-bold">Hal qilingan</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB: ORDERS MONITOR */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Barcha platforma buyurtmalari</h2>
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5 font-bold">Xizmat</th>
                    <th className="p-3.5 font-bold">Mijoz</th>
                    <th className="p-3.5 font-bold">Usta</th>
                    <th className="p-3.5 font-bold">Shahar</th>
                    <th className="p-3.5 font-bold">Holat</th>
                    <th className="p-3.5 font-bold text-right">Sana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-900">{o.serviceTitle}</td>
                      <td className="p-3.5 text-slate-700">{o.customerName}</td>
                      <td className="p-3.5 text-blue-600 font-semibold">{o.masterName}</td>
                      <td className="p-3.5 text-slate-500">{o.city}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 text-slate-800">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString('uz-UZ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
