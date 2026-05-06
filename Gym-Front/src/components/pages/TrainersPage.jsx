import React, { useState, useEffect } from "react";
import { trainersApi } from "../../api/trainersApi";
import TrainerCard from "../trainers/TrainerCard";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import { FaSearch, FaFilter } from "react-icons/fa";

const FALLBACK_TRAINERS = [
  {
    _id: "1",
    name: "Imran Ullah",
    specialisation: "Fitness & Fat Loss",
    bio: "Official PCB (Pakistan Cricket Board) certified fitness coach with 8 years of experience. Specialises in functional fitness, fat loss programs, and athletic conditioning. Has trained national-level cricketers and elite athletes.",
    experience: 8,
    rating: 4.9,
    gender: "male",
    profileImage:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=400&fit=crop",
  },
  {
    _id: "2",
    name: "Waqas Ahmad",
    specialisation: "Bodybuilding & Bulking",
    bio: "Professional competitive bodybuilder with extensive experience in bulking and cutting cycles. Helps clients achieve maximum muscle hypertrophy and contest-ready physiques.",
    experience: 7,
    rating: 4.7,
    gender: "male",
    profileImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
  },
  {
    _id: "3",
    name: "Mukhtiar Ahmad",
    specialisation: "Bodybuilding",
    bio: "Former competitive bodybuilder and proud Mr. Peshawar title holder. Brings championship-level expertise to help clients build impressive physiques and achieve their body composition goals.",
    experience: 6,
    rating: 4.8,
    gender: "male",
    profileImage:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop",
  },
  {
    _id: "4",
    name: "Fatima Malik",
    specialisation: "Yoga & Wellness",
    bio: "Certified female yoga instructor specialising in women's fitness and wellness. Expert in Hatha yoga, Vinyasa flow, flexibility training, and mindfulness meditation. Sessions available for females only.",
    experience: 5,
    rating: 4.9,
    gender: "female",
    profileImage:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
  },
];

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
      setError(null);
      setTrainers(FALLBACK_TRAINERS);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specialisation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "fitness" &&
        trainer.specialisation.toLowerCase().includes("fitness")) ||
      (filter === "bodybuilding" &&
        trainer.specialisation.toLowerCase().includes("bodybuilding")) ||
      (filter === "yoga" &&
        trainer.specialisation.toLowerCase().includes("yoga"));
    return matchesSearch && matchesFilter;
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
              <option value="fitness">Fitness & Fat Loss</option>
              <option value="bodybuilding">Bodybuilding</option>
              <option value="yoga">Yoga & Wellness</option>
            </select>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

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
