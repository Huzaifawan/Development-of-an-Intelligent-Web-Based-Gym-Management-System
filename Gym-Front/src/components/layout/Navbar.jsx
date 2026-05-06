import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FaDumbbell, FaBars, FaTimes, FaUser,
  FaSignOutAlt, FaSignInAlt, FaUserPlus, FaShieldAlt,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/trainers", label: "Trainers" },
    { path: "/programs", label: "Programs" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-dark/95 backdrop-blur-md border-b border-border" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <FaDumbbell className="text-3xl text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-glow"></div>
            </div>
            <span className="text-2xl font-bold gradient-text">GetFit</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className="text-gray-300 hover:text-primary transition-colors duration-300 font-medium relative group">
                {link.label}
                <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-primary transition">
                  <FaUser /> <span>{user.name?.split(" ")[0]}</span>
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-all text-sm font-medium">
                    <FaShieldAlt /> Admin
                  </Link>
                )}
                <button onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-primary text-primary hover:bg-primary/10 transition-all duration-300">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="flex items-center gap-2 text-gray-300 hover:text-primary transition">
                  <FaSignInAlt /> Login
                </Link>
                <Link to="/register"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-dark font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105">
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-2xl text-white">
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-border animate-slideDown">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-primary transition-colors py-2">{link.label}</Link>
              ))}
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-gray-300 hover:text-primary py-2"><FaUser /> Dashboard</Link>
                  {user.role === "admin" && (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-purple-400 py-2"><FaShieldAlt /> Admin Panel</Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-2 text-primary py-2"><FaSignOutAlt /> Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-gray-300 hover:text-primary py-2"><FaSignInAlt /> Login</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-primary py-2"><FaUserPlus /> Join Now</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
