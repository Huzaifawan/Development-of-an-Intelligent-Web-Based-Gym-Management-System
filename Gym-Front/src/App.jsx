import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import Layout from "./components/layout/Layout";
import PrivateRoute from "./components/auth/PrivateRoute";
import PublicRoute from "./components/auth/PublicRoute";
import HomePage from "./components/pages/HomePage";
import TrainersPage from "./components/pages/TrainersPage";
import ProgramsPage from "./components/pages/ProgramsPage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import DashboardPage from "./components/pages/DashboardPage";
import AdminPage from "./components/pages/AdminPage";
import ChatbotPage from "./components/pages/ChatbotPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/trainers" element={<TrainersPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
          </Routes>
          <ChatbotPage />
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
