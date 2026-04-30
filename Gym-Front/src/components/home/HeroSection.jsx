import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaPlay,
  FaDumbbell,
  FaHeartbeat,
  FaUsers,
  FaTimes,
} from "react-icons/fa";
import Button from "../common/Button";
import axiosInstance from "../../api/axiosConfig";

const DemoModal = ({ onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
      >
        <FaTimes />
      </button>
      <div className="bg-gray-900 px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
          <FaPlay className="text-primary text-xs" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">GetFit Demo</p>
          <p className="text-gray-400 text-xs">
            See how our gym management works
          </p>
        </div>
      </div>
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/gey73xiS79A?autoplay=1&rel=0"
          title="GetFit Gym Demo"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="bg-gray-900 px-6 py-3 flex justify-between items-center">
        <p className="text-gray-400 text-xs">GetFit — Transform Your Body</p>
        <Link
          to="/register"
          onClick={onClose}
          className="text-primary text-xs font-semibold hover:underline"
        >
          Join Now →
        </Link>
      </div>
    </div>
  </div>
);

const HeroSection = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [stats, setStats] = useState({
    totalMembers: null,
    totalTrainers: null,
    activeMembers: null,
  });

  useEffect(() => {
    axiosInstance
      .get("/stats")
      .then((res) => {
        if (res.data.success) setStats(res.data.stats);
      })
      .catch(() => {});
  }, []);

  const fmt = (val, fallback) =>
    val === null ? "..." : val > 0 ? `${val}` : fallback;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-pulse">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              <span className="text-primary text-sm font-medium">
                Since 2020
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Transform Your Body with{" "}
              <span className="gradient-text bg-gradient-to-r from-primary to-secondary bg-clip-text">
                GetFit
              </span>
            </h1>

            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Join the ultimate fitness community. Get personalized training
              plans, expert guidance, and state-of-the-art facilities to achieve
              your fitness goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex items-center gap-2 group"
                >
                  Join Now
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setShowDemo(true)}
                className="flex items-center gap-2"
              >
                <FaPlay />
                Watch Demo
              </Button>
            </div>

            {/* ✅ REAL stats from database */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border">
              <div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <FaUsers className="text-primary text-xl" />
                  <span className="text-2xl font-bold text-white">
                    {fmt(stats.totalMembers, "0")}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">Total Members</p>
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <FaDumbbell className="text-primary text-xl" />
                  <span className="text-2xl font-bold text-white">
                    {fmt(stats.totalTrainers, "0")}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">Expert Trainers</p>
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <FaHeartbeat className="text-primary text-xl" />
                  <span className="text-2xl font-bold text-white">
                    {fmt(stats.activeMembers, "0")}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">Active Plans</p>
              </div>
            </div>
          </div>

          {/* Right — Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative neon-border rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Fitness Training"
                className="w-full h-auto rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent"></div>
              <button
                onClick={() => setShowDemo(true)}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <div className="w-16 h-16 bg-primary/80 hover:bg-primary rounded-full flex items-center justify-center shadow-lg transition-all group-hover:scale-110">
                  <FaPlay className="text-white text-xl ml-1" />
                </div>
              </button>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-10 -right-10 glass-card p-4 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <FaDumbbell className="text-primary text-xl" />
                </div>
                <div>
                  <p className="text-white font-semibold">Personal Training</p>
                  <p className="text-primary text-sm">Expert Guidance</p>
                </div>
              </div>
            </div>

            <div
              className="absolute -bottom-10 -left-10 glass-card p-4 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <FaHeartbeat className="text-secondary text-xl" />
                </div>
                <div>
                  <p className="text-white font-semibold">24/7 Support</p>
                  <p className="text-secondary text-sm">Always Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
