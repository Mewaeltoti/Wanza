import { Navigation, CheckCircle, Truck, Clock } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useShipments, useUpdateShipmentStatus } from '../../hooks/useApi';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { useState } from 'react';
import type { ShipmentStatus } from '../../types';

export function MyDeliveries() {
  const { user } = useAuth();
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('');
  const updateStatus = useUpdateShipmentStatus();

  const { data: outForDelivery } = useShipments({ status: 'out_for_delivery', pageSize: 50 });
  const { data: assigned } = useShipments({ status: 'arrived_at_destination', pageSize: 50 });

  const myDeliveries = [...(outForDelivery?.data || []), ...(assigned?.data || [])];

  const handleDelivered = (id: string) => {
    setSelectedId(id);
    setConfirmModal(true);
  };

  const confirmDelivery = () => {
    updateStatus.mutate(
      { shipmentId: selectedId, newStatus: 'delivered' as ShipmentStatus, notes: 'Delivered by driver' },
      { onSuccess: () => setConfirmModal(false) }
    );
  };

  const stats = [
    { label: 'Assigned', value: myDeliveries.length, icon: Navigation, color: 'text-secondary' },
    { label: 'Out for Delivery', value: outForDelivery?.data?.length || 0, icon: Truck, color: 'text-primary' },
    { label: 'Completed Today', value: 0, icon: CheckCircle, color: 'text-green-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-primary">My Deliveries</h2>
        <p className="text-on-surface-variant font-body-md">View and manage your assigned delivery tasks.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm flex items-center justify-between">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant">{s.label}</p>
              <h3 className="font-headline-lg text-headline-lg text-primary">{s.value}</h3>
            </div>
            <s.icon size={28} className={s.color} />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {myDeliveries.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-12 text-center">
            <Clock size={40} className="text-on-surface-variant mx-auto mb-4 opacity-40" />
            <h3 className="font-bold text-primary mb-1">No Active Deliveries</h3>
            <p className="text-on-surface-variant text-body-sm">Check back later for new assignments.</p>
          </div>
        ) : (
          myDeliveries.map(s => (
            <div key={s.id} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-primary text-body-md">#{s.tracking_number}</span>
                    <StatusBadge status={s.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-body-sm">
                    <div>
                      <span className="text-on-surface-variant">Receiver: </span>
                      <span className="font-bold text-primary">{s.receiver_name}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant">Phone: </span>
                      <span className="font-bold text-primary">{s.receiver_phone}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-on-surface-variant">Address: </span>
                      <span className="font-bold text-primary">{s.receiver_address || s.destination_branch?.branch_name}</span>
                    </div>
                  </div>
                </div>
                {s.status === 'out_for_delivery' && (
                  <button
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all flex items-center gap-2"
                    onClick={() => handleDelivered(s.id)}
                  >
                    <CheckCircle size={18} />
                    Mark Delivered
                  </button>
                )}
                {s.status === 'arrived_at_destination' && (
                  <button
                    className="px-6 py-2.5 bg-secondary text-on-primary rounded-lg font-bold hover:opacity-90 transition-all flex items-center gap-2"
                    onClick={() => {
                      updateStatus.mutate({ shipmentId: s.id, newStatus: 'out_for_delivery' as ShipmentStatus, notes: 'Picked up by driver' });
                    }}
                  >
                    <Truck size={18} />
                    Start Delivery
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        open={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Confirm Delivery"
        footer={
          <>
            <button className="flex-1 py-3 border border-outline-variant rounded-lg font-bold text-primary hover:bg-surface-container transition-colors" onClick={() => setConfirmModal(false)}>Cancel</button>
            <button className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all" onClick={confirmDelivery} disabled={updateStatus.isPending}>
              {updateStatus.isPending ? 'Confirming...' : 'Confirm Delivered'}
            </button>
          </>
        }
      >
        <p className="text-on-surface-variant">Are you sure you want to mark this shipment as delivered? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
