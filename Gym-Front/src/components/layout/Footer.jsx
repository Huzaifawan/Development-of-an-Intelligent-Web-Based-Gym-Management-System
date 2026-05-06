import React from "react";
import { Link } from "react-router-dom";
import {
  FaDumbbell,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: "/", label: "Home" },
    { path: "/trainers", label: "Trainers" },
    { path: "/programs", label: "Programs" },
    { path: "/login", label: "Login" },
    { path: "/register", label: "Join Now" },
  ];

  return (
    <footer className="bg-dark/95 border-t border-border py-12 mt-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FaDumbbell className="text-3xl text-primary" />
              <span className="text-2xl font-bold gradient-text">GetFit</span>
            </div>
            <p className="text-gray-400 mb-4">
              Transform your body and mind with GetFit. Your journey to a
              healthier life starts here.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all duration-300"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all duration-300"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all duration-300"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/10 transition-all duration-300"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <FaMapMarkerAlt className="text-primary" />
                <span>Shaheen Town University Road</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaPhone className="text-primary" />
                <span>+92 3459411552</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaEnvelope className="text-primary" />
                <span>getfit4life@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Opening Hours
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>Monday - Saturday: 6:00 AM - 10:00 PM</li>
              <li>Sunday: 8:00 AM - 6:00 PM</li>
              <li className="text-primary mt-3">
                Premium Members: 24/7 Access
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} GetFit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
