/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ContestantsPage } from './pages/ContestantsPage';
import { ContestantProfilePage } from './pages/ContestantProfilePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { RegisterPage } from './pages/RegisterPage';
import { VotePage } from './pages/VotePage';
import { VoteContestantPage } from './pages/VoteContestantPage';
import { RulesPage } from './pages/RulesPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { PaymentCallbackPage } from './pages/PaymentCallbackPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminContestants } from './pages/admin/AdminContestants';
import { AdminApplications } from './pages/admin/AdminApplications';
import { AdminVotes } from './pages/admin/AdminVotes';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminLeaderboard } from './pages/admin/AdminLeaderboard';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminActivity } from './pages/admin/AdminActivity';

// Route guard for administrative area
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center text-zinc-400">
        <div className="w-8 h-8 rounded-full border-2 border-[#E5A93C] border-t-transparent animate-spin mr-3" />
        Verifying administrative authorization...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Layout wrapper to hide public navbar & footer on /admin routes
const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-[#f3f4f6]">
      {!isAdminRoute && <Navbar />}

      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contestants" element={<ContestantsPage />} />
          <Route path="/contestants/:slug" element={<ContestantProfilePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/vote" element={<VotePage />} />
          <Route path="/vote/:contestantId" element={<VoteContestantPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/payment/callback" element={<PaymentCallbackPage />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="contestants" element={<AdminContestants />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="votes" element={<AdminVotes />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="leaderboard" element={<AdminLeaderboard />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="activity" element={<AdminActivity />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
