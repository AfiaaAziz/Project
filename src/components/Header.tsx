import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, ChevronDown, Menu, X, ShoppingCart } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSignOut = () => {
    setShowAccountMenu(false);
    signOut();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowMobileMenu(false);
    } else {
      navigate("/browse");
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b-4 border-orange-500">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:flex justify-between items-center h-20">
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="goodpix.org logo"
                className="h-10"
              />
            </Link>
          </div>

          <nav className="flex-1 flex justify-center items-center space-x-8">
            <div className="relative">
              <Link
                to="/browse"
                className="flex items-center text-gray-600 hover:text-orange-500 font-semibold transition-colors text-sm tracking-wide"
              >
                <span>BROWSE</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="flex items-center text-gray-600 hover:text-orange-500 font-semibold transition-colors text-sm tracking-wide"
              >
                <span>MY ACCOUNT</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/auth"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              )}
            </div>
          </nav>

          <div className="flex-1 flex justify-end items-center space-x-4">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="keywords"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm w-40"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
              >
                Search
              </button>
            </form>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors font-semibold text-sm">
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
            </button>
          </div>
        </div>

        <div className="md:hidden flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <img
              src="/images/logo.png"
              alt="goodpix.org logo"
              className="h-9"
            />
          </Link>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 text-gray-700 hover:text-orange-500 transition-colors"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4">
            <Link
              to="/browse"
              onClick={() => setShowMobileMenu(false)}
              className="text-left text-gray-700 hover:text-orange-500 font-medium"
            >
              BROWSE
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setShowMobileMenu(false)}
                  className="text-left text-gray-700 hover:text-orange-500 font-medium"
                >
                  MY ACCOUNT
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setShowMobileMenu(false);
                  }}
                  className="text-left text-gray-700 hover:text-orange-500 font-medium"
                >
                  SIGN OUT
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setShowMobileMenu(false)}
                className="text-left text-gray-700 hover:text-orange-500 font-medium"
              >
                SIGN IN
              </Link>
            )}
            <hr />
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 mt-4"
            >
              <input
                type="text"
                placeholder="keywords"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold"
              >
                Search
              </button>
            </form>
            <button className="flex items-center justify-center space-x-2 text-gray-600 hover:text-orange-500 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors font-semibold text-sm">
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
