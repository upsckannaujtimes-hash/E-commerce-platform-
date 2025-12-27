import express from 'express';
import Order from '../models/Order.js';
import { protect, authorize } from '../middleware/auth. js';

const router = express. Router();

// Create order (buyers only)
router.post('/', protect, authorize('buyer'), async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    const order = new Order({
      buyer: req.user.id,
      items,
      totalAmount,
      shippingAddress
    });

    await order.save();
    await order.populate('items.product');

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.params.userId })
      .populate('items. product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (sellers only)
router.put('/:id', protect, authorize('seller'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params. id, { status }, { new:  true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;