import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Shipment, ShipmentStatus, StatusHistoryEntry, Branch, PaymentType, User, UserRole } from '../types';

// Shipments
export function useShipments(params?: {
  status?: ShipmentStatus;
  search?: string;
  branchId?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const from = (page - 1) * pageSize;

  return useQuery({
    queryKey: ['shipments', params],
    queryFn: async () => {
      let query = supabase
        .from('shipments')
        .select('*, origin_branch:branches!shipments_origin_branch_id_fkey(*), destination_branch:branches!shipments_destination_branch_id_fkey(*)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, from + pageSize - 1);

      if (params?.status) query = query.eq('status', params.status);
      if (params?.branchId) {
        query = query.or(`origin_branch_id.eq.${params.branchId},destination_branch_id.eq.${params.branchId}`);
      }
      if (params?.search) {
        query = query.or(`tracking_number.ilike.%${params.search}%,sender_name.ilike.%${params.search}%,receiver_name.ilike.%${params.search}%,sender_phone.ilike.%${params.search}%,receiver_phone.ilike.%${params.search}%`);
      }

      const { data, count, error } = await query;
      if (error) throw error;
      return { data: data as Shipment[], count: count || 0, page, pageSize };
    },
  });
}

export function useShipment(id: string) {
  return useQuery({
    queryKey: ['shipment', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipments')
        .select('*, origin_branch:branches!shipments_origin_branch_id_fkey(*), destination_branch:branches!shipments_destination_branch_id_fkey(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Shipment;
    },
    enabled: !!id,
  });
}

export function useShipmentByTracking(trackingNumber: string) {
  return useQuery({
    queryKey: ['shipment-tracking', trackingNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipments')
        .select('*, origin_branch:branches!shipments_origin_branch_id_fkey(*), destination_branch:branches!shipments_destination_branch_id_fkey(*)')
        .eq('tracking_number', trackingNumber)
        .single();
      if (error) throw error;
      return data as Shipment;
    },
    enabled: !!trackingNumber,
  });
}

export function useStatusHistory(shipmentId: string) {
  return useQuery({
    queryKey: ['status-history', shipmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('status_history')
        .select('*, branch:branches(*)')
        .eq('shipment_id', shipmentId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as StatusHistoryEntry[];
    },
    enabled: !!shipmentId,
  });
}

export function useCreateShipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (shipment: {
      sender_name: string;
      sender_phone: string;
      sender_address?: string;
      receiver_name: string;
      receiver_phone: string;
      receiver_address?: string;
      origin_branch_id: string;
      destination_branch_id: string;
      weight_kg: number;
      dimensions?: string;
      shipping_cost: number;
      payment_type: PaymentType;
      package_description?: string;
    }) => {
      const tracking_number = 'WZA-' + Math.floor(Math.random() * 9000000 + 1000000);
      const { data, error } = await supabase
        .from('shipments')
        .insert({ ...shipment, tracking_number, payment_status: shipment.payment_type === 'sender_pays' ? 'paid' : 'unpaid', status: 'received' })
        .select('*, origin_branch:branches!shipments_origin_branch_id_fkey(*), destination_branch:branches!shipments_destination_branch_id_fkey(*)')
        .single();
      if (error) throw error;

      await supabase.from('status_history').insert({
        shipment_id: data.id,
        new_status: 'received',
        notes: 'Package received at origin branch',
        branch_id: shipment.origin_branch_id,
      });

      return data as Shipment;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shipments'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

export function useUpdateShipmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ shipmentId, newStatus, notes, branchId }: { shipmentId: string; newStatus: ShipmentStatus; notes?: string; branchId?: string }) => {
      const { data: shipment } = await supabase.from('shipments').select('status').eq('id', shipmentId).single();

      const { error: updateError } = await supabase
        .from('shipments')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', shipmentId);
      if (updateError) throw updateError;

      const { error: historyError } = await supabase.from('status_history').insert({
        shipment_id: shipmentId,
        previous_status: shipment?.status,
        new_status: newStatus,
        notes: notes || null,
        branch_id: branchId || null,
      });
      if (historyError) throw historyError;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shipments'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

// Branches
export function useBranches() {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const { data, error } = await supabase.from('branches').select('*').eq('is_active', true).order('branch_name');
      if (error) throw error;
      return data as Branch[];
    },
  });
}

export function useAllBranches() {
  return useQuery({
    queryKey: ['all-branches'],
    queryFn: async () => {
      const { data, error } = await supabase.from('branches').select('*').order('branch_name');
      if (error) throw error;
      return data as Branch[];
    },
  });
}

export function useCreateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (branch: { branch_name: string; city: string; address: string; phone?: string }) => {
      const { data, error } = await supabase.from('branches').insert(branch).select().single();
      if (error) throw error;
      return data as Branch;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['branches'] }),
  });
}

export function useUpdateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Branch>) => {
      const { data, error } = await supabase.from('branches').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw error;
      return data as Branch;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['branches'] }),
  });
}

// Dashboard Stats
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [shipmentsRes, branchesRes] = await Promise.all([
        supabase.from('shipments').select('status, shipping_cost, created_at'),
        supabase.from('branches').select('id', { count: 'exact' }).eq('is_active', true),
      ]);

      if (shipmentsRes.error) throw shipmentsRes.error;
      if (branchesRes.error) throw branchesRes.error;

      const shipments = shipmentsRes.data;
      const totalShipments = shipments.length;
      const delivered = shipments.filter(s => s.status === 'delivered').length;
      const inTransit = shipments.filter(s => s.status === 'in_transit' || s.status === 'out_for_delivery').length;
      const revenue = shipments.reduce((sum, s) => sum + Number(s.shipping_cost), 0);

      const today = new Date().toISOString().split('T')[0];
      const todayShipments = shipments.filter(s => s.created_at?.startsWith(today)).length;

      return {
        totalShipments,
        delivered,
        inTransit,
        revenue,
        todayShipments,
        activeBranches: branchesRes.count || 0,
      };
    },
  });
}

// Users Management
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*, branch:branches(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as (User & { branch?: Branch })[];
    },
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { email: string; password: string; full_name: string; phone?: string; role: UserRole; branch_id?: string }) => {
      // Create auth account first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: { data: { full_name: params.full_name, role: params.role } },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create auth account');

      // Then create the profile in users table
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          full_name: params.full_name,
          email: params.email,
          phone: params.phone || null,
          role: params.role,
          branch_id: params.branch_id || null,
          is_active: true,
        })
        .select('*, branch:branches(*)')
        .single();
      if (error) throw error;
      return data as User & { branch?: Branch };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<User>) => {
      const { data, error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*, branch:branches(*)')
        .single();
      if (error) throw error;
      return data as User & { branch?: Branch };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useToggleUserActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from('users')
        .update({ is_active, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}
