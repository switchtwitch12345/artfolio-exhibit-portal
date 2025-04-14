
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Gavel } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import WalletConnector from "@/components/WalletConnector";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navigationLinks = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/gallery" },
    { name: "Auctions", path: "/auctions" },
    { name: "About", path: "/about" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          artfolio
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-nav">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`navbar-nav-item ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
              {link.name === "Auctions" && <Gavel size={16} className="ml-1" />}
            </Link>
          ))}
          <div className="navbar-separator" />
          {isAuthenticated ? (
            <button onClick={handleLogout} className="navbar-log-out">
              Log Out
            </button>
          ) : (
            <Link to="/auth" className="navbar-sign-in">
              Sign In
            </Link>
          )}
        </nav>

        <div className="ml-auto hidden md:block">
          <WalletConnector />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="navbar-menu-button"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X size={20} className="text-black" />
          ) : (
            <Menu size={20} className="text-black" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`navbar-mobile-menu ${isMobileMenuOpen ? 'visible' : 'hidden'}`}>
        <nav className="navbar-mobile-nav">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`navbar-mobile-nav-item ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
              {link.name === "Auctions" && <Gavel size={16} className="ml-1" />}
            </Link>
          ))}
          
          <div className="py-4">
            <WalletConnector />
          </div>
          
          {isAuthenticated ? (
            <button onClick={handleLogout} className="navbar-mobile-log-out">
              Log Out
            </button>
          ) : (
            <Link to="/auth" className="navbar-mobile-sign-in">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
