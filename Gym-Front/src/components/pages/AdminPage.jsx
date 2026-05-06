import React, { useState, useEffect } from "react";
import { adminApi } from "../../api/adminApi";
import { usersApi } from "../../api/usersApi";
import { trainersApi } from "../../api/trainersApi";
import { membershipsApi } from "../../api/membershipsApi";
import { sessionsApi } from "../../api/sessionsApi";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  FaUsers, FaDumbbell, FaCrown, FaCalendarCheck,
  FaMoneyBillWave, FaTrash, FaEdit, FaToggleOn, FaToggleOff,
  FaPlus, FaSpinner, FaTimes, FaCheck,
} from "react-icons/fa";

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass-card p-6">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="text-white text-xl" />
      </div>
    </div>
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="text-2xl font-bold text-white mt-1">{value ?? "—"}</p>
  </div>
);

// ─── Modal ───────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
        <FaTimes />
      </button>
      <h2 className="text-xl font-bold text-white mb-5">{title}</h2>
      {children}
    </div>
  </div>
);

// ─── Tab Button ───────────────────────────────────────────────────────────────
const Tab = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
      active ? "bg-primary text-dark" : "text-gray-400 hover:text-white"
    }`}
  >
    {children}
  </button>
);

// ─── Main AdminPage ───────────────────────────────────────────────────────────
const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // { type, data }
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "admin") { navigate("/dashboard"); return; }
    loadDashboard();
  }, [user]);

  useEffect(() => {
    if (tab === "users") loadUsers();
    if (tab === "trainers") loadTrainers();
    if (tab === "memberships") loadMemberships();
    if (tab === "sessions") loadSessions();
  }, [tab]);

  const loadDashboard = async () => {
    try {
      const r = await adminApi.getDashboardStats();
      setStats(r.data.stats || r.data);
    } catch { setStats({}); }
  };

  const loadUsers = async () => {
    setLoading(true);
    try { const r = await usersApi.getAllUsers(); setUsers(r.data.users || r.data.data || []); }
    catch { setUsers([]); }
    finally { setLoading(false); }
  };

  const loadTrainers = async () => {
    setLoading(true);
    try { const r = await trainersApi.getAllTrainers(); setTrainers(r.data.trainers || r.data.data || []); }
    catch { setTrainers([]); }
    finally { setLoading(false); }
  };

  const loadMemberships = async () => {
    setLoading(true);
    try { const r = await membershipsApi.getAllMemberships(); setMemberships(r.data.memberships || r.data.data || []); }
    catch { setMemberships([]); }
    finally { setLoading(false); }
  };

  const loadSessions = async () => {
    setLoading(true);
    try { const r = await sessionsApi.getAllSessions(); setSessions(r.data.sessions || r.data.data || []); }
    catch { setSessions([]); }
    finally { setLoading(false); }
  };

  const showMsg = (text, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3000);
  };

  const openModal = (type, data = {}) => { setForm(data); setModal({ type, data }); };
  const closeModal = () => { setModal(null); setForm({}); };

  // ── Users CRUD ──────────────────────────────────────────────────────────────
  const handleToggleUser = async (id) => {
    try { await adminApi.toggleUserActive(id); loadUsers(); showMsg("User status updated!"); }
    catch { showMsg("Failed to update user", false); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try { await usersApi.deleteUser(id); loadUsers(); showMsg("User deleted!"); }
    catch { showMsg("Failed to delete user", false); }
  };

  // ── Trainers CRUD ───────────────────────────────────────────────────────────
  const handleSaveTrainer = async () => {
    try {
      if (modal.data._id) {
        await trainersApi.updateTrainer(modal.data._id, form);
        showMsg("Trainer updated!");
      } else {
        await trainersApi.createTrainer(form);
        showMsg("Trainer created!");
      }
      closeModal(); loadTrainers();
    } catch (e) { showMsg(e.response?.data?.message || "Failed", false); }
  };

  const handleDeleteTrainer = async (id) => {
    if (!window.confirm("Delete this trainer?")) return;
    try { await trainersApi.deleteTrainer(id); loadTrainers(); showMsg("Trainer deleted!"); }
    catch { showMsg("Failed to delete trainer", false); }
  };

  // ── Memberships CRUD ────────────────────────────────────────────────────────
  const handleUpdateMembership = async () => {
    try {
      await membershipsApi.updateMembership(modal.data._id, form);
      showMsg("Membership updated!"); closeModal(); loadMemberships();
    } catch (e) { showMsg(e.response?.data?.message || "Failed", false); }
  };

  const handleCancelMembership = async (id) => {
    if (!window.confirm("Cancel this membership?")) return;
    try { await membershipsApi.cancelMembership(id); loadMemberships(); showMsg("Membership cancelled!"); }
    catch { showMsg("Failed", false); }
  };

  // ── Sessions ────────────────────────────────────────────────────────────────
  const handleCancelSession = async (id) => {
    if (!window.confirm("Cancel this session?")) return;
    try { await sessionsApi.cancelSession(id); loadSessions(); showMsg("Session cancelled!"); }
    catch { showMsg("Failed", false); }
  };

  const inp = "w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none";
  const lbl = "block text-gray-300 text-sm mb-1";

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">
            Admin <span className="gradient-text">Panel</span>
          </h1>
          <p className="text-gray-400">Manage your gym — users, trainers, memberships, sessions</p>
        </div>

        {/* Success/Error Message */}
        {msg && (
          <div className={`mb-6 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium ${msg.ok ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
            {msg.ok ? <FaCheck /> : <FaTimes />} {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {["dashboard","users","trainers","memberships","sessions"].map(t => (
            <Tab key={t} active={tab === t} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Tab>
          ))}
        </div>

        {/* ── DASHBOARD ─────────────────────────────────────────────────────── */}
        {tab === "dashboard" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon={FaUsers}         label="Total Users"       value={stats?.totalUsers}        color="bg-blue-500/20" />
              <StatCard icon={FaCrown}          label="Active Members"    value={stats?.activeMembers}     color="bg-green-500/20" />
              <StatCard icon={FaDumbbell}       label="Trainers"          value={stats?.totalTrainers}     color="bg-purple-500/20" />
              <StatCard icon={FaMoneyBillWave}  label="Total Revenue"     value={stats?.totalRevenue ? `PKR ${stats.totalRevenue.toLocaleString()}` : "—"} color="bg-yellow-500/20" />
            </div>
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["users","trainers","memberships","sessions"].map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className="p-4 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-xl text-primary font-medium transition-all capitalize">
                    Manage {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ─────────────────────────────────────────────────────────── */}
        {tab === "users" && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-4">All Users ({users.length})</h2>
            {loading ? <div className="flex justify-center py-10"><FaSpinner className="text-primary text-2xl animate-spin" /></div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-border">
                      <th className="text-left py-3 px-2">Name</th>
                      <th className="text-left py-3 px-2">Email</th>
                      <th className="text-left py-3 px-2">Role</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Joined</th>
                      <th className="text-left py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-b border-border/50 hover:bg-white/5">
                        <td className="py-3 px-2 text-white font-medium">{u.name}</td>
                        <td className="py-3 px-2 text-gray-400">{u.email}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === "admin" ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"}`}>{u.role}</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{u.isActive ? "Active" : "Inactive"}</span>
                        </td>
                        <td className="py-3 px-2 text-gray-400">{new Date(u.joinDate || u.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-2">
                          <div className="flex gap-2">
                            <button onClick={() => handleToggleUser(u._id)} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition" title="Toggle Active">
                              {u.isActive ? <FaToggleOn /> : <FaToggleOff />}
                            </button>
                            <button onClick={() => handleDeleteUser(u._id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition" title="Delete">
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && <p className="text-center text-gray-400 py-8">No users found</p>}
              </div>
            )}
          </div>
        )}

        {/* ── TRAINERS ──────────────────────────────────────────────────────── */}
        {tab === "trainers" && (
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">All Trainers ({trainers.length})</h2>
              <button onClick={() => openModal("trainer", {})} className="flex items-center gap-2 px-4 py-2 bg-primary text-dark rounded-xl font-medium hover:bg-primary/80 transition text-sm">
                <FaPlus /> Add Trainer
              </button>
            </div>
            {loading ? <div className="flex justify-center py-10"><FaSpinner className="text-primary text-2xl animate-spin" /></div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-border">
                      <th className="text-left py-3 px-2">Name</th>
                      <th className="text-left py-3 px-2">Specialisation</th>
                      <th className="text-left py-3 px-2">Experience</th>
                      <th className="text-left py-3 px-2">Rating</th>
                      <th className="text-left py-3 px-2">Available</th>
                      <th className="text-left py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainers.map(t => (
                      <tr key={t._id} className="border-b border-border/50 hover:bg-white/5">
                        <td className="py-3 px-2 text-white font-medium">{t.name}</td>
                        <td className="py-3 px-2 text-gray-400">{t.specialisation}</td>
                        <td className="py-3 px-2 text-gray-400">{t.experience} yrs</td>
                        <td className="py-3 px-2 text-yellow-400">⭐ {t.rating || "N/A"}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.isAvailable ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{t.isAvailable ? "Yes" : "No"}</span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex gap-2">
                            <button onClick={() => openModal("trainer", t)} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition"><FaEdit /></button>
                            <button onClick={() => handleDeleteTrainer(t._id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {trainers.length === 0 && <p className="text-center text-gray-400 py-8">No trainers found. Add one!</p>}
              </div>
            )}
          </div>
        )}

        {/* ── MEMBERSHIPS ───────────────────────────────────────────────────── */}
        {tab === "memberships" && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-4">All Memberships ({memberships.length})</h2>
            {loading ? <div className="flex justify-center py-10"><FaSpinner className="text-primary text-2xl animate-spin" /></div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-border">
                      <th className="text-left py-3 px-2">Member</th>
                      <th className="text-left py-3 px-2">Plan</th>
                      <th className="text-left py-3 px-2">Price</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Payment</th>
                      <th className="text-left py-3 px-2">Expires</th>
                      <th className="text-left py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberships.map(m => (
                      <tr key={m._id} className="border-b border-border/50 hover:bg-white/5">
                        <td className="py-3 px-2 text-white">{m.user?.name || "—"}</td>
                        <td className="py-3 px-2 text-gray-400 capitalize">{m.planType}</td>
                        <td className="py-3 px-2 text-gray-400">PKR {m.price?.toLocaleString()}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${m.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{m.status}</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${m.paymentStatus === "paid" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>{m.paymentStatus}</span>
                        </td>
                        <td className="py-3 px-2 text-gray-400">{m.endDate ? new Date(m.endDate).toLocaleDateString() : "—"}</td>
                        <td className="py-3 px-2">
                          <div className="flex gap-2">
                            <button onClick={() => openModal("membership", m)} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition"><FaEdit /></button>
                            <button onClick={() => handleCancelMembership(m._id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {memberships.length === 0 && <p className="text-center text-gray-400 py-8">No memberships found</p>}
              </div>
            )}
          </div>
        )}

        {/* ── SESSIONS ──────────────────────────────────────────────────────── */}
        {tab === "sessions" && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-4">All Sessions ({sessions.length})</h2>
            {loading ? <div className="flex justify-center py-10"><FaSpinner className="text-primary text-2xl animate-spin" /></div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-border">
                      <th className="text-left py-3 px-2">Member</th>
                      <th className="text-left py-3 px-2">Trainer</th>
                      <th className="text-left py-3 px-2">Type</th>
                      <th className="text-left py-3 px-2">Date</th>
                      <th className="text-left py-3 px-2">Time</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map(s => (
                      <tr key={s._id} className="border-b border-border/50 hover:bg-white/5">
                        <td className="py-3 px-2 text-white">{s.user?.name || "—"}</td>
                        <td className="py-3 px-2 text-gray-400">{s.trainer?.name || "—"}</td>
                        <td className="py-3 px-2 text-gray-400">{s.sessionType}</td>
                        <td className="py-3 px-2 text-gray-400">{s.date ? new Date(s.date).toLocaleDateString() : "—"}</td>
                        <td className="py-3 px-2 text-gray-400">{s.startTime} – {s.endTime}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${s.status === "confirmed" ? "bg-green-500/20 text-green-400" : s.status === "cancelled" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}>{s.status || "pending"}</span>
                        </td>
                        <td className="py-3 px-2">
                          <button onClick={() => handleCancelSession(s._id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {sessions.length === 0 && <p className="text-center text-gray-400 py-8">No sessions found</p>}
              </div>
            )}
          </div>
        )}

        {/* ── TRAINER MODAL ─────────────────────────────────────────────────── */}
        {modal?.type === "trainer" && (
          <Modal title={modal.data._id ? "Edit Trainer" : "Add New Trainer"} onClose={closeModal}>
            <div className="space-y-4">
              <div>
                <label className={lbl}>Name *</label>
                <input className={inp} placeholder="Trainer name" defaultValue={modal.data.name || ""} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
              </div>
              <div>
                <label className={lbl}>Specialisation *</label>
                <input className={inp} placeholder="e.g. Weight Training" defaultValue={modal.data.specialisation || ""} onChange={e => setForm(f => ({...f, specialisation: e.target.value}))} />
              </div>
              <div>
                <label className={lbl}>Bio</label>
                <textarea className={inp} rows={3} placeholder="Short bio..." defaultValue={modal.data.bio || ""} onChange={e => setForm(f => ({...f, bio: e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Experience (years)</label>
                  <input className={inp} type="number" min="0" defaultValue={modal.data.experience || ""} onChange={e => setForm(f => ({...f, experience: e.target.value}))} />
                </div>
                <div>
                  <label className={lbl}>Rating (1-5)</label>
                  <input className={inp} type="number" min="1" max="5" step="0.1" defaultValue={modal.data.rating || ""} onChange={e => setForm(f => ({...f, rating: e.target.value}))} />
                </div>
              </div>
              <div>
                <label className={lbl}>Contact</label>
                <input className={inp} placeholder="Phone number" defaultValue={modal.data.contact || ""} onChange={e => setForm(f => ({...f, contact: e.target.value}))} />
              </div>
              <div>
                <label className={lbl}>Profile Image URL</label>
                <input className={inp} placeholder="https://..." defaultValue={modal.data.profileImage || ""} onChange={e => setForm(f => ({...f, profileImage: e.target.value}))} />
              </div>
              <div className="flex items-center gap-3">
                <label className={lbl + " mb-0"}>Available</label>
                <input type="checkbox" defaultChecked={modal.data.isAvailable !== false} onChange={e => setForm(f => ({...f, isAvailable: e.target.checked}))} className="w-4 h-4 accent-primary" />
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 rounded-xl hover:border-gray-500 transition">Cancel</button>
                <button onClick={handleSaveTrainer} className="flex-1 px-4 py-2 bg-primary text-dark rounded-xl font-medium hover:bg-primary/80 transition">
                  {modal.data._id ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* ── MEMBERSHIP MODAL ──────────────────────────────────────────────── */}
        {modal?.type === "membership" && (
          <Modal title="Edit Membership" onClose={closeModal}>
            <div className="space-y-4">
              <div>
                <label className={lbl}>Plan Type</label>
                <select className={inp} defaultValue={modal.data.planType} onChange={e => setForm(f => ({...f, planType: e.target.value}))}>
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Status</label>
                <select className={inp} defaultValue={modal.data.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Payment Status</label>
                <select className={inp} defaultValue={modal.data.paymentStatus} onChange={e => setForm(f => ({...f, paymentStatus: e.target.value}))}>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 rounded-xl hover:border-gray-500 transition">Cancel</button>
                <button onClick={handleUpdateMembership} className="flex-1 px-4 py-2 bg-primary text-dark rounded-xl font-medium hover:bg-primary/80 transition">Update</button>
              </div>
            </div>
          </Modal>
        )}

      </div>
    </div>
  );
};

export default AdminPage;
