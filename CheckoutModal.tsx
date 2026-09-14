import React, { useState, useEffect } from 'react';
import { CartItem, DeviceOS, Order, ShippingAddress } from '../types';
import {
  X,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Loader2,
  Apple,
  Truck,
  Package,
  Receipt,
  Check,
  Navigation,
  Phone,
  User,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  items: CartItem[];
  deviceOS: DeviceOS;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

const DEFAULT_ADDRESS: ShippingAddress = {
  fullName: 'Alex Morgan',
  address: '742 Evergreen Terrace, Apt 4B',
  city: 'San Francisco',
  state: 'CA',
  zipCode: '94107',
  country: 'United States',
  phone: '+1 (555) 234-5678',
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  items,
  deviceOS,
  onClose,
  onOrderCompleted,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'google_pay' | 'card' | 'cod'>(
    deviceOS === 'ios' ? 'apple_pay' : 'google_pay'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Address state with local persistence (so it saves on localhost/personal computer)
  const [address, setAddress] = useState<ShippingAddress>(() => {
    try {
      const saved = localStorage.getItem('lumina_saved_delivery_address');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_ADDRESS;
  });

  // Temporary draft address while editing
  const [draftAddress, setDraftAddress] = useState<ShippingAddress>(address);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressSavedNotification, setAddressSavedNotification] = useState(false);

  // Subtotal calculation (Clean pricing without any OFF/discount option)
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleSaveAddress = () => {
    setAddress(draftAddress);
    try {
      localStorage.setItem('lumina_saved_delivery_address', JSON.stringify(draftAddress));
    } catch {
      // fallback
    }
    setIsEditingAddress(false);
    setAddressSavedNotification(true);
    setTimeout(() => setAddressSavedNotification(false), 3000);
  };

  const handleApplyPreset = (preset: Partial<ShippingAddress>) => {
    setDraftAddress((prev) => ({ ...prev, ...preset }));
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newOrder: Order = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        items,
        subtotal,
        discount: 0,
        shipping,
        total,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        paymentMethod,
        shippingAddress: address,
        status: 'confirmed',
      };

      setCompletedOrder(newOrder);
      onOrderCompleted(newOrder);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0f172a', '#0284c7', '#10b981', '#f59e0b', '#6366f1'],
        });
      } catch {
        // Confetti fallback
      }
    }, 1000);
  };

  return (
    <div
      id="checkout-modal-overlay"
      className="absolute inset-0 bg-slate-900/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="checkout-sheet"
        className="w-full bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              {completedOrder ? 'Order Confirmed' : 'Instant Checkout'}
            </h2>
          </div>
          <button
            id="close-checkout-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 custom-scroll space-y-4">
          {completedOrder ? (
            /* Order Success View */
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-600">
                  Payment Successful
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Thank you, {completedOrder.shippingAddress.fullName}!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Order ID: <span className="font-mono font-bold text-slate-800">{completedOrder.id}</span>
                </p>
              </div>

              {/* Delivery Destination Confirmation */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <MapPin className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Delivering to Your Specified Location:</span>
                </div>
                <div className="text-xs text-slate-600 pl-6 space-y-0.5">
                  <p className="font-bold text-slate-900">{completedOrder.shippingAddress.fullName}</p>
                  <p>{completedOrder.shippingAddress.address}</p>
                  <p>
                    {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} {completedOrder.shippingAddress.zipCode}
                  </p>
                  <p className="text-slate-500">{completedOrder.shippingAddress.country} • {completedOrder.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Receipt Summary */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-slate-400" /> Payment Receipt
                  </span>
                  <span className="capitalize">{completedOrder.paymentMethod.replace('_', ' ')}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  {completedOrder.items.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span className="truncate max-w-[200px]">
                        {it.quantity}x {it.product.title} ({it.selectedColor.name})
                      </span>
                      <span className="font-bold text-slate-800">
                        ${(it.product.price * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-200">
                    <span>Shipping</span>
                    <span>{completedOrder.shipping === 0 ? 'FREE' : `$${completedOrder.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-900 pt-1">
                    <span>Total Paid</span>
                    <span>${completedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                id="finish-order-btn"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-md"
              >
                Back to Mobile Store
              </button>
            </div>
          ) : (
            /* Active Checkout Form */
            <>
              {/* Order Items Summary */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/70 space-y-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Order Items ({items.length})
                </span>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {item.product.title}
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          {item.selectedColor.name} {item.selectedSize ? `• ${item.selectedSize}` : ''} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address / Location Changer */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <MapPin className="w-4 h-4 text-cyan-600" />
                    <span>Delivery Location & Address</span>
                  </div>
                  <button
                    id="edit-address-toggle"
                    type="button"
                    onClick={() => {
                      if (!isEditingAddress) {
                        setDraftAddress(address);
                      }
                      setIsEditingAddress(!isEditingAddress);
                    }}
                    className="text-[11px] font-bold text-cyan-600 hover:text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    {isEditingAddress ? 'Cancel' : 'Change Location'}
                  </button>
                </div>

                {addressSavedNotification && (
                  <div className="flex items-center gap-1.5 p-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold animate-in fade-in">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Location updated and saved to your device!</span>
                  </div>
                )}

                {isEditingAddress ? (
                  <div className="space-y-2.5 pt-1 text-xs animate-in fade-in duration-150">
                    <p className="text-[11px] text-slate-500">
                      Update your shipping details. Changes are saved for future orders on this device.
                    </p>

                    {/* Quick Presets */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Presets:</span>
                      <button
                        type="button"
                        onClick={() => handleApplyPreset({
                          fullName: 'Alex Morgan',
                          address: '742 Evergreen Terrace, Apt 4B',
                          city: 'San Francisco',
                          state: 'CA',
                          zipCode: '94107',
                          country: 'United States',
                        })}
                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold whitespace-nowrap"
                      >
                        Home (San Francisco)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyPreset({
                          fullName: 'Alex Morgan',
                          address: '500 Pike Street, Suite 1200',
                          city: 'Seattle',
                          state: 'WA',
                          zipCode: '98101',
                          country: 'United States',
                        })}
                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold whitespace-nowrap"
                      >
                        Office (Seattle)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyPreset({
                          fullName: 'Alex Morgan',
                          address: '120 Broadway, Floor 8',
                          city: 'New York',
                          state: 'NY',
                          zipCode: '10271',
                          country: 'United States',
                        })}
                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold whitespace-nowrap"
                      >
                        Studio (New York)
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Recipient Full Name</label>
                        <input
                          id="input-address-name"
                          type="text"
                          value={draftAddress.fullName}
                          onChange={(e) => setDraftAddress({ ...draftAddress, fullName: e.target.value })}
                          placeholder="e.g. Sarah Connor"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Street Address & Apartment</label>
                        <input
                          id="input-address-street"
                          type="text"
                          value={draftAddress.address}
                          onChange={(e) => setDraftAddress({ ...draftAddress, address: e.target.value })}
                          placeholder="e.g. 1042 Market Street, Apt 3"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">City</label>
                          <input
                            id="input-address-city"
                            type="text"
                            value={draftAddress.city}
                            onChange={(e) => setDraftAddress({ ...draftAddress, city: e.target.value })}
                            placeholder="e.g. Austin"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">State / Province</label>
                          <input
                            id="input-address-state"
                            type="text"
                            value={draftAddress.state}
                            onChange={(e) => setDraftAddress({ ...draftAddress, state: e.target.value })}
                            placeholder="e.g. TX"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">ZIP / Postal Code</label>
                          <input
                            id="input-address-zip"
                            type="text"
                            value={draftAddress.zipCode}
                            onChange={(e) => setDraftAddress({ ...draftAddress, zipCode: e.target.value })}
                            placeholder="e.g. 78701"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Contact Phone</label>
                          <input
                            id="input-address-phone"
                            type="text"
                            value={draftAddress.phone || ''}
                            onChange={(e) => setDraftAddress({ ...draftAddress, phone: e.target.value })}
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Country</label>
                        <input
                          id="input-address-country"
                          type="text"
                          value={draftAddress.country}
                          onChange={(e) => setDraftAddress({ ...draftAddress, country: e.target.value })}
                          placeholder="United States"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <button
                      id="save-address-btn"
                      type="button"
                      onClick={handleSaveAddress}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Save & Use This Location
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-slate-600 pl-6 space-y-0.5">
                    <p className="font-bold text-slate-900">{address.fullName}</p>
                    <p>{address.address}</p>
                    <p>{address.city}, {address.state} {address.zipCode}, {address.country}</p>
                    {address.phone && (
                      <p className="text-[11px] text-slate-400">Phone: {address.phone}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 block">
                  Select Payment Option
                </span>

                {/* Option 1: Native Mobile Pay */}
                {deviceOS === 'ios' ? (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'apple_pay'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Apple className="w-5 h-5 fill-current" />
                      <div>
                        <span className="text-xs font-black block">Apple Pay</span>
                        <span className="text-[10px] opacity-80">Instant Biometric Touch ID / Face ID</span>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'apple_pay' ? 'border-white bg-white text-slate-900' : 'border-slate-300'
                    }`}>
                      {paymentMethod === 'apple_pay' && <div className="w-2 h-2 rounded-full bg-slate-900" />}
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('google_pay')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'google_pay'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-black text-sm tracking-tight text-white bg-blue-600 px-1.5 py-0.5 rounded">G</span>
                      <div>
                        <span className="text-xs font-black block">Google Pay</span>
                        <span className="text-[10px] opacity-80">Fast Android 1-Tap Checkout</span>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'google_pay' ? 'border-white bg-white text-slate-900' : 'border-slate-300'
                    }`}>
                      {paymentMethod === 'google_pay' && <div className="w-2 h-2 rounded-full bg-slate-900" />}
                    </div>
                  </button>
                )}

                {/* Option 2: Credit Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'card'
                      ? 'border-slate-900 bg-slate-50 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-5 h-5 text-slate-700" />
                    <div>
                      <span className="text-xs font-bold block text-slate-900">Credit / Debit Card</span>
                      <span className="text-[10px] text-slate-500">Visa, Mastercard ending in •••• 4242</span>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-slate-900 bg-slate-900' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              </div>

              {/* Price Calculation Summary (Original Regular Pricing, No OFF) */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Standard Shipping</span>
                  <span className="font-semibold text-slate-800">
                    {shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900">
                  <span>Total Amount</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Action */}
        {!completedOrder && (
          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <button
              id="confirm-pay-btn"
              disabled={isProcessing || items.length === 0}
              onClick={handlePlaceOrder}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <span>CONFIRM ORDER</span>
                  <span>•</span>
                  <span>${total.toFixed(2)}</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              🔒 Encrypted Express Checkout • Delivers in 2-4 Business Days
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
