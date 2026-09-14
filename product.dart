import 'package:flutter/material.dart';

class ProductColor {
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
