import React, { useState, useEffect, useMemo } from 'react';
import {
  Product,
  CartItem,
  Order,
  DeviceOS,
  AppScreen,
  ProductColor,
} from './types';
import { PRODUCTS, CATEGORIES } from './data/products';
import { DeviceFrame } from './components/DeviceFrame';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { CartDrawer } from './components/CartDrawer';
import {
  Search,
  SlidersHorizontal,
  Bell,
  ShoppingBag,
  Heart,
  Store,
  Grid,
  ClipboardList,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Trash2,
  PackageCheck,
  MapPin
} from 'lucide-react';

export default function App() {
  const [deviceOS, setDeviceOS] = useState<DeviceOS>('responsive');
  const [activeTab, setActiveTab] = useState<AppScreen>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart, Wishlist, Orders local persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('flutter_store_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('flutter_store_wishlist');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-3'];
    } catch {
      return ['prod-1', 'prod-3'];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('flutter_store_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('flutter_store_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('flutter_store_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem('flutter_store_orders', JSON.stringify(orders));
  }, [orders]);

  // Current time for mobile status bar
  const currentTime = useMemo(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }, []);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Wishlisted products
  const wishlistedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  }, [wishlistIds]);

  // Wishlist toggle handler
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  // Add to cart handler
  const handleAddToCart = (
    product: Product,
    selectedColor: ProductColor,
    selectedSize?: string,
    quantity: number = 1
  ) => {
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedColor.name === selectedColor.name &&
        item.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        product,
        selectedColor,
        selectedSize: selectedSize || product.sizes[0],
        quantity,
      };
      setCartItems((prev) => [...prev, newItem]);
    }
  };

  // Quick add to cart directly from catalog card
  const handleQuickAddToCart = (product: Product) => {
    handleAddToCart(product, product.colors[0], product.sizes[0], 1);
  };

  // Instant Buy Now handler: directly opens CheckoutModal with the chosen product
  const handleBuyNow = (
    product: Product,
    selectedColor: ProductColor,
    selectedSize?: string,
    quantity: number = 1
  ) => {
    const singleItem: CartItem = {
      id: `buy-now-${product.id}-${Date.now()}`,
      product,
      selectedColor,
      selectedSize: selectedSize || product.sizes[0],
      quantity,
    };
    setCheckoutItems([singleItem]);
    setIsCheckoutOpen(true);
  };

  // Proceed to checkout from cart drawer
  const handleCartProceedCheckout = () => {
    if (cartItems.length === 0) return;
    setCheckoutItems([...cartItems]);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Update cart item quantity
  const handleUpdateCartQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
      );
    }
  };

  // Remove cart item
  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Order completed
  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Clear cart items if checkout was from cart
    if (checkoutItems.length === cartItems.length) {
      setCartItems([]);
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased selection:bg-slate-900 selection:text-white">
      {/* Main Center Stage */}
      <main className="flex-1 flex items-center justify-center p-0 sm:p-6 overflow-y-auto">
        <DeviceFrame
          deviceOS={deviceOS}
          currentTime={currentTime}
          showBack={Boolean(selectedProduct)}
          onBack={() => setSelectedProduct(null)}
        >
          {/* Internal Mobile App Views */}
          <div className="flex-1 flex flex-col relative w-full h-full bg-white">
            {/* Mobile Header Bar */}
            <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                  {activeTab === 'home' && 'Curated Collection'}
                  {activeTab === 'categories' && 'Browse Categories'}
                  {activeTab === 'wishlist' && 'Saved Items'}
                  {activeTab === 'orders' && 'Order History'}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {activeTab === 'home' && 'Premium lifestyle & everyday carry'}
                  {activeTab === 'categories' && 'Select department'}
                  {activeTab === 'wishlist' && `${wishlistedProducts.length} items saved`}
                  {activeTab === 'orders' && `${orders.length} orders placed`}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Cart Button */}
                <button
                  id="mobile-cart-trigger"
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                  aria-label="Open cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {totalCartCount > 0 && (
                    <span className="absolute 0 top-1 right-1 bg-slate-900 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {totalCartCount}
                    </span>
                  )}
                </button>
              </div>
            </header>

            {/* Content Body based on ActiveTab */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-16">
              {/* TAB 1: HOME (Store) */}
              {activeTab === 'home' && (
                <div className="p-4 space-y-4">
                  {/* Search input with live filter */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="mobile-search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search audio, watches, sneakers..."
                      className="w-full pl-9 pr-8 py-2.5 bg-white rounded-2xl border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Brand Flagship Showcase Banner */}
                  <div
                    id="flagship-banner"
                    className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white rounded-3xl p-4 sm:p-5 shadow-sm"
                  >
                    <div className="relative z-10 space-y-1 max-w-[220px]">
                      <span className="inline-flex items-center gap-1 bg-cyan-400/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border border-cyan-400/30">
                        <Sparkles className="w-3 h-3" /> Flagship Design
                      </span>
                      <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug pt-1">
                        PRECISION CRAFTED ESSENTIALS
                      </h3>
                      <p className="text-[11px] text-slate-300 font-medium">
                        Refined acoustics, minimalist wearables, and studio optics.
                      </p>
                    </div>

                    {/* Decorative Background Artwork */}
                    <div className="absolute right-[-10px] bottom-[-15px] opacity-15 pointer-events-none">
                      <ShoppingBag className="w-36 h-36 text-white" />
                    </div>
                  </div>

                  {/* Category Filter Pills */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Categories
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {filteredProducts.length} items
                      </span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                      {CATEGORIES.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            id={`cat-pill-${cat}`}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                              isSelected
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <h3 className="text-xs font-bold text-slate-900">
                        Tap product or image to open details & buy
                      </h3>
                    </div>

                    {filteredProducts.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 p-6">
                        <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-700">No products found</p>
                        <p className="text-xs text-slate-400 mt-1">Try another category or search term</p>
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('All');
                          }}
                          className="mt-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {filteredProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            isWishlisted={wishlistIds.includes(product.id)}
                            onOpenProduct={(p) => setSelectedProduct(p)}
                            onToggleWishlist={handleToggleWishlist}
                            onQuickAddToCart={handleQuickAddToCart}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: CATEGORIES */}
              {activeTab === 'categories' && (
                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-500">Select a collection to filter products</p>
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => {
                    const count = PRODUCTS.filter((p) => p.category === cat).length;
                    const sampleProduct = PRODUCTS.find((p) => p.category === cat);
                    return (
                      <div
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setActiveTab('home');
                        }}
                        className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm cursor-pointer flex items-center justify-between transition-all"
                      >
                        <div className="flex items-center gap-3">
                          {sampleProduct && (
                            <img
                              src={sampleProduct.images[0]}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                          )}
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{cat}</h4>
                            <p className="text-[11px] text-slate-400">{count} products available</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: WISHLIST */}
              {activeTab === 'wishlist' && (
                <div className="p-4 space-y-3">
                  {wishlistedProducts.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6">
                      <Heart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-slate-800">Your Wishlist is Empty</h4>
                      <p className="text-xs text-slate-400 mt-1">Tap the heart icon on any product to save it here</p>
                      <button
                        onClick={() => setActiveTab('home')}
                        className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                      >
                        Explore Products
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {wishlistedProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            onClick={() => setSelectedProduct(product)}
                            className="w-16 h-16 rounded-xl object-cover cursor-pointer"
                          />
                          <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {product.title}
                            </h4>
                            <p className="text-[11px] text-slate-500">${product.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleQuickAddToCart(product)}
                              className="p-2 bg-slate-900 text-white rounded-xl text-xs hover:bg-slate-800"
                              title="Add to bag"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleWishlist(product)}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                              title="Remove from saved"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: ORDERS */}
              {activeTab === 'orders' && (
                <div className="p-4 space-y-3">
                  {orders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6">
                      <PackageCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-slate-800">No Orders Yet</h4>
                      <p className="text-xs text-slate-400 mt-1">Select a product and use the "BUY NOW" option to place an order</p>
                      <button
                        onClick={() => setActiveTab('home')}
                        className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              Order #{order.id}
                            </span>
                            <p className="text-xs font-bold text-slate-800">{order.date}</p>
                          </div>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Confirmed
                          </span>
                        </div>

                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2.5 text-xs">
                              <img
                                src={item.product.images[0]}
                                alt=""
                                className="w-9 h-9 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 truncate">
                                  {item.product.title}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  {item.selectedColor.name} • Qty {item.quantity}
                                </p>
                              </div>
                              <span className="font-bold text-slate-900">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-slate-100 space-y-1">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <MapPin className="w-3 h-3 text-cyan-600 shrink-0" />
                            <span className="truncate">Delivered to: {order.shippingAddress.address}, {order.shippingAddress.city}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-slate-500 font-medium">Total Paid</span>
                            <span className="font-black text-slate-900">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Bottom Mobile Navigation Bar */}
            <nav className="absolute bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1 flex items-center justify-around">
              <button
                id="nav-store-btn"
                onClick={() => {
                  setSelectedProduct(null);
                  setActiveTab('home');
                }}
                className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
                  activeTab === 'home' && !selectedProduct
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Store className="w-4 h-4" />
                <span className="text-[10px] mt-0.5">Store</span>
              </button>

              <button
                id="nav-categories-btn"
                onClick={() => {
                  setSelectedProduct(null);
                  setActiveTab('categories');
                }}
                className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
                  activeTab === 'categories'
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span className="text-[10px] mt-0.5">Explore</span>
              </button>

              <button
                id="nav-wishlist-btn"
                onClick={() => {
                  setSelectedProduct(null);
                  setActiveTab('wishlist');
                }}
                className={`flex flex-col items-center py-1 px-3 rounded-xl relative transition-colors ${
                  activeTab === 'wishlist'
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span className="text-[10px] mt-0.5">Saved</span>
                {wishlistIds.length > 0 && (
                  <span className="absolute top-1 right-3 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                )}
              </button>

              <button
                id="nav-orders-btn"
                onClick={() => {
                  setSelectedProduct(null);
                  setActiveTab('orders');
                }}
                className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
                  activeTab === 'orders'
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span className="text-[10px] mt-0.5">Orders</span>
              </button>
            </nav>

            {/* PRODUCT DETAILS FULL VIEW (Opens upon clicking product image or card) */}
            {selectedProduct && (
              <ProductDetailModal
                product={selectedProduct}
                isWishlisted={wishlistIds.includes(selectedProduct.id)}
                onClose={() => setSelectedProduct(null)}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            )}

            {/* CART DRAWER */}
            <CartDrawer
              isOpen={isCartOpen}
              items={cartItems}
              onClose={() => setIsCartOpen(false)}
              onUpdateQuantity={handleUpdateCartQuantity}
              onRemoveItem={handleRemoveCartItem}
              onProceedToCheckout={handleCartProceedCheckout}
            />

            {/* CHECKOUT MODAL (Buy Option) */}
            {isCheckoutOpen && (
              <CheckoutModal
                items={checkoutItems}
                deviceOS={deviceOS}
                onClose={() => setIsCheckoutOpen(false)}
                onOrderCompleted={handleOrderCompleted}
              />
            )}
          </div>
        </DeviceFrame>
      </main>
    </div>
  );
}
