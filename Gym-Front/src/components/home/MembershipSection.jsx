import React, { useState, useEffect } from "react";
import { membershipsApi } from "../../api/membershipsApi";
import { FaCheck, FaCrown, FaFire, FaStar } from "react-icons/fa";
import Button from "../common/Button";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const MembershipSection = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const response = await membershipsApi.getAllMemberships();
      setMemberships(response.data.memberships || response.data);
      setError(null);
    } catch (err) {
      setError(null); // suppress error since fallback data is provided
      // Fallback data if API is not ready
      setMemberships([
        {
          _id: "1",
          name: "Basic",
          price: 2000,
          duration: "1 month",
          features: ["Access to gym", "Basic equipment", "Locker room"],
          color: "from-blue-500 to-cyan-500",
        },
        {
          _id: "2",
          name: "Standard",
          price: 4000,
          duration: "1 month",
          features: [
            "All Basic features",
            "Group classes",
            "Personal trainer (2x/month)",
            "Nutrition guide",
          ],
          color: "from-primary to-secondary",
          popular: true,
        },
        {
          _id: "3",
          name: "Premium",
          price: 7000,
          duration: "1 month",
          features: [
            "All Standard features",
            "24/7 access",
            "Unlimited personal training",
            "Spa & sauna",
            "Guest passes",
          ],
          color: "from-purple-500 to-pink-500",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    if (!user) {
      navigate("/register");
    } else {
      // Navigate to checkout or show modal
      alert(`Selected ${plan.name} plan. Checkout coming soon!`);
    }
  };

  const getPlanIcon = (index) => {
    if (index === 1) return <FaCrown className="text-yellow-400" />;
    if (index === 2) return <FaFire className="text-orange-400" />;
    return <FaStar className="text-primary" />;
  };

  if (loading) return <Loader />;

  return (
    <section className="py-20 bg-dark/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="gradient-text">Membership</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Select the perfect plan that fits your fitness goals and budget. All
            plans include access to our state-of-the-art facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {memberships.map((plan, index) => (
            <div
              key={plan._id}
              className={`relative glass-card p-8 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 group ${
                plan.popular
                  ? "border-2 border-primary scale-105 md:scale-110"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-secondary text-dark px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  {getPlanIcon(index)}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-primary">
                    PKR {plan.price}
                  </span>
                  <span className="text-gray-400">/{plan.duration}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <FaCheck className="text-primary text-sm" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "primary" : "secondary"}
                size="md"
                onClick={() => handleSelectPlan(plan)}
                className="w-full"
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
