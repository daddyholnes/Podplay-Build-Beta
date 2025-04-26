import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '~/hooks/AuthContext';

// Dynamically import components
const Landing = React.lazy(() => import('~/components/Landing'));
const Search = React.lazy(() => import('~/components/Search'));
const GeminiStudio = React.lazy(() => import('~/components/GeminiStudio')); // Keep if still used
const GeminiVertex = React.lazy(() => import('~/components/GeminiVertex')); // Add this import
const Chat = React.lazy(() => import('~/components/Chat'));
const Login = React.lazy(() => import('~/components/Auth/Login'));
const Registration = React.lazy(() => import('~/components/Auth/Registration'));
const RequestPasswordReset = React.lazy(() => import('~/components/Auth/RequestPasswordReset'));
const ResetPassword = React.lazy(() => import('~/components/Auth/ResetPassword'));

function AppRoutes() {
  const { isAuthenticated } = useAuthContext();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/forgot-password" element={<RequestPasswordReset />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={isAuthenticated ? <Landing /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/search/:query?" // Optional query param
        element={isAuthenticated ? <Search /> : <Navigate to="/login" replace />}
      />
       {/* Keep GeminiStudio route if needed */}
      <Route
        path="/gemini-studio"
        element={isAuthenticated ? <GeminiStudio /> : <Navigate to="/login" replace />}
      />
       {/* Add GeminiVertex route */}
      <Route
        path="/gemini-vertex"
        element={isAuthenticated ? <GeminiVertex /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/chat/:conversationId?" // Optional conversationId param
        element={isAuthenticated ? <Chat /> : <Navigate to="/login" replace />}
      />

      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;