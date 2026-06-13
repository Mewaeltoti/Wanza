import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { MobileNav } from './MobileNav';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <TopNav />
        <main className="p-6 lg:p-8 flex-1 pb-24 md:pb-8">
          <Outlet />
        </main>
        <footer className="w-full py-6 px-8 flex flex-col md:flex-row justify-between items-center bg-surface-container-lowest border-t border-outline-variant">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <span className="font-label-caps font-bold text-primary uppercase tracking-wider">Wanza Express</span>
            <span className="text-on-surface-variant text-[12px] opacity-40">|</span>
            <p className="font-body-sm text-on-surface-variant">&copy; 2024 Wanza Express Logistics. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <a className="text-on-surface-variant font-body-sm hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="text-on-surface-variant font-body-sm hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="text-on-surface-variant font-body-sm hover:text-primary transition-colors" href="#">Contact Support</a>
          </div>
        </footer>
      </div>
      <MobileNav />
    </div>
  );
}
