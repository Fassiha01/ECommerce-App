export interface FlutterFile {
  name: string;
  path: string;
  language: string;
  code: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    name: 'main.dart',
    path: 'lib/main.dart',
    language: 'dart',
    code: `import 'package:flutter/material.dart';
import 'state/app_state.dart';
import 'screens/home_screen.dart';
import 'screens/categories_screen.dart';
import 'screens/wishlist_screen.dart';
import 'screens/orders_screen.dart';
import 'widgets/cart_sheet.dart';

void main() {
  runApp(const LuminaStudioApp());
}

class LuminaStudioApp extends StatefulWidget {
  const LuminaStudioApp({Key? key}) : super(key: key);

  @override
  State<LuminaStudioApp> createState() => _LuminaStudioAppState();
}

class _LuminaStudioAppState extends State<LuminaStudioApp> {
  final AppState _appState = AppState();

  @override
  void dispose() {
    _appState.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppStateScope(
      notifier: _appState,
      child: MaterialApp(
        title: 'Lumina Studio',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          fontFamily: 'Inter',
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF0F172A),
            primary: const Color(0xFF0F172A),
            secondary: const Color(0xFF0284C7),
            surface: Colors.white,
          ),
          scaffoldBackgroundColor: const Color(0xFFF8FAFC),
          appBarTheme: const AppBarTheme(
            backgroundColor: Colors.white,
            foregroundColor: Color(0xFF0F172A),
            elevation: 0,
          ),
        ),
        home: const MainNavigationShell(),
      ),
    );
  }
}

class MainNavigationShell extends StatelessWidget {
  const MainNavigationShell({Key? key}) : super(key: key);

  final List<Widget> _pages = const [
    HomeScreen(),
    CategoriesScreen(),
    WishlistScreen(),
    OrdersScreen(),
  ];

  String _getTabTitle(int index) {
    switch (index) {
      case 0:
        return 'Curated Collection';
      case 1:
        return 'Browse Categories';
      case 2:
        return 'Saved Items';
      case 3:
        return 'Order History';
      default:
        return 'Lumina Studio';
    }
  }

  @override
  Widget build(BuildContext context) {
    final appState = AppStateScope.of(context);
    final currentIndex = appState.activeTabIndex;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'LUMINA STUDIO',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.5,
                color: Color(0xFF94A3B8),
              ),
            ),
            Text(
              _getTabTitle(currentIndex),
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w900,
                color: Color(0xFF0F172A),
              ),
            ),
          ],
        ),
        actions: [
          // Wishlist quick jump button
          IconButton(
            icon: Stack(
              clipBehavior: Clip.none,
              children: [
                Icon(
                  currentIndex == 2 ? Icons.favorite : Icons.favorite_border,
                  color: currentIndex == 2 ? Colors.red : const Color(0xFF0F172A),
                ),
                if (appState.wishlistIds.isNotEmpty)
                  Positioned(
                    top: -4,
                    right: -4,
                    child: Container(
                      padding: const EdgeInsets.all(3),
                      decoration: const BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                      child: Text(
                        '\${appState.wishlistIds.length}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            onPressed: () => appState.setActiveTab(2),
          ),
          // Cart Button with live badge counter
          IconButton(
            icon: Stack(
              clipBehavior: Clip.none,
              children: [
                const Icon(Icons.shopping_bag_outlined),
                if (appState.cartCount > 0)
                  Positioned(
                    top: -4,
                    right: -4,
                    child: Container(
                      padding: const EdgeInsets.all(3),
                      decoration: const BoxDecoration(
                        color: Color(0xFF0F172A),
                        shape: BoxShape.circle,
                      ),
                      child: Text(
                        '\${appState.cartCount}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            onPressed: () => CartSheet.show(context),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: IndexedStack(
        index: currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: currentIndex,
        onDestinationSelected: (idx) => appState.setActiveTab(idx),
        destinations: [
          const NavigationDestination(
            icon: Icon(Icons.storefront_outlined),
            selectedIcon: Icon(Icons.storefront),
            label: 'Store',
          ),
          const NavigationDestination(
            icon: Icon(Icons.grid_view_outlined),
            selectedIcon: Icon(Icons.grid_view),
            label: 'Categories',
          ),
          NavigationDestination(
            icon: Badge(
              isLabelVisible: appState.wishlistIds.isNotEmpty,
              label: Text('\${appState.wishlistIds.length}'),
              child: const Icon(Icons.favorite_outline),
            ),
            selectedIcon: Badge(
              isLabelVisible: appState.wishlistIds.isNotEmpty,
              label: Text('\${appState.wishlistIds.length}'),
              child: const Icon(Icons.favorite),
            ),
            label: 'Wishlist',
          ),
          NavigationDestination(
            icon: Badge(
              isLabelVisible: appState.orders.isNotEmpty,
              label: Text('\${appState.orders.length}'),
              child: const Icon(Icons.receipt_long_outlined),
            ),
            selectedIcon: Badge(
              isLabelVisible: appState.orders.isNotEmpty,
              label: Text('\${appState.orders.length}'),
              child: const Icon(Icons.receipt_long),
            ),
            label: 'Orders',
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    name: 'product.dart',
    path: 'lib/models/product.dart',
    language: 'dart',
    code: `class ProductColor {
  final String name;
  final int colorHex;

  const ProductColor({
    required this.name,
    required this.colorHex,
  });
}

class Product {
  final String id;
  final String title;
  final String subtitle;
  final String brand;
  final double price;
  final double rating;
  final int reviewCount;
  final String category;
  final String description;
  final List<String> features;
  final Map<String, String> specs;
  final List<ProductColor> colors;
  final List<String> sizes;
  final List<String> images;
  final bool inStock;
  final int stockCount;

  const Product({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.brand,
    required this.price,
    required this.rating,
    required this.reviewCount,
    required this.category,
    required this.description,
    required this.features,
    required this.specs,
    required this.colors,
    required this.sizes,
    required this.images,
    required this.inStock,
    required this.stockCount,
  });
}

class CartItemModel {
  final String id;
  final Product product;
  final ProductColor selectedColor;
  final String selectedSize;
  int quantity;

  CartItemModel({
    required this.id,
    required this.product,
    required this.selectedColor,
    required this.selectedSize,
    this.quantity = 1,
  });
}

class AddressModel {
  String name;
  String street;
  String cityZip;
  String phone;

  AddressModel({
    required this.name,
    required this.street,
    required this.cityZip,
    required this.phone,
  });

  AddressModel copyWith({
    String? name,
    String? street,
    String? cityZip,
    String? phone,
  }) {
    return AddressModel(
      name: name ?? this.name,
      street: street ?? this.street,
      cityZip: cityZip ?? this.cityZip,
      phone: phone ?? this.phone,
    );
  }
}

class OrderModel {
  final String id;
  final DateTime date;
  final List<CartItemModel> items;
  final double subtotal;
  final double shipping;
  final double total;
  final String status;
  final AddressModel address;

  OrderModel({
    required this.id,
    required this.date,
    required this.items,
    required this.subtotal,
    required this.shipping,
    required this.total,
    required this.status,
    required this.address,
  });
}

const List<String> CATEGORIES = [
  'All',
  'Audio & Tech',
  'Footwear',
  'Wearables',
  'Accessories',
  'Photography',
];

const List<Product> SAMPLE_PRODUCTS = [
  Product(
    id: 'prod-1',
    title: 'AeroPulse Pro Wireless Headphones',
    subtitle: 'Active Noise Cancelling & Spatial Audio',
    brand: 'Acoustic Labs',
    price: 249.99,
    rating: 4.9,
    reviewCount: 1420,
    category: 'Audio & Tech',
    description: 'Experience studio-grade acoustics crafted for audiophiles and mobile creators with 45-hour battery lifespan.',
    features: [
      'Active Noise Cancellation with Transparency Mode',
      'Lossless 24-bit Hi-Res audio playback',
      'Multipoint Bluetooth 5.4 connection for 2 devices',
      'Fast charge: 10 mins gives 5 hours of playback'
    ],
    specs: {
      'Driver': '40mm Titanium Composite',
      'Battery': 'Up to 45 hours',
      'Weight': '248g',
      'Bluetooth': 'v5.4 aptX Adaptive'
    },
    colors: [
      ProductColor(name: 'Midnight Obsidian', colorHex: 0xFF1E293B),
      ProductColor(name: 'Titanium Silver', colorHex: 0xFF94A3B8),
      ProductColor(name: 'Warm Cream', colorHex: 0xFFE2D9CC),
    ],
    sizes: ['Standard'],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    ],
    inStock: true,
    stockCount: 18,
  ),
  Product(
    id: 'prod-2',
    title: 'Pulse Horizon Smartwatch Gen 4',
    subtitle: 'Always-On Retina AMOLED & ECG Monitor',
    brand: 'Chronos Wear',
    price: 329.00,
    rating: 4.8,
    reviewCount: 984,
    category: 'Wearables',
    description: 'A precision-engineered titanium timepiece with advanced cardiovascular bio-sensors and dual-band GPS navigation.',
    features: [
      'Grade 5 Aerospace Titanium bezel with Sapphire crystal',
      'Medical-grade ECG and blood oxygen SpO2 monitoring',
      'Water-resistant to 50 meters (5 ATM)',
      'Fast magnetic wireless charging cradle included'
    ],
    specs: {
      'Case': '44mm Aerospace Titanium',
      'Display': '1.43" AMOLED 466x466 (1000 nits)',
      'Battery': '7 days standard / 36 hrs GPS',
      'Water Rating': '5 ATM (50m)'
    },
    colors: [
      ProductColor(name: 'Graphite Black', colorHex: 0xFF18181B),
      ProductColor(name: 'Starlight Silver', colorHex: 0xFFD4D4D8),
      ProductColor(name: 'Midnight Navy', colorHex: 0xFF1E3A8A),
    ],
    sizes: ['40mm', '44mm'],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
    ],
    inStock: true,
    stockCount: 11,
  ),
  Product(
    id: 'prod-3',
    title: 'Veloce Air Stride Athletic Sneakers',
    subtitle: 'Carbon Plate Cushioning & Breathable Knit',
    brand: 'Veloce Performance',
    price: 159.50,
    rating: 4.7,
    reviewCount: 652,
    category: 'Footwear',
    description: 'Engineered for marathon runners and urban commuters seeking ultra-responsive energy return and lightweight comfort.',
    features: [
      'Proprietary full-length carbon composite speed plate',
      'Engineered jacquard mono-mesh upper with high breathability',
      'Supercritical nitrogen-infused EVA foam midsole',
      'High-abrasion Continental rubber outsole lugs'
    ],
    specs: {
      'Weight': '210g (US Men 9)',
      'Heel Drop': '8mm (36mm heel / 28mm forefoot)',
      'Upper': 'Seamless engineered mesh',
      'Midsole': 'Supercritical Foam + Carbon'
    },
    colors: [
      ProductColor(name: 'Volt Crimson', colorHex: 0xFFEF4444),
      ProductColor(name: 'Phantom White', colorHex: 0xFFF1F5F9),
      ProductColor(name: 'Core Black', colorHex: 0xFF09090B),
    ],
    sizes: ['US 8', 'US 9', 'US 10', 'US 11'],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    ],
    inStock: true,
    stockCount: 24,
  ),
  Product(
    id: 'prod-4',
    title: 'Lumina Prime Mirrorless Rangefinder',
    subtitle: '45MP Full-Frame Sensor & 4K 120fps Video',
    brand: 'Lumina Optics',
    price: 1899.00,
    rating: 4.9,
    reviewCount: 388,
    category: 'Photography',
    description: 'Handcrafted magnesium body with optical rangefinder dial, ultra-fast phase-detection autofocus, and weather sealing.',
    features: [
      '45.2MP BSI CMOS full-frame sensor with 15 stops dynamic range',
      '5-axis in-body image stabilization (IBIS) rated for 8 stops',
      'Mechanical shutter up to 1/8000s and 20fps silent electronic burst',
      'Dual CFexpress Type B and UHS-II SD card slots'
    ],
    specs: {
      'Sensor': '45.2 MP Full-Frame BSI CMOS',
      'ISO Range': '50 - 102,400 extended',
      'Video': '4K UHD up to 120fps 10-bit 4:2:2',
      'Weight': '640g (Body only)'
    },
    colors: [
      ProductColor(name: 'Classic Matte Black', colorHex: 0xFF18181B),
      ProductColor(name: 'Vintage Silver Chrome', colorHex: 0xFFCBD5E1),
    ],
    sizes: ['Body Only', 'With 35mm f/1.4'],
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80',
    ],
    inStock: true,
    stockCount: 6,
  ),
  Product(
    id: 'prod-5',
    title: 'Monolith Minimalist Carry Backpack',
    subtitle: 'Cordura Ballistic Nylon & Magnetic Clasp',
    brand: 'Monolith Goods',
    price: 189.00,
    rating: 4.8,
    reviewCount: 420,
    category: 'Accessories',
    description: 'Weatherproof commute pack with dedicated 16" laptop sleeve, hidden passport security pocket, and Fidlock magnetic closures.',
    features: [
      '1680D Cordura ballistic nylon exterior with water-repellent DWR coating',
      'Quick-access magnetic Fidlock front buckles',
      'Padded suspended compartment for up to 16-inch MacBook Pro',
      'Ergonomic EVA-molded back ventilation channels'
    ],
    specs: {
      'Capacity': '22 Liters',
      'Dimensions': '48 x 30 x 16 cm',
      'Weight': '980g',
      'Material': '1680D Cordura Nylon'
    },
    colors: [
      ProductColor(name: 'Pitch Black', colorHex: 0xFF0F172A),
      ProductColor(name: 'Slate Charcoal', colorHex: 0xFF475569),
      ProductColor(name: 'Forest Olive', colorHex: 0xFF3F6212),
    ],
    sizes: ['22L Standard'],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
    ],
    inStock: true,
    stockCount: 15,
  ),
  Product(
    id: 'prod-6',
    title: 'Studio Acoustics Soundbar System',
    subtitle: 'Dolby Atmos 7.1.2 & Wireless Subwoofer',
    brand: 'Acoustic Labs',
    price: 499.00,
    rating: 4.9,
    reviewCount: 310,
    category: 'Audio & Tech',
    description: 'Immersive cinema sound featuring upward-firing height channels, room calibration microphone, and AirPlay 2 / Spotify Connect.',
    features: [
      'True 7.1.2 physical surround channels with 11 dedicated drivers',
      'Wireless 8-inch high-excursion downward firing subwoofer',
      'HDMI eARC with 4K HDR10+ and Dolby Vision passthrough',
      'Integrated acoustic room measurement and auto-tuning'
    ],
    specs: {
      'Power Output': '520W Peak Total',
      'Frequency Response': '32Hz - 22,000Hz',
      'Inputs': 'HDMI eARC, Optical, Aux, Bluetooth 5.3',
      'Dimensions': '102 x 7.5 x 11 cm'
    },
    colors: [
      ProductColor(name: 'Graphite Fabric', colorHex: 0xFF27272A),
      ProductColor(name: 'Matte White', colorHex: 0xFFF4F4F5),
    ],
    sizes: ['System Bundle'],
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    ],
    inStock: true,
    stockCount: 8,
  ),
];
`,
  },
  {
    name: 'app_state.dart',
    path: 'lib/state/app_state.dart',
    language: 'dart',
    code: `import 'package:flutter/material.dart';
