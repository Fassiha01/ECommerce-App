import { Product } from '../types';

export const CATEGORIES = [
  'All',
  'Audio & Tech',
  'Footwear',
  'Wearables',
  'Accessories',
  'Photography'
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'AeroPulse Pro Wireless Headphones',
    subtitle: 'Active Noise Cancelling & Spatial Audio',
    brand: 'Acoustic Labs',
    price: 249.99,
    rating: 4.9,
    reviewCount: 1420,
    category: 'Audio & Tech',
    description: 'Experience studio-grade acoustics crafted for audiophiles and mobile creators. Features hybrid active noise cancellation, custom 40mm titanium drivers, ultra-low latency mode, and an industry-leading 45-hour battery lifespan.',
    features: [
      'Active Noise Cancellation with Transparency Mode',
      'Lossless 24-bit Hi-Res audio playback',
      'Multipoint Bluetooth 5.4 connection for 2 devices simultaneously',
      'Ultra-soft memory foam protein leather earcups',
      'Fast charge: 10 mins gives 5 hours of playback'
    ],
    specs: {
      'Driver Size': '40mm Titanium Composite',
      'Battery Life': 'Up to 45 hours (ANC Off)',
      'Weight': '248g',
      'Bluetooth': 'v5.4 with aptX Adaptive & AAC',
      'Water Resistance': 'IPX4 Sweat Resistant'
    },
    colors: [
      { name: 'Midnight Obsidian', hex: '#1e293b' },
      { name: 'Titanium Silver', hex: '#94a3b8' },
      { name: 'Warm Cream', hex: '#e2d9cc' }
    ],
    sizes: ['Standard'],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80'
    ],
    inStock: true,
    stockCount: 18,
    isFeatured: true,
    isNew: true
  },
  {
    id: 'prod-2',
    title: 'Pulse Horizon Smartwatch Gen 4',
    subtitle: 'Always-On Retina AMOLED & ECG Monitor',
    brand: 'Chronos Wear',
    price: 329.00,
    rating: 4.8,
    reviewCount: 984,
    category: 'Wearables',
    description: 'A precision-engineered titanium timepiece with advanced cardiovascular bio-sensors, dual-band GPS navigation, and 7-day battery endurance in a sleek aerodynamic chassis.',
    features: [
      'Grade 5 Aerospace Titanium bezel with Sapphire crystal glass',
      'Medical-grade ECG and blood oxygen SpO2 monitoring',
      'Water-resistant to 50 meters (5 ATM) with open-water swim tracking',
      'Instant contactless payments and offline Spotify playlist storage',
      'Fast magnetic wireless charging cradle included'
    ],
    specs: {
      'Case Diameter': '44mm Aerospace Titanium',
      'Display': '1.43" AMOLED 466x466 (1000 nits)',
      'Sensors': 'Optical HR, ECG, SpO2, Barometer, Gyro',
      'Battery': '7 days standard / 36 hours GPS mode',
      'Compatibility': 'iOS 15+ and Android 9+'
    },
    colors: [
      { name: 'Graphite Black', hex: '#18181b' },
      { name: 'Starlight Silver', hex: '#d4d4d8' },
      { name: 'Midnight Navy', hex: '#1e3a8a' }
    ],
    sizes: ['40mm', '44mm'],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80'
    ],
    inStock: true,
    stockCount: 11,
    isFeatured: true
  },
  {
    id: 'prod-3',
    title: 'Veloce Air Stride Athletic Sneakers',
    subtitle: 'Carbon Plate Cushioning & Breathable Knit',
    brand: 'Veloce Performance',
    price: 159.50,
    rating: 4.7,
    reviewCount: 652,
    category: 'Footwear',
    description: 'Engineered for optimal energy return and maximum road comfort. Embedded with a dynamic curved carbon fiber plate that propels you forward with every stride, complemented by an ultra-breathable recycled mesh upper.',
    features: [
      'Full-length carbon propulsion plate between dual foam layers',
      'Micro-perforated upper for thermal regulation',
      'High-traction rubber outsole engineered for wet & dry tarmac',
      'Ortholite antimicrobial cushioned insole'
    ],
    specs: {
      'Weight': '210g (Men size 9)',
      'Heel-to-toe drop': '8mm',
      'Upper': 'Engineered monofilament breathable knit',
      'Midsole': 'Supercritical PEBA foam'
    },
    colors: [
      { name: 'Arctic White', hex: '#f8fafc' },
      { name: 'Volt Emerald', hex: '#10b981' },
      { name: 'Phantom Black', hex: '#18181b' }
    ],
    sizes: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80'
    ],
    inStock: true,
    stockCount: 24,
    isFeatured: true
  },
  {
    id: 'prod-4',
    title: 'Nomad Heritage Waxed Canvas Pack',
    subtitle: 'Weatherproof Everyday & Travel Commuter',
    brand: 'Nomad Goods',
    price: 175.00,
    rating: 4.9,
    reviewCount: 428,
    category: 'Accessories',
    description: 'Handcrafted from 18oz water-repellent Scottish waxed canvas and full-grain vegetable-tanned Italian leather. Houses up to a 16-inch laptop with padded suspension protection and dedicated tablet compartment.',
    features: [
      'Weather-resistant storm flap and YKK Aquaguard zips',
      'Suspended protective laptop sleeve fits up to 16" MacBook Pro',
      'Hidden passport stash pocket against your back',
      'Ergonomic padded shoulder straps with breathable mesh'
    ],
    specs: {
      'Volume': '24 Liters',
      'Dimensions': '48cm x 31cm x 16cm',
      'Material': '18oz Halley Stevensons Waxed Cotton',
      'Hardware': 'Antique brass buckles'
    },
    colors: [
      { name: 'Vintage Olive', hex: '#3f4f3c' },
      { name: 'Charcoal Grey', hex: '#334155' },
      { name: 'Caramel Tan', hex: '#92400e' }
    ],
    sizes: ['24L Standard'],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=1000&q=80'
    ],
    inStock: true,
    stockCount: 7,
    isFeatured: false
  },
  {
    id: 'prod-5',
    title: 'Lumina Prime Mirrorless Rangefinder',
    subtitle: '40MP Full-Frame Sensor & 4K60 Cinematic',
    brand: 'Lumina Studio',
    price: 899.00,
    rating: 4.9,
    reviewCount: 312,
    category: 'Photography',
    description: 'Classic rangefinder ergonomics paired with bleeding-edge mirrorless performance. Featuring a 40MP back-illuminated sensor, 5-axis in-body image stabilization, tactile analog dials, and razor-sharp prime optics.',
    features: [
      '40.2MP BSI High-Speed Full-Frame CMOS Sensor',
      '5-Axis In-Body Image Stabilization (up to 7.0 stops)',
      'Subject detection autofocus with Eye AF tracking',
      'Dual UHS-II SD card slots with wireless cloud sync'
    ],
    specs: {
      'Sensor': 'Full-Frame 35.9 x 23.9 mm',
      'Lens Mount': 'Universal L-Mount',
      'Video': '4K at 60p 10-bit 4:2:2 internal',
      'Shutter': '1/8000s mechanical, up to 1/32000s electronic'
    },
    colors: [
      { name: 'Silver Chrome', hex: '#cbd5e1' },
      { name: 'Stealth Matte Black', hex: '#0f172a' }
    ],
    sizes: ['Body Only', 'With 28mm f/2.0 Kit'],
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80'
    ],
    inStock: true,
    stockCount: 5,
    isFeatured: true
  },
  {
    id: 'prod-6',
    title: 'Solstice Polarized Titanium Sunglasses',
    subtitle: 'Japanese Titanium & Category 3 UV400 Glass',
    brand: 'Komorebi Eyewear',
    price: 135.00,
    rating: 4.8,
    reviewCount: 512,
    category: 'Accessories',
    description: 'Ultra-lightweight Japanese beta-titanium frames weighing under 18 grams. Equipped with scratch-resistant polarized mineral glass lenses providing 100% UV400 protection and anti-reflective inner coating.',
    features: [
      'Featherweight 17.5g Japanese beta-titanium construction',
      'Anti-scratch hydrophobic & oleophobic lens coating',
      'Custom silicone hypoallergenic adjustable nose pads',
      'Includes recycled leather protective carrying case'
    ],
    specs: {
      'Lens Width': '51mm',
      'Bridge Width': '20mm',
      'Temple Length': '145mm',
      'Weight': '17.5g'
    },
    colors: [
      { name: 'Matte Gold / Green Lens', hex: '#d97706' },
      { name: 'Gunmetal / Smoke Lens', hex: '#475569' },
      { name: 'Rose Gold / Amber Lens', hex: '#fb7185' }
    ],
    sizes: ['Medium 51mm', 'Large 54mm'],
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1000&q=80'
    ],
    inStock: true,
    stockCount: 30,
    isFeatured: false
  }
];
