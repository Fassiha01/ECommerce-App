import 'package:flutter/material.dart';
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
                    tag: index == 0 ? 'product-image-${widget.product.id}' : 'prod-img-$index',
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
                            '${widget.product.rating} (${widget.product.reviewCount})',
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
                    '\$${widget.product.price.toStringAsFixed(2)}',
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
                        id: 'buy-now-${widget.product.id}-${DateTime.now().millisecondsSinceEpoch}',
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
                          content: Text('Added $_quantity item(s) to bag'),
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
