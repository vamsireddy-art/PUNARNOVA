'use client';

import React, { useState } from 'react';
import { X, Send, Tag, AlertTriangle, Ban, CheckCircle2, Shield, DollarSign } from 'lucide-react';
import { Product, Message } from '@/types';
import { useAppStore } from '@/lib/store';

interface ChatModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatModal({ product, isOpen, onClose }: ChatModalProps) {
  const { currentUser, addNotification } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      conversationId: `conv-${product.id}`,
      senderId: product.sellerId,
      senderName: product.sellerName,
      messageType: 'text',
      content: `Hi ${currentUser?.fullName || 'there'}! Thanks for your interest in "${product.title}". Let me know if you want to inspect it or arrange a campus handover!`,
      createdAt: '10:00 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [offerAmount, setOfferAmount] = useState<string>('');
  const [showOfferBox, setShowOfferBox] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [reported, setReported] = useState(false);

  if (!isOpen) return null;

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isBlocked) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: `conv-${product.id}`,
      senderId: currentUser?.id || 'guest',
      senderName: currentUser?.fullName || 'Guest User',
      messageType: 'text',
      content: inputText.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate seller peer reply after 1.5s
    setTimeout(() => {
      const replyMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        conversationId: `conv-${product.id}`,
        senderId: product.sellerId,
        senderName: product.sellerName,
        messageType: 'text',
        content: `Sounds good! I am available between 3 PM and 6 PM near ${product.pickupLocationNotes || 'the campus library'}.`,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1500);
  };

  const handleSendOffer = () => {
    const amount = parseFloat(offerAmount);
    if (!amount || amount <= 0) return;

    const offerMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: `conv-${product.id}`,
      senderId: currentUser?.id || 'guest',
      senderName: currentUser?.fullName || 'Guest User',
      messageType: 'price_offer',
      content: `Proposed counter-offer of ₹${amount.toLocaleString('en-IN')}`,
      offerAmount: amount,
      offerStatus: 'pending',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, offerMsg]);
    setShowOfferBox(false);
    setOfferAmount('');

    // Notify seller simulation
    addNotification({
      id: `notif-${Date.now()}`,
      userId: product.sellerId,
      title: 'Counter Offer Received',
      message: `${currentUser?.fullName || 'A student buyer'} made an offer of ₹${amount} for ${product.title}.`,
      type: 'chat_message',
      linkUrl: `/product/${product.id}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    // Auto accept if reasonable within 15%
    setTimeout(() => {
      if (amount >= product.sellingPrice * 0.85) {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            conversationId: `conv-${product.id}`,
            senderId: product.sellerId,
            senderName: product.sellerName,
            messageType: 'deal_accepted',
            content: `Accepted! Let us proceed with ₹${amount.toLocaleString('en-IN')}. Please click Buy Now to lock the handover!`,
            offerAmount: amount,
            offerStatus: 'accepted',
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            conversationId: `conv-${product.id}`,
            senderId: product.sellerId,
            senderName: product.sellerName,
            messageType: 'text',
            content: `₹${amount} is a bit too low since this item is already priced at ₹${product.sellingPrice} with AI fair pricing. Could you do ₹${Math.round(product.sellingPrice * 0.92)}?`,
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full h-[620px] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Chat Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
              <img
                src={product.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={product.sellerName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h4 className="font-bold text-navy-900 text-sm">{product.sellerName}</h4>
                <span className="text-[10px] bg-emerald-50 text-brand-green px-1.5 py-0.2 rounded-full font-medium border border-emerald-200">
                  Verified Student
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {product.institutionName} • Safe in-app chat (Phone number masked)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to report this user for moderation review?')) {
                  setReported(true);
                  alert('Thank you. A moderation report has been flagged to the campus admin.');
                }
              }}
              className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg transition"
              title="Report User"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsBlocked(!isBlocked);
                alert(isBlocked ? 'User unblocked' : 'User blocked from sending further messages');
              }}
              className={`p-1.5 rounded-lg transition ${isBlocked ? 'text-rose-600' : 'text-slate-400 hover:text-rose-600'}`}
              title="Block User"
            >
              <Ban className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Reference Card */}
        <div className="bg-slate-100/70 p-2.5 px-4 flex items-center justify-between border-b border-slate-200 text-xs">
          <div className="flex items-center space-x-3 truncate">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-8 h-8 rounded-md object-cover shrink-0"
            />
            <div className="truncate">
              <p className="font-semibold text-slate-800 truncate">{product.title}</p>
              <p className="text-slate-500 text-[11px]">Listed at ₹{product.sellingPrice}</p>
            </div>
          </div>
          <button
            onClick={() => setShowOfferBox(!showOfferBox)}
            className="shrink-0 ml-2 px-2.5 py-1 bg-white hover:bg-slate-50 text-brand-blue border border-brand-blue/30 rounded-lg font-semibold flex items-center space-x-1"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Make Offer</span>
          </button>
        </div>

        {/* Offer Negotiation Panel */}
        {showOfferBox && (
          <div className="p-3 bg-blue-50/70 border-b border-blue-200 flex items-center space-x-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-2 text-slate-500 font-bold text-xs">₹</span>
              <input
                type="number"
                placeholder="Enter counter offer amount (e.g. 700)"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="w-full bg-white text-xs pl-6 pr-3 py-1.5 rounded-lg border border-blue-300 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSendOffer}
              className="px-3 py-1.5 bg-brand-blue text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition"
            >
              Send Offer
            </button>
            <button
              onClick={() => setShowOfferBox(false)}
              className="px-2 py-1.5 text-slate-500 text-xs hover:text-slate-700"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white">
          <div className="flex items-center justify-center my-2">
            <div className="bg-slate-100 text-slate-500 text-[11px] px-3 py-1 rounded-full flex items-center space-x-1">
              <Shield className="w-3 h-3 text-emerald-600" />
              <span>Campus Trust Mode: Never share passwords or external payment links</span>
            </div>
          </div>

          {messages.map((m) => {
            const isMe = !!currentUser && m.senderId === currentUser.id;
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-brand-blue text-white rounded-br-xs'
                      : 'bg-slate-100 text-navy-900 rounded-bl-xs'
                  }`}
                >
                  {m.messageType === 'price_offer' && (
                    <div className="flex items-center space-x-1.5 mb-1 font-bold text-amber-200">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Negotiation Offer</span>
                    </div>
                  )}
                  {m.messageType === 'deal_accepted' && (
                    <div className="flex items-center space-x-1.5 mb-1 font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Offer Accepted</span>
                    </div>
                  )}
                  <p>{m.content}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.createdAt}</span>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendText} className="p-3 bg-slate-50 border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            placeholder={isBlocked ? 'You have blocked this conversation' : 'Type message to seller...'}
            disabled={isBlocked}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isBlocked}
            className="p-2.5 rounded-xl bg-brand-blue text-white hover:bg-blue-600 disabled:opacity-50 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
