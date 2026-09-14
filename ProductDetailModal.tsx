import React, { useState } from 'react';
import { Product, ProductColor } from '../types';
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  ZoomIn,
  X,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, color: ProductColor, size?: string, quantity?: number) => void;
  onBuyNow: (product: Product, color: ProductColor, size?: string, quantity?: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping'>('details');
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    onBuyNow(product, selectedColor, selectedSize, quantity);
  };

  return (
    <div
      id="product-detail-view"
      className="absolute inset-0 bg-white z-40 flex flex-col overflow-y-auto custom-scroll animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      {/* Top Floating App Bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <button
          id="detail-back-btn"
          onClick={onClose}
          className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
          aria-label="Back to store"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 truncate max-w-[180px]">
          {product.brand}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            id="detail-wishlist-btn"
            onClick={() => onToggleWishlist(product)}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-5 h-5 ${
                isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-700'
              }`}
            />
          </button>
          <button
            id="detail-share-btn"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: product.title,
                  text: product.subtitle,
                  url: window.location.href,
                }).catch(() => {});
              }
            }}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            aria-label="Share product"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 pb-32">
        {/* Product Image Stage */}
        <div className="relative bg-slate-100 w-full aspect-square overflow-hidden select-none">
          <img
            src={product.images[activeImageIndex]}
            alt={`${product.title} view ${activeImageIndex + 1}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-all duration-300"
          />

          {/* Fullscreen Zoom trigger button */}
          <button
            id="open-image-zoom-btn"
            onClick={() => setIsZoomOpen(true)}
            className="absolute bottom-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-xs text-slate-800 shadow-md hover:bg-white transition-transform active:scale-95"
            title="Inspect High-Resolution Image"
            aria-label="Zoom image"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Thumbnail Preview Slider */}
        <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-50 border-b border-slate-200/60 overflow-x-auto no-scrollbar">
          {product.images.map((img, idx) => (
            <button
              key={idx}
              id={`thumbnail-img-${idx}`}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                activeImageIndex === idx
                  ? 'border-slate-900 ring-2 ring-slate-900/20 scale-105 shadow-sm'
                  : 'border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
          <span className="text-[11px] text-slate-400 pl-1 whitespace-nowrap">
            {product.images.length} photos
          </span>
        </div>

        {/* Product Information Container */}
        <div className="px-5 pt-4">
          {/* Rating & Stock Status */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="text-xs font-bold text-amber-900">{product.rating}</span>
              <span className="text-[11px] text-amber-700">({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{product.inStock ? `In Stock (${product.stockCount} left)` : 'Out of Stock'}</span>
            </div>
          </div>

          {/* Title and Subtitle */}
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mt-1">
            {product.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium leading-relaxed">
            {product.subtitle}
          </p>

          {/* Pricing Row */}
          <div className="mt-3 flex items-baseline gap-2.5 pb-4 border-b border-slate-100">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Variant 1: Color Swatch Selector */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Color: <span className="text-slate-600 font-semibold">{selectedColor.name}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              {product.colors.map((color, idx) => {
                const isSelected = selectedColor.name === color.name;
                return (
                  <button
                    key={idx}
                    id={`color-swatch-${idx}`}
                    onClick={() => setSelectedColor(color)}
                    className={`relative p-0.5 rounded-full transition-all ${
                      isSelected
                        ? 'ring-2 ring-slate-900 ring-offset-2 scale-110'
                        : 'opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    title={color.name}
                    aria-label={`Select color ${color.name}`}
                  >
                    <span
                      className="block w-6 h-6 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: color.hex }}
                    />
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white drop-shadow-md stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Variant 2: Size / Model Selector */}
          {product.sizes.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Option / Size:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, idx) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={idx}
                      id={`size-pill-${idx}`}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details / Specs / Shipping Tabs */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex border-b border-slate-200 gap-4 text-xs font-bold text-slate-500">
              <button
                id="tab-details"
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 transition-colors relative ${
                  activeTab === 'details' ? 'text-slate-900' : 'hover:text-slate-700'
                }`}
              >
                Overview
                {activeTab === 'details' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
                )}
              </button>
              <button
                id="tab-specs"
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 transition-colors relative ${
                  activeTab === 'specs' ? 'text-slate-900' : 'hover:text-slate-700'
                }`}
              >
                Specifications
                {activeTab === 'specs' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
                )}
              </button>
              <button
                id="tab-shipping"
                onClick={() => setActiveTab('shipping')}
                className={`pb-2.5 transition-colors relative ${
                  activeTab === 'shipping' ? 'text-slate-900' : 'hover:text-slate-700'
                }`}
              >
                Delivery & Return
                {activeTab === 'shipping' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
                )}
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'details' && (
              <div className="py-4 space-y-3.5 text-xs text-slate-600 leading-relaxed animate-in fade-in duration-150">
                <p>{product.description}</p>
                <div className="pt-2">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Key Features
                  </h4>
                  <ul className="space-y-1.5">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Specifications */}
            {activeTab === 'specs' && (
              <div className="py-4 animate-in fade-in duration-150">
                <div className="bg-slate-50 rounded-xl p-3 divide-y divide-slate-200/70 border border-slate-200/60">
                  {Object.entries(product.specs).map(([key, val], idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">{key}</span>
                      <span className="font-semibold text-slate-900 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Shipping */}
            {activeTab === 'shipping' && (
              <div className="py-4 space-y-3 text-xs text-slate-600 animate-in fade-in duration-150">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Fast Worldwide Shipping</span>
                    <span>Free express shipping on all orders over $100. Dispatches within 24 hours.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">30-Day Money Back Guarantee</span>
                    <span>No questions asked return policy with prepaid shipping return labels.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">2-Year Official Warranty</span>
                    <span>Full manufacturer defect protection with priority customer support.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom "Buy Option" & "Add to Cart" Action Bar */}
      <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-[0_-8px_20px_rgba(0,0,0,0.06)]">
        {addedToast && (
          <div className="mb-2 bg-emerald-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg text-center shadow-md animate-in fade-in slide-in-from-bottom-2">
            ✓ Added {quantity} item(s) to Cart!
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Quantity Selector */}
          <div className="flex items-center border border-slate-200 bg-slate-50 rounded-xl p-1 shrink-0">
            <button
              id="detail-qty-minus"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs font-extrabold text-slate-800 min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              id="detail-qty-plus"
              onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
              className="p-1 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            id="detail-add-cart-btn"
            onClick={handleAddToCart}
            className="flex-1 py-3 px-3 rounded-xl border-2 border-slate-900 text-slate-900 hover:bg-slate-50 font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-98"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>

          {/* Primary BUY NOW Option */}
          <button
            id="detail-buy-now-btn"
            onClick={handleBuyNow}
            className="flex-1 py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-98"
          >
            <span>BUY NOW</span>
            <span className="text-[11px] font-normal opacity-80">
              • ${(product.price * quantity).toFixed(2)}
            </span>
          </button>
        </div>
      </div>

      {/* Fullscreen High-Resolution Image Zoom Modal */}
      {isZoomOpen && (
        <div
          id="image-zoom-overlay"
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <button
            id="close-image-zoom-btn"
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Close zoom"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-xl w-full max-h-[80vh] flex flex-col items-center">
            <img
              src={product.images[activeImageIndex]}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="mt-4 flex items-center gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx ? 'border-white scale-110' : 'border-white/30 opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <p className="text-white/70 text-xs mt-3">High Definition Product Gallery</p>
          </div>
        </div>
      )}
    </div>
  );
};
