import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function Cart({ user }) {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartData);
  };

  const updateQuantity = (productId, quantity) => {
    const updatedCart = cart.map(item =>
      item._id === productId ?  { ...item, quantity: Math.max(1, quantity) } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cart. filter(item => item._id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to checkout');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const orderData = {
        items: cart. map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount,
        shippingAddress: {
          street: '123 Main St',
          city: 'Your City',
          zipCode: '12345',
          country: 'Your Country'
        }
      };

      await axios.post(`${API_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.removeItem('cart');
      alert('Order placed successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Error placing order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
            <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover: bg-blue-700 transition">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-md p-6 flex gap-6">
                  <img
                    src={item.image || 'https://via.placeholder.com/120? text=' + item.name}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-lg font-semibold text-gray-800 hover:text-blue-600"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-600 text-sm mt-1">{item.category}</p>
                    <p className="text-2xl font-bold text-blue-600 mt-3">${item.price}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-3 py-2 hover:bg-gray-100"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="px-4 font-semibold">{item. quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._i