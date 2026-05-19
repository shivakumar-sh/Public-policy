import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import HomePage from './pages/HomePage';
import ChatbotPage from './pages/ChatbotPage';
import PolicySearchPage from './pages/PolicySearchPage';
import PolicyDetailsPage from './pages/PolicyDetailsPage';
import ComparePoliciesPage from './pages/ComparePoliciesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/policies" element={<PolicySearchPage />} />
              <Route path="/policies/:id" element={<PolicyDetailsPage />} />
              
              {/* Protected Routes */}
              <Route path="/chat" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
              <Route path="/compare" element={<ProtectedRoute><ComparePoliciesPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#334155',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '14px'
              }
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
