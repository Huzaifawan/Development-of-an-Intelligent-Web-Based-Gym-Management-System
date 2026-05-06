import React, { useState } from "react";
import { FaCheck, FaTimes, FaCrown, FaFire, FaStar } from "react-icons/fa";
import Button from "../common/Button";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ALL_FEATURES = [
  "Gym access (6am–10pm)",
  "Locker room & equipment",
  "Group fitness classes",
  "Sauna access",
  "Personal trainer",
  "24/7 access",
];

const FALLBACK_PLANS = [
  {
    _id: "1",
    name: "Basic",
    price: 2000,
    duration: "1 month",
    included: [true, true, false, false, false, false],
    color: "from-blue-500 to-cyan-500",
    popular: false,
  },
  {
    _id: "2",
    name: "Standard",
    price: 4000,
    duration: "1 month",
    included: [true, true, true, true, false, false],
    color: "from-primary to-secondary",
    popular: true,
  },
  {
    _id: "3",
    name: "Premium",
    price: 7000,
    duration: "1 month",
    included: [true, true, true, true, true, true],
    color: "from-purple-500 to-pink-500",
    popular: false,
  },
];

const MembershipSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = () => {
    if (!user) navigate("/register");
    else navigate("/programs");
  };

  const getPlanIcon = (index) => {
    if (index === 0) return <FaStar className="text-blue-400 text-xl" />;
    if (index === 1) return <FaCrown className="text-yellow-400 text-xl" />;
    return <FaFire className="text-orange-400 text-xl" />;
  };

  return (
    <section className="py-16 bg-dark/50">
      <div className="mx-auto px-6" style={{ maxWidth: "960px" }}>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="gradient-text">Membership</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Select the perfect plan that fits your fitness goals and budget.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5 items-stretch">
          {FALLBACK_PLANS.map((plan, index) => (
            <div
              key={plan._id}
              className={`relative glass-card p-6 flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 group ${
                plan.popular
                  ? "border-2 border-primary"
                  : "border border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-secondary text-dark px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Icon + Name + Price */}
              <div className="text-center mb-5">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                >
                  {getPlanIcon(index)}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-bold text-primary">
                    PKR {plan.price?.toLocaleString()}
                  </span>
                  <span className="text-gray-400 text-xs">
                    /{plan.duration}
                  </span>
                </div>
              </div>

              {/* Features — same list for all, tick or cross */}
              <ul className="space-y-2 mb-6 flex-1">
                {ALL_FEATURES.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    {plan.included[i] ? (
                      <>
                        <FaCheck className="text-primary flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </>
                    ) : (
                      <>
                        <FaTimes className="text-gray-600 flex-shrink-0" />
                        <span className="text-gray-600 line-through">
                          {feature}
                        </span>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              {/* Button always at bottom */}
              <Button
                variant={plan.popular ? "primary" : "secondary"}
                size="md"
                onClick={handleSelectPlan}
                className="w-full mt-auto"
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;