import '../models/product.dart';

class AppState extends ChangeNotifier {
  int _activeTabIndex = 0;
  String _selectedCategory = 'All';
  String _searchQuery = '';
  final Set<String> _wishlistIds = {'prod-1', 'prod-4'};
  final List<CartItemModel> _cartItems = [];
  final List<OrderModel> _orders = [
    OrderModel(
      id: 'ORD-89421',
      date: DateTime.now().subtract(const Duration(days: 2)),
      items: [
        CartItemModel(
          id: 'item-init-1',
          product: SAMPLE_PRODUCTS[0],
          selectedColor: SAMPLE_PRODUCTS[0].colors[0],
          selectedSize: SAMPLE_PRODUCTS[0].sizes[0],
          quantity: 1,
        ),
      ],
      subtotal: 249.99,
      shipping: 0.0,
      total: 249.99,
      status: 'Delivered',
      address: AddressModel(
        name: 'Alex Morgan',
        street: '742 Evergreen Terrace, Suite 4B',
        cityZip: 'San Francisco, CA 94107',
        phone: '+1 (555) 234-5678',
      ),
    ),
  ];

  AddressModel _deliveryAddress = AddressModel(
    name: 'Alex Morgan',
    street: '742 Evergreen Terrace, Suite 4B',
    cityZip: 'San Francisco, CA 94107',
    phone: '+1 (555) 234-5678',
  );

