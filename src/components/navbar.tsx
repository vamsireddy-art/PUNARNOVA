'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  Heart, 
  Bell, 
  MapPin, 
  Search, 
  PlusCircle, 
  User as UserIcon, 
  ShieldCheck, 
  Repeat, 
  CheckCircle2, 
  Sparkles,
  ChevronDown,
  Menu,
  X,
  ShieldAlert,
  Plus,
  Building2
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { 
    currentUser, 
    logout, 
    selectedCampus, 
    setSelectedCampus, 
    allInstitutions,
    addCustomInstitution,
    cart, 
    wishlist, 
    notifications,
    markNotificationsAsRead 
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [campusSearch, setCampusSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInstName, setNewInstName] = useState('');
  const [newInstType, setNewInstType] = useState<'School' | 'College' | 'University'>('College');
  const [newInstCity, setNewInstCity] = useState('');
  const [newInstState, setNewInstState] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const campusDropdownRef = useRef<HTMLDivElement>(null);
  const campusSearchRef = useRef<HTMLInputElement>(null);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (campusDropdownRef.current && !campusDropdownRef.current.contains(e.target as Node)) {
        setShowCampusDropdown(false);
        setShowAddForm(false);
        setCampusSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Filtered institutions based on search query
  const filteredInstitutions = useMemo(() => {
    const term = campusSearch.trim().toLowerCase();
    if (!term) return allInstitutions;
    return allInstitutions.filter(
      (inst) =>
        inst.name.toLowerCase().includes(term) ||
        inst.city?.toLowerCase().includes(term) ||
        inst.state?.toLowerCase().includes(term) ||
        inst.type.toLowerCase().includes(term)
    );
  }, [campusSearch, allInstitutions]);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstName.trim()) return;
    const added = addCustomInstitution(newInstName, newInstType, newInstCity, newInstState);
    setSelectedCampus(added);
    setShowAddForm(false);
    setShowCampusDropdown(false);
    setNewInstName('');
    setNewInstCity('');
    setNewInstState('');
    setCampusSearch('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buy?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-soft">
      {/* Top Banner: Campus & Trust Status in Deep Navy */}
      <div className="bg-[#0B1F33] text-slate-300 text-xs py-1.5 px-4 border-b border-[#132B45]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="inline-flex items-center text-slate-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#10B981] mr-2 animate-pulse" />
              PunarNova Campus Network
            </span>
            <span className="hidden sm:inline text-slate-600">/</span>
            <span className="hidden sm:inline text-[#D1FAE5]">
              0% Commission • Verified Handover Points
            </span>
          </div>

          {/* Real-time Status / User Info */}
          <div className="flex items-center space-x-3 text-[11px]">
            {currentUser ? (
              <span className="text-slate-300">
                <span className="text-slate-400">Signed in as </span>
                <strong className="text-white font-medium">{currentUser.fullName}</strong>
                {currentUser.role === 'admin' ? (
                  <span className="ml-2 px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-medium">Admin</span>
                ) : currentUser.verificationStatus === 'verified' ? (
                  <span className="ml-2 px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#D1FAE5] font-medium">Verified Student</span>
                ) : (
                  <span className="ml-2 px-1.5 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] font-medium">Verification Pending</span>
                )}
              </span>
            ) : (
              <span className="text-[#D1FAE5]/80">Direct Student-to-Student Exchange</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-soft group-hover:scale-105 transition border border-[#E2E8F0] bg-[#0B1F33] shrink-0">
                <Image
                  src="/logo.png"
                  alt="PunarNova Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="leading-tight">
                <span className="text-lg font-bold tracking-tight text-[#0B1F33] flex items-center">
                  Punar<span className="text-[#10B981] ml-0.5">Nova</span>
                </span>
                <span className="text-[10px] block text-[#64748B] font-medium tracking-wider uppercase">
                  Discover • Reuse • Grow
                </span>
              </div>
            </Link>

            {/* Campus Selector Dropdown */}
            <div className="relative hidden lg:block" ref={campusDropdownRef}>
              <button
                onClick={() => setShowCampusDropdown(!showCampusDropdown)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-slate-50 hover:bg-[#ECFDF5] hover:border-[#10B981] text-[#0B1F33] text-xs font-medium transition"
              >
                <MapPin className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <span className="max-w-[140px] truncate">
                  {selectedCampus ? selectedCampus.name : 'All Campuses'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#64748B]" />
              </button>

              {showCampusDropdown && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-elevated border border-[#E2E8F0] py-2 z-50 max-h-[460px] flex flex-col">
                  <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-100">
                    <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Select Your Institution
                    </span>
                    <button
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="text-[11px] text-[#10B981] hover:text-[#059669] font-semibold flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{showAddForm ? 'View List' : '+ Add College'}</span>
                    </button>
                  </div>

                  {showAddForm ? (
                    <form onSubmit={handleAddCustom} className="p-3 space-y-2.5">
                      <div className="text-xs font-medium text-[#0B1F33] flex items-center space-x-1.5 mb-1">
                        <Building2 className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>Add Your College / University</span>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="College / School name *"
                        value={newInstName}
                        onChange={(e) => setNewInstName(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                      />
                      <select
                        value={newInstType}
                        onChange={(e) => setNewInstType(e.target.value as any)}
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-slate-50 focus:bg-white focus:outline-none"
                      >
                        <option value="College">College</option>
                        <option value="University">University</option>
                        <option value="School">School</option>
                      </select>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="City (e.g. Hyderabad)"
                          value={newInstCity}
                          onChange={(e) => setNewInstCity(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-slate-50 focus:bg-white focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="State (e.g. Telangana)"
                          value={newInstState}
                          onChange={(e) => setNewInstState(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-slate-50 focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div className="flex space-x-2 pt-1">
                        <button
                          type="submit"
                          className="flex-1 bg-[#10B981] text-[#0B1F33] hover:bg-[#059669] hover:text-white py-1.5 rounded-lg text-xs font-semibold transition"
                        >
                          Save & Select
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="px-3 py-1.5 rounded-lg text-xs text-[#64748B] bg-slate-100 hover:bg-slate-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      {/* Search box within dropdown */}
                      <div className="px-3 py-2 border-b border-slate-100">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Type to filter or search colleges..."
                            value={campusSearch}
                            onChange={(e) => setCampusSearch(e.target.value)}
                            className="w-full text-xs pl-7 pr-2 py-1.5 rounded-lg border border-[#E2E8F0] bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                          />
                          <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2 top-2" />
                        </div>
                      </div>

                      <div className="overflow-y-auto max-h-[300px]">
                        <button
                          onClick={() => {
                            setSelectedCampus(null);
                            setShowCampusDropdown(false);
                            setCampusSearch('');
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#ECFDF5] transition ${
                            !selectedCampus ? 'bg-[#ECFDF5] text-[#047857] font-semibold' : 'text-[#0B1F33]'
                          }`}
                        >
                          <span>All Campuses (Nationwide)</span>
                          {!selectedCampus && <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />}
                        </button>

                        <div className="border-t border-slate-100 my-1" />

                        {filteredInstitutions.length > 0 ? (
                          filteredInstitutions.map((inst) => (
                            <button
                              key={inst.id}
                              onClick={() => {
                                setSelectedCampus(inst);
                                setShowCampusDropdown(false);
                                setCampusSearch('');
                              }}
                              className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#ECFDF5] transition ${
                                selectedCampus?.id === inst.id
                                  ? 'bg-[#ECFDF5] text-[#047857] font-semibold'
                                  : 'text-[#0B1F33]'
                              }`}
                            >
                              <div className="pr-2">
                                <p className="font-medium truncate max-w-[210px]">{inst.name}</p>
                                <p className="text-[11px] text-[#64748B]">
                                  {inst.city ? `${inst.city}, ` : ''}{inst.state || inst.type}
                                  {inst.distanceKm ? ` • ${inst.distanceKm} km` : ''}
                                </p>
                              </div>
                              {selectedCampus?.id === inst.id && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-4 text-center">
                            <p className="text-xs text-[#64748B] mb-2">College not found</p>
                            <button
                              onClick={() => {
                                setNewInstName(campusSearch);
                                setShowAddForm(true);
                              }}
                              className="text-xs text-[#10B981] font-semibold hover:underline"
                            >
                              + Add &quot;{campusSearch}&quot; as new college
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search textbooks, calculators, authors, ISBN, or gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 text-[#0F172A] text-xs sm:text-sm pl-9 pr-4 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#10B981]/25 focus:border-[#10B981] transition placeholder:text-[#64748B]"
              />
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
            </form>
          </div>

          {/* Navigation Items & CTAs */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Direct Links in Deep Navy with Emerald Hover/Active */}
            <nav className="hidden xl:flex items-center space-x-5 text-sm font-medium text-[#0B1F33]">
              <Link 
                href="/buy" 
                className={`hover:text-[#10B981] transition ${pathname === '/buy' ? 'text-[#10B981] font-semibold' : ''}`}
              >
                Buy
              </Link>
              <Link 
                href="/exchange" 
                className={`hover:text-[#10B981] transition flex items-center space-x-1 ${pathname === '/exchange' ? 'text-[#10B981] font-semibold' : ''}`}
              >
                <span>Exchange</span>
                <span className="bg-[#ECFDF5] text-[#047857] text-[10px] px-1.5 py-0.2 rounded-full font-bold border border-[#A7F3D0]">
                  Swap
                </span>
              </Link>
              <Link 
                href="/orders" 
                className={`hover:text-[#10B981] transition ${pathname === '/orders' ? 'text-[#10B981] font-semibold' : ''}`}
              >
                My Orders
              </Link>
              <Link 
                href="/sustainability" 
                className={`hover:text-[#10B981] transition ${pathname === '/sustainability' ? 'text-[#10B981] font-semibold' : ''}`}
              >
                Eco Ledger
              </Link>
              {currentUser?.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className={`text-purple-600 hover:text-purple-700 transition flex items-center space-x-1 font-semibold ${pathname === '/admin' ? 'underline' : ''}`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="p-2 rounded-xl text-[#0B1F33] hover:text-[#10B981] hover:bg-[#ECFDF5] relative transition"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#10B981] text-[#0B1F33] text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="p-2 rounded-xl text-[#0B1F33] hover:text-[#10B981] hover:bg-[#ECFDF5] relative transition"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#10B981] text-[#0B1F33] text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) markNotificationsAsRead();
                }}
                className="p-2 rounded-xl text-[#0B1F33] hover:text-[#10B981] hover:bg-[#ECFDF5] relative transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#10B981] ring-2 ring-white" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-elevated border border-[#E2E8F0] py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#0B1F33]">Notifications</span>
                    <span className="text-[11px] text-[#10B981] hover:underline cursor-pointer" onClick={markNotificationsAsRead}>
                      Mark all as read
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-[#64748B]">No new notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-3 hover:bg-[#ECFDF5] transition text-xs">
                          <p className="font-semibold text-[#0B1F33]">{n.title}</p>
                          <p className="text-[#64748B] mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button: Emerald Green with Deep Navy Text */}
            <Link
              href="/sell"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.2]" />
              <span>List Item</span>
            </Link>

            {/* User Profile Avatar / Menu OR Sign In / Sign Up buttons */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1 pl-2 rounded-xl border border-[#E2E8F0] hover:border-[#10B981] transition"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-[#0B1F33] truncate max-w-[110px]">
                      {currentUser.fullName}
                    </p>
                    <p className="text-[10px] text-[#64748B] flex items-center justify-end">
                      {currentUser.role === 'admin' ? (
                        <span className="text-purple-600 font-semibold flex items-center">
                          Admin
                        </span>
                      ) : currentUser.verificationStatus === 'verified' ? (
                        <span className="text-[#047857] font-medium flex items-center">
                          <CheckCircle2 className="w-2.5 h-2.5 mr-0.5 text-[#10B981]" /> Verified
                        </span>
                      ) : (
                        <span className="text-[#F59E0B] flex items-center">
                          <ShieldAlert className="w-2.5 h-2.5 mr-0.5" /> Pending
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center overflow-hidden">
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-[#047857]" />
                    )}
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-[#E2E8F0] py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-semibold text-[#0B1F33]">{currentUser.fullName}</p>
                      <p className="text-[#64748B] text-[11px] truncate">{currentUser.email}</p>
                      {currentUser.institutionName && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                            {currentUser.institutionName}
                          </span>
                        </div>
                      )}
                    </div>

                    {currentUser.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2 hover:bg-slate-50 text-purple-700 font-semibold transition"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2 text-purple-600" />
                        <span>Admin Control Center</span>
                      </Link>
                    )}

                    <Link
                      href="/verification"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2 hover:bg-[#ECFDF5] text-[#0B1F33] transition"
                    >
                      <ShieldCheck className="w-4 h-4 mr-2 text-[#10B981]" />
                      <span>Student Verification</span>
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2 hover:bg-[#ECFDF5] text-[#0B1F33] transition"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2 text-[#64748B]" />
                      <span>My Orders & Codes</span>
                    </Link>
                    <Link
                      href="/sustainability"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2 hover:bg-[#ECFDF5] text-[#0B1F33] transition"
                    >
                      <Sparkles className="w-4 h-4 mr-2 text-[#10B981]" />
                      <span>Sustainability Impact</span>
                    </Link>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        router.push('/auth/signin');
                      }}
                      className="w-full text-left flex items-center px-4 py-2 hover:bg-rose-50 text-rose-600 font-medium transition"
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/signin"
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#0B1F33] hover:text-[#10B981] border border-[#0B1F33] hover:border-[#10B981] hover:bg-[#ECFDF5] rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#0B1F33] bg-[#10B981] hover:bg-[#059669] hover:text-white rounded-lg transition shadow-xs"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#0B1F33] rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E2E8F0] px-4 py-3 space-y-3">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 text-sm pl-9 pr-4 py-2 rounded-xl border border-[#E2E8F0] focus:ring-[#10B981] focus:border-[#10B981]"
              />
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
            </div>
          </form>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link
              href="/buy"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 hover:bg-[#ECFDF5] rounded-lg text-center font-medium text-[#0B1F33]"
            >
              Buy Products
            </Link>
            <Link
              href="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-[#10B981] text-[#0B1F33] font-semibold rounded-lg text-center"
            >
              Sell Product
            </Link>
            <Link
              href="/exchange"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 hover:bg-[#ECFDF5] rounded-lg text-center font-medium text-[#0B1F33]"
            >
              Book Exchange
            </Link>
            <Link
              href="/sustainability"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 hover:bg-[#ECFDF5] rounded-lg text-center font-medium text-[#0B1F33]"
            >
              Eco Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
