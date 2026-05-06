import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaWeightHanging,
  FaHeart,
  FaRunning,
  FaSpa,
  FaLeaf,
  FaBicycle,
  FaCheck,
  FaCrown,
  FaStar,
  FaRocket,
} from "react-icons/fa";
import { membershipsApi } from "../../api/membershipsApi";
import { useAuth } from "../hooks/useAuth";

const programs = [
  {
    icon: FaWeightHanging,
    title: "Strength Training",
    description:
      "Build muscle and increase strength with our comprehensive weight training programs.",
    duration: "45-60 min",
    level: "Intermediate to Advanced",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: FaHeart,
    title: "Cardio Fitness",
    description:
      "Improve endurance and heart health with high-energy cardio workouts.",
    duration: "30-45 min",
    level: "All Levels",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: FaSpa,
    title: "Yoga & Flexibility",
    description:
      "Enhance flexibility, reduce stress, and improve mental clarity.",
    duration: "60 min",
    level: "All Levels",
    color: "from-green-500 to-teal-500",
  },
  {
    icon: FaRunning,
    title: "HIIT Training",
    description:
      "Burn maximum calories in minimum time with high-intensity interval training.",
    duration: "20-30 min",
    level: "Intermediate",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: FaLeaf,
    title: "Mindfulness & Meditation",
    description: "Find inner peace and improve mental wellbeing.",
    duration: "30 min",
    level: "All Levels",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FaBicycle,
    title: "Spinning",
    description: "High-energy cycling workouts that challenge your limits.",
    duration: "45 min",
    level: "All Levels",
    color: "from-yellow-500 to-orange-500",
  },
];

const PLANS = [
  {
    key: "basic",
    name: "Basic",
    price: 2000,
    icon: FaStar,
    color: "from-blue-500 to-cyan-500",
    popular: false,
    features: ["Gym access (6am–10pm)", "Locker room", "Basic equipment"],
    notIncluded: [
      "Group classes",
      "Sauna access",
      "Personal trainer",
      "Diet consultation",
      "24/7 access",
    ],
  },
  {
    key: "standard",
    name: "Standard",
    price: 4000,
    icon: FaRocket,
    color: "from-primary to-secondary",
    popular: true,
    features: [
      "Gym access (6am–10pm)",
      "Locker room",
      "Basic equipment",
      "Group classes",
      "Sauna access",
    ],
    notIncluded: ["Personal trainer", "Diet consultation", "24/7 access"],
  },
  {
    key: "premium",
    name: "Premium",
    price: 7000,
    icon: FaCrown,
    color: "from-yellow-400 to-orange-500",
    popular: false,
    features: [
      "Gym access (6am–10pm)",
      "Locker room",
      "Basic equipment",
      "Group classes",
      "Sauna access",
      "Personal trainer",
      "Diet consultation",
      "24/7 access",
    ],
    notIncluded: [],
  },
];

const ProgramsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleBuy = async (planKey) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedPlan(planKey);
    setError(null);
    setLoading(true);
    try {
      await membershipsApi.purchaseMembership({
        planType: planKey,
        durationMonths: duration,
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Purchase failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Programs Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Programs</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover a wide range of fitness programs designed to help you reach
            your goals.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <div
                key={index}
                className="group glass-card p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${program.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {program.title}
                </h3>
                <p className="text-gray-400 mb-4">{program.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div>
                    <p className="text-gray-500 text-xs">Duration</p>
                    <p className="text-white text-sm font-medium">
                      {program.duration}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Level</p>
                    <p className="text-primary text-sm font-medium">
                      {program.level}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Membership Plans Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Membership <span className="gradient-text">Plans</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your goals. Cancel anytime.
            </p>
          </div>

          {/* Duration Selector */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2 flex-wrap justify-center">
              <span className="text-gray-400 text-sm mr-1">Duration:</span>
              {[1, 3, 6, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => setDuration(m)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    duration === m
                      ? "bg-primary text-dark"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {m === 1 ? "1 Month" : m === 12 ? "1 Year" : `${m} Months`}
                </button>
              ))}
            </div>
          </div>

          {/* Success */}
          {success && (
            <div className="max-w-md mx-auto mb-8 px-6 py-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-center">
              ✅ Membership purchased! &nbsp;
              <button
                onClick={() => navigate("/dashboard")}
                className="underline font-semibold"
              >
                View Dashboard
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="max-w-md mx-auto mb-8 px-6 py-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const totalPrice = plan.price * duration;
              const isSelected = selectedPlan === plan.key;
              return (
                <div
                  key={plan.key}
                  className={`relative glass-card p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 ${plan.popular ? "border-primary/50 border-2" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-primary to-secondary text-dark text-xs font-bold px-4 py-1 rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mb-5`}
                  >
                    <Icon className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {plan.name}
                  </h3>
                  <div className="mb-5">
                    <span className="text-3xl font-bold text-white">
                      Rs. {totalPrice.toLocaleString()}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">
                      / {duration === 1 ? "month" : `${duration} months`}
                    </span>
                    {duration > 1 && (
                      <p className="text-primary text-xs mt-1">
                        Rs. {plan.price.toLocaleString()} / month
                      </p>
                    )}
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-gray-300 text-sm"
                      >
                        <FaCheck className="text-green-400 flex-shrink-0" /> {f}
                      </li>
                    ))}
                    {plan.notIncluded.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-gray-600 text-sm line-through"
                      >
                        <FaCheck className="text-gray-700 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleBuy(plan.key)}
                    disabled={loading && isSelected}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                      plan.popular
                        ? "bg-gradient-to-r from-primary to-secondary text-dark hover:shadow-lg hover:shadow-primary/25"
                        : "bg-card border border-border text-white hover:border-primary"
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {loading && isSelected
                      ? "Processing..."
                      : user
                        ? "Buy Now"
                        : "Login to Buy"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">
            Ready to start your fitness journey?
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-dark font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
          >
            Join Now - Free Trial
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProgramsPage;