  // Getters
  int get activeTabIndex => _activeTabIndex;
  String get selectedCategory => _selectedCategory;
  String get searchQuery => _searchQuery;
  Set<String> get wishlistIds => _wishlistIds;
  List<CartItemModel> get cartItems => List.unmodifiable(_cartItems);
  List<OrderModel> get orders => List.unmodifiable(_orders);
  AddressModel get deliveryAddress => _deliveryAddress;

  int get cartCount => _cartItems.fold(0, (sum, item) => sum + item.quantity);
  double get cartSubtotal => _cartItems.fold(0.0, (sum, item) => sum + (item.product.price * item.quantity));

  List<Product> get wishlistedProducts =>
      SAMPLE_PRODUCTS.where((p) => _wishlistIds.contains(p.id)).toList();

  List<Product> get filteredProducts {
    return SAMPLE_PRODUCTS.where((product) {
      final matchesCat = _selectedCategory == 'All' || product.category == _selectedCategory;
      final matchesSearch = _searchQuery.isEmpty ||
          product.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          product.description.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    }).toList();
  }

  // Navigation & Category Filtering
  void setActiveTab(int index) {
    _activeTabIndex = index;
    notifyListeners();
  }

  void setSelectedCategory(String category) {
    _selectedCategory = category;
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  // Wishlist
  bool isWishlisted(String productId) => _wishlistIds.contains(productId);

  void toggleWishlist(String productId) {
    if (_wishlistIds.contains(productId)) {
      _wishlistIds.remove(productId);
    } else {
      _wishlistIds.add(productId);
    }
    notifyListeners();
  }

  // Cart
  void addToCart(Product product, ProductColor color, String size, [int quantity = 1]) {
    final existingIndex = _cartItems.indexWhere(
      (item) =>
          item.product.id == product.id &&
          item.selectedColor.name == color.name &&
          item.selectedSize == size,
    );

    if (existingIndex >= 0) {
      _cartItems[existingIndex].quantity += quantity;
    } else {
      _cartItems.add(CartItemModel(
        id: '\${product.id}-\${DateTime.now().millisecondsSinceEpoch}',
        product: product,
        selectedColor: color,
        selectedSize: size,
        quantity: quantity,
      ));
    }
    notifyListeners();
  }

  void updateCartQuantity(String itemId, int newQuantity) {
    if (newQuantity <= 0) {
      _cartItems.removeWhere((item) => item.id == itemId);
    } else {
      final index = _cartItems.indexWhere((item) => item.id == itemId);
      if (index >= 0) {
        _cartItems[index].quantity = newQuantity;
      }
    }
    notifyListeners();
  }

  void removeFromCart(String itemId) {
    _cartItems.removeWhere((item) => item.id == itemId);
    notifyListeners();
  }

  void clearCart() {
    _cartItems.clear();
    notifyListeners();
  }

  // Address
  void updateDeliveryAddress(AddressModel newAddress) {
    _deliveryAddress = newAddress;
    notifyListeners();
  }

  // Orders
  void addOrder(OrderModel order) {
    _orders.insert(0, order);
    notifyListeners();
  }
}

class AppStateScope extends InheritedNotifier<AppState> {
  const AppStateScope({
    Key? key,
    required AppState notifier,
    required Widget child,
  }) : super(key: key, notifier: notifier, child: child);

  static AppState of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<AppStateScope>();
    assert(scope != null, 'No AppStateScope found in context');
    return scope!.notifier!;
  }
}
`,
  },
  {
    name: 'app_network_image.dart',
    path: 'lib/widgets/app_network_image.dart',
    language: 'dart',
    code: `import 'package:flutter/material.dart';

class AppNetworkImage extends StatelessWidget {
  final String imageUrl;
  final BoxFit fit;
  final double? width;
  final double? height;
  final BorderRadius? borderRadius;
  final String? placeholderTitle;
  final String? category;

  const AppNetworkImage({
    Key? key,
    required this.imageUrl,
    this.fit = BoxFit.cover,
    this.width,
    this.height,
    this.borderRadius,
    this.placeholderTitle,
    this.category,
  }) : super(key: key);

  IconData _getCategoryIcon(String? cat) {
    switch (cat) {
      case 'Audio & Tech':
        return Icons.headphones_outlined;
      case 'Footwear':
        return Icons.hiking_outlined;
      case 'Wearables':
        return Icons.watch_outlined;
      case 'Photography':
        return Icons.camera_alt_outlined;
      case 'Accessories':
        return Icons.backpack_outlined;
      default:
        return Icons.shopping_bag_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    Widget imageWidget = Image.network(
      imageUrl,
      width: width,
      height: height,
      fit: fit,
      loadingBuilder: (context, child, loadingProgress) {
        if (loadingProgress == null) return child;
        final expectedBytes = loadingProgress.expectedTotalBytes;
        final loadedBytes = loadingProgress.cumulativeBytesLoaded;
        return Container(
          width: width,
          height: height,
          color: const Color(0xFFF1F5F9),
          child: Center(
            child: SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: const Color(0xFF0F172A),
                value: expectedBytes != null && expectedBytes > 0
                    ? loadedBytes / expectedBytes
                    : null,
              ),
            ),
          ),
        );
      },
      errorBuilder: (context, error, stackTrace) {
        return Container(
          width: width,
          height: height,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: borderRadius,
          ),
          padding: const EdgeInsets.all(12),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Icon(
                _getCategoryIcon(category),
                color: const Color(0xFF38BDF8),
                size: (height != null && height! < 120) ? 24 : 34,
              ),
              const SizedBox(height: 6),
              if (placeholderTitle != null)
                Text(
                  placeholderTitle!,
                  textAlign: TextAlign.center,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
            ],
          ),
        );
      },
    );

    if (borderRadius != null) {
      return ClipRRect(
        borderRadius: borderRadius!,
        child: imageWidget,
      );
    }

    return imageWidget;
  }
}
`,
  },
  {
    name: 'product_card.dart',
    path: 'lib/widgets/product_card.dart',
    language: 'dart',
    code: `import 'package:flutter/material.dart';
