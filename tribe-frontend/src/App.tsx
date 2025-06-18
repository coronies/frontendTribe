import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import './styles/background-effects.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthCard } from './components/AuthCard';
import { Homepage } from './pages/Homepage';
import { useTokenRefresh } from './hooks/useTokenRefresh';
import ProtectedRoute from './components/ProtectedRoute';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  // Initialize token refresh functionality
  useTokenRefresh();
  const { isAuthenticated, loading } = useAuth();

  // Show loading while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Homepage />} />
      
      {/* Auth routes with background effects */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="relative min-h-screen overflow-hidden bg-sky-50">
              {/* Background decorative elements */}
              <div className="absolute inset-0 mesh-gradient" />
              
              {/* Floating orbs */}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-sky-200/40 floating glowing blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-200/40 floating glowing blur-3xl" style={{ animationDelay: '-2s' }} />
              <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-indigo-200/40 floating glowing blur-3xl" style={{ animationDelay: '-4s' }} />
              
              {/* Content container */}
              <div className="relative z-10">
                <AuthCard />
              </div>
            </div>
          )
        } 
      />
      
      <Route 
        path="/register" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="relative min-h-screen overflow-hidden bg-sky-50">
              {/* Background decorative elements */}
              <div className="absolute inset-0 mesh-gradient" />
              
              {/* Floating orbs */}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-sky-200/40 floating glowing blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-200/40 floating glowing blur-3xl" style={{ animationDelay: '-2s' }} />
              <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-indigo-200/40 floating glowing blur-3xl" style={{ animationDelay: '-4s' }} />
              
              {/* Content container */}
              <div className="relative z-10">
                <AuthCard />
              </div>
            </div>
          )
        } 
      />

      {/* Protected Routes - require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route 
          path="/dashboard" 
          element={
            <div className="min-h-screen bg-gray-100 p-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Tribe Dashboard!</h1>
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <p className="text-gray-600 text-lg">
                    You're successfully logged in! This is your dashboard where you can discover clubs and connect with your university community.
                  </p>
                  <div className="mt-6">
                    <button 
                      onClick={() => {
                        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                        window.location.href = '/';
                      }}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Logout (Demo)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          } 
        />
      </Route>

      {/* Admin Routes - require specific roles */}
      <Route element={<ProtectedRoute requiredRole={[2]} />}>
        <Route 
          path="/admin" 
          element={
            <div className="min-h-screen bg-gray-100 p-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 mt-4">Only club representatives can access this page.</p>
            </div>
          } 
        />
      </Route>

      {/* Catch all route - redirect to homepage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
