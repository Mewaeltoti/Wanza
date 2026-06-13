import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import type { UserRole } from '../../types';

interface RequireAuthProps {
  allowedRoles?: UserRole[];
}

export function RequireAuth({ allowedRoles }: RequireAuthProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-on-primary font-bold text-sm">WX</span>
          </div>
          <p className="text-on-surface-variant font-body-md">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
