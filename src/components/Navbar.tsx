
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
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
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-apple",
        isScrolled
          ? "py-3 glassmorphism"
          : "py-6 bg-transparent"
      )}
    >
      <div className="container px-6 mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight transition-opacity duration-300 ease-apple hover:opacity-80"
        >
          artfolio
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-all duration-300 ease-apple hover:text-black/70",
                location.pathname === link.path
                  ? "text-black"
                  : "text-gray-500"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-4 w-px bg-gray-300 mx-1" />
          <Link
            to="/auth"
            className="text-sm font-medium px-5 py-2 rounded-full bg-black text-white transition-all duration-300 ease-apple hover:bg-black/80 active:scale-[0.98]"
          >
            Sign In
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-full transition-colors duration-300 ease-apple hover:bg-black/5"
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
      <div
        className={cn(
          "fixed inset-0 top-[60px] bg-white/95 backdrop-blur-lg z-40 transition-transform duration-500 ease-apple md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="container h-full flex flex-col items-center justify-center space-y-8 p-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-lg font-medium transition-colors duration-300 ease-apple",
                location.pathname === link.path
                  ? "text-black"
                  : "text-gray-500"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/auth"
            className="mt-4 text-lg font-medium w-full max-w-xs text-center px-5 py-3 rounded-full bg-black text-white transition-all duration-300 ease-apple hover:bg-black/80 active:scale-[0.98]"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