import '../models/product.dart';
import '../screens/product_detail_screen.dart';
import '../state/app_state.dart';
import 'app_network_image.dart';

class ProductCard extends StatelessWidget {
  final Product product;

  const ProductCard({Key? key, required this.product}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final appState = AppStateScope.of(context);
    final isWishlisted = appState.isWishlisted(product.id);

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ProductDetailScreen(product: product),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Image & Wishlist Button
            Expanded(
              child: Stack(
                children: [
                  Positioned.fill(
                    child: Hero(
                      tag: 'product-image-\${product.id}',
                      child: AppNetworkImage(
                        imageUrl: product.images.first,
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
                        placeholderTitle: product.title,
                        category: product.category,
                      ),
                    ),
                  ),
                  // Wishlist Floating Button
                  Positioned(
                    top: 8,
                    right: 8,
                    child: GestureDetector(
                      onTap: () {
                        appState.toggleWishlist(product.id);
                      },
                      child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.92),
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.06),
                              blurRadius: 4,
                            ),
                          ],
                        ),
                        child: Icon(
                          isWishlisted ? Icons.favorite : Icons.favorite_border,
                          size: 16,
                          color: isWishlisted ? Colors.red : const Color(0xFF64748B),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Product Information Details
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        product.brand.toUpperCase(),
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: Colors.grey[500],
                          letterSpacing: 0.8,
                        ),
                      ),
                      Row(
                        children: [
                          const Icon(Icons.star, size: 13, color: Colors.amber),
                          const SizedBox(width: 2),
                          Text(
                            product.rating.toString(),
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    product.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '\\$\${product.price.toStringAsFixed(2)}',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      InkWell(
                        onTap: () {
                          appState.addToCart(
                            product,
                            product.colors.first,
                            product.sizes.first,
                            1,
                          );
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Added \${product.title} to bag'),
                              duration: const Duration(seconds: 1),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                        },
                        borderRadius: BorderRadius.circular(8),
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: const Color(0xFF0F172A),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(
                            Icons.add_shopping_bag_outlined,
                            size: 14,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`,
  },
  {
    name: 'cart_sheet.dart',
    path: 'lib/widgets/cart_sheet.dart',
    language: 'dart',
    code: `import 'package:flutter/material.dart';
import '../state/app_state.dart';
import '../screens/checkout_screen.dart';
import 'app_network_image.dart';

class CartSheet extends StatelessWidget {
  const CartSheet({Key? key}) : super(key: key);

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const CartSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final appState = AppStateScope.of(context);
    final items = appState.cartItems;
    final subtotal = appState.cartSubtotal;

    return Container(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.85,
      ),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag handle & Header
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 12),
            child: Column(
              children: [
                Center(
                  child: Container(
                    width: 36,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey[300],
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Text(
                          'Shopping Bag',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFF0F172A),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            '\${appState.cartCount}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, size: 20),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: Color(0xFFF1F5F9)),

          // Items list or empty state
          Flexible(
            child: items.isEmpty
                ? Padding(
                    padding: const EdgeInsets.symmetric(vertical: 48, horizontal: 24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.shopping_bag_outlined, size: 48, color: Colors.grey[300]),
                        const SizedBox(height: 12),
                        const Text(
                          'Your bag is empty',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Items added from the catalog will show up here',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                        ),
                      ],
                    ),
                  )
                : ListView.separated(
                    shrinkWrap: true,
                    padding: const EdgeInsets.all(16),
                    itemCount: items.length,
                    separatorBuilder: (_, __) => const Divider(height: 16, color: Color(0xFFF1F5F9)),
                    itemBuilder: (context, index) {
                      final item = items[index];
                      return Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: AppNetworkImage(
                              imageUrl: item.product.images.first,
                              width: 64,
                              height: 64,
                              placeholderTitle: item.product.title,
                              category: item.product.category,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item.product.title,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF0F172A),
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '\${item.selectedColor.name} • \${item.selectedSize}',
                                  style: TextStyle(fontSize: 11, color: Colors.grey[600]),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '\\$\${(item.product.price * item.quantity).toStringAsFixed(2)}',
                                  style: const TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF0F172A),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          // Quantity Controls
                          Container(
                            decoration: BoxDecoration(
                              color: const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: const Color(0xFFE2E8F0)),
                            ),
                            child: Row(
                              children: [
                                InkWell(
                                  onTap: () {
                                    appState.updateCartQuantity(item.id, item.quantity - 1);
                                  },
                                  borderRadius: BorderRadius.circular(8),
                                  child: const Padding(
                                    padding: EdgeInsets.all(6),
                                    child: Icon(Icons.remove, size: 14),
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 8),
                                  child: Text(
                                    '\${item.quantity}',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                                InkWell(
                                  onTap: () {
                                    appState.updateCartQuantity(item.id, item.quantity + 1);
                                  },
                                  borderRadius: BorderRadius.circular(8),
                                  child: const Padding(
                                    padding: EdgeInsets.all(6),
                                    child: Icon(Icons.add, size: 14),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      );
                    },
                  ),
          ),

          // Bottom Checkout Bar
          if (items.isNotEmpty)
            SafeArea(
              top: false,
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  border: Border(top: BorderSide(color: Color(0xFFF1F5F9))),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Subtotal',
                          style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
                        ),
                        Text(
                          '\\$\${subtotal.toStringAsFixed(2)}',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.pop(context); // Close cart sheet
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => CheckoutScreen(
                                checkoutItems: items,
                              ),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0F172A),
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'PROCEED TO CHECKOUT',
                              style: TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 13,
                                letterSpacing: 0.5,
                              ),
                            ),
                            SizedBox(width: 8),
                            Icon(Icons.arrow_forward, size: 16),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
`,
  },
  {
    name: 'home_screen.dart',
    path: 'lib/screens/home_screen.dart',
    language: 'dart',
    code: `import 'package:flutter/material.dart';
import '../models/product.dart';
import '../state/app_state.dart';
import '../widgets/product_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final appState = AppStateScope.of(context);
    final products = appState.filteredProducts;
    final selectedCategory = appState.selectedCategory;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Search Bar
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.02),
                      blurRadius: 4,
                      offset: const Offset(0, 1),
                    ),
                  ],
                ),
                child: TextField(
                  onChanged: (val) => appState.setSearchQuery(val),
                  decoration: InputDecoration(
                    hintText: 'Search audio, watches, sneakers...',
                    hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                    prefixIcon: const Icon(Icons.search, color: Color(0xFF94A3B8), size: 20),
                    suffixIcon: appState.searchQuery.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear, size: 16, color: Color(0xFF94A3B8)),
                            onPressed: () => appState.setSearchQuery(''),
                          )
                        : null,
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Flagship Showcase Banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF0F172A), Color(0xFF1E293B), Color(0xFF334155)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF38BDF8).withOpacity(0.2),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: const Color(0xFF38BDF8).withOpacity(0.4)),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.auto_awesome, size: 12, color: Color(0xFF38BDF8)),
                          SizedBox(width: 4),
                          Text(
                            'FLAGSHIP DESIGN',
                            style: TextStyle(
                              color: Color(0xFF38BDF8),
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'PRECISION CRAFTED ESSENTIALS',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -0.3,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Refined acoustics, minimalist wearables, and studio optics.',
                      style: TextStyle(color: Color(0xFFCBD5E1), fontSize: 11),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Category Selector
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'CATEGORIES',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF64748B),
                      letterSpacing: 0.8,
                    ),
                  ),
                  Text(
                    '\${products.length} items',
                    style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              SizedBox(
                height: 36,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: CATEGORIES.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, index) {
                    final cat = CATEGORIES[index];
                    final isSelected = selectedCategory == cat;
                    return ChoiceChip(
                      label: Text(cat),
                      selected: isSelected,
                      selectedColor: const Color(0xFF0F172A),
                      labelStyle: TextStyle(
                        color: isSelected ? Colors.white : const Color(0xFF334155),
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                      backgroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                        side: BorderSide(
                          color: isSelected ? const Color(0xFF0F172A) : const Color(0xFFE2E8F0),
                        ),
                      ),
                      onSelected: (val) {
                        if (val) appState.setSelectedCategory(cat);
                      },
                    );
                  },
                ),
              ),
              const SizedBox(height: 20),

