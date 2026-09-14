import 'package:flutter/material.dart';
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
                        '${appState.wishlistIds.length}',
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
                        '${appState.cartCount}',
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
              label: Text('${appState.wishlistIds.length}'),
              child: const Icon(Icons.favorite_outline),
            ),
            selectedIcon: Badge(
              isLabelVisible: appState.wishlistIds.isNotEmpty,
              label: Text('${appState.wishlistIds.length}'),
              child: const Icon(Icons.favorite),
            ),
            label: 'Wishlist',
          ),
          NavigationDestination(
            icon: Badge(
              isLabelVisible: appState.orders.isNotEmpty,
              label: Text('${appState.orders.length}'),
              child: const Icon(Icons.receipt_long_outlined),
            ),
            selectedIcon: Badge(
              isLabelVisible: appState.orders.isNotEmpty,
              label: Text('${appState.orders.length}'),
              child: const Icon(Icons.receipt_long),
            ),
            label: 'Orders',
          ),
        ],
      ),
    );
  }
}
