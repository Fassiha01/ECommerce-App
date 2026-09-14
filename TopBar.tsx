import React from 'react';
import { DeviceOS } from '../types';
import {
  Smartphone,
  Maximize2,
  Code2,
  ShoppingBag,
  Heart,
  Sparkles,
  Layers,
  Download
} from 'lucide-react';

interface TopBarProps {
  deviceOS: DeviceOS;
  onSetDeviceOS: (os: DeviceOS) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenCode: () => void;
  onOpenWishlist: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  deviceOS,
  onSetDeviceOS,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenCode,
  onOpenWishlist,
}) => {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 z-40 shrink-0 select-none shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Platform Badge */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700 flex items-center justify-center font-black text-sm">
            L
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-tight text-white">Lumina Studio</h1>
              <span className="hidden sm:inline-flex items-center gap-1 bg-cyan-950/80 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-800/60">
                <Sparkles className="w-2.5 h-2.5" /> Flutter • Android & iOS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Flagship Lifestyle & Tech Mobile Store with full Dart source export
            </p>
          </div>
        </div>

        {/* Device Switcher Controls */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 text-xs font-semibold">
          <button
            id="switch-ios-btn"
            onClick={() => onSetDeviceOS('ios')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              deviceOS === 'ios'
                ? 'bg-slate-900 text-white shadow-xs border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="iPhone 16 Pro (iOS Simulation)"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span>iPhone (iOS)</span>
          </button>

          <button
            id="switch-android-btn"
            onClick={() => onSetDeviceOS('android')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              deviceOS === 'android'
                ? 'bg-slate-900 text-white shadow-xs border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Pixel 9 Pro (Android Simulation)"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pixel (Android)</span>
          </button>

          <button
            id="switch-responsive-btn"
            onClick={() => onSetDeviceOS('responsive')}
            className={`px-2.5 py-1.5 rounded-lg hidden md:flex items-center gap-1.5 transition-all ${
              deviceOS === 'responsive'
                ? 'bg-slate-900 text-white shadow-xs border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Clean View"
          >
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Clean View</span>
          </button>
        </div>

        {/* Header Action Tools */}
        <div className="flex items-center gap-2">
          {/* Direct ZIP Download */}
          <a
            id="download-zip-direct-link"
            href="/flutter_ecommerce.zip"
            download="lumina_studio_flutter_app.zip"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Direct Download Flutter Project .ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ZIP</span>
          </a>

          {/* Flutter / Dart Code Button */}
          <button
            id="open-flutter-code-btn"
            onClick={onOpenCode}
            className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
            title="Inspect Flutter Dart Code"
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Dart / Flutter Code</span>
            <span className="sm:hidden">Dart</span>
          </button>

          {/* Wishlist quick button */}
          <button
            id="top-wishlist-btn"
            onClick={onOpenWishlist}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Wishlist"
            title="Saved Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart quick button */}
          <button
            id="top-cart-btn"
            onClick={onOpenCart}
            className="relative p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors flex items-center gap-1.5"
            aria-label="Shopping Cart"
            title="Open Cart"
          >
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
