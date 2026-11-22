'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Product, 
  CartItem, 
  Order, 
  OrderStatus,
  Conversation, 
  Message, 
  VerificationRequest, 
  VerificationStatus,
  ProductExchange, 
  NotificationItem,
  Institution
} from '@/types';
import { updateRegisteredAccountVerification } from './auth';
import { MOCK_USERS, MOCK_PRODUCTS, MOCK_INSTITUTIONS, MOCK_NOTIFICATIONS } from './mock-data';

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
};

// Initial verification requests for admin review
const INITIAL_VERIFICATIONS: VerificationRequest[] = [
  {
    id: 'verif-1',
    userId: 'user-2',
    userName: 'Priya Patel',
    userEmail: 'priya.patel@du.ac.in',
    institutionName: 'University of Delhi',
    documentType: 'student_id_card',
    documentUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    verifiedLegalName: 'Priya K. Patel',
    nameMatchScore: 94.5,
    status: 'pending',
    submittedAt: '2026-11-18T14:20:00Z',
  },
  {
    id: 'verif-2',
    userId: 'user-3',
    userName: 'Rohan Deshmukh',
    userEmail: 'rohan.d@iitb.ac.in',
    institutionName: 'IIT Bombay',
    documentType: 'student_id_card',
    documentUrl: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&auto=format&fit=crop&q=80',
    verifiedLegalName: 'Rohan S. Deshmukh',
    nameMatchScore: 98.0,
    status: 'pending',
    submittedAt: '2026-11-19T09:10:00Z',
  }
];

// Initial conversations
const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    productId: 'prod-1',
    productTitle: 'Casio FX-991EX Scientific Calculator',
    productImage: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=200&auto=format&fit=crop&q=80',
    productPrice: 750,
    buyerId: 'user-2',
    buyerName: 'Priya Patel',
    sellerId: 'user-1',
    sellerName: 'Aarav Sharma',
    lastMessageText: 'Can you do ₹700 for cash handover near library?',
    lastMessageAt: '2026-11-19T10:15:00Z',
    unreadCount: 1,
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
  const [conversations, setConversationsState] = useState<Conversation[]>([]);
  const [notifications, setNotificationsState] = useState<NotificationItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedVerifications = localStorage.getItem(STORAGE_KEYS.VERIFICATIONS);
      const parsedVerifs: VerificationRequest[] = savedVerifications ? JSON.parse(savedVerifications) : [];
      if (savedVerifications) setVerificationsState(parsedVerifs);

      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        let parsedUser: User = JSON.parse(savedUser);
        // Automatically reconcile verification status: if any approved verification exists for this user, mark as verified!
        if (parsedVerifs.length > 0) {
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
        }
        setCurrentUserState(parsedUser);
      }

      const savedCampus = localStorage.getItem(STORAGE_KEYS.CAMPUS);
      if (savedCampus) setSelectedCampusState(JSON.parse(savedCampus));

      const savedCustomInstitutions = localStorage.getItem(STORAGE_KEYS.CUSTOM_INSTITUTIONS);
      if (savedCustomInstitutions) setCustomInstitutionsState(JSON.parse(savedCustomInstitutions));

      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProducts) setProductsState(JSON.parse(savedProducts));

      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) setCartState(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (savedWishlist) setWishlistState(JSON.parse(savedWishlist));

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) setOrdersState(JSON.parse(savedOrders));

      const savedConversations = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (savedConversations) setConversationsState(JSON.parse(savedConversations));

      const savedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (savedNotifications) setNotificationsState(JSON.parse(savedNotifications));
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

  // Deprecated demo switcher (kept for backwards compatibility)
  const switchDemoUser = (_role: 'verified_student' | 'unverified_student' | 'admin') => {
    // No-op in real-time mode
  };

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

  // Add a custom institution
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
    // Add seller sales count & notification
    addNotification({
      id: `notif-${Date.now()}`,
      userId: currentUser?.id || 'guest',
      title: 'Listing Published Successfully!',
      message: `"${newProduct.title}" is now visible to students across ${newProduct.institutionName}.`,
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
      orderNumber: `RC-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      pickupCode: `${Math.floor(1000 + Math.random() * 9000)}`,
    };
    const updatedOrders = [newOrder, ...orders];
    setOrdersState(updatedOrders);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));
    }

    // Mark purchased products as sold
    const purchasedIds = orderData.items.map((i) => i.product.id);
    const updatedProducts = products.map((p) =>
      purchasedIds.includes(p.id) ? { ...p, status: 'sold' as const } : p
    );
    setProductsState(updatedProducts);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
    }

    // Clear cart
    clearCart();

    // Trigger Notification
    addNotification({
      id: `notif-${Date.now()}`,
      userId: currentUser?.id || 'guest',
      title: 'Order Confirmed!',
      message: `Order #${newOrder.orderNumber} placed successfully. Handover code: ${newOrder.pickupCode}.`,
      type: 'order_update',
      linkUrl: '/orders',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return newOrder;
  };

  // Add Notification
  const addNotification = (item: NotificationItem) => {
    const updated = [item, ...notifications];
    setNotificationsState(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    }
  };

  // Mark all notifications read
  const markNotificationsAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotificationsState(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    }
  };

  // Update Order Status (for Admin & Seller/Buyer coordination)
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

    // Trigger Notification to buyer
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      const statusLabels: Record<string, string> = {
        created: 'Order Placed',
        confirmed: 'Order Confirmed by Admin',
        ready_for_handover: 'Ready for Campus Handover',
        ready_for_pickup: 'Ready for Pickup',
        completed: 'Order Handover Completed',
        cancelled: 'Order Cancelled',
      };

      addNotification({
        id: `notif-${Date.now()}`,
        userId: targetOrder.buyerId,
        title: statusLabels[status] || 'Order Status Updated',
        message: `Order #${targetOrder.orderNumber} status changed to ${status.replace(/_/g, ' ').toUpperCase()}.${notes ? ` Note: ${notes}` : ''}`,
        type: 'order_update',
        linkUrl: '/orders',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }
  };

  // Submit Verification Request
  const submitVerification = (req: Omit<VerificationRequest, 'id' | 'submittedAt' | 'status'>) => {
    // If fuzzy score is >= 80%, automated match marks as verified immediately
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

    // Update currentUser and registered account permanently
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

  // Admin Review Verification
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

    // Permanently update user in registered accounts database
    if (target) {
      updateRegisteredAccountVerification(target.userId, target.userEmail, finalStatus);
      // If currently logged-in user matches target, update their active state
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
    verifications,
    submitVerification,
    reviewVerification,
    conversations,
    notifications,
    addNotification,
    markNotificationsAsRead,
  };
}
