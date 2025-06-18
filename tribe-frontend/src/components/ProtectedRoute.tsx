import { useAuth } from '../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
    requiredRole?: number | number[]; // role_id is a number in your AuthContext
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();

  // 1. Show a loading indicator while auth state is being determined
  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner or loading component
  }

  // 2. If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Role check (using role_id from user object)
  if (requiredRole !== undefined) {
    const userRoleId = user?.role_id;
    let allowed = false;
    if (userRoleId !== undefined) {
      allowed = Array.isArray(requiredRole)
        ? requiredRole.includes(userRoleId)
        : userRoleId === requiredRole;
    }
    if (!allowed) {
      // Optionally, redirect or show a message
      return <div>Unauthorized: You do not have access to this page.</div>;
      // Or: return <Navigate to="/unauthorized" replace />;
      // Will have to create an Unauthorized route/component
    }
  }

  // 4. If authenticated and authorized, render the child routes/components
  return <Outlet />;
};

export default ProtectedRoute;