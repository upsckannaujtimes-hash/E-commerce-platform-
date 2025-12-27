import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, Home as HomeIcon } from 'lucide-react';

export default function Navbar({ user, setUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-blue-600">
            <HomeIcon size={28} />
            <span>ShopHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition">
              Browse
            </Link>
            
            {user && user.role === 'seller' && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition">
                  Dashboard
                </Link>
                <Link to="/create-product" className="text-gray-600 hover: text-blue-600 transition">
                  Sell Product
                </Link>
              </>
            )}

            <Link to="/cart" className="relative text-gray-600 hover: text-blue-600 transition">
              <ShoppingCart size={24} />
            </Link>

            {user ?  (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link to="/" className="block text-gray-600 hover:text-blue-600">
              Browse
            </Link>
            {user && user.role === 'seller' && (
              <>
                <Link to="/dashboard" className="block text-gray-600 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/create-product" className="block text-gray-600 hover:text-blue-600">
                  Sell Product
                </Link>
              </>
            )}
            <Link to="/cart" className="block text-gray-600 hover:text-blue-600">
              Cart
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-500 hover:text-red-600"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="block text-gray-600 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="block text-gray-600 hover:text-blue-600">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}