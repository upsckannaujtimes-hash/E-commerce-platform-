import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose. Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: Number,
    price: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    zipCode: String,
    country: String
  },
  createdAt: {
    type:  Date,
    default: Date. now
  }
});

export default mongoose.model('Order', orderSchema);