import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthContext } from '~/hooks/AuthContext'; // Assuming this hook exists

// Layout component (optional, adjust as needed)
// import RootLayout from './layouts/RootLayout';

// Dynamically import components for code splitting
const Landing = React.lazy(() => import('~/routes/Dashboard'));
const Search = React.lazy(() => import('~/routes/Search'));
const GeminiStudio = React.lazy(() => import('~/routes/GeminiStudioRoute'));
const GeminiVertex = React.lazy(() => import('~/routes/GeminiVertexRoute'));
const Chat = React.lazy(() => import('~/routes/ChatRoute'));
const Login = React.lazy(() => import('~/components/Auth/Login'));
const Registration = React.lazy(() => import('~/components/Auth/Registration'));
const RequestPasswordReset = React.lazy(() => import('~/components/Auth/RequestPasswordReset'));
const ResetPassword = React.lazy(() => import('~/components/Auth/ResetPassword'));

// Helper component for protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Define routes using the object-based configuration
const routeObjects = [
  // Public routes
  { path: '/login', element: <Suspense fallback={<div>Loading...</div>}><Login /></Suspense> },
  { path: '/register', element: <Suspense fallback={<div>Loading...</div>}><Registration /></Suspense> },
  { path: '/forgot-password', element: <Suspense fallback={<div>Loading...</div>}><RequestPasswordReset /></Suspense> },
  { path: '/reset-password/:token', element: <Suspense fallback={<div>Loading...</div>}><ResetPassword /></Suspense> },

  // Protected routes (assuming a layout or directly wrapping elements)
  // Example without a RootLayout:
  {
    path: '/',
    element: <ProtectedRoute><Suspense fallback={<div>Loading...</div>}><Landing /></Suspense></ProtectedRoute>,
  },
  {
    path: '/search/:query?',
    element: <ProtectedRoute><Suspense fallback={<div>Loading...</div>}><Search /></Suspense></ProtectedRoute>,
  },
  {
    path: '/gemini-studio',
    element: <ProtectedRoute><Suspense fallback={<div>Loading...</div>}><GeminiStudio /></Suspense></ProtectedRoute>,
  },
  {
    path: '/gemini-vertex',
    element: <ProtectedRoute><Suspense fallback={<div>Loading...</div>}><GeminiVertex /></Suspense></ProtectedRoute>,
  },
  {
    path: '/chat/:conversationId?',
    element: <ProtectedRoute><Suspense fallback={<div>Loading...</div>}><Chat /></Suspense></ProtectedRoute>,
  },

  // Fallback for unknown routes
  { path: '*', element: <Navigate to="/" replace /> },

  // Example with a RootLayout (if you have one):
  // {
  //   path: '/',
  //   element: <RootLayout />, // Your main layout component
  //   children: [
  //     { index: true, element: <ProtectedRoute><Suspense fallback={<div>Loading...</div>}><Landing /></Suspense></ProtectedRoute> },
  //     { path: 'search/:query?', element: <ProtectedRoute><Suspense fallback={<div>Loading...</div>}><Search /></Suspense></ProtectedRoute> },
  //     { path: 'gemini-studio', element: <ProtectedRoute><Suspense fallback={<div>Loading...</div>}><GeminiStudio /></Suspense></ProtectedRoute> },
  //     { path: 'gemini-vertex', element: <ProtectedRoute><Suspense fallback={<div>Loading...</div>}><GeminiVertex /></Suspense></ProtectedRoute> },
  //     { path: 'chat/:conversationId?', element: <ProtectedRoute><Suspense fallback={<div>Loading...</div>}><Chat /></Suspense></ProtectedRoute> },
  //     // Add other protected routes here
  //   ]
  // },
];

// Create and export the router instance
export const router = createBrowserRouter(routeObjects);

// Keep the default export if anything else relies on it, otherwise it can be removed.
// export default routeObjects; // You might not need this default export anymore