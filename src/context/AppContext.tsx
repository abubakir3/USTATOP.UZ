import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  MasterProfile,
  Order,
  Review,
  Conversation,
  ChatMessage,
  NotificationItem,
  ReportItem,
  UserRole,
  OrderStatus,
  ServiceItem,
  PortfolioItem,
  AIDiagnosisResult,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_MASTERS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
} from '../data/seedData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  masters: MasterProfile[];
  orders: Order[];
  reviews: Review[];
  conversations: Conversation[];
  messages: ChatMessage[];
  notifications: NotificationItem[];
  reports: ReportItem[];
  favorites: string[];
  toasts: Toast[];

  // Toast
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Auth & Roles
  login: (emailOrPhone: string, role?: UserRole) => boolean;
  loginAs: (userId: string) => void;
  logout: () => void;
  register: (data: {
    role: UserRole;
    name: string;
    phone: string;
    email: string;
    profession?: string;
    city?: string;
    district?: string;
  }) => User;

  // Master Actions
  currentMasterProfile: MasterProfile | null;
  updateMasterProfile: (data: Partial<MasterProfile>) => void;
  toggleMasterAvailability: (available: boolean) => void;
  addMasterService: (service: Omit<ServiceItem, 'id' | 'masterId'>) => void;
  deleteMasterService: (serviceId: string) => void;
  addMasterPortfolio: (item: Omit<PortfolioItem, 'id' | 'masterId'>) => void;
  deleteMasterPortfolio: (itemId: string) => void;
  submitMasterVerification: (docType: string, docNumber: string) => void;

  // Orders
  createOrder: (order: {
    masterId: string;
    serviceTitle: string;
    description: string;
    city: string;
    district: string;
    address: string;
    preferredDate: string;
    preferredTime: string;
    budget?: number;
    images?: string[];
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => void;
  proposeOrderPrice: (orderId: string, price: number) => void;
  acceptProposedPrice: (orderId: string) => void;

  // Reviews
  addReview: (orderId: string, rating: number, comment: string) => void;

  // Favorites
  toggleFavorite: (masterUserId: string) => void;
  isFavorite: (masterUserId: string) => boolean;

  // Chat
  getOrCreateConversation: (masterUserId: string) => Conversation;
  sendMessage: (conversationId: string, text: string, attachmentUrl?: string) => void;
  markConversationAsRead: (conversationId: string) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Admin
  adminApproveVerification: (masterUserId: string) => void;
  adminRejectVerification: (masterUserId: string) => void;
  toggleUserSuspension: (userId: string) => void;
  submitReport: (targetType: 'master' | 'customer' | 'review', targetId: string, targetName: string, reason: string, details: string) => void;
  resolveReport: (reportId: string) => void;

  // AI Diagnostic
  diagnoseProblem: (description: string) => Promise<AIDiagnosisResult>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'ustatop_users_v2',
  MASTERS: 'ustatop_masters_v2',
  ORDERS: 'ustatop_orders_v2',
  REVIEWS: 'ustatop_reviews_v2',
  CONVERSATIONS: 'ustatop_conversations_v2',
  MESSAGES: 'ustatop_messages_v2',
  NOTIFICATIONS: 'ustatop_notifications_v2',
  REPORTS: 'ustatop_reports_v2',
  FAVORITES: 'ustatop_favorites_v2',
  CURRENT_USER_ID: 'ustatop_current_user_id_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage or seed data
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [masters, setMasters] = useState<MasterProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MASTERS);
    return saved ? JSON.parse(saved) : INITIAL_MASTERS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return saved ? JSON.parse(saved) : ['user-master-1', 'user-master-3'];
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'user-cust-1'; // Default logged in as Farrux Karimov (Customer)
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist states to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MASTERS, JSON.stringify(masters));
  }, [masters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }, [currentUserId]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const currentUser = users.find((u) => u.id === currentUserId) || null;
  const currentMasterProfile = currentUser?.role === 'master'
    ? masters.find((m) => m.userId === currentUser.id) || null
    : null;

  const loginAs = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
      showToast(`${target.name} sifatida tizimga kirildi (${target.role.toUpperCase()})`, 'info');
    }
  };

  const login = (emailOrPhone: string, role?: UserRole): boolean => {
    const cleanInput = emailOrPhone.trim().toLowerCase();
    const found = users.find(
      (u) =>
        (u.email.toLowerCase() === cleanInput || u.phone.includes(cleanInput)) &&
        (!role || u.role === role)
    );

    if (found) {
      if (found.isSuspended) {
        showToast("Ushbu hisob qoidabuzarlik tufayli to'xtatilgan. Administratorga murojaat qiling.", 'error');
        return false;
      }
      setCurrentUserId(found.id);
      showToast(`Xush kelibsiz, ${found.name}!`, 'success');
      return true;
    }

    showToast("Foydalanuvchi topilmadi. Ma'lumotlarni tekshiring yoki ro'yxatdan o'ting.", 'error');
    return false;
  };

  const logout = () => {
    setCurrentUserId(null);
    showToast('Tizimdan muvaffaqiyatli chiqildi', 'info');
  };

  const register = (data: {
    role: UserRole;
    name: string;
    phone: string;
    email: string;
    profession?: string;
    city?: string;
    district?: string;
  }): User => {
    const newId = `user-${Date.now()}`;
    const newUser: User = {
      id: newId,
      role: data.role,
      name: data.name,
      phone: data.phone,
      email: data.email || `${newId}@example.com`,
      profileImage: `https://images.unsplash.com/photo-${data.role === 'master' ? '1560250097-0b93528c311a' : '1534528741775-53994a69daeb'}?auto=format&fit=crop&w=300&q=80`,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);

    if (data.role === 'master') {
      const newMaster: MasterProfile = {
        userId: newId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        avatar: newUser.profileImage,
        profession: data.profession || 'Professional Usta',
        category: data.profession || 'Boshqa',
        additionalServices: [],
        bio: 'Xush kelibsiz! Tez orada to‘liq ma‘lumotlarimni to‘ldiraman.',
        experienceYears: 1,
        city: data.city || 'Toshkent',
        district: data.district || 'Markaziy tuman',
        serviceRadius: 15,
        startingPrice: 50000,
        priceType: 'per_service',
        workingHours: {
          Dushanba: { working: true, start: '08:00', end: '19:00' },
          Seshanba: { working: true, start: '08:00', end: '19:00' },
          Chorshanba: { working: true, start: '08:00', end: '19:00' },
          Payshanba: { working: true, start: '08:00', end: '19:00' },
          Juma: { working: true, start: '08:00', end: '19:00' },
          Shanba: { working: true, start: '09:00', end: '18:00' },
          Yakshanba: { working: false, start: '09:00', end: '18:00' },
        },
        services: [
          {
            id: `srv-${Date.now()}`,
            masterId: newId,
            name: 'Dastlabki diagnostika va maslahat',
            description: 'Muammoni joyida ko‘rib chiqish va baholash.',
            price: 50000,
            priceUnit: 'xizmat',
            estimatedDuration: '30 daqiqa',
          },
        ],
        portfolio: [],
        rating: 5.0,
        reviewCount: 0,
        isVerified: false,
        verificationStatus: 'none',
        isAvailable: true,
        completedOrdersCount: 0,
      };
      setMasters((prev) => [newMaster, ...prev]);
    }

    setCurrentUserId(newId);
    showToast(`Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi!`, 'success');
    return newUser;
  };

  // Master Actions
  const updateMasterProfile = (data: Partial<MasterProfile>) => {
    if (!currentUser || currentUser.role !== 'master') return;
    setMasters((prev) =>
      prev.map((m) => (m.userId === currentUser.id ? { ...m, ...data } : m))
    );
    if (data.name) {
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? { ...u, name: data.name! } : u))
      );
    }
    showToast('Profil ma‘lumotlari yangilandi', 'success');
  };

  const toggleMasterAvailability = (available: boolean) => {
    if (!currentUser || currentUser.role !== 'master') return;
    setMasters((prev) =>
      prev.map((m) => (m.userId === currentUser.id ? { ...m, isAvailable: available } : m))
    );
    showToast(
      available ? 'Holat: "Bugun ishlayapman" deb belgilandi' : 'Holat: "Bandman" deb belgilandi',
      'info'
    );
  };

  const addMasterService = (service: Omit<ServiceItem, 'id' | 'masterId'>) => {
    if (!currentUser || currentUser.role !== 'master') return;
    const newService: ServiceItem = {
      ...service,
      id: `srv-${Date.now()}`,
      masterId: currentUser.id,
    };
    setMasters((prev) =>
      prev.map((m) =>
        m.userId === currentUser.id
          ? { ...m, services: [...m.services, newService] }
          : m
      )
    );
    showToast('Yangi xizmat qo‘shildi', 'success');
  };

  const deleteMasterService = (serviceId: string) => {
    if (!currentUser || currentUser.role !== 'master') return;
    setMasters((prev) =>
      prev.map((m) =>
        m.userId === currentUser.id
          ? { ...m, services: m.services.filter((s) => s.id !== serviceId) }
          : m
      )
    );
    showToast('Xizmat o‘chirildi', 'info');
  };

  const addMasterPortfolio = (item: Omit<PortfolioItem, 'id' | 'masterId'>) => {
    if (!currentUser || currentUser.role !== 'master') return;
    const newItem: PortfolioItem = {
      ...item,
      id: `port-${Date.now()}`,
      masterId: currentUser.id,
      completedDate: item.completedDate || new Date().toISOString().split('T')[0],
    };
    setMasters((prev) =>
      prev.map((m) =>
        m.userId === currentUser.id
          ? { ...m, portfolio: [newItem, ...m.portfolio] }
          : m
      )
    );
    showToast('Portfolio rasmi qo‘shildi', 'success');
  };

  const deleteMasterPortfolio = (itemId: string) => {
    if (!currentUser || currentUser.role !== 'master') return;
    setMasters((prev) =>
      prev.map((m) =>
        m.userId === currentUser.id
          ? { ...m, portfolio: m.portfolio.filter((p) => p.id !== itemId) }
          : m
      )
    );
    showToast('Portfolio surati olib tashlandi', 'info');
  };

  const submitMasterVerification = (docType: string, docNumber: string) => {
    if (!currentUser || currentUser.role !== 'master') return;
    setMasters((prev) =>
      prev.map((m) =>
        m.userId === currentUser.id
          ? {
              ...m,
              verificationStatus: 'pending',
              verificationDocuments: {
                docType,
                docNumber,
                submittedAt: new Date().toISOString(),
              },
            }
          : m
      )
    );

    // Notify admin
    const adminNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'user-admin',
      title: 'Yangi tasdiqlash so‘rovi',
      message: `${currentUser.name} tasdiqlash uchun hujjat yubordi (${docType}).`,
      type: 'verification',
      read: false,
      link: '/admin',
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [adminNotif, ...prev]);

    showToast('Tasdiqlash arizangiz adminga yuborildi. Tez orada ko‘rib chiqiladi!', 'success');
  };

  // Orders
  const createOrder = (orderData: {
    masterId: string;
    serviceTitle: string;
    description: string;
    city: string;
    district: string;
    address: string;
    preferredDate: string;
    preferredTime: string;
    budget?: number;
    images?: string[];
  }): Order => {
    if (!currentUser) throw new Error('Tizimga kirish talab qilinadi');

    const targetMaster = masters.find((m) => m.userId === orderData.masterId);
    if (!targetMaster) throw new Error('Usta topilmadi');

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      masterId: targetMaster.userId,
      masterName: targetMaster.name,
      masterProfession: targetMaster.profession,
      masterAvatar: targetMaster.avatar,
      serviceTitle: orderData.serviceTitle,
      description: orderData.description,
      images: orderData.images || [],
      city: orderData.city,
      district: orderData.district,
      address: orderData.address,
      preferredDate: orderData.preferredDate,
      preferredTime: orderData.preferredTime,
      budget: orderData.budget,
      status: 'yangi',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Send notification to master
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: targetMaster.userId,
      title: 'Yangi buyurtma so‘rovi!',
      message: `${currentUser.name} sizga "${orderData.serviceTitle}" bo‘yicha yangi buyurtma yubordi.`,
      type: 'order',
      read: false,
      link: '/master/dashboard',
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    // Automatically create conversation if not exists
    getOrCreateConversation(targetMaster.userId);

    showToast('Buyurtma muvaffaqiyatli yuborildi! Usta ko‘rib chiqmoqda.', 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, reason?: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              rejectionReason: reason || o.rejectionReason,
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );

    // Notify appropriate user
    const isCurrentUserMaster = currentUser?.id === targetOrder.masterId;
    const recipientId = isCurrentUserMaster ? targetOrder.customerId : targetOrder.masterId;

    const statusLabels: Record<OrderStatus, string> = {
      yangi: 'Yangi',
      korib_chiqilmoqda: 'Ko‘rib chiqilmoqda',
      qabul_qilindi: 'Qabul qilindi',
      kelishilgan: 'Kelishilgan',
      jarayonda: 'Jarayonda',
      yakunlandi: 'Yakunlandi',
      bekor_qilindi: 'Bekor qilindi',
    };

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: recipientId,
      title: `Buyurtma holati: ${statusLabels[status]}`,
      message: `"${targetOrder.serviceTitle}" buyurtmasi holati yangilandi.`,
      type: 'order',
      read: false,
      link: isCurrentUserMaster ? '/customer/dashboard' : '/master/dashboard',
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    if (status === 'yakunlandi') {
      // Increase master's completedOrdersCount
      setMasters((prev) =>
        prev.map((m) =>
          m.userId === targetOrder.masterId
            ? { ...m, completedOrdersCount: (m.completedOrdersCount || 0) + 1 }
            : m
        )
      );
    }

    showToast(`Buyurtma holati "${statusLabels[status]}"ga o‘zgartirildi`, 'success');
  };

  const proposeOrderPrice = (orderId: string, price: number) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              proposedPrice: price,
              status: 'korib_chiqilmoqda',
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );

    // Notify customer
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: targetOrder.customerId,
      title: 'Usta yangi narx taklif qildi',
      message: `${targetOrder.masterName} sizning buyurtmangiz uchun ${price.toLocaleString()} so‘m narx taklif etdi.`,
      type: 'order',
      read: false,
      link: '/customer/dashboard',
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(`${price.toLocaleString()} so‘m narx taklifi yuborildi`, 'info');
  };

  const acceptProposedPrice = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder || !targetOrder.proposedPrice) return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              finalPrice: targetOrder.proposedPrice,
              status: 'qabul_qilindi',
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );

    // Notify master
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: targetOrder.masterId,
      title: 'Mijoz narxni qabul qildi!',
      message: `${targetOrder.customerName} siz taklif qilgan narxni ma‘qulladi.`,
      type: 'order',
      read: false,
      link: '/master/dashboard',
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast('Narx taklifi qabul qilindi. Buyurtma faollashtirildi!', 'success');
  };

  // Reviews
  const addReview = (orderId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // Check if order already reviewed
    if (targetOrder.hasReview) {
      showToast('Ushbu buyurtmaga allaqachon fikr bildirilgan.', 'error');
      return;
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      orderId,
      masterId: targetOrder.masterId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerAvatar: currentUser.profileImage,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);

    // Mark order as reviewed
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, hasReview: true } : o))
    );

    // Recalculate master's average rating and review count
    setMasters((prev) =>
      prev.map((m) => {
        if (m.userId === targetOrder.masterId) {
          const masterExistingReviews = reviews.filter((r) => r.masterId === m.userId);
          const allReviews = [...masterExistingReviews, newReview];
          const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
          return {
            ...m,
            rating: Number(avg.toFixed(2)),
            reviewCount: allReviews.length,
          };
        }
        return m;
      })
    );

    // Notify master
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: targetOrder.masterId,
      title: 'Yangi sharh qoldirildi',
      message: `${currentUser.name} sizga ${rating} yulduzli sharh yozdi: "${comment.slice(0, 40)}..."`,
      type: 'review',
      read: false,
      link: '/master/dashboard',
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast('Fikringiz uchun rahmat! Baho saqlandi.', 'success');
  };

  // Favorites
  const toggleFavorite = (masterUserId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(masterUserId);
      if (exists) {
        showToast('Saqlanganlardan olib tashlandi', 'info');
        return prev.filter((id) => id !== masterUserId);
      } else {
        showToast('Usta saqlanganlarga qo‘shildi', 'success');
        return [...prev, masterUserId];
      }
    });
  };

  const isFavorite = (masterUserId: string) => favorites.includes(masterUserId);

  // Chat & Messaging
  const getOrCreateConversation = (masterUserId: string): Conversation => {
    if (!currentUser) throw new Error('Tizimga kiring');

    const customerId = currentUser.role === 'customer' ? currentUser.id : 'user-cust-1';
    const masterId = masterUserId;

    const existing = conversations.find(
      (c) =>
        (c.customerId === customerId && c.masterId === masterId) ||
        (c.participants.includes(customerId) && c.participants.includes(masterId))
    );

    if (existing) return existing;

    const master = masters.find((m) => m.userId === masterId);
    const customer = users.find((u) => u.id === customerId);

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      participants: [customerId, masterId],
      customerId,
      customerName: customer?.name || 'Mijoz',
      customerAvatar: customer?.profileImage || '',
      masterId,
      masterName: master?.name || 'Usta',
      masterAvatar: master?.avatar || '',
      masterProfession: master?.profession || 'Mutaxassis',
      lastMessage: 'Yangi suhbat boshlandi',
      lastMessageTime: new Date().toISOString(),
      unreadCountForCustomer: 0,
      unreadCountForMaster: 0,
      updatedAt: new Date().toISOString(),
    };

    setConversations((prev) => [newConv, ...prev]);
    return newConv;
  };

  const sendMessage = (conversationId: string, text: string, attachmentUrl?: string) => {
    if (!currentUser) return;
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return;

    const isMasterSender = currentUser.id === conv.masterId;
    const receiverId = isMasterSender ? conv.customerId : conv.masterId;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId,
      text,
      attachmentUrl,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: text || 'Fayl yuborildi',
              lastMessageTime: new Date().toISOString(),
              unreadCountForCustomer: isMasterSender ? c.unreadCountForCustomer + 1 : 0,
              unreadCountForMaster: !isMasterSender ? c.unreadCountForMaster + 1 : 0,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    // If customer sent message to a master, simulate realistic master response after 2.5 seconds
    if (!isMasterSender) {
      setTimeout(() => {
        const autoReplies = [
          "Assalomu alaykum! Xabaringizni oldim, ertaga soat nechida qulay bo'ladi?",
          "Assalomu alaykum! Muammo qayerda joylashgan, manzilni aniqroq yozib yuboring.",
          "Salom! Ha, albatta, bu ishni sifatli qilib beramiz. Asboblarni tayyorlab boraman.",
          "Vaalaykum assalom! Katta rahmat murojaat uchun. Qaysi kuni borishimni xohlaysiz?",
        ];
        const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];

        const replyMsg: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          conversationId,
          senderId: conv.masterId,
          senderName: conv.masterName,
          receiverId: currentUser.id,
          text: randomReply,
          isRead: false,
          createdAt: new Date().toISOString(),
        };

        setMessages((m) => [...m, replyMsg]);
        setConversations((allC) =>
          allC.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage: randomReply,
                  lastMessageTime: new Date().toISOString(),
                  unreadCountForCustomer: c.unreadCountForCustomer + 1,
                  updatedAt: new Date().toISOString(),
                }
              : c
          )
        );

        // Send toast or notification
        const msgNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          userId: currentUser.id,
          title: `${conv.masterName}dan yangi xabar`,
          message: randomReply,
          type: 'message',
          read: false,
          link: `/messages/${conversationId}`,
          createdAt: new Date().toISOString(),
        };
        setNotifications((n) => [msgNotif, ...n]);
      }, 2500);
    }
  };

  const markConversationAsRead = (conversationId: string) => {
    if (!currentUser) return;
    const isMaster = currentUser.role === 'master';

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              unreadCountForCustomer: isMaster ? c.unreadCountForCustomer : 0,
              unreadCountForMaster: isMaster ? 0 : c.unreadCountForMaster,
            }
          : c
      )
    );

    setMessages((prev) =>
      prev.map((m) =>
        m.conversationId === conversationId && m.receiverId === currentUser.id
          ? { ...m, isRead: true }
          : m
      )
    );
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n))
    );
    showToast('Barcha bildirishnomalar o‘qildi', 'info');
  };

  // Admin Actions
  const adminApproveVerification = (masterUserId: string) => {
    setMasters((prev) =>
      prev.map((m) =>
        m.userId === masterUserId
          ? { ...m, isVerified: true, verificationStatus: 'verified' }
          : m
      )
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: masterUserId,
      title: 'Profilingiz tasdiqlandi! 🎉',
      message: 'Tabriklaymiz! Sizning malaka ma‘lumotlaringiz muvaffaqiyatli tasdiqlandi va maxsus nishon berildi.',
      type: 'verification',
      read: false,
      link: '/master/dashboard',
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast('Usta muvaffaqiyatli tasdiqlandi!', 'success');
  };

  const adminRejectVerification = (masterUserId: string) => {
    setMasters((prev) =>
      prev.map((m) =>
        m.userId === masterUserId
          ? { ...m, isVerified: false, verificationStatus: 'rejected' }
          : m
      )
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: masterUserId,
      title: 'Tasdiqlash arizasi rad etildi',
      message: 'Taqdim etilgan hujjatlar talabga javob bermadi. Iltimos, aniqroq ma‘lumotlar bilan qayta yuboring.',
      type: 'verification',
      read: false,
      link: '/master/dashboard',
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast('Tasdiqlash so‘rovi rad etildi', 'info');
  };

  const toggleUserSuspension = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newState = !u.isSuspended;
          showToast(
            newState ? `${u.name} bloklandi` : `${u.name} blokdan chiqarildi`,
            newState ? 'error' : 'success'
          );
          return { ...u, isSuspended: newState };
        }
        return u;
      })
    );
  };

  const submitReport = (
    targetType: 'master' | 'customer' | 'review',
    targetId: string,
    targetName: string,
    reason: string,
    details: string
  ) => {
    if (!currentUser) return;

    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reporterRole: currentUser.role,
      targetType,
      targetId,
      targetName,
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setReports((prev) => [newReport, ...prev]);

    // Notify admin
    const adminNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'user-admin',
      title: 'Yangi shikoyat kelib tushdi',
      message: `${currentUser.name} tomonidan ${targetName} ustidan shikoyat qilindi: "${reason}".`,
      type: 'system',
      read: false,
      link: '/admin',
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [adminNotif, ...prev]);

    showToast('Shikoyatingiz ma‘muriyatga yetkazildi. Tez orada tekshirib chiqiladi.', 'info');
  };

  const resolveReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' } : r))
    );
    showToast('Shikoyat ko‘rib chiqildi va yopildi', 'success');
  };

  // AI Diagnostic
  const diagnoseProblem = async (description: string): Promise<AIDiagnosisResult> => {
    try {
      const res = await fetch('/api/ai-diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      if (!res.ok) {
        throw new Error('API request failed');
      }
      return await res.json();
    } catch {
      // Fallback
      return {
        category: 'Santexnik',
        explanation: "Muammo tavsifiga ko'ra sanitariya-texnik mutaxassis ko'rigi zarur.",
        urgency: "O'rtacha",
        suggestedQuestions: [
          "Qanday asboblar kerak bo'ladi?",
          "Ish qancha vaqt oladi?",
          "Kafolat qancha muddatga beriladi?"
        ],
        disclaimer: "Ushbu tavsiya dastlabki xulosadir. Aniq narx va muddatni usta bilan kelishing.",
      };
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        masters,
        orders,
        reviews,
        conversations,
        messages,
        notifications,
        reports,
        favorites,
        toasts,
        showToast,
        removeToast,
        login,
        loginAs,
        logout,
        register,
        currentMasterProfile,
        updateMasterProfile,
        toggleMasterAvailability,
        addMasterService,
        deleteMasterService,
        addMasterPortfolio,
        deleteMasterPortfolio,
        submitMasterVerification,
        createOrder,
        updateOrderStatus,
        proposeOrderPrice,
        acceptProposedPrice,
        addReview,
        toggleFavorite,
        isFavorite,
        getOrCreateConversation,
        sendMessage,
        markConversationAsRead,
        markNotificationAsRead,
        clearAllNotifications,
        adminApproveVerification,
        adminRejectVerification,
        toggleUserSuspension,
        submitReport,
        resolveReport,
        diagnoseProblem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
