'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  Product, 
  CartItem, 
  Order, 
  OrderStatus,
  Conversation, 
  VerificationRequest, 
  VerificationStatus,
  ProductExchange, 
  NotificationItem,
  Institution,
  ProductReport,
  EnvironmentalStats,
  AchievementBadge
} from '@/types';
import { updateRegisteredAccountVerification } from './auth';
import { MOCK_USERS, MOCK_PRODUCTS, MOCK_INSTITUTIONS, MOCK_CATEGORIES } from './mock-data';

const STORAGE_KEYS = {
  USER: 'reuse_campus_current_user',
  CAMPUS: 'reuse_campus_selected_campus',
  PRODUCTS: 'reuse_campus_products',
  CART: 'reuse_campus_cart',
  WISHLIST: 'reuse_campus_wishlist',
  ORDERS: 'reuse_campus_orders',
  VERIFICATIONS: 'reuse_campus_verifications',
  EXCHANGES: 'reuse_campus_exchanges',
  CONVERSATIONS: 'reuse_campus_conversations',
  NOTIFICATIONS: 'reuse_campus_notifications',
  CUSTOM_INSTITUTIONS: 'reuse_campus_custom_institutions',
  PRODUCT_REPORTS: 'reuse_campus_product_reports',
};

// Initial verification requests for admin review
const INITIAL_VERIFICATIONS: VerificationRequest[] = [
  {
    id: 'verif-1',
    userId: 'user-2',
    userName: 'Priya Sharma',
    userEmail: 'priya.sharma@du.ac.in',
    institutionId: 'inst-3',
    institutionName: 'University of Delhi (North Campus)',
    documentType: 'student_id_card',
    documentUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    verifiedLegalName: 'Priya Sharma',
    nameMatchScore: 96.0,
    status: 'verified',
    submittedAt: '2026-11-18T14:20:00Z',
    reviewedAt: '2026-11-18T15:00:00Z',
  },
  {
    id: 'verif-2',
    userId: 'user-3',
    userName: 'Rohan Deshmukh',
    userEmail: 'rohan.deshmukh@iitb.ac.in',
    institutionId: 'inst-1',
    institutionName: 'Indian Institute of Technology (IIT) Bombay',
    documentType: 'student_id_card',
    documentUrl: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=80',
    verifiedLegalName: 'Rohan Deshmukh',
    nameMatchScore: 98.0,
    status: 'verified',
    submittedAt: '2026-11-19T09:10:00Z',
    reviewedAt: '2026-11-19T10:00:00Z',
  }
];

