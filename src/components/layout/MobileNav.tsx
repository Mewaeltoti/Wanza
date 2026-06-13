import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, PlusCircle, MapPin, Building2, Navigation } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import type { UserRole } from '../../types';

interface MobileNavItem {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  roles: UserRole[];
  isCenter?: boolean;
}

const navItems: MobileNavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dash', roles: ['super_admin', 'branch_manager', 'staff', 'driver'] },
  { to: '/shipments', icon: Package, label: 'Ship', roles: ['super_admin', 'branch_manager', 'staff'] },
  { to: '/create-shipment', icon: PlusCircle, label: '', roles: ['super_admin', 'branch_manager', 'staff'], isCenter: true },
  { to: '/my-deliveries', icon: Navigation, label: 'Drive', roles: ['driver'], isCenter: true },
  { to: '/tracking', icon: MapPin, label: 'Track', roles: ['super_admin', 'branch_manager', 'staff', 'driver'] },
  { to: '/branches', icon: Building2, label: 'Hubs', roles: ['super_admin', 'branch_manager'] },
];

export function MobileNav() {
  const { user } = useAuth();

  const visibleItems = navItems.filter(item =>
    user ? item.roles.includes(user.role) : true
  );

  // Ensure we have a center button if user is staff/admin, or show driver items
  const centerItem = visibleItems.find(i => i.isCenter);
  const regularItems = visibleItems.filter(i => !i.isCenter);

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant flex justify-around items-center h-16 md:hidden z-50">
      {regularItems.slice(0, 2).map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-secondary' : 'text-on-surface-variant'}`
          }
        >
          <item.icon size={20} />
          <span className="text-[10px] font-bold">{item.label}</span>
        </NavLink>
      ))}

      {centerItem && (
        <NavLink
          to={centerItem.to}
          className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-on-primary -mt-8 shadow-lg"
        >
          <centerItem.icon size={22} />
        </NavLink>
      )}

      {regularItems.slice(2).map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-secondary' : 'text-on-surface-variant'}`
          }
        >
          <item.icon size={20} />
          <span className="text-[10px] font-bold">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
