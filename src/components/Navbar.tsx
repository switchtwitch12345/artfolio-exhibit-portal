
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
    { name: "About", path: "/about" },
  ];

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
            </Link>
          ))}
          <div className="navbar-separator" />
          <Link to="/auth" className="navbar-sign-in">
            Sign In
          </Link>
        </nav>

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
            </Link>
          ))}
          <Link to="/auth" className="navbar-mobile-sign-in">
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
