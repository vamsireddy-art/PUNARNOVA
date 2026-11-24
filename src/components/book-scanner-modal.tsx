'use client';

import React, { useState } from 'react';
import { X, Camera, Scan, BookOpen, Check, AlertCircle, Sparkles, RefreshCw, Edit3 } from 'lucide-react';
import { BookScannerResult } from '@/types';
import { scanBookFromImage, lookupGoogleBooks } from '@/lib/book-scanner';

interface BookScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: {
    title: string;
    author?: string;
    edition?: string;
    isbn?: string;
    publisher?: string;
    publishedYear?: string;
  }) => void;
}

export function BookScannerModal({ isOpen, onClose, onApply }: BookScannerModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [manualIsbn, setManualIsbn] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<BookScannerResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [edition, setEdition] = useState('');
  const [isbn, setIsbn] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result as string;
        setImagePreview(dataUrl);
        await performScan(dataUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const performScan = async (dataUrl: string, hint?: string) => {
    setIsScanning(true);
    setScanResult(null);

    // Call smart scanner
    const result = await scanBookFromImage(dataUrl, hint);
    setScanResult(result);
    setTitle(result.title || '');
    setAuthor(result.author || '');
    setEdition(result.edition || '');
    setIsbn(result.isbn || '');
    setIsScanning(false);
  };

  const handleIsbnLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualIsbn.trim()) return;

    setIsScanning(true);
    const result = await lookupGoogleBooks(manualIsbn.trim(), true);
    if (result) {
      setScanResult(result);
      setTitle(result.title || '');
      setAuthor(result.author || '');
      setEdition(result.edition || '');
      setIsbn(result.isbn || manualIsbn.trim());
    } else {
      setScanResult({
        isbn: manualIsbn.trim(),
        confidence: 50.0,
        extractedFrom: 'manual',
      });
      setIsbn(manualIsbn.trim());
    }
    setIsScanning(false);
  };

  const handleConfirm = () => {
    onApply({
      title: title || 'Untitled Course Book',
      author,
      edition,
      isbn,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-[#0B1F33]">
            <Scan className="w-5 h-5 text-[#10B981]" />
            <h3 className="font-black text-[#0B1F33] text-base sm:text-lg">
              Smart Book & Barcode Scanner
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#64748B]">
          Upload a photo of the textbook cover, barcode, or back page. Our AI extracts Title, Author, Edition, and ISBN instantly.
        </p>

        {/* Upload Dropzone */}
        <div className="space-y-3">
          <label className="border-2 border-dashed border-[#E2E8F0] hover:border-[#10B981] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-[#F8FAFC] hover:bg-[#ECFDF5]/50 transition text-center">
            {imagePreview ? (
              <div className="relative w-32 h-44 rounded-xl overflow-hidden shadow-md mb-2 border border-slate-200">
                <img src={imagePreview} alt="Book Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mb-2">
                <Camera className="w-6 h-6" />
              </div>
            )}
            <span className="text-xs font-bold text-[#0B1F33]">
              {imagePreview ? 'Click to Change Book Photo' : 'Upload or Snap Book Cover / Barcode'}
            </span>
            <span className="text-[11px] text-[#64748B] mt-1">Supports JPG, PNG, WebP (Max 5MB)</span>
            <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Or Type ISBN directly */}
        <form onSubmit={handleIsbnLookup} className="flex gap-2">
          <input
            type="text"
            value={manualIsbn}
            onChange={(e) => setManualIsbn(e.target.value)}
            placeholder="Or enter 10/13-digit ISBN (e.g. 9780262046305)"
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981]"
          />
          <button
            type="submit"
            disabled={isScanning || !manualIsbn.trim()}
            className="px-4 py-2.5 bg-[#0B1F33] hover:bg-[#132B45] text-white rounded-xl text-xs font-bold disabled:opacity-50 transition"
          >
            Lookup
          </button>
        </form>

        {/* Scanning Spinner */}
        {isScanning && (
          <div className="p-6 bg-[#ECFDF5] rounded-2xl border border-[#A7F3D0] flex items-center justify-center space-x-3 text-[#065F46]">
            <RefreshCw className="w-5 h-5 animate-spin text-[#10B981]" />
            <span className="text-xs font-bold">Scanning text & reconciling academic database...</span>
          </div>
        )}

        {/* Scan Results & Manual Corrections */}
        {scanResult && !isScanning && (
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-[#065F46] text-xs font-bold">
                <Sparkles className="w-4 h-4 text-[#10B981]" />
                <span>Extracted Academic Metadata ({scanResult.confidence}% Confidence)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-[11px] font-bold text-[#10B981] flex items-center space-x-1 hover:underline"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditing ? 'Done Editing' : 'Manual Edit'}</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Book Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-navy-900 disabled:opacity-90"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Author(s)</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g. Cormen, Leiserson"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-90"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Edition / Year</label>
                  <input
                    type="text"
                    value={edition}
                    onChange={(e) => setEdition(e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g. 4th Edition"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-90"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-0.5">ISBN</label>
                <input
                  type="text"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  disabled={!isEditing}
                  placeholder="ISBN-10 or ISBN-13"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-mono text-[11px] disabled:opacity-90"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-[#0B1F33] hover:text-white rounded-xl text-xs font-black transition flex items-center justify-center space-x-1.5 shadow-emerald"
            >
              <Check className="w-4 h-4" />
              <span>Apply Details to My Listing</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
