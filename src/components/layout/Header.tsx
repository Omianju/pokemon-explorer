import { Database, GitCompare, Heart, Home, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePokemonContext } from "../../contexts/PokemonContext";
import SearchBar from "../common/SearchBar";
import { Pokeball } from "../icons/Pokeball";

const Header: React.FC = () => {
  const location = useLocation();
  const { setSearchTerm, searchTerm } = usePokemonContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Only show search on the home page
  const showSearch = location.pathname === "/";

  // Update header style based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-red-600 font-bold text-xl"
          >
            <Pokeball className="w-8 h-8  text-red-600" />
            <span>PokéExplorer</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              <NavLink to="/" icon={<Home size={18} />} label="Home" />
              <NavLink
                to="/favorites"
                icon={<Heart size={18} />}
                label="Favorites"
              />
              <NavLink
                to="/compare"
                icon={<GitCompare size={18} />}
                label="Compare"
              />
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t mt-2 px-4 py-4 shadow-lg">
          {showSearch && (
            <SearchBar
              onSearch={setSearchTerm}
              initialValue={searchTerm}
              className="mb-4"
            />
          )}

          <nav className="flex flex-col space-y-4">
            <MobileNavLink to="/" icon={<Home size={18} />} label="Home" />
            <MobileNavLink
              to="/favorites"
              icon={<Heart size={18} />}
              label="Favorites"
            />
            <MobileNavLink
              to="/compare"
              icon={<Database size={18} />}
              label="Compare"
            />
          </nav>
        </div>
      )}
    </header>
  );
};

// NavLink component for desktop
const NavLink: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
}> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-1 py-2 px-3 rounded-lg transition-colors ${
        isActive
          ? "text-red-600 font-semibold"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

// NavLink component for mobile
const MobileNavLink: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
}> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${
        isActive
          ? "bg-red-100 text-red-600 font-semibold"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span className="text-lg">{label}</span>
    </Link>
  );
};

export default Header;
