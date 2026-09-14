import React, { useState } from 'react';
import { Product } from '../types';
import { Star, Heart, ShoppingBag, Eye, Image as ImageIcon } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onOpenProduct: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onOpenProduct,
  onToggleWishlist,
  onQuickAddToCart,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
    >
      {/* Clickable Image Container */}
      <div
        id={`product-image-trigger-${product.id}`}
        onClick={() => onOpenProduct(product)}
        className="relative aspect-square w-full overflow-hidden bg-slate-100 cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={`Open details for ${product.title}`}
      >
        {!imageError ? (
          <img
            src={product.images[0]}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
            <span className="text-[10px] font-semibold">{product.title}</span>
          </div>
        )}

        {/* Badges - clean brand badge without discount */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              NEW RELEASE
            </span>
          )}
        </div>

        {/* Hover / Tap Hint Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs shadow-xs hover:bg-white transition-colors z-10 text-slate-700"
          aria-label="Toggle wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
            }`}
          />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div onClick={() => onOpenProduct(product)} className="cursor-pointer">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {product.brand}
            </span>
            <div className="flex items-center text-amber-500 text-xs font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 leading-snug group-hover:text-slate-900">
            {product.title}
          </h3>

          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>
        </div>

        {/* Price & Action Row (No OFF/Discount) */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-sm sm:text-base font-extrabold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            id={`quick-buy-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickAddToCart(product);
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs active:scale-95"
            title="Add to Cart"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
