import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function ProductDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      setProduct(response. data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Added ${quantity} item(s) to cart!`);
  };

  const handleSubmitReview = async () => {
    if (!user || user.role !== 'buyer') {
      alert('Only buyers can leave reviews');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios. post(
        `${API_URL}/products/${id}/review`,
        newReview,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProduct(response.data);
      setNewReview({ rating: 5, comment: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting review');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!product) {
    return <div className="flex items-center justify-center min-h-screen">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-8 font-medium"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 md: grid-cols-2 gap-12 bg-white rounded-xl shadow-lg p-8">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <img
              src={product.image || 'https://via.placeholder.com/500? text=' + product.name}
              alt={product.name}
              className="max-w-full h-auto"
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-gray-600 ml-3">({product.reviews?.length || 0} reviews)</span>
            </div>

            <p className="text-gray-600 text-lg mb-6">{product.description}</p>

            <div className="border-t border-b py-6 mb-6">
              <p className="text-4xl font-bold text-blue-600 mb-4">${product.price}</p>
              <p className={`text-lg font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-gray-600 mb-1">Seller</p>
              <p className="text-lg font-semibold text-gray-800">{product. seller?.shopName || product.seller?.username}</p>
              {product.seller?. shopDescription && (
                <p className="text-gray-600 text-sm mt-2">{product.seller. shopDescription}</p>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math. max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>

          {/* Add Review */}
          {user && user.role === 'buyer' && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Leave a Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Rating</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {[5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>{num} Stars</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Comment</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Share your experience..."
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleSubmitReview}
                  className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                >
                  Submit Review
                </button>
              </div>
            </div>
          )}

          {/* Display Reviews */}
          <div className="space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-800">{review.buyer?. username}</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < review.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">No reviews yet.  Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}