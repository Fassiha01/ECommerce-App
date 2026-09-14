import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div
      id="cart-drawer-overlay"
      className="absolute inset-0 bg-slate-900/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="cart-drawer"
        className="w-full bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-extrabold text-slate-900">
              Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>
          <button
            id="close-cart-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scroll space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <ShoppingBag className="w-12 h-12 mb-3 stroke-[1.5] text-slate-300" />
              <p className="text-sm font-bold text-slate-600">Your bag is empty</p>
              <p className="text-xs text-slate-400 mt-1">Explore our gear and add items to your cart</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className="flex gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/70 relative"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-xl object-cover bg-white shrink-0 border border-slate-200"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-900 truncate pr-4">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                        aria-label="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {item.selectedColor.name} {item.selectedSize ? `• ${item.selectedSize}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-black text-slate-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-200 bg-white rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 rounded text-slate-600 hover:bg-slate-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, Math.min(item.product.stockCount, item.quantity + 1))
                        }
                        className="p-1 rounded text-slate-600 hover:bg-slate-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-extrabold text-sm text-slate-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <button
              id="cart-checkout-btn"
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
