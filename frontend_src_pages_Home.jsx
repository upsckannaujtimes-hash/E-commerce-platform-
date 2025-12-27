import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Search } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;

      const response = await axios. get(`${API_URL}/products`, { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ... product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Welcome to ShopHub</h1>
          <p className="text-xl mb-8">Buy and sell products from verified sellers</p>

          {/* Search Bar */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 rounded-lg text-gray-800"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home">Home</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden group">
                {/* Product Image */}
                <div className="h-64 bg-gray-200 overflow-hidden group-hover:scale-105 transition transform">
                  <img
                    src={product.image || 'https://via.placeholder.com/400x300? text=' + product.name}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link
                    to={`/product/${product._id}`}
                    className="text-lg font-semibold text-gray-800 hover:text-blue-600 mb-2 block line-clamp-1"
                  >
                    {product. name}
                  </Link>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm ml-2">({product.reviews?. length || 0})</span>
                  </div>

                  {/* Price and Seller */}
                  <div className="mb-3">
                    <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                    <p className="text-gray-600 text-sm">by {product.seller?. shopName || product.seller?.username}</p>
                  </div>

                  {/* Stock Status */}
                  <p className={`text-sm mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/product/${product._id}`}
                      className="flex-1 bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 transition text-center"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}