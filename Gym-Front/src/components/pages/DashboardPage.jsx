import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { membershipsApi } from "../../api/membershipsApi";
import { trainersApi } from "../../api/trainersApi";
import {
  FaUser, FaCalendarCheck, FaDumbbell, FaCrown,
  FaCheckCircle, FaTimesCircle, FaSpinner,
} from "react-icons/fa";

const DashboardPage = () => {
  const { user } = useAuth();
  const [membership, setMembership] = useState(null);
  const [trainers, setTrainers]     = useState([]);
  const [loadingM, setLoadingM]     = useState(true);
  const [loadingT, setLoadingT]     = useState(true);

  useEffect(() => {
    membershipsApi.getUserMemberships()
      .then(r => setMembership(r.data.membership))
      .catch(() => setMembership(null))
      .finally(() => setLoadingM(false));

    trainersApi.getAllTrainers()
      .then(r => setTrainers(r.data.trainers || []))
      .catch(() => setTrainers([]))
      .finally(() => setLoadingT(false));
  }, []);

  const daysLeft = membership
    ? Math.max(0, Math.ceil((new Date(membership.endDate) - new Date()) / 86400000))
    : 0;

  const joinDate = user?.joinDate
    ? new Date(user.joinDate).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  const endDate = membership
    ? new Date(membership.endDate).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })
    : null;

  const planLabel = membership
    ? membership.planType.charAt(0).toUpperCase() + membership.planType.slice(1) + " Plan"
    : "No active plan";

  const stats = [
    {
      icon: FaCrown,
      label: "Membership",
      value: membership ? planLabel : "None",
      badge: membership ? "Active" : "Inactive",
      good: !!membership,
      color: "from-yellow-500 to-amber-500",
    },
    {
      icon: FaCalendarCheck,
      label: "Days Remaining",
      value: loadingM ? "..." : (membership ? `${daysLeft}` : "—"),
      badge: membership ? (daysLeft > 7 ? "Good" : "Expiring") : "—",
      good: daysLeft > 7,
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: FaDumbbell,
      label: "Trainers Available",
      value: loadingT ? "..." : `${trainers.length}`,
      badge: "Live",
      good: true,
      color: "from-blue-500 to-cyan-500",
    },
  ];

  const sessions = trainers.slice(0, 3).flatMap(t =>
    (t.schedule || []).slice(0, 1).map(s => ({
      id: t._id + s.day,
      trainer: t.name,
      type: s.sessionType || t.specialisation,
      date: s.day,
      time: s.startTime ? `${s.startTime} – ${s.endTime}` : "—",
    }))
  ).slice(0, 3);

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 md:px-6">

        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back,{" "}
            <span className="gradient-text">{user?.name?.split(" ")[0]}!</span>
          </h1>
          <p className="text-gray-400">Track your fitness journey and stay motivated</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="glass-card p-6 transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="text-white text-xl" />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.good ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {stat.badge}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Trainer Sessions */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Trainer Schedules</h2>
              <Link to="/trainers" className="text-primary text-sm hover:underline">View All</Link>
            </div>
            {loadingT ? (
              <div className="flex justify-center py-8">
                <FaSpinner className="text-primary text-2xl animate-spin" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No trainer sessions found</p>
            ) : (
              <div className="space-y-4">
                {sessions.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-4 bg-dark rounded-xl border border-border">
                    <div>
                      <p className="text-white font-semibold">{s.type}</p>
                      <p className="text-gray-400 text-sm">with {s.trainer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-medium">{s.date}</p>
                      <p className="text-gray-400 text-sm">{s.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile + Membership */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <FaUser className="text-dark text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <p className="text-primary">{user?.role === "admin" ? "Admin Account" : "Member Account"}</p>
                <p className="text-gray-400 text-sm">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex justify-between">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white">{joinDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Membership Plan</span>
                {loadingM
                  ? <FaSpinner className="text-primary animate-spin" />
                  : <span className={membership ? "text-primary font-semibold" : "text-gray-500"}>{planLabel}</span>
                }
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                {loadingM ? <FaSpinner className="text-primary animate-spin" /> : (
                  <span className={`flex items-center gap-1 text-sm font-semibold ${membership ? "text-green-400" : "text-red-400"}`}>
                    {membership ? <FaCheckCircle /> : <FaTimesCircle />}
                    {membership ? "Active" : "No Membership"}
                  </span>
                )}
              </div>
              {membership && endDate && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Expires On</span>
                  <span className={`text-sm font-semibold ${daysLeft <= 7 ? "text-red-400" : "text-white"}`}>{endDate}</span>
                </div>
              )}
              {membership && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Days Left</span>
                  <span className={`text-sm font-bold ${daysLeft <= 7 ? "text-red-400" : "text-green-400"}`}>{daysLeft} days</span>
                </div>
              )}
            </div>

            {!membership && !loadingM && (
              <Link
                to="/programs"
                className="mt-4 w-full block text-center px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-dark font-semibold text-sm hover:opacity-90 transition"
              >
                Buy a Membership Plan
              </Link>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/trainers"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-dark font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
          >
            Book a Training Session
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
