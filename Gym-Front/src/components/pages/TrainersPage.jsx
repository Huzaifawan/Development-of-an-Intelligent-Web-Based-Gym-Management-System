import React, { useState, useEffect } from "react";
import { trainersApi } from "../../api/trainersApi";
import TrainerCard from "../trainers/TrainerCard";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import { FaSearch, FaFilter } from "react-icons/fa";

const TrainersPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const response = await trainersApi.getAllTrainers();
      setTrainers(response.data.trainers || response.data);
      setError(null);
    } catch (err) {
      setError(null); // suppress error since fallback data is provided
      // Fallback data
      setTrainers([
        {
          _id: "1",
          name: "Imran Ullah",
          specialisation: "Fitness Training",
          bio: "Certified fitness trainer at PCB with 5 years of experience in functional fitness and conditioning.",
          experience: 5,
          rating: 4.8,
        },
        {
          _id: "2",
          name: "Waqas Ahmad",
          specialisation: "Bodybuilding & Bulking",
          bio: "Professional bodybuilder specialising in bulking programs and muscle hypertrophy training.",
          experience: 6,
          rating: 4.6,
        },
        {
          _id: "3",
          name: "Mukhtiar",
          specialisation: "Bodybuilding",
          bio: "Experienced bodybuilder helping clients build muscle mass and reach their body composition goals.",
          experience: 4,
          rating: 4.7,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specialisation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Meet Our <span className="gradient-text">Expert Trainers</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our certified trainers are here to guide you every step of the way.
            Choose from a variety of specializations and achieve your fitness
            goals.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search trainers by name or specialisation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-12 pr-8 py-3 bg-card border border-border rounded-xl text-white focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="all">All Trainers</option>
              <option value="strength">Strength Training</option>
              <option value="cardio">Cardio & Yoga</option>
              <option value="crossfit">CrossFit</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Trainers Grid */}
        {filteredTrainers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No trainers found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredTrainers.map((trainer, index) => (
              <TrainerCard key={trainer._id} trainer={trainer} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainersPage;
