import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './lib/auth';
import { AdminLayout } from './components/layout/AdminLayout';
import { RequireAuth } from './components/layout/RequireAuth';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Shipments } from './pages/shipments/Shipments';
import { CreateShipment } from './pages/create-shipment/CreateShipment';
import { Tracking } from './pages/tracking/Tracking';
import { Branches } from './pages/branches/Branches';
import { Dispatch } from './pages/dispatch/Dispatch';
import { MyDeliveries } from './pages/driver/MyDeliveries';
import { UserManagement } from './pages/users/UserManagement';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Tracking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<RequireAuth />}>
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/shipments" element={<Shipments />} />
                <Route path="/create-shipment" element={<CreateShipment />} />
                <Route path="/branches" element={<Branches />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/dispatch" element={<Dispatch />} />
                <Route path="/my-deliveries" element={<MyDeliveries />} />
              </Route>
            </Route>

            <Route path="/tracking" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
