import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Plus, Filter, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { useShipments, useBranches, useUpdateShipmentStatus } from '../../hooks/useApi';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import type { ShipmentStatus } from '../../types';

const STATUS_OPTIONS: { value: ShipmentStatus; label: string }[] = [
  { value: 'received', label: 'Received' },
  { value: 'processing', label: 'Processing' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'arrived_at_destination', label: 'Arrived at Destination' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function Shipments() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [branchFilter, setBranchFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<ShipmentStatus>('in_transit');
  const [notes, setNotes] = useState('');

  const { data: shipmentsData, isLoading } = useShipments({
    search: search || undefined,
    status: (statusFilter as ShipmentStatus) || undefined,
    branchId: branchFilter || undefined,
    page,
    pageSize: 10,
  });

  const { data: branches } = useBranches();
  const updateStatus = useUpdateShipmentStatus();

  const totalPages = shipmentsData ? Math.ceil(shipmentsData.count / shipmentsData.pageSize) : 1;

  const handleStatusUpdate = () => {
    if (!selectedShipment) return;
    updateStatus.mutate(
      { shipmentId: selectedShipment, newStatus, notes },
      { onSuccess: () => { setStatusModalOpen(false); setNotes(''); } }
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Shipment Management</h2>
          <p className="font-body-md text-on-surface-variant">Track, manage and update real-time logistics operations.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant px-4 py-2 rounded-lg font-bold text-primary hover:bg-surface-container transition-colors">
            <Download size={18} /> Export Data
          </button>
          <Link to="/create-shipment" className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2 rounded-lg font-bold hover:opacity-90 shadow-lg shadow-primary/10 transition-all">
            <Plus size={18} /> New Shipment
          </Link>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 mb-6 flex flex-wrap items-end gap-4 shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Tracking Number</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              className="w-full bg-surface border border-outline-variant rounded-lg pl-9 pr-3 py-2 text-body-sm focus:ring-2 focus:ring-primary"
              placeholder="WZA-000000"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Status</label>
          <select
            className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-sm focus:ring-2 focus:ring-primary"
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Branch</label>
          <select
            className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-sm focus:ring-2 focus:ring-primary"
            value={branchFilter}
            onChange={e => { setBranchFilter(e.target.value); setPage(1); }}
          >
            <option value="">Global View</option>
            {branches?.map(b => <option key={b.id} value={b.id}>{b.branch_name}</option>)}
          </select>
        </div>
        <button className="bg-surface-container-high text-primary px-6 py-2 rounded-lg font-bold h-[42px] hover:bg-outline-variant transition-colors flex items-center gap-2">
          <Filter size={16} /> Apply
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Tracking ID</th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Sender</th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Receiver</th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Origin/Dest</th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Weight</th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {isLoading ? (
                <tr><td colSpan={7} className="p-8 text-center text-on-surface-variant">Loading shipments...</td></tr>
              ) : shipmentsData?.data.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-on-surface-variant">No shipments found.</td></tr>
              ) : (
                shipmentsData?.data.map(s => (
                  <tr key={s.id} className="hover:bg-surface-container transition-colors group">
                    <td className="p-4">
                      <a className="font-table-data text-table-data text-secondary hover:underline font-bold cursor-pointer">
                        {s.tracking_number}
                      </a>
                      <p className="text-[10px] text-on-surface-variant font-medium">
                        Updated {new Date(s.updated_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-table-data text-table-data text-primary">{s.sender_name}</p>
                      <p className="text-[11px] text-on-surface-variant">{s.sender_phone}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-table-data text-table-data text-primary">{s.receiver_name}</p>
                      <p className="text-[11px] text-on-surface-variant">{s.receiver_phone}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-table-data text-table-data text-primary">{s.origin_branch?.city?.slice(0, 3).toUpperCase()}</span>
                        <span className="text-on-surface-variant text-xs">→</span>
                        <span className="font-table-data text-table-data text-primary">{s.destination_branch?.city?.slice(0, 3).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="p-4 font-table-data text-table-data text-primary">{s.weight_kg} kg</td>
                    <td className="p-4"><StatusBadge status={s.status} /></td>
                    <td className="p-4 text-center">
                      <button
                        className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
                        onClick={() => { setSelectedShipment(s.id); setNewStatus(s.status); setStatusModalOpen(true); }}
                      >
                        <MoreVertical size={18} className="text-on-surface-variant" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-low">
          <div className="text-body-sm font-body-sm text-on-surface-variant">
            Showing <span className="font-bold text-primary">{((page - 1) * 10) + 1} - {Math.min(page * 10, shipmentsData?.count ?? 0)}</span> of <span className="font-bold text-primary">{shipmentsData?.count ?? 0}</span> shipments
          </div>
          <div className="flex gap-2">
            <button
              className="w-10 h-10 border border-outline-variant rounded-lg flex items-center justify-center hover:bg-surface transition-colors disabled:opacity-40"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${page === pageNum ? 'bg-primary text-on-primary' : 'border border-outline-variant hover:bg-surface text-on-surface-variant'}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              className="w-10 h-10 border border-outline-variant rounded-lg flex items-center justify-center hover:bg-surface transition-colors disabled:opacity-40"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-2">Active Shipments</p>
            <h3 className="text-display-lg font-display-lg text-primary">{shipmentsData?.count ?? 0}</h3>
            <p className="text-body-sm font-body-sm text-green-600 font-bold flex items-center gap-1">
              +12% from last week
            </p>
          </div>
          <Package size={80} className="absolute -right-4 -bottom-4 text-surface-container opacity-20 group-hover:opacity-40 transition-opacity" />
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-2">Transit Delays</p>
            <h3 className="text-display-lg font-display-lg text-error">0</h3>
            <p className="text-body-sm font-body-sm text-on-surface-variant font-medium">No delays reported</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm relative overflow-hidden group col-span-1 md:col-span-2">
          <div className="relative z-10 h-full flex flex-col">
            <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-2">Revenue Overview</p>
            <div className="flex items-baseline gap-2 mb-4">
              <h3 className="text-display-lg font-display-lg text-primary">ETB {(shipmentsData?.data?.reduce((s, sh) => s + Number(sh.shipping_cost), 0) ?? 0).toLocaleString()}</h3>
            </div>
            <div className="mt-auto flex items-center gap-4">
              <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="w-[75%] h-full bg-secondary" />
              </div>
              <p className="text-label-caps font-label-caps text-on-surface-variant">75% of Goal</p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Shipment Status"
        footer={
          <>
            <button className="flex-1 px-4 py-2 border border-outline-variant rounded-lg font-bold text-primary hover:bg-surface transition-colors" onClick={() => setStatusModalOpen(false)}>Cancel</button>
            <button className="flex-1 px-4 py-2 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 shadow-lg shadow-primary/10 transition-all" onClick={handleStatusUpdate} disabled={updateStatus.isPending}>
              {updateStatus.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">New Status</label>
            <select
              className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary"
              value={newStatus}
              onChange={e => setNewStatus(e.target.value as ShipmentStatus)}
            >
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Notes</label>
            <textarea
              className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-sm h-24 focus:ring-2 focus:ring-primary"
              placeholder="Optional notes..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 p-3 bg-secondary-container/10 border border-secondary-container/20 rounded-lg">
            <span className="text-secondary font-bold text-sm">i</span>
            <p className="text-body-sm text-on-secondary-container font-medium">Automatic notification will be sent to the receiver.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Package(props: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
    </svg>
  );
}
