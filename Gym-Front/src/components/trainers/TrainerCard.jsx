import React, { useState } from "react";
import {
  FaStar,
  FaCalendarAlt,
  FaDumbbell,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { sessionsApi } from "../../api/sessionsApi";

const MALE_IMAGES = [
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
];

const FEMALE_IMAGES = [
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop",
];

const FEMALE_NAMES = [
  "fatima",
  "sara",
  "ayesha",
  "maria",
  "zara",
  "nadia",
  "hina",
  "sana",
  "amna",
  "rabia",
];

const getTrainerImage = (trainer, index) => {
  if (trainer.profileImage) return trainer.profileImage;
  const isFemale =
    trainer.gender === "female" ||
    (trainer.name &&
      FEMALE_NAMES.some((n) => trainer.name.toLowerCase().includes(n)));
  const images = isFemale ? FEMALE_IMAGES : MALE_IMAGES;
  return images[index % images.length];
};

const TrainerCard = ({ trainer, index }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    sessionType: trainer.specialisation || "General Training",
    notes: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleBook = async () => {
    setError(null);
    if (!form.date || !form.startTime || !form.endTime) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.startTime >= form.endTime) {
      setError("End time must be after start time.");
      return;
    }
    setLoading(true);
    try {
      await sessionsApi.bookSession({
        trainerId: trainer._id,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        sessionType: form.sessionType,
        notes: form.notes,
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSuccess(false);
    setError(null);
    setForm({
      date: "",
      startTime: "",
      endTime: "",
      sessionType: trainer.specialisation || "General Training",
      notes: "",
    });
  };

  const today = new Date().toISOString().split("T")[0];
  const trainerImage = getTrainerImage(trainer, index);

  return (
    <>
      <div className="group relative glass-card overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
        <div className="relative overflow-hidden h-64">
          <img
            src={trainerImage}
            alt={trainer.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-gray-300 text-sm">{trainer.bio}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {trainer.name}
              </h3>
              <p className="text-primary text-sm font-medium">
                {trainer.specialisation}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
              <FaStar className="text-yellow-400 text-sm" />
              <span className="text-white text-sm font-semibold">
                {trainer.rating || 4.8}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
            <div className="flex items-center gap-1">
              <FaDumbbell className="text-primary" />
              <span>{trainer.experience || 5}+ years exp</span>
            </div>
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="text-primary" />
              <span>Available Mon-Sat</span>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="w-full mt-4 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/80 hover:scale-105 transition-all duration-300 font-medium"
          >
            Book Session
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes size={18} />
            </button>
            {success ? (
              <div className="text-center py-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                    <FaCheck className="text-green-400 text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Session Booked!
                </h3>
                <p className="text-gray-400 mb-2">
                  Your session with{" "}
                  <span className="text-primary font-semibold">
                    {trainer.name}
                  </span>{" "}
                  has been confirmed.
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  {form.date} &bull; {form.startTime} – {form.endTime}
                </p>
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-primary rounded-xl text-white font-medium hover:bg-primary/80 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-1">
                  Book a Session
                </h3>
                <p className="text-gray-400 text-sm mb-5">
                  with{" "}
                  <span className="text-primary font-semibold">
                    {trainer.name}
                  </span>{" "}
                  — {trainer.specialisation}
                </p>
                {error && (
                  <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">
                      Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      min={today}
                      value={form.date}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-gray-300 text-sm mb-1">
                        Start Time <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={form.startTime}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-300 text-sm mb-1">
                        End Time <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={form.endTime}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">
                      Session Type
                    </label>
                    <input
                      type="text"
                      name="sessionType"
                      value={form.sessionType}
                      onChange={handleChange}
                      placeholder="e.g. Strength Training"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">
                      Notes (optional)
                    </label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Any specific goals or requests..."
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:border-primary focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-700 text-gray-300 hover:border-gray-500 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBook}
                    disabled={loading}
                    className="flex-1 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/80 transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Booking..." : "Confirm Booking"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TrainerCard;
