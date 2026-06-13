import { useState } from 'react';
import { Users, CheckCircle, Truck, AlertTriangle, MoreVertical, Search } from 'lucide-react';
import { useShipments, useUpdateShipmentStatus } from '../../hooks/useApi';
import { Modal } from '../../components/ui/Modal';
import type { ShipmentStatus } from '../../types';

interface Driver {
  id: string;
  name: string;
  status: 'available' | 'on_delivery' | 'off_duty';
  vehicle: string;
  detail: string;
}

const sampleDrivers: Driver[] = [
  { id: '1', name: 'Marco Silva', status: 'available', vehicle: 'Scania R450', detail: 'Capacity: 24.5 Tons' },
  { id: '2', name: 'Elena Fischer', status: 'on_delivery', vehicle: 'Volvo FH16', detail: 'ETA: 14:45 PM' },
  { id: '3', name: 'Sarah J.', status: 'available', vehicle: 'Volvo FH16', detail: 'Location: Berlin Hub' },
  { id: '4', name: 'Lukas Meyer', status: 'off_duty', vehicle: '-', detail: 'Off-duty' },
];

export function Dispatch() {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>('');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');

  const { data: shipmentsData } = useShipments({ status: 'arrived_at_destination', pageSize: 20 });
  const updateStatus = useUpdateShipmentStatus();

  const pendingShipments = shipmentsData?.data || [];

  const handleAssign = () => {
    if (selectedShipmentId) {
      updateStatus.mutate(
        { shipmentId: selectedShipmentId, newStatus: 'out_for_delivery' as ShipmentStatus, notes: `Assigned to driver` },
        { onSuccess: () => setAssignModalOpen(false) }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-lg text-headline-lg text-primary">Driver Assignment Dashboard</h2>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Drivers', value: '124', icon: Users, bg: 'bg-primary/5', color: 'text-primary' },
          { label: 'Available Now', value: '42', icon: CheckCircle, bg: 'bg-secondary/10', color: 'text-secondary' },
          { label: 'Active Deliveries', value: '78', icon: Truck, bg: 'bg-primary/5', color: 'text-primary' },
          { label: 'Pending Assignment', value: String(pendingShipments.length), icon: AlertTriangle, bg: 'bg-error/10', color: 'text-error' },
        ].map(card => (
          <div key={card.label} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex items-center justify-between">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant">{card.label}</p>
              <h3 className="font-headline-lg text-headline-lg text-primary">{card.value}</h3>
            </div>
            <div className={`w-12 h-12 ${card.bg} rounded-full flex items-center justify-center ${card.color}`}>
              <card.icon size={28} />
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-title-md text-title-md text-primary">Pending Dispatch</h3>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low">
                <tr className="font-label-caps text-label-caps text-on-surface-variant">
                  <th className="px-4 py-4 border-b border-outline-variant">Tracking ID</th>
                  <th className="px-4 py-4 border-b border-outline-variant">Destination</th>
                  <th className="px-4 py-4 border-b border-outline-variant">Status</th>
                  <th className="px-4 py-4 border-b border-outline-variant text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-table-data text-table-data">
                {pendingShipments.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-on-surface-variant">No pending dispatches</td></tr>
                ) : (
                  pendingShipments.map(s => (
                    <tr key={s.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-4 py-4 font-bold text-primary">#{s.tracking_number}</td>
                      <td className="px-4 py-4">{s.destination_branch?.branch_name}</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full text-[11px] font-bold uppercase">Arrived</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          className="bg-primary text-on-primary px-4 py-1.5 rounded-lg hover:opacity-90 transition-all opacity-0 group-hover:opacity-100"
                          onClick={() => { setSelectedShipmentId(s.id); setAssignModalOpen(true); }}
                        >
                          Assign Driver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-title-md text-title-md text-primary">Live Tracking</h3>
            <div className="flex gap-1 items-center">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Real-Time</span>
            </div>
          </div>
          <div className="bg-primary-container rounded-xl h-[300px] relative overflow-hidden shadow-md flex items-center justify-center">
            <div className="text-center text-on-primary-container">
              <Truck size={48} className="mx-auto mb-4 opacity-60" />
              <p className="font-bold">Map View</p>
              <p className="text-body-sm opacity-70">Central European Corridor</p>
            </div>
          </div>
        </section>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-title-md text-title-md text-primary">Active Fleet Status</h3>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-surface-container-high rounded-full font-label-caps text-[11px] text-primary border border-outline-variant">All Drivers</button>
            <button className="px-4 py-1.5 bg-secondary text-on-primary rounded-full font-label-caps text-[11px] shadow-sm">Available Only</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {sampleDrivers.map(driver => (
            <div key={driver.id} className={`bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm hover:border-secondary transition-all cursor-pointer ${driver.status === 'off_duty' ? 'opacity-60 grayscale' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-primary text-sm ${driver.status === 'available' ? 'bg-secondary/10' : 'bg-primary/5'}`}>
                      {driver.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${driver.status === 'available' ? 'bg-secondary' : driver.status === 'on_delivery' ? 'bg-primary' : 'bg-on-surface-variant'}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-body-md">{driver.name}</h4>
                    <p className="font-body-sm text-on-surface-variant capitalize">{driver.status.replace('_', ' ')}</p>
                  </div>
                </div>
                <MoreVertical size={18} className="text-outline" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant">{driver.status === 'on_delivery' ? 'Current Load' : 'Vehicle'}</span>
                  <span className="font-bold text-primary">{driver.vehicle}</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant">{driver.status === 'on_delivery' ? 'ETA' : 'Capacity'}</span>
                  <span className={`font-bold ${driver.status === 'on_delivery' ? 'text-secondary' : 'text-primary'}`}>{driver.detail}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Modal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Link Shipment"
        maxWidth="max-w-lg"
        footer={
          <>
            <button className="flex-1 py-3 border border-outline-variant rounded-lg font-label-caps text-label-caps text-primary hover:bg-surface-container transition-colors" onClick={() => setAssignModalOpen(false)}>Cancel</button>
            <button className="flex-1 py-3 bg-secondary text-on-primary rounded-lg font-label-caps text-label-caps shadow-lg hover:brightness-110 transition-all" onClick={handleAssign} disabled={updateStatus.isPending}>
              {updateStatus.isPending ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant">Select Shipment</label>
            <select
              className="w-full bg-surface-container rounded-lg border border-outline-variant p-4 focus:ring-2 focus:ring-secondary"
              value={selectedShipmentId}
              onChange={e => setSelectedShipmentId(e.target.value)}
            >
              <option value="">Choose a shipment</option>
              {pendingShipments.map(s => (
                <option key={s.id} value={s.id}>{s.tracking_number} - {s.destination_branch?.branch_name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant">Available Driver</label>
            <select
              className="w-full bg-surface-container rounded-lg border border-outline-variant p-4 focus:ring-2 focus:ring-secondary"
              value={selectedDriverId}
              onChange={e => setSelectedDriverId(e.target.value)}
            >
              <option value="">Choose a driver</option>
              {sampleDrivers.filter(d => d.status === 'available').map(d => (
                <option key={d.id} value={d.id}>{d.name} - {d.vehicle}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