              // Product Grid
              if (products.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.search_off, size: 40, color: Color(0xFF94A3B8)),
                      const SizedBox(height: 8),
                      const Text(
                        'No products found',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Try clearing your search or selecting another category',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey, fontSize: 11),
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: () {
                          appState.setSearchQuery('');
                          appState.setSelectedCategory('All');
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0F172A),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        child: const Text('Reset Filters'),
                      ),
                    ],
                  ),
                )
              else
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.68,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  itemCount: products.length,
                  itemBuilder: (context, index) {
                    return ProductCard(product: products[index]);
                  },
                ),
            ],
          ),
        ),
      ),
    );
  }
}
`,
  },
  {
    name: 'categories_screen.dart',
    path: 'lib/screens/categories_screen.dart',
    language: 'dart',
    code: `import 'package:flutter/material.dart';
import '../models/product.dart';
import '../state/app_state.dart';
import '../widgets/app_network_image.dart';

class CategoriesScreen extends StatelessWidget {
  const CategoriesScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final appState = AppStateScope.of(context);
    final categories = CATEGORIES.where((c) => c != 'All').toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Explore Collections',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'Select a department to filter products and view specialized items',
                style: TextStyle(
                  fontSize: 12,
                  color: Color(0xFF64748B),
                ),
              ),
              const SizedBox(height: 16),

              // Categories List
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: categories.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final cat = categories[index];
                  final matchingProducts = SAMPLE_PRODUCTS.where((p) => p.category == cat).toList();
                  final sampleProduct = matchingProducts.isNotEmpty ? matchingProducts.first : null;

                  return GestureDetector(
                    onTap: () {
                      appState.setSelectedCategory(cat);
                      appState.setActiveTab(0); // Jump to store tab
                    },
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.02),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          // Category Thumbnail
                          if (sampleProduct != null)
                            ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: AppNetworkImage(
                                imageUrl: sampleProduct.images.first,
                                width: 64,
                                height: 64,
                                placeholderTitle: cat,
                                category: cat,
                              ),
                            )
                          else
                            Container(
                              width: 64,
                              height: 64,
                              decoration: BoxDecoration(
                                color: const Color(0xFFF1F5F9),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(Icons.category_outlined, color: Color(0xFF94A3B8)),
                            ),
                          const SizedBox(width: 14),
                          // Category Info
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  cat,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w800,
                                    color: Color(0xFF0F172A),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '\${matchingProducts.length} items available',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: Color(0xFF64748B),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(
                              Icons.arrow_forward_ios,
                              size: 14,
                              color: Color(0xFF94A3B8),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`,
  },
  {
    name: 'wishlist_screen.dart',
    path: 'lib/screens/wishlist_screen.dart',
    language: 'dart',
    code: `import 'package:flutter/material.dart';
import '../state/app_state.dart';
import '../screens/product_detail_screen.dart';
import '../widgets/app_network_image.dart';

class WishlistScreen extends StatelessWidget {
  const WishlistScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final appState = AppStateScope.of(context);
    final wishlisted = appState.wishlistedProducts;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Saved Items',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  Text(
                    '\${wishlisted.length} items',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              if (wishlisted.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 48, horizontal: 24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: const BoxDecoration(
                          color: Color(0xFFF1F5F9),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.favorite_border,
                          size: 36,
                          color: Color(0xFF94A3B8),
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Your Wishlist is Empty',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Tap the heart icon on any product in the store to save it here for later.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFF64748B),
                        ),
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () {
                          appState.setActiveTab(0);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0F172A),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'Explore Products',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                )
              else
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: wishlisted.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final product = wishlisted[index];
                    return GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ProductDetailScreen(product: product),
                          ),
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.02),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: AppNetworkImage(
                                imageUrl: product.images.first,
                                width: 72,
                                height: 72,
                                placeholderTitle: product.title,
                                category: product.category,
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    product.brand.toUpperCase(),
                                    style: TextStyle(
                                      fontSize: 9,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.grey[500],
                                      letterSpacing: 0.8,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    product.title,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w700,
                                      color: Color(0xFF0F172A),
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '\\$\${product.price.toStringAsFixed(2)}',
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w900,
                                      color: Color(0xFF0F172A),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Column(
                              children: [
                                // Move to Cart
                                InkWell(
                                  onTap: () {
                                    appState.addToCart(
                                      product,
                                      product.colors.first,
                                      product.sizes.first,
                                      1,
                                    );
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text('Moved \${product.title} to bag'),
                                        duration: const Duration(seconds: 1),
                                        behavior: SnackBarBehavior.floating,
                                      ),
                                    );
                                  },
                                  borderRadius: BorderRadius.circular(8),
                                  child: Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF0F172A),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: const Icon(
                                      Icons.shopping_bag_outlined,
                                      size: 16,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 8),
                                // Remove
                                InkWell(
                                  onTap: () {
                                    appState.toggleWishlist(product.id);
                                  },
                                  borderRadius: BorderRadius.circular(8),
                                  child: Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFFEE2E2),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: const Icon(
                                      Icons.delete_outline,
                                      size: 16,
                                      color: Color(0xFFDC2626),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
            ],
          ),
        ),
      ),
    );
  }
}
`,
  },
  {
    name: 'orders_screen.dart',
    path: 'lib/screens/orders_screen.dart',
    language: 'dart',
    code: `import 'package:flutter/material.dart';
import '../models/product.dart';
import '../state/app_state.dart';
import '../widgets/app_network_image.dart';

class OrdersScreen extends StatelessWidget {
  const OrdersScreen({Key? key}) : super(key: key);

