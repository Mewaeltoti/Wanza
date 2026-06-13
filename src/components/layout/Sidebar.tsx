import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, PlusCircle, MapPin, Building2, Settings, LogOut, Truck, Navigation, Users } from 'lucide-react';
import { useAuth, ROLE_LABELS, ROLE_COLORS } from '../../lib/auth';
import type { UserRole } from '../../types';

interface NavItem {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['super_admin', 'branch_manager', 'staff', 'driver'] },
  { to: '/shipments', icon: Package, label: 'Shipments', roles: ['super_admin', 'branch_manager', 'staff'] },
  { to: '/create-shipment', icon: PlusCircle, label: 'Create Shipment', roles: ['super_admin', 'branch_manager', 'staff'] },
  { to: '/users', icon: Users, label: 'Users', roles: ['super_admin', 'branch_manager'] },
  { to: '/dispatch', icon: Truck, label: 'Dispatch', roles: ['super_admin', 'branch_manager'] },
  { to: '/branches', icon: Building2, label: 'Branches', roles: ['super_admin', 'branch_manager'] },
  { to: '/my-deliveries', icon: Navigation, label: 'My Deliveries', roles: ['driver'] },
];

export function Sidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const visibleItems = navItems.filter(item =>
    user ? item.roles.includes(user.role) : true
  );

  const canDispatch = user?.role === 'super_admin' || user?.role === 'branch_manager' || user?.role === 'staff';

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col pt-4 pb-8 z-40 bg-surface border-r border-outline-variant w-64 hidden md:flex">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Truck size={20} className="text-on-primary" />
        </div>
        <div>
          <h1 className="font-title-md text-title-md font-bold text-primary">Wanza Express</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Logistics Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {visibleItems.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-caps text-label-caps transition-all ${
                isActive
                  ? 'text-on-secondary-container bg-secondary-container font-bold'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {canDispatch && (
        <div className="px-4 mb-4">
          <NavLink
            to="/create-shipment"
            className="w-full py-3 bg-primary text-on-primary font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <PlusCircle size={18} />
            Dispatch Now
          </NavLink>
        </div>
      )}

      {/* User Info */}
      {user && (
        <div className="px-4 mb-3">
          <div className="bg-surface-container p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-xs">
                  {user.fullName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-primary text-body-sm truncate">{user.fullName}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${ROLE_COLORS[user.role]}`}>
                  {ROLE_LABELS[user.role]}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 space-y-1 border-t border-outline-variant pt-4">
        <NavLink to="/settings" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all rounded-lg font-label-caps text-label-caps">
          <Settings size={18} />
          Settings
        </NavLink>
        <button
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-all w-full rounded-lg font-label-caps text-label-caps"
          onClick={signOut}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
