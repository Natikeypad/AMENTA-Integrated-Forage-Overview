import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/gallery", label: "Gallery" },
    { href: "/news", label: "News" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-green-900 text-white text-sm hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              +251 91 685 5542
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              amentaagriculturaldevelopmentp@gmail.com
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Nyangatom Woreda, South Omo, Ethiopia
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-amber-400 transition-colors"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="hover:text-amber-400 transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="hover:text-amber-400 transition-colors"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white shadow"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/images/logo.png"
                alt="Amenta Agricultural Development PLC"
                className="h-12 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-green-800 leading-tight group-hover:text-green-700 transition-colors">
                  AMENTA
                </h1>
                <p className="text-[10px] text-gray-500 leading-tight tracking-wide">
                  AGRICULTURAL DEVELOPMENT PLC
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-amber-700 hover:bg-amber-50 transition-all flex items-center gap-1.5"
                >
                  <Shield className="w-4 h-4" /> Dashboard
                </Link>
              )}
              {isAuthenticated ? (
                <div className="flex items-center gap-2 ml-4">
                  {user?.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.name || "User"}
                      className="w-8 h-8 rounded-full border-2 border-green-500"
                    />
                  )}
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="ml-4 px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6 text-green-800" /> : <Menu className="w-6 h-6 text-green-800" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t shadow-lg animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" /> Dashboard
                </Link>
              )}
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block px-4 py-3 bg-green-600 text-white rounded-lg text-sm font-medium text-center hover:bg-green-700 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