  void _showEditAddressDialog(BuildContext context, AppState appState) {
    final nameCtrl = TextEditingController(text: appState.deliveryAddress.name);
    final streetCtrl = TextEditingController(text: appState.deliveryAddress.street);
    final cityCtrl = TextEditingController(text: appState.deliveryAddress.cityZip);
    final phoneCtrl = TextEditingController(text: appState.deliveryAddress.phone);

    showDialog(
      context: context,
      builder: (dialogCtx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(Icons.location_on_outlined, color: Color(0xFF0F172A)),
              SizedBox(width: 8),
              Text(
                'Change Delivery Address',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
              ),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Quick Select Presets:',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey),
                ),
                const SizedBox(height: 6),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: [
                    _presetChip('San Francisco, CA', () {
                      setDialogState(() {
                        streetCtrl.text = '742 Evergreen Terrace, Suite 4B';
                        cityCtrl.text = 'San Francisco, CA 94107';
                      });
                    }),
                    _presetChip('Seattle, WA', () {
                      setDialogState(() {
                        streetCtrl.text = '1201 3rd Ave, Floor 18';
                        cityCtrl.text = 'Seattle, WA 98101';
                      });
                    }),
                    _presetChip('New York, NY', () {
                      setDialogState(() {
                        streetCtrl.text = '550 Madison Ave, Penthouse';
                        cityCtrl.text = 'New York, NY 10022';
                      });
                    }),
                  ],
                ),
                const SizedBox(height: 14),
                _inputField('Full Name', nameCtrl),
                const SizedBox(height: 8),
                _inputField('Street Address', streetCtrl),
                const SizedBox(height: 8),
                _inputField('City, State, Zip', cityCtrl),
                const SizedBox(height: 8),
                _inputField('Phone Number', phoneCtrl),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogCtx),
              child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
            ),
            ElevatedButton(
              onPressed: () {
                appState.updateDeliveryAddress(
                  AddressModel(
                    name: nameCtrl.text.trim(),
                    street: streetCtrl.text.trim(),
                    cityZip: cityCtrl.text.trim(),
                    phone: phoneCtrl.text.trim(),
                  ),
                );
                Navigator.pop(dialogCtx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Delivery address updated'),
                    duration: Duration(seconds: 2),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0F172A),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: const Text('Save Address'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _presetChip(String label, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: const Color(0xFFCBD5E1)),
        ),
        child: Text(
          label,
          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF334155)),
        ),
      ),
    );
  }

  Widget _inputField(String label, TextEditingController controller) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey),
        ),
        const SizedBox(height: 3),
        TextField(
          controller: controller,
          style: const TextStyle(fontSize: 12),
          decoration: InputDecoration(
            isDense: true,
            contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final appState = AppStateScope.of(context);
    final orders = appState.orders;
    final address = appState.deliveryAddress;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // User Profile Banner
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: const BoxDecoration(
                        color: Color(0xFF0F172A),
                        shape: BoxShape.circle,
                      ),
                      child: const Center(
                        child: Text(
                          'AM',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            address.name,
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(height: 2),
                          const Row(
                            children: [
                              Icon(Icons.verified, size: 13, color: Colors.blue),
                              SizedBox(width: 4),
                              Text(
                                'Lumina Verified Member',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: Color(0xFF64748B),
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Active Delivery Location
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.location_on, size: 16, color: Color(0xFF0F172A)),
                            SizedBox(width: 6),
                            Text(
                              'Default Delivery Address',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                          ],
                        ),
                        TextButton(
                          onPressed: () => _showEditAddressDialog(context, appState),
                          style: TextButton.styleFrom(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            minimumSize: Size.zero,
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          ),
                          child: const Text(
                            'Change',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF0284C7),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '\${address.street}\\n\${address.cityZip}',
                      style: const TextStyle(fontSize: 12, color: Color(0xFF475569), height: 1.4),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Orders Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Order History',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  Text(
                    '\${orders.length} orders placed',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              if (orders.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.inventory_2_outlined, size: 40, color: Color(0xFF94A3B8)),
                      const SizedBox(height: 12),
                      const Text(
                        'No Orders Yet',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Your completed purchases will appear here',
                        style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () => appState.setActiveTab(0),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0F172A),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        child: const Text('Start Shopping'),
                      ),
                    ],
                  ),
                )
              else
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: orders.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final order = orders[index];
                    final dateStr =
                        '\${order.date.year}-\${order.date.month.toString().padLeft(2, '0')}-\${order.date.day.toString().padLeft(2, '0')}';

                    return Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    order.id,
                                    style: const TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w900,
                                      color: Color(0xFF0F172A),
                                    ),
                                  ),
                                  Text(
                                    dateStr,
                                    style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8)),
                                  ),
                                ],
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: order.status == 'Delivered'
                                      ? const Color(0xFFDCFCE7)
                                      : const Color(0xFFE0F2FE),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  order.status,
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    color: order.status == 'Delivered'
                                        ? const Color(0xFF16A34A)
                                        : const Color(0xFF0284C7),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const Divider(height: 16, color: Color(0xFFF1F5F9)),

                          // Order Items
                          ...order.items.map((item) => Padding(
                                padding: const EdgeInsets.symmetric(vertical: 4),
                                child: Row(
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(8),
                                      child: AppNetworkImage(
                                        imageUrl: item.product.images.first,
                                        width: 36,
                                        height: 36,
                                        placeholderTitle: item.product.title,
                                        category: item.product.category,
                                      ),
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Text(
                                        '\${item.quantity}x \${item.product.title}',
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w600,
                                          color: Color(0xFF1E293B),
                                        ),
                                      ),
                                    ),
                                    Text(
                                      '\\$\${(item.product.price * item.quantity).toStringAsFixed(2)}',
                                      style: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w800,
                                        color: Color(0xFF0F172A),
                                      ),
                                    ),
                                  ],
                                ),
                              )),
                          const Divider(height: 16, color: Color(0xFFF1F5F9)),

                          // Total
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Shipped to: \${order.address.cityZip}',
                                style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8)),
                              ),
                              Text(
                                'Total: \\$\${order.total.toStringAsFixed(2)}',
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w900,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),
            ],
          ),
        ),
      ),
    );
  }
}
`,
  },
  {
    name: 'product_detail_screen.dart',
    path: 'lib/screens/product_detail_screen.dart',
    language: 'dart',
    code: `import 'package:flutter/material.dart';
