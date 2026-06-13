import { Link } from 'react-router-dom';
import { Package, CheckCircle, Truck, DollarSign, Building2, ArrowRight, MoreVertical, Calendar, Download } from 'lucide-react';
import { useDashboardStats, useShipments } from '../../hooks/useApi';
import { StatusBadge } from '../../components/ui/StatusBadge';

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'];
const barHeights = [96, 128, 192, 160, 224, 208, 176];

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: shipmentsData } = useShipments({ page: 1, pageSize: 5 });

  if (statsLoading) return <div className="animate-pulse space-y-8"><div className="h-40 bg-surface-container rounded-xl" /></div>;

  const statCards = [
    { label: 'Total Shipments', value: stats?.totalShipments ?? 0, icon: Package, iconBg: 'bg-primary-container', iconColor: 'text-primary-fixed', badge: '+12%', badgeColor: 'text-green-600' },
    { label: 'Delivered', value: stats?.delivered ?? 0, icon: CheckCircle, iconBg: 'bg-green-100', iconColor: 'text-green-700', badge: '92% rate', badgeColor: 'text-on-surface-variant' },
    { label: 'In Transit', value: stats?.inTransit ?? 0, icon: Truck, iconBg: 'bg-secondary-container', iconColor: 'text-on-secondary-container', badge: 'Live tracking', badgeColor: 'text-secondary' },
    { label: 'Total Revenue', value: `ETB ${(stats?.revenue ?? 0).toLocaleString()}`, icon: DollarSign, iconBg: 'bg-blue-100', iconColor: 'text-blue-700', badge: 'Projected: ETB 520k', badgeColor: 'text-blue-700', colSpan: 'md:col-span-2' },
    { label: 'Active Branches', value: stats?.activeBranches ?? 0, icon: Building2, iconBg: 'bg-purple-100', iconColor: 'text-purple-700' },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Logistics Overview</h2>
          <p className="text-on-surface-variant font-body-md">Real-time performance metrics for Wanza Express Global.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm hover:bg-surface-container transition-colors">
            <Calendar size={18} />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-bold shadow-sm">
            <Download size={18} />
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map(card => (
          <div key={card.label} className={`bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-[0px_2px_4px_rgba(26,43,60,0.05)] hover:border-primary transition-colors ${card.colSpan || ''}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <card.icon size={18} className={card.iconColor} />
              </div>
              {card.badge && (
                <span className={`font-bold text-xs flex items-center gap-1 ${card.badgeColor}`}>
                  {card.badge}
                </span>
              )}
            </div>
            <p className="text-on-surface-variant font-label-caps mb-1">{card.label}</p>
            <h3 className="text-headline-lg-mobile font-bold text-primary">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-[0px_2px_4px_rgba(26,43,60,0.05)]">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-title-md text-primary">Monthly Shipment Volume</h4>
            <select className="bg-surface border border-outline-variant rounded-lg text-body-sm px-3 py-1 focus:ring-primary">
              <option>Year 2024</option>
              <option>Year 2023</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {months.map((m, i) => (
              <div key={m} className="group relative flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t-lg h-[${barHeights[i]}px] ${i === 4 ? 'bg-secondary' : 'bg-primary/20'} group-hover:bg-primary transition-all cursor-pointer`}
                  style={{ height: `${barHeights[i]}px` }}
                />
                <span className="text-[10px] mt-2 font-bold text-on-surface-variant">{m}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-[0px_2px_4px_rgba(26,43,60,0.05)]">
          <h4 className="font-title-md text-primary mb-6">Shipment Status</h4>
          <div className="relative h-48 w-48 mx-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#041627" strokeDasharray="65, 100" strokeWidth="4" />
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#fc820c" strokeDasharray="20, 100" strokeDashoffset="-65" strokeWidth="4" />
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#ba1a1a" strokeDasharray="15, 100" strokeDashoffset="-85" strokeWidth="4" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-headline-lg-mobile font-bold text-primary">{stats?.totalShipments ?? 0}</span>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase">Total</span>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex justify-between items-center text-body-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary" /> Delivered</div>
              <span className="font-bold">65%</span>
            </div>
            <div className="flex justify-between items-center text-body-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary-container" /> In Transit</div>
              <span className="font-bold">20%</span>
            </div>
            <div className="flex justify-between items-center text-body-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-error" /> Pending</div>
              <span className="font-bold">15%</span>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0px_2px_4px_rgba(26,43,60,0.05)] overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center">
          <div>
            <h4 className="font-title-md text-primary">Recent Shipments</h4>
            <p className="text-body-sm text-on-surface-variant">Last dispatches across all active routes.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container text-on-surface-variant uppercase font-label-caps text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Tracking ID</th>
                <th className="px-6 py-4">Sender</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="text-table-data text-on-surface divide-y divide-outline-variant">
              {shipmentsData?.data.map(s => (
                <tr key={s.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 font-bold text-primary">#{s.tracking_number}</td>
                  <td className="px-6 py-4">{s.sender_name}</td>
                  <td className="px-6 py-4">{s.origin_branch?.city} → {s.destination_branch?.city}</td>
                  <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                  <td className="px-6 py-4 text-on-surface-variant">{new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-on-surface-variant hover:text-primary"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-outline-variant flex justify-center">
          <Link to="/shipments" className="text-body-sm font-bold text-primary hover:underline flex items-center gap-1">
            View All Global Shipments <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
