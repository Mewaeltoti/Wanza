import { Search, Bell, HelpCircle, ChevronDown } from 'lucide-react';
import { useAuth, ROLE_LABELS, ROLE_COLORS } from '../../lib/auth';

export function TopNav() {
  const { user } = useAuth();

  const initials = user ? user.fullName.split(' ').map(n => n[0]).join('') : 'WX';
  const roleLabel = user ? ROLE_LABELS[user.role] : 'Guest';
  const roleBadgeClass = user ? ROLE_COLORS[user.role] : 'bg-on-surface-variant text-surface';

  return (
    <header className="sticky top-0 flex justify-between items-center w-full px-8 h-16 z-50 bg-surface border-b border-outline-variant md:pl-72">
      <div className="flex items-center gap-8">
        <div className="relative hidden md:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            className="bg-surface-container border-none text-body-sm rounded-lg py-2 pl-10 pr-4 w-80 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
            placeholder="Search by ID, name, or phone..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full hover:bg-surface-container-high transition-colors flex items-center justify-center text-on-surface-variant">
          <Bell size={20} />
        </button>
        <button className="w-10 h-10 rounded-full hover:bg-surface-container-high transition-colors flex items-center justify-center text-on-surface-variant">
          <HelpCircle size={20} />
        </button>
        <div className="h-8 w-px bg-outline-variant mx-2" />
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="font-body-sm font-bold text-primary">{user?.fullName || 'Guest'}</p>
            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${roleBadgeClass}`}>
              {roleLabel}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-primary-container group-hover:border-primary transition-colors bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">{initials}</span>
          </div>
          <ChevronDown size={14} className="text-on-surface-variant" />
        </div>
      </div>
    </header>
  );
}