import '../models/product.dart';
import '../state/app_state.dart';
import '../widgets/app_network_image.dart';
import '../widgets/cart_sheet.dart';
import 'checkout_screen.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product product;

  const ProductDetailScreen({Key? key, required this.product}) : super(key: key);

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  int _selectedImageIndex = 0;
  late ProductColor _selectedColor;
  late String _selectedSize;
  int _quantity = 1;

  @override
  void initState() {
    super.initState();
    _selectedColor = widget.product.colors.first;
    _selectedSize = widget.product.sizes.first;
  }

  @override
  Widget build(BuildContext context) {
    final appState = AppStateScope.of(context);
    final isWishlisted = appState.isWishlisted(widget.product.id);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: Icon(
              isWishlisted ? Icons.favorite : Icons.favorite_border,
              color: isWishlisted ? Colors.red : const Color(0xFF0F172A),
            ),
            onPressed: () {
              appState.toggleWishlist(widget.product.id);
            },
          ),
          IconButton(
            icon: Stack(
              clipBehavior: Clip.none,
              children: [
                const Icon(Icons.shopping_bag_outlined),
                if (appState.cartCount > 0)
                  Positioned(
                    top: -4,
                    right: -4,
                    child: Container(
                      padding: const EdgeInsets.all(3),
                      decoration: const BoxDecoration(
                        color: Color(0xFF0F172A),
                        shape: BoxShape.circle,
                      ),
                      child: Text(
                        '\${appState.cartCount}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            onPressed: () => CartSheet.show(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Carousel Area
            SizedBox(
              height: 320,
              child: PageView.builder(
                itemCount: widget.product.images.length,
                onPageChanged: (idx) => setState(() => _selectedImageIndex = idx),
                itemBuilder: (context, index) {
                  return Hero(
                    tag: index == 0 ? 'product-image-\${widget.product.id}' : 'prod-img-$index',
                    child: AppNetworkImage(
                      imageUrl: widget.product.images[index],
                      placeholderTitle: widget.product.title,
                      category: widget.product.category,
                      width: double.infinity,
                      height: 320,
                    ),
                  );
                },
              ),
            ),

            // Carousel Dots
            if (widget.product.images.length > 1)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(
                    widget.product.images.length,
                    (index) => Container(
                      width: _selectedImageIndex == index ? 20 : 6,
                      height: 6,
                      margin: const EdgeInsets.symmetric(horizontal: 3),
                      decoration: BoxDecoration(
                        color: _selectedImageIndex == index
                            ? const Color(0xFF0F172A)
                            : const Color(0xFFCBD5E1),
                        borderRadius: BorderRadius.circular(3),
                      ),
                    ),
                  ),
                ),
              ),

            // Product Details
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        widget.product.brand.toUpperCase(),
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: Colors.grey[500],
                          letterSpacing: 1.0,
                        ),
                      ),
                      Row(
                        children: [
                          const Icon(Icons.star, size: 16, color: Colors.amber),
                          const SizedBox(width: 4),
                          Text(
                            '\${widget.product.rating} (\${widget.product.reviewCount})',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    widget.product.title,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    widget.product.subtitle,
                    style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    '\\$\${widget.product.price.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const Divider(height: 32, color: Color(0xFFF1F5F9)),

                  // Color Picker
                  const Text('Select Color', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                  const SizedBox(height: 10),
                  Row(
                    children: widget.product.colors.map((color) {
                      final isSelected = _selectedColor.name == color.name;
                      return GestureDetector(
                        onTap: () => setState(() => _selectedColor = color),
                        child: Container(
                          margin: const EdgeInsets.only(right: 12),
                          padding: const EdgeInsets.all(3),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: isSelected ? const Color(0xFF0F172A) : Colors.transparent,
                              width: 2,
                            ),
                          ),
                          child: CircleAvatar(
                            radius: 14,
                            backgroundColor: Color(color.colorHex),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 20),

                  // Size Picker
                  const Text('Select Option', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    children: widget.product.sizes.map((size) {
                      final isSelected = _selectedSize == size;
                      return ChoiceChip(
                        label: Text(size),
                        selected: isSelected,
                        selectedColor: const Color(0xFF0F172A),
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.white : const Color(0xFF0F172A),
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                        backgroundColor: const Color(0xFFF8FAFC),
                        onSelected: (val) => setState(() => _selectedSize = size),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 20),

                  // Quantity Selector
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Quantity', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                      Container(
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.remove, size: 16),
                              onPressed: () {
                                if (_quantity > 1) setState(() => _quantity--);
                              },
                            ),
                            Text('$_quantity', style: const TextStyle(fontWeight: FontWeight.bold)),
                            IconButton(
                              icon: const Icon(Icons.add, size: 16),
                              onPressed: () => setState(() => _quantity++),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const Divider(height: 32, color: Color(0xFFF1F5F9)),

                  // Description
                  const Text('Description', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                  const SizedBox(height: 8),
                  Text(
                    widget.product.description,
                    style: const TextStyle(color: Color(0xFF475569), height: 1.5, fontSize: 13),
                  ),
                  const SizedBox(height: 16),

                  // Features
                  const Text('Key Features', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                  const SizedBox(height: 8),
                  ...widget.product.features.map(
                    (feat) => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 3.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.check_circle_outline, size: 16, color: Color(0xFF0284C7)),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              feat,
                              style: const TextStyle(fontSize: 12, color: Color(0xFF334155)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: SafeArea(
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: const BoxDecoration(
            color: Colors.white,
            border: Border(top: BorderSide(color: Color(0xFFF1F5F9))),
          ),
          child: Row(
            children: [
              // Buy Now
              Expanded(
                child: SizedBox(
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      final singleItem = CartItemModel(
                        id: 'buy-now-\${widget.product.id}-\${DateTime.now().millisecondsSinceEpoch}',
                        product: widget.product,
                        selectedColor: _selectedColor,
                        selectedSize: _selectedSize,
                        quantity: _quantity,
                      );
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => CheckoutScreen(
                            checkoutItems: [singleItem],
                          ),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0F172A),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('BUY NOW', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12)),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              // Add to Bag
              Expanded(
                child: SizedBox(
                  height: 48,
                  child: OutlinedButton(
                    onPressed: () {
                      appState.addToCart(
                        widget.product,
                        _selectedColor,
                        _selectedSize,
                        _quantity,
                      );
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Added \$_quantity item(s) to bag'),
                          duration: const Duration(seconds: 2),
                          action: SnackBarAction(
                            label: 'VIEW BAG',
                            textColor: const Color(0xFF38BDF8),
                            onPressed: () => CartSheet.show(context),
                          ),
                        ),
                      );
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF0F172A),
                      side: const BorderSide(color: Color(0xFF0F172A), width: 1.5),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('ADD TO BAG', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`,
  },
  {
    name: 'checkout_screen.dart',
    path: 'lib/screens/checkout_screen.dart',
    language: 'dart',
    code: `import 'package:flutter/material.dart';
import '../models/product.dart';
import '../state/app_state.dart';
import '../widgets/app_network_image.dart';

class CheckoutScreen extends StatefulWidget {
  final List<CartItemModel> checkoutItems;

  const CheckoutScreen({
    Key? key,
    required this.checkoutItems,
  }) : super(key: key);

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  String _selectedPaymentMethod = 'Apple Pay';
  bool _isProcessing = false;

  void _showChangeAddressDialog(BuildContext context, AppState appState) {
    final nameController = TextEditingController(text: appState.deliveryAddress.name);
    final streetController = TextEditingController(text: appState.deliveryAddress.street);
    final cityController = TextEditingController(text: appState.deliveryAddress.cityZip);
    final phoneController = TextEditingController(text: appState.deliveryAddress.phone);

    showDialog(
      context: context,
      builder: (dialogCtx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(Icons.location_on, color: Color(0xFF0F172A)),
              SizedBox(width: 8),
              Text(
                'Change Delivery Location',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
              ),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Quick Presets (Tap to apply):',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey),
                ),
                const SizedBox(height: 6),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: [
                    _presetChip('San Francisco', () {
                      setDialogState(() {
                        streetController.text = '742 Evergreen Terrace, Suite 4B';
                        cityController.text = 'San Francisco, CA 94107';
                      });
                    }),
                    _presetChip('Seattle', () {
                      setDialogState(() {
                        streetController.text = '1201 3rd Ave, Floor 18';
                        cityController.text = 'Seattle, WA 98101';
                      });
                    }),
                    _presetChip('New York', () {
                      setDialogState(() {
                        streetController.text = '550 Madison Ave, Penthouse';
                        cityController.text = 'New York, NY 10022';
                      });
                    }),
                  ],
                ),
                const SizedBox(height: 14),
                _formField('Recipient Name', nameController),
                const SizedBox(height: 8),
                _formField('Street Address', streetController),
                const SizedBox(height: 8),
                _formField('City, State, Zip', cityController),
                const SizedBox(height: 8),
                _formField('Phone Number', phoneController),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogCtx),
              child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
            ),
            ElevatedButton(
              onPressed: () {
                appState.updateDeliveryAddress(
                  AddressModel(
                    name: nameController.text.trim(),
                    street: streetController.text.trim(),
                    cityZip: cityController.text.trim(),
                    phone: phoneController.text.trim(),
                  ),
                );
                Navigator.pop(dialogCtx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Delivery address updated'),
                    duration: Duration(seconds: 1),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0F172A),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: const Text('Update Address'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _presetChip(String label, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: const Color(0xFFCBD5E1)),
        ),
        child: Text(
          label,
          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF334155)),
        ),
      ),
    );
  }

  Widget _formField(String label, TextEditingController controller) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey),
        ),
        const SizedBox(height: 3),
        TextField(
          controller: controller,
          style: const TextStyle(fontSize: 12),
          decoration: InputDecoration(
            isDense: true,
            contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
          ),
        ),
      ],
    );
  }

  double get subtotal => widget.checkoutItems.fold(
        0.0,
        (sum, item) => sum + (item.product.price * item.quantity),
      );

  double get total => subtotal;

  void _handlePlaceOrder(BuildContext context, AppState appState) async {
    setState(() => _isProcessing = true);
    await Future.delayed(const Duration(milliseconds: 700));
    if (!mounted) return;

    final orderId = 'ORD-\${(10000 + DateTime.now().millisecondsSinceEpoch % 90000)}';
    final newOrder = OrderModel(
      id: orderId,
      date: DateTime.now(),
      items: List.from(widget.checkoutItems),
      subtotal: subtotal,
      shipping: 0.0,
      total: total,
      status: 'Confirmed',
      address: appState.deliveryAddress,
    );

    appState.addOrder(newOrder);
    appState.clearCart();

    setState(() => _isProcessing = false);

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (confirmCtx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: Color(0xFFDCFCE7),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_circle, size: 48, color: Color(0xFF16A34A)),
            ),
            const SizedBox(height: 16),
            const Text(
              'Order Confirmed!',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 6),
            Text(
              'Order #$orderId has been placed successfully.',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
            ),
            const SizedBox(height: 8),
            Text(
              'Delivering to: \${appState.deliveryAddress.street}',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF334155)),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(confirmCtx);
                  Navigator.pop(context);
                  appState.setActiveTab(3); // Jump to Orders tab
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0F172A),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('View in Order History'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final appState = AppStateScope.of(context);
    final address = appState.deliveryAddress;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Express Checkout', style: TextStyle(fontWeight: FontWeight.w900)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Delivery Location Card
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.location_on, size: 16, color: Color(0xFF0F172A)),
                          SizedBox(width: 6),
                          Text(
                            'Delivery Location',
                            style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                          ),
                        ],
                      ),
                      TextButton(
                        onPressed: () => _showChangeAddressDialog(context, appState),
                        style: TextButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          minimumSize: Size.zero,
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        ),
                        child: const Text(
                          'Change',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF0284C7)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    address.name,
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                  ),
                  Text(
                    '\${address.street}, \${address.cityZip}',
                    style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                  ),
                  Text(
                    address.phone,
                    style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Order Items
            const Text('Order Items', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: widget.checkoutItems.map((item) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 6.0),
                    child: Row(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: AppNetworkImage(
                            imageUrl: item.product.images.first,
                            width: 48,
                            height: 48,
                            placeholderTitle: item.product.title,
                            category: item.product.category,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.product.title,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                '\${item.selectedColor.name} • \${item.selectedSize}',
                                style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
                              ),
                            ],
                          ),
                        ),
                        Text(
                          '\${item.quantity}x \\$\${item.product.price.toStringAsFixed(2)}',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 16),

            // Payment Options
            const Text('Payment Method', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
            const SizedBox(height: 8),
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  RadioListTile<String>(
                    title: const Text('Apple Pay / Google Pay', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    subtitle: const Text('Instant biometric authorization', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    value: 'Apple Pay',
                    groupValue: _selectedPaymentMethod,
                    onChanged: (val) => setState(() => _selectedPaymentMethod = val!),
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  RadioListTile<String>(
                    title: const Text('Credit or Debit Card', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    subtitle: const Text('Visa, Mastercard, Amex ending in 4242', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    value: 'Credit Card',
                    groupValue: _selectedPaymentMethod,
                    onChanged: (val) => setState(() => _selectedPaymentMethod = val!),
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  RadioListTile<String>(
                    title: const Text('Cash on Delivery', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    subtitle: const Text('Pay upon physical parcel receipt', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    value: 'Cash on Delivery',
                    groupValue: _selectedPaymentMethod,
                    onChanged: (val) => setState(() => _selectedPaymentMethod = val!),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Cost Summary
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Subtotal', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                      Text('\\$\${subtotal.toStringAsFixed(2)}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 6),
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Standard Delivery', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                      Text('FREE', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF16A34A))),
                    ],
                  ),
                  const Divider(height: 16, color: Color(0xFFF1F5F9)),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Total to Pay', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF0F172A))),
                      Text('\\$\${total.toStringAsFixed(2)}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF0F172A))),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Confirm Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _isProcessing ? null : () => _handlePlaceOrder(context, appState),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0F172A),
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: _isProcessing
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            'PLACE ORDER NOW',
                            style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 0.8),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '• \\$\${total.toStringAsFixed(2)}',
                            style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
                          ),
                        ],
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`,
  },
  {
    name: 'index.html',
    path: 'web/index.html',
    language: 'html',
    code: `<!DOCTYPE html>
<html>
<head>
  <base href="$FLUTTER_BASE_HREF">
  <meta charset="UTF-8">
  <meta content="IE=Edge" http-equiv="X-UA-Compatible">
  <meta name="description" content="Lumina Studio - Minimalist Premium E-Commerce Store (Flutter & Dart)">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="apple-mobile-web-app-title" content="Lumina Studio">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lumina Studio</title>
  <link rel="manifest" href="manifest.json">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0F172A;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .loading-container {
      text-align: center;
      color: white;
    }
    .loading-spinner {
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      border-top: 3px solid #38BDF8;
      width: 36px;
      height: 36px;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .brand-title {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #94A3B8;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div id="loading" class="loading-container">
    <div class="loading-spinner"></div>
    <div class="brand-title">LUMINA STUDIO</div>
  </div>

  <!-- Automatically hide loading screen once Flutter renders the first frame -->
  <script>
    window.addEventListener('flutter-first-frame', function () {
      var loadingEl = document.getElementById("loading");
      if (loadingEl) loadingEl.remove();
    });
  </script>

  <!-- Modern Flutter 3.22+ Bootstrapper -->
  <script src="flutter_bootstrap.js" async onerror="loadClassicFlutter()"></script>

  <!-- Fallback Bootstrapper for Flutter versions using flutter.js -->
  <script>
    function loadClassicFlutter() {
      var script = document.createElement('script');
      script.src = 'flutter.js';
      script.onload = function () {
        if (window._flutter && window._flutter.loader) {
          _flutter.loader.loadEntrypoint({
            onEntrypointLoaded: function (engineInitializer) {
              engineInitializer.initializeEngine({
                renderer: "html"
              }).then(function (appRunner) {
                var loadingEl = document.getElementById("loading");
                if (loadingEl) loadingEl.remove();
                appRunner.runApp();
              });
            }
          });
        }
      };
      document.body.appendChild(script);
    }
  </script>
</body>
</html>
`,
  },
  {
    name: 'pubspec.yaml',
    path: 'pubspec.yaml',
    language: 'yaml',
    code: `name: lumina_studio
description: "Lumina Studio - Cross-platform Flutter E-Commerce mobile app for Android, iOS & Web."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`,
  },
];
