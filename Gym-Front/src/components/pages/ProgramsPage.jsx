import React from "react";
import {
  FaWeightHanging,
  FaHeart,
  FaRunning,
  FaSpa,
  FaLeaf,
  FaBicycle,
} from "react-icons/fa";

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

const ProgramsPage = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Programs</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover a wide range of fitness programs designed to help you reach
            your goals. From strength training to mindfulness, we have something
            for everyone.
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

        {/* Call to Action */}
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
