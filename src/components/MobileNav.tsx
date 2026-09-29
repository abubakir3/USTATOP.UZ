import React from 'react';
import { Home, Search, PlusCircle, MessageSquare, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MobileNavProps {
  currentTab: string;
  onNavigate: (tab: string, param?: any) => void;
  onOpenOrderModal?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onNavigate,
  onOpenOrderModal,
}) => {
  const { currentUser, conversations } = useApp();

  const totalUnreadMessages = conversations.reduce((total, c) => {
    if (currentUser?.role === 'master' && c.masterId === currentUser.id) {
      return total + (c.unreadCountForMaster || 0);
    } else if (currentUser?.role === 'customer' && c.customerId === currentUser.id) {
      return total + (c.unreadCountForCustomer || 0);
    }
    return total;
  }, 0);

  const handleProfileClick = () => {
    if (!currentUser) {
      onNavigate('login');
    } else if (currentUser.role === 'customer') {
      onNavigate('customerDashboard');
    } else if (currentUser.role === 'master') {
      onNavigate('masterDashboard');
    } else if (currentUser.role === 'admin') {
      onNavigate('admin');
    }
  };

  const handleOrderClick = () => {
    if (onOpenOrderModal) {
      onOpenOrderModal();
    } else {
      onNavigate('masters');
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 shadow-lg">
      <div className="grid grid-cols-5 items-center justify-items-center">
        {/* Bosh sahifa */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-colors ${
            currentTab === 'home' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Bosh sahifa</span>
        </button>

        {/* Qidirish */}
        <button
          onClick={() => onNavigate('masters')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-colors ${
            currentTab === 'masters' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px]">Qidirish</span>
        </button>

        {/* Buyurtma (Center highlight) */}
        <button
          onClick={handleOrderClick}
          className="flex flex-col items-center gap-0.5 -mt-4"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-transform">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] text-slate-700 font-medium">Buyurtma</span>
        </button>

        {/* Chat */}
        <button
          onClick={() => onNavigate('messages')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-colors relative ${
            currentTab === 'messages' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          {totalUnreadMessages > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {totalUnreadMessages}
            </span>
          )}
          <span className="text-[10px]">Chat</span>
        </button>

        {/* Profil */}
        <button
          onClick={handleProfileClick}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-colors ${
            ['customerDashboard', 'masterDashboard', 'admin', 'login', 'register'].includes(currentTab)
              ? 'text-blue-600 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px]">Profil</span>
        </button>
      </div>
    </div>
  );
};
