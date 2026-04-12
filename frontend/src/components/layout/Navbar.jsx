import { Link, useNavigate } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineBars3, HiOutlineXMark, HiOutlineMapPin } from "react-icons/hi2";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import LocationModal from "../ui/LocationModal";
import SearchBar from "../ui/SearchBar";

/**
 * Main navigation bar styled for quick-commerce layout:
 * - Logo
 * - Delivery location
 * - Search bar
 * - User/Login & Cart
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Left section: Logo & Location */}
          <div className="flex items-center shrink-0">
            {/* Logo */}
            <Link to="/" className="flex items-center pr-6 md:border-r border-gray-200">
              <span className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-gold tracking-wide">
                VELORA
              </span>
            </Link>

            {/* Location Picker (hidden on very small screens) */}
            <div className="hidden md:flex flex-col ml-6 cursor-pointer group relative" onClick={() => setLocationModalOpen(true)}>
              <span className="text-sm font-bold text-midnight leading-tight">
                Delivery in 12 minutes
              </span>
              <div className="flex items-center gap-1 text-xs text-midnight-lighter group-hover:text-gold transition-colors">
                <span className="truncate max-w-[150px]">B169, Sector B, Manak Nagar...</span>
                <span className="text-[10px]">▼</span>
              </div>
            </div>
            {/* Location Modal relative to Navbar */}
            <LocationModal isOpen={locationModalOpen} onClose={() => setLocationModalOpen(false)} />
          </div>

          {/* Center section: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl px-4">
            <SearchBar placeholder='Search "sugar"' />
          </div>

          {/* Right section: Login & Cart */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            {/* User menu */}
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-midnight font-medium hover:text-gold transition-colors"
                >
                  <span className="text-sm">My Account</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-lg shadow-xl py-2 animate-fade-in z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-midnight text-sm font-bold">{user.name}</p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-gold hover:bg-gray-50 transition-colors"
                    >
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:text-gold hover:bg-gray-50 transition-colors"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block text-sm text-midnight hover:text-gold transition-colors"
              >
                Login
              </Link>
            )}

            {/* Cart — hidden for admin */}
            {!isAdmin && (
              <Link
                to="/cart"
                className="flex items-center gap-2 px-3 py-2.5 bg-midnight hover:bg-midnight-light text-white rounded-lg transition-colors duration-200"
              >
                <HiOutlineShoppingBag className="w-5 h-5" />
                <span className="text-sm font-bold">
                  {cartCount > 0 ? `${cartCount} items` : "My Cart"}
                </span>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-midnight hover:bg-gray-50 rounded"
            >
              {mobileOpen ? <HiOutlineXMark className="w-6 h-6" /> : <HiOutlineBars3 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar below header */}
        <div className="md:hidden pb-3">
          <SearchBar placeholder="Search for products..." />
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in absolute w-full">
          <div className="px-4 py-4 space-y-2 pb-6 shadow-xl">
            {/* Mobile Location */}
            <div className="py-2 border-b border-gray-100 mb-2">
              <div className="flex items-center gap-2" onClick={() => {setLocationModalOpen(true); setMobileOpen(false);}}>
                <HiOutlineMapPin className="text-midnight w-5 h-5"/>
                <div>
                  <span className="text-sm font-bold text-midnight block">Delivery in 12 minutes</span>
                  <span className="text-xs text-gray-500">B169, Sector B, Manak Nagar...</span>
                </div>
              </div>
            </div>

            {user ? (
              <>
                {!isAdmin && (
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-midnight hover:text-gold rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    My Orders
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-midnight hover:text-gold rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Admin Panel
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left px-4 py-2.5 text-red-500 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Logout ({user.name})
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-gold font-bold rounded-lg hover:bg-gray-50 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