export function useAppStore() {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [selectedCampus, setSelectedCampusState] = useState<Institution | null>(MOCK_INSTITUTIONS[0]);
  const [customInstitutions, setCustomInstitutionsState] = useState<Institution[]>([]);
  const [products, setProductsState] = useState<Product[]>([]);
  const [cart, setCartState] = useState<CartItem[]>([]);
  const [wishlist, setWishlistState] = useState<string[]>([]);
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [verifications, setVerificationsState] = useState<VerificationRequest[]>([]);
  const [exchanges, setExchangesState] = useState<ProductExchange[]>([]);
  const [conversations, setConversationsState] = useState<Conversation[]>([]);
  const [notifications, setNotificationsState] = useState<NotificationItem[]>([]);
  const [productReports, setProductReportsState] = useState<ProductReport[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedVerifications = localStorage.getItem(STORAGE_KEYS.VERIFICATIONS);
      const parsedVerifs: VerificationRequest[] = savedVerifications ? JSON.parse(savedVerifications) : INITIAL_VERIFICATIONS;
      setVerificationsState(parsedVerifs);

      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        let parsedUser: User = JSON.parse(savedUser);
        // Automatically reconcile verification status: if verified submission exists, mark as verified
        const hasApproved = parsedVerifs.some(
          (v) =>
            (v.userId === parsedUser.id || (parsedUser.email && v.userEmail?.toLowerCase() === parsedUser.email.toLowerCase())) &&
            v.status === 'verified'
        );
        if (hasApproved && parsedUser.verificationStatus !== 'verified') {
          parsedUser = {
            ...parsedUser,
            verificationStatus: 'verified',
            isEmailVerified: true,
            isMobileVerified: true,
          };
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(parsedUser));
          updateRegisteredAccountVerification(parsedUser.id, parsedUser.email, 'verified');
        }
        setCurrentUserState(parsedUser);
      }

      const savedCampus = localStorage.getItem(STORAGE_KEYS.CAMPUS);
      if (savedCampus) setSelectedCampusState(JSON.parse(savedCampus));

      const savedCustomInstitutions = localStorage.getItem(STORAGE_KEYS.CUSTOM_INSTITUTIONS);
      if (savedCustomInstitutions) setCustomInstitutionsState(JSON.parse(savedCustomInstitutions));

      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProducts) {
        setProductsState(JSON.parse(savedProducts));
      } else {
        setProductsState(MOCK_PRODUCTS);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
      }

      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) setCartState(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (savedWishlist) setWishlistState(JSON.parse(savedWishlist));

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) setOrdersState(JSON.parse(savedOrders));

      const savedExchanges = localStorage.getItem(STORAGE_KEYS.EXCHANGES);
      if (savedExchanges) setExchangesState(JSON.parse(savedExchanges));

      const savedConversations = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (savedConversations) setConversationsState(JSON.parse(savedConversations));

      const savedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (savedNotifications) setNotificationsState(JSON.parse(savedNotifications));

      const savedReports = localStorage.getItem(STORAGE_KEYS.PRODUCT_REPORTS);
      if (savedReports) setProductReportsState(JSON.parse(savedReports));
    } catch (e) {
      console.error('Error loading persisted store:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Update Current User
  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
  };

  // Sign out user
  const logout = () => {
    setCurrentUser(null);
  };

  // Deprecated demo switcher kept for clean signature compatibility
  const switchDemoUser = (_role: 'verified_student' | 'unverified_student' | 'admin') => {};

  // Select Campus
  const setSelectedCampus = (campus: Institution | null) => {
    setSelectedCampusState(campus);
    if (typeof window !== 'undefined') {
      if (campus) localStorage.setItem(STORAGE_KEYS.CAMPUS, JSON.stringify(campus));
      else localStorage.removeItem(STORAGE_KEYS.CAMPUS);
    }
  };

  // All institutions = built-in + user-added
  const allInstitutions: Institution[] = [...MOCK_INSTITUTIONS, ...customInstitutions];

  // Add custom campus
  const addCustomInstitution = (name: string, type: 'School' | 'College' | 'University', city?: string, state?: string): Institution => {
    const newInst: Institution = {
      id: `custom-inst-${Date.now()}`,
      name: name.trim(),
      type,
      code: name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() || '').join('').slice(0, 6),
      emailDomain: '',
      city: city?.trim() || '',
      state: state?.trim() || '',
      country: 'India',
      distanceKm: 0,
      isVerified: false,
      safeHandoverSpots: [
        { id: `spot-${Date.now()}-1`, name: 'Main Campus Gate Security Office', landmark: 'Visitor Desk', timing: '9:00 AM - 6:00 PM', isOfficialCampusPoint: true },
        { id: `spot-${Date.now()}-2`, name: 'Central Campus Library', landmark: 'Main Entrance Foyer', timing: '9:00 AM - 8:00 PM', isOfficialCampusPoint: true },
      ],
    };
    const updated = [...customInstitutions, newInst];
    setCustomInstitutionsState(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_INSTITUTIONS, JSON.stringify(updated));
    }
    return newInst;
  };

  // Add Product (Sell flow)
  const addProduct = (newProduct: Product) => {
    const updated = [newProduct, ...products];
    setProductsState(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    }
    addNotification({
      id: `notif-${Date.now()}`,
      userId: currentUser?.id || 'guest',
      title: 'Listing Published Successfully!',
      message: `"${newProduct.title}" is now active in ${newProduct.institutionName}.`,
      type: 'system',
      linkUrl: `/product/${newProduct.id}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  };

  // Add to Cart
  const addToCart = (product: Product, quantity = 1) => {
    let updated: CartItem[];
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    if (existingIndex > -1) {
      updated = [...cart];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [...cart, { product, quantity }];
    }
    setCartState(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(updated));
    }
  };

  // Remove from Cart
  const removeFromCart = (productId: string) => {
    const updated = cart.filter((item) => item.product.id !== productId);
    setCartState(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(updated));
    }
  };

  // Update Cart Quantity
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    setCartState(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(updated));
    }
  };

  // Clear Cart
  const clearCart = () => {
    setCartState([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CART);
    }
  };

  // Toggle Wishlist
  const toggleWishlist = (productId: string) => {
    let updated: string[];
    if (wishlist.includes(productId)) {
      updated = wishlist.filter((id) => id !== productId);
    } else {
      updated = [...wishlist, productId];
    }
    setWishlistState(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(updated));
    }
  };

  // Create Order (Checkout)
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      orderNumber: `PN-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      pickupCode: `${Math.floor(1000 + Math.random() * 9000)}`,
    };
    const updatedOrders = [newOrder, ...orders];
    setOrdersState(updatedOrders);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));
    }

    // Mark purchased items as reserved/sold
    const purchasedIds = orderData.items.map((i) => i.product.id);
    const updatedProducts = products.map((p) =>
      purchasedIds.includes(p.id) ? { ...p, status: 'sold' as const } : p
    );
    setProductsState(updatedProducts);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
    }

    clearCart();

    addNotification({
      id: `notif-${Date.now()}`,
      userId: currentUser?.id || 'guest',
      title: 'Order Confirmed!',
      message: `Order #${newOrder.orderNumber} placed. Campus Handover Code: ${newOrder.pickupCode}.`,
      type: 'order_update',
      linkUrl: '/orders',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return newOrder;
  };

  // Update Order Status (Admin & Seller Handover Confirmation)
  const updateOrderStatus = (orderId: string, status: OrderStatus, notes?: string) => {
    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          orderStatus: status,
        };
      }
      return o;
    });
    setOrdersState(updatedOrders);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));
    }

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      addNotification({
        id: `notif-${Date.now()}`,
        userId: targetOrder.buyerId,
        title: `Order #${targetOrder.orderNumber} Status: ${status.replace(/_/g, ' ').toUpperCase()}`,
        message: notes || `Your order status is now ${status.replace(/_/g, ' ')}.`,
        type: 'order_update',
        linkUrl: '/orders',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }
  };

  // Smart Swap: Propose Product Exchange
  const proposeExchange = (exchangeData: Omit<ProductExchange, 'id' | 'createdAt' | 'status'>) => {
    const newEx: ProductExchange = {
      ...exchangeData,
      id: `ex-${Date.now()}`,
      status: 'proposed',
      createdAt: new Date().toISOString(),
    };
    const updated = [newEx, ...exchanges];
    setExchangesState(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.EXCHANGES, JSON.stringify(updated));
    }

    addNotification({
      id: `notif-${Date.now()}`,
      userId: exchangeData.ownerId,
      title: 'New Book Swap Proposal!',
      message: `${exchangeData.requesterName} proposed swapping "${exchangeData.offeredProduct.title}" for your "${exchangeData.targetProduct.title}".`,
      type: 'exchange_request',
      linkUrl: '/exchange',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return newEx;
  };

  // Update Exchange Status
  const updateExchangeStatus = (exchangeId: string, status: ProductExchange['status']) => {
    const updated = exchanges.map((ex) => {
      if (ex.id === exchangeId) {
        return {
          ...ex,
          status,
          completedAt: status === 'completed' ? new Date().toISOString() : undefined,
        };
      }
      return ex;
    });
    setExchangesState(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.EXCHANGES, JSON.stringify(updated));
    }
  };

  // Product Reporting (Content Moderation)
  const reportProduct = (report: Omit<ProductReport, 'id' | 'createdAt' | 'status'>) => {
    const newReport: ProductReport = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const updated = [newReport, ...productReports];
    setProductReportsState(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PRODUCT_REPORTS, JSON.stringify(updated));
    }

    addNotification({
      id: `notif-${Date.now()}`,
      userId: currentUser?.id || 'guest',
      title: 'Listing Report Submitted',
      message: `Thank you for keeping campus safe. Our moderator team is reviewing "${report.productTitle}".`,
      type: 'system',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  };

  // User Blocking
  const blockUser = (userIdToBlock: string) => {
    if (!currentUser) return;
    const currentBlocked = currentUser.blockedUserIds || [];
    if (!currentBlocked.includes(userIdToBlock)) {
      const updatedUser: User = {
        ...currentUser,
        blockedUserIds: [...currentBlocked, userIdToBlock],
      };
      setCurrentUser(updatedUser);
    }
  };

  const unblockUser = (userIdToUnblock: string) => {
    if (!currentUser) return;
    const currentBlocked = currentUser.blockedUserIds || [];
    const updatedUser: User = {
      ...currentUser,
      blockedUserIds: currentBlocked.filter(id => id !== userIdToUnblock),
    };
    setCurrentUser(updatedUser);
  };

  // Dynamic Environmental Calculation strictly from real completed transactions
  const environmentalStats: EnvironmentalStats = useMemo(() => {
    // 1. Completed Orders
    const completedOrders = orders.filter((o) => o.orderStatus === 'completed');
    // 2. Completed Swaps
    const completedSwaps = exchanges.filter((e) => e.status === 'completed');

    let totalItems = 0;
    let moneySaved = 0;
    let paperKg = 0;
    let co2Kg = 0;
    let waterL = 0;

    // Process completed purchase orders
    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        const qty = item.quantity || 1;
        totalItems += qty;
        const orig = item.product.originalPrice || 500;
        const sell = item.unitPrice || item.product.sellingPrice || 250;
        moneySaved += Math.max(orig - sell, 0) * qty;

        // Life Cycle Assessment factors (EPN)
        const isElectronics = item.product.categoryName === 'Calculators' || item.product.categoryName === 'Lab Equipment';
        if (isElectronics) {
          co2Kg += 4.2 * qty; // Embodied electronics carbon
          waterL += 12 * qty;
        } else {
          // Standard Academic Book: ~1.1 kg paper weight
          const bookPaperWeight = 1.1;
          paperKg += bookPaperWeight * qty;
          co2Kg += (bookPaperWeight * 1.54) * qty; // 1.54 kg CO2 per kg virgin paper
          waterL += (bookPaperWeight * 26.0) * qty; // 26L water per kg virgin paper
        }
      });
    });

    // Process completed peer swaps (both participants reuse 1 item)
    completedSwaps.forEach(() => {
      totalItems += 2;
      moneySaved += 800; // Estimated 2 academic books saved
      paperKg += 2.2;
      co2Kg += 3.38;
      waterL += 57.2;
    });

    return {
      totalItemsReused: totalItems,
      totalMoneySavedInr: Math.round(moneySaved),
      totalCo2AvoidedKg: Number(co2Kg.toFixed(1)),
      totalWaterSavedLiters: Math.round(waterL),
      treesEquivalentPreserved: Number((paperKg * 0.017).toFixed(2)),
      paperSavedKg: Number(paperKg.toFixed(1)),
      verifiedTransactionsCount: completedOrders.length + completedSwaps.length,
    };
  }, [orders, exchanges]);

  // Submit Verification Request
  const submitVerification = (req: Omit<VerificationRequest, 'id' | 'submittedAt' | 'status'>) => {
    const autoVerified = req.nameMatchScore >= 80;
    const finalStatus: VerificationStatus = autoVerified ? 'verified' : 'pending';

    const newReq: VerificationRequest = {
      ...req,
      id: `verif-${Date.now()}`,
      status: finalStatus,
      submittedAt: new Date().toISOString(),
    };
    const updated = [newReq, ...verifications];
    setVerificationsState(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(updated));
    }

    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        verificationStatus: finalStatus,
        verifiedLegalName: req.verifiedLegalName,
        isEmailVerified: true,
        isMobileVerified: true,
      };
      setCurrentUser(updatedUser);
      updateRegisteredAccountVerification(updatedUser.id, updatedUser.email, finalStatus);
    }
  };

  // Review Verification (Admin)
  const reviewVerification = (verifId: string, approve: boolean, reason?: string) => {
    const finalStatus: VerificationStatus = approve ? 'verified' : 'rejected';
    const target = verifications.find((v) => v.id === verifId);

    const updated = verifications.map((v) => {
      if (v.id === verifId) {
        return {
          ...v,
          status: finalStatus,
          rejectionReason: reason,
          reviewedAt: new Date().toISOString(),
        };
      }
      return v;
    });
    setVerificationsState(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(updated));
    }

    if (target) {
      updateRegisteredAccountVerification(target.userId, target.userEmail, finalStatus);
      if (
        currentUser &&
        (currentUser.id === target.userId ||
          (currentUser.email && currentUser.email.toLowerCase() === target.userEmail.toLowerCase()))
      ) {
        setCurrentUser({
          ...currentUser,
          verificationStatus: finalStatus,
        });
      }
    }
  };

  // Notifications
  const addNotification = (item: NotificationItem) => {
    const updated = [item, ...notifications];
    setNotificationsState(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    }
  };

  const markNotificationsAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotificationsState(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    }
  };

  return {
    isInitialized,
    currentUser,
    setCurrentUser,
    logout,
    switchDemoUser,
    selectedCampus,
    setSelectedCampus,
    allInstitutions,
    customInstitutions,
    addCustomInstitution,
    products,
    addProduct,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    wishlist,
    toggleWishlist,
    orders,
    createOrder,
    updateOrderStatus,
    exchanges,
    proposeExchange,
    updateExchangeStatus,
    productReports,
    reportProduct,
    blockUser,
    unblockUser,
    environmentalStats,
    verifications,
    submitVerification,
    reviewVerification,
    conversations,
    notifications,
    addNotification,
    markNotificationsAsRead,
  };
}
