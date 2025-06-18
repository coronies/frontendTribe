import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import './styles/background-effects.css';
import { AuthProvider } from './contexts/AuthContext';
import { AuthCard } from './components/AuthCard';
import { useTokenRefresh } from './hooks/useTokenRefresh';
import ProtectedRoute from './components/ProtectedRoute'; // Use later for protected routes

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

  return (
    <>
      {/* Main container */}
      <div className="relative min-h-screen overflow-hidden bg-sky-50">
        {/* Background decorative elements */}
        <div className="absolute inset-0 mesh-gradient" />
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-sky-200/40 floating glowing blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-200/40 floating glowing blur-3xl" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-indigo-200/40 floating glowing blur-3xl" style={{ animationDelay: '-4s' }} />
        
        {/* Content container */}
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<AuthCard />} />
            <Route path="/register" element={<AuthCard />} />
            <Route path="/reset-password" element={<AuthCard />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
/* EXAMPLE ROUTES
  Protected routes for any authenticated user
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
  </Route>

  Protected route for administrator roles (role_id: 1,2,3,etc)
  <Route element={<ProtectedRoute requiredRole={[1,2,3,etc]} />}>
    <Route path="/admin" element={<AdminPanel />} />
  </Route>
*/

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
