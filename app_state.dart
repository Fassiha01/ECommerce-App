import 'package:flutter/material.dart';
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
        id: '${product.id}-${DateTime.now().millisecondsSinceEpoch}',
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
