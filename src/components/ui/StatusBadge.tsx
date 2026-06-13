import type { ShipmentStatus } from '../../types';

const statusStyles: Record<ShipmentStatus, string> = {
  received: 'bg-blue-100 text-blue-800',
  processing: 'bg-amber-100 text-amber-800',
  in_transit: 'bg-orange-100 text-orange-800',
  arrived_at_destination: 'bg-cyan-100 text-cyan-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels: Record<ShipmentStatus, string> = {
  received: 'Received',
  processing: 'Processing',
  in_transit: 'In Transit',
  arrived_at_destination: 'Arrived',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

interface StatusBadgeProps {
  status: ShipmentStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider ${statusStyles[status]} ${sizeClasses}`}>
      {statusLabels[status]}
    </span>
  );
}
