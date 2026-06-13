export type ShipmentStatus =
  | 'received'
  | 'processing'
  | 'in_transit'
  | 'arrived_at_destination'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentType = 'sender_pays' | 'receiver_pays';

export type UserRole = 'super_admin' | 'branch_manager' | 'staff' | 'driver';

export interface Branch {
  id: string;
  branch_name: string;
  city: string;
  address: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  branch_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Shipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  sender_phone: string;
  sender_address: string | null;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string | null;
  origin_branch_id: string;
  destination_branch_id: string;
  weight_kg: number;
  dimensions: string | null;
  shipping_cost: number;
  payment_type: PaymentType;
  payment_status: string;
  package_description: string | null;
  status: ShipmentStatus;
  assigned_driver_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  origin_branch?: Branch;
  destination_branch?: Branch;
}

export interface StatusHistoryEntry {
  id: string;
  shipment_id: string;
  previous_status: ShipmentStatus | null;
  new_status: ShipmentStatus;
  notes: string | null;
  branch_id: string | null;
  updated_by: string | null;
  created_at: string;
  branch?: Branch;
}

export interface DashboardStats {
  totalShipments: number;
  delivered: number;
  inTransit: number;
  revenue: number;
  todayShipments: number;
  activeBranches: number;
}

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  received: 'Received',
  processing: 'Processing',
  in_transit: 'In Transit',
  arrived_at_destination: 'Arrived at Destination',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const STATUS_FLOW: ShipmentStatus[] = [
  'received',
  'processing',
  'in_transit',
  'arrived_at_destination',
  'out_for_delivery',
  'delivered',
];

export function maskName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.map(p => p.charAt(0) + '***').join(' ');
}

export function generateTrackingNumber(): string {
  const prefix = 'WZA';
  const num = Math.floor(Math.random() * 9000000 + 1000000);
  return `${prefix}-${num}`;
}
