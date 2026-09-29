import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MasterProfile, ServiceItem, Order } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { ToastContainer } from './components/ToastContainer';
import { AIDiagnoseModal } from './components/AIDiagnoseModal';
import { OrderModal } from './components/OrderModal';
import { ReportModal } from './components/ReportModal';
import { ReviewModal } from './components/ReviewModal';

// Pages
import { HomePage } from './pages/HomePage';
import { MastersSearchPage } from './pages/MastersSearchPage';
import { MasterProfilePage } from './pages/MasterProfilePage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { MasterDashboard } from './pages/MasterDashboard';
import { MasterSetupWizard } from './pages/MasterSetupWizard';
import { ChatPage } from './pages/ChatPage';
import { AdminPage } from './pages/AdminPage';
import { AuthPages } from './pages/AuthPages';
import { FavoritesPage } from './pages/FavoritesPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { FAQPage, TermsPage, PrivacyPage } from './pages/StaticPages';

const MainLayout: React.FC = () => {
  const { currentUser, getOrCreateConversation } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedMaster, setSelectedMaster] = useState<MasterProfile | null>(null);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');
  const [searchInitialCategory, setSearchInitialCategory] = useState('');

  // Modals state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderModalMaster, setOrderModalMaster] = useState<MasterProfile | null>(null);
  const [orderModalService, setOrderModalService] = useState<ServiceItem | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ id: string; name: string } | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [activeChatConvId, setActiveChatConvId] = useState<string | undefined>(undefined);

  // Navigation handler
  const handleNavigate = (tab: string, param?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tab === 'masters') {
      if (param?.search !== undefined) setSearchInitialQuery(param.search);
      if (param?.category !== undefined) setSearchInitialCategory(param.category);
    }

    if (tab === 'messages' && param?.conversationId) {
      setActiveChatConvId(param.conversationId);
    }

    setCurrentTab(tab);
  };

  // View master profile
  const handleViewMaster = (master: MasterProfile) => {
    setSelectedMaster(master);
    setCurrentTab('masterProfile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct chat initiation
  const handleStartChat = (master: MasterProfile) => {
    if (!currentUser) {
      setCurrentTab('login');
      return;
    }
    const conv = getOrCreateConversation(master.userId);
    setActiveChatConvId(conv.id);
    setCurrentTab('messages');
  };

  // Direct order request
  const handleRequestOrder = (master: MasterProfile, service?: ServiceItem) => {
    setOrderModalMaster(master);
    setOrderModalService(service || null);
    setOrderModalOpen(true);
  };

  // Open report modal
  const handleOpenReport = (master: MasterProfile) => {
    setReportTarget({ id: master.userId, name: master.name });
    setReportModalOpen(true);
  };

  // Open review modal
  const handleOpenReviewModal = (order: Order) => {
    setReviewOrder(order);
    setReviewModalOpen(true);
  };

  // AI Diagnostic Category match selection
  const handleAICategorySelect = (category: string) => {
    setSearchInitialCategory(category);
    setSearchInitialQuery('');
    setCurrentTab('masters');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast notifications container */}
      <ToastContainer />

      {/* Main Top Header Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenAIDiagnose={() => setAiModalOpen(true)}
      />

      {/* Content View Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onViewMaster={handleViewMaster}
            onStartChat={handleStartChat}
            onRequestOrder={handleRequestOrder}
            onOpenAIDiagnose={() => setAiModalOpen(true)}
          />
        )}

        {currentTab === 'masters' && (
          <MastersSearchPage
            initialSearch={searchInitialQuery}
            initialCategory={searchInitialCategory}
            onViewMaster={handleViewMaster}
            onStartChat={handleStartChat}
            onRequestOrder={handleRequestOrder}
          />
        )}

        {currentTab === 'masterProfile' && selectedMaster && (
          <MasterProfilePage
            master={selectedMaster}
            onStartChat={handleStartChat}
            onRequestOrder={handleRequestOrder}
            onOpenReport={handleOpenReport}
            onBack={() => setCurrentTab('masters')}
          />
        )}

        {currentTab === 'customerDashboard' && (
          <CustomerDashboard
            onNavigate={handleNavigate}
            onViewMaster={handleViewMaster}
            onStartChat={handleStartChat}
            onRequestOrder={handleRequestOrder}
            onOpenReviewModal={handleOpenReviewModal}
          />
        )}

        {currentTab === 'masterDashboard' && (
          <MasterDashboard
            onNavigate={handleNavigate}
            onOpenSetupWizard={() => setCurrentTab('masterSetupWizard')}
          />
        )}

        {currentTab === 'masterSetupWizard' && (
          <MasterSetupWizard
            onComplete={() => setCurrentTab('masterDashboard')}
            onCancel={() => setCurrentTab('masterDashboard')}
          />
        )}

        {currentTab === 'messages' && (
          <ChatPage
            initialConversationId={activeChatConvId}
            onBack={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'admin' && <AdminPage />}

        {currentTab === 'favorites' && (
          <FavoritesPage
            onViewMaster={handleViewMaster}
            onStartChat={handleStartChat}
            onRequestOrder={handleRequestOrder}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'categories' && (
          <CategoriesPage
            onSelectCategory={(cat) => {
              setSearchInitialCategory(cat);
              setCurrentTab('masters');
            }}
          />
        )}

        {currentTab === 'login' && (
          <AuthPages
            initialView="login"
            onSuccess={(role) => {
              if (role === 'master') setCurrentTab('masterDashboard');
              else if (role === 'admin') setCurrentTab('admin');
              else setCurrentTab('customerDashboard');
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'register' && (
          <AuthPages
            initialView="register"
            onSuccess={(role) => {
              if (role === 'master') setCurrentTab('masterSetupWizard');
              else if (role === 'admin') setCurrentTab('admin');
              else setCurrentTab('customerDashboard');
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'faq' && <FAQPage />}
        {currentTab === 'terms' && <TermsPage />}
        {currentTab === 'privacy' && <PrivacyPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenOrderModal={() => handleNavigate('masters')}
      />

      {/* Global Modals */}
      <AIDiagnoseModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onSelectCategory={handleAICategorySelect}
      />

      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        master={orderModalMaster}
        selectedService={orderModalService}
      />

      {reportTarget && (
        <ReportModal
          isOpen={reportModalOpen}
          onClose={() => {
            setReportModalOpen(false);
            setReportTarget(null);
          }}
          targetType="master"
          targetId={reportTarget.id}
          targetName={reportTarget.name}
        />
      )}

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setReviewOrder(null);
        }}
        order={reviewOrder}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
