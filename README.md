# Lumina Studio (Flutter & Dart for Android, iOS & Web)

Lumina Studio is a production-grade, minimalist luxury e-commerce mobile & web application built with Flutter 3+ and Material 3.

## Features Included Across All Platforms
- **Curated Store Catalog**: Live search, flagship hero banner, responsive category filter chips, and 2-column product catalog.
- **Explore Categories Tab**: Browse all collections with item counts, photography previews, and one-tap filtering.
- **Saved / Wishlist Tab**: Add or remove saved favorites, view prices, move items to bag, and custom empty state.
- **Orders & Account Tab**: View completed order history cards, dynamic delivery addresses, order items breakdown, status indicators, and member profile.
- **Shopping Bag Modal**: Bottom sheet drawer with quantity steppers (+/-), item removal, and live subtotal calculation.
- **Express Checkout**: Interactive delivery address picker with one-tap location presets (San Francisco, Seattle, New York), payment method selection, and order confirmation.
- **Universal Image Handling**: `AppNetworkImage` ensures all product imagery loads smoothly and reliably with shimmering placeholders and graceful fallbacks.

## Quick Start / Run on Localhost (Chrome)
To run the Flutter app on your local machine with full image rendering:
```bash
# 1. First time setup: ensure web platform files match your Flutter SDK
flutter create . --platforms=web

# 2. Fetch packages
flutter pub get

# 3. Run on Chrome
flutter run -d chrome --web-renderer html
```
*(Note: `--web-renderer html` ensures high-definition network photos display without cross-origin canvas blocks on localhost)*

### Troubleshooting Localhost Spinner / White Screen
If the app stays on the dark loading spinner:
1. Make sure you ran `flutter create . --platforms=web` so your local Flutter SDK creates the web bootstrap files.
2. Open Chrome DevTools (`F12` or `Ctrl+Shift+I` -> Console) to see if there are any network/asset warnings.
3. Run `flutter clean && flutter run -d chrome --web-renderer html` to clear stale build caches.

## Run on Android
```bash
flutter pub get
flutter run -d android
```

## Run on iOS
```bash
flutter pub get
flutter run -d ios
```
