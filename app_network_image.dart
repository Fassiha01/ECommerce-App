import 'package:flutter/material.dart';

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
