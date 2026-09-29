import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wrench,
  Search,
  MessageSquare,
  Bell,
  Heart,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Check,
  PlusCircle,
  Briefcase,
  Users,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: any) => void;
  onOpenAIDiagnose: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenAIDiagnose,
}) => {
  const {
    currentUser,
    notifications,
    conversations,
    favorites,
    loginAs,
    logout,
    markNotificationAsRead,
    clearAllNotifications,
  } = useApp();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifs = notifications.filter(
    (n) => n.userId === currentUser?.id && !n.read
  );

  const totalUnreadMessages = conversations.reduce((total, c) => {
    if (currentUser?.role === 'master' && c.masterId === currentUser.id) {
      return total + (c.unreadCountForMaster || 0);
    } else if (currentUser?.role === 'customer' && c.customerId === currentUser.id) {
      return total + (c.unreadCountForCustomer || 0);
    }
    return total;
  }, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                    Usta<span className="text-blue-600">Top</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded">
                    UZ
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium block leading-none">
                  Ishonchli ustalar
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onNavigate('home')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === 'home'
                    ? 'text-blue-600 bg-blue-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                Bosh sahifa
              </button>
              <button
                onClick={() => onNavigate('masters')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === 'masters'
                    ? 'text-blue-600 bg-blue-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                Usta topish
              </button>
              <button
                onClick={() => onNavigate('categories')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === 'categories'
                    ? 'text-blue-600 bg-blue-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                Xizmatlar
              </button>
              <button
                onClick={() => onNavigate('register', { defaultRole: 'master' })}
                className="px-3 py-2 rounded-lg text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                Usta bo‘lish
              </button>
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Diagnose Button */}
            <button
              onClick={onOpenAIDiagnose}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-blue-500/20 transition-all hover:shadow-md cursor-pointer"
              title="Sun'iy intellekt orqali kerakli usta turini aniqlang"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">Qaysi usta kerak?</span>
              <span className="sm:hidden font-bold">AI</span>
            </button>

            {/* If Logged In */}
            {currentUser ? (
              <>
                {/* Favorites button (for customer) */}
                {currentUser.role === 'customer' && (
                  <button
                    onClick={() => onNavigate('favorites')}
                    className={`p-2 sm:p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50 transition-colors relative ${
                      currentTab === 'favorites' ? 'text-rose-600 border-rose-300 bg-rose-50' : ''
                    }`}
                    title="Saqlangan ustalar"
                  >
                    <Heart className="w-5 h-5" />
                    {favorites.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                  </button>
                )}

                {/* Messages button */}
                <button
                  onClick={() => onNavigate('messages')}
                  className={`p-2 sm:p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 transition-colors relative ${
                    currentTab === 'messages' ? 'text-blue-600 border-blue-300 bg-blue-50' : ''
                  }`}
                  title="Xabarlar"
                >
                  <MessageSquare className="w-5 h-5" />
                  {totalUnreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {totalUnreadMessages}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown */}
                <div className="relative" ref={notifMenuRef}>
                  <button
                    onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                    className="p-2 sm:p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 transition-colors relative"
                    title="Bildirishnomalar"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifs.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {unreadNotifs.length}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Card */}
                  {notifMenuOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Bildirishnomalar ({unreadNotifs.length})
                        </span>
                        {unreadNotifs.length > 0 && (
                          <button
                            onClick={clearAllNotifications}
                            className="text-xs text-blue-600 hover:underline font-medium"
                          >
                            Barchasini o‘qilgan qilish
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-500">
                            Bildirishnomalar yo‘q
                          </div>
                        ) : (
                          notifications.slice(0, 6).map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markNotificationAsRead(n.id);
                                if (n.link) {
                                  if (n.link.includes('admin')) onNavigate('admin');
                                  else if (n.link.includes('customer')) onNavigate('customerDashboard');
                                  else if (n.link.includes('master')) onNavigate('masterDashboard');
                                  else if (n.link.includes('messages')) onNavigate('messages');
                                }
                                setNotifMenuOpen(false);
                              }}
                              className={`p-3.5 hover:bg-blue-50/50 transition-colors cursor-pointer text-left ${
                                !n.read ? 'bg-blue-50/30' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-1 mb-1">
                                <span className="font-semibold text-xs text-slate-900 leading-tight">
                                  {n.title}
                                </span>
                                {!n.read && (
                                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-0.5" />
                                )}
                              </div>
                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                {n.message}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <img
                      src={currentUser.profileImage}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                    />
                    <div className="hidden sm:block text-left">
                      <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[100px]">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] font-medium text-blue-600 block uppercase">
                        {currentUser.role === 'customer'
                          ? 'Mijoz'
                          : currentUser.role === 'master'
                          ? 'Usta'
                          : 'Admin'}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                      {/* User Header */}
                      <div className="p-4 bg-slate-50 border-b border-slate-200/80">
                        <div className="flex items-center gap-3">
                          <img
                            src={currentUser.profileImage}
                            alt={currentUser.name}
                            className="w-11 h-11 rounded-xl object-cover ring-2 ring-blue-100"
                          />
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-slate-900 text-sm truncate">
                              {currentUser.name}
                            </h4>
                            <p className="text-xs text-slate-500 truncate">{currentUser.phone}</p>
                            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                              {currentUser.role === 'customer' && 'Mijoz hisobi'}
                              {currentUser.role === 'master' && 'Usta hisobi'}
                              {currentUser.role === 'admin' && 'Administrator'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Navigation links by role */}
                      <div className="p-2 space-y-1">
                        {currentUser.role === 'customer' && (
                          <button
                            onClick={() => {
                              onNavigate('customerDashboard');
                              setUserMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors"
                          >
                            <Briefcase className="w-4 h-4 text-blue-600" />
                            Mening buyurtmalarim
                          </button>
                        )}

                        {currentUser.role === 'master' && (
                          <button
                            onClick={() => {
                              onNavigate('masterDashboard');
                              setUserMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors"
                          >
                            <Wrench className="w-4 h-4 text-blue-600" />
                            Usta kabineti & Buyurtmalar
                          </button>
                        )}

                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => {
                              onNavigate('admin');
                              setUserMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-600 flex items-center gap-2.5 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-600" />
                            Admin boshqaruv paneli
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onNavigate('messages');
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                          Chatlar va yozishmalar
                        </button>
                      </div>

                      {/* 1-Click Role Switcher for instant testing */}
                      <div className="p-3 bg-slate-50/80 border-t border-b border-slate-200/80">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 tracking-wider">
                          Tezkor demo hisobga o‘tish:
                        </span>
                        <div className="grid grid-cols-1 gap-1.5 text-xs">
                          <button
                            onClick={() => {
                              loginAs('user-cust-1');
                              setUserMenuOpen(false);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between font-medium ${
                              currentUser.id === 'user-cust-1'
                                ? 'bg-blue-600 text-white font-bold'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span>Farrux Karimov (Mijoz)</span>
                            {currentUser.id === 'user-cust-1' && <Check className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => {
                              loginAs('user-master-1');
                              setUserMenuOpen(false);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between font-medium ${
                              currentUser.id === 'user-master-1'
                                ? 'bg-blue-600 text-white font-bold'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span>Jamshid Rustamov (Santexnik)</span>
                            {currentUser.id === 'user-master-1' && <Check className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => {
                              loginAs('user-admin');
                              setUserMenuOpen(false);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between font-medium ${
                              currentUser.id === 'user-admin'
                                ? 'bg-purple-600 text-white font-bold'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span>Dilshod Aliyev (Admin)</span>
                            {currentUser.id === 'user-admin' && <Check className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Logout */}
                      <div className="p-2">
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Tizimdan chiqish
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* If Logged Out */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100/60 rounded-xl transition-colors"
                >
                  Kirish
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 transition-all"
                >
                  Ro‘yxatdan o‘tish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
