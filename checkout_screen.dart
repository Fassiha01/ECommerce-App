import 'package:flutter/material.dart';
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

  double get total => subtotal; // Standard free delivery

  void _handlePlaceOrder(BuildContext context, AppState appState) async {
    setState(() => _isProcessing = true);
    await Future.delayed(const Duration(milliseconds: 700));
    if (!mounted) return;

    final orderId = 'ORD-${(10000 + DateTime.now().millisecondsSinceEpoch % 90000)}';
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
              'Delivering to: ${appState.deliveryAddress.street}',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF334155)),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(confirmCtx); // Close dialog
                  Navigator.pop(context); // Close checkout
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
                    '${address.street}, ${address.cityZip}',
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
                                '${item.selectedColor.name} • ${item.selectedSize}',
                                style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
                              ),
                            ],
                          ),
                        ),
                        Text(
                          '${item.quantity}x \$${item.product.price.toStringAsFixed(2)}',
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
                      Text('\$${subtotal.toStringAsFixed(2)}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
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
                      Text('\$${total.toStringAsFixed(2)}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF0F172A))),
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
                            '• \$${total.toStringAsFixed(2)}',
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
