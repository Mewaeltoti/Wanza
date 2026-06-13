import { useState } from 'react';
import { Users, Plus, Shield, Building2, UserCircle, Navigation, ToggleLeft, ToggleRight, Edit2, Eye, EyeOff } from 'lucide-react';
import { useAuth, ROLE_LABELS, ROLE_COLORS } from '../../lib/auth';
import { useUsers, useBranches, useCreateUser, useUpdateUser, useToggleUserActive } from '../../hooks/useApi';
import { Modal } from '../../components/ui/Modal';
import type { UserRole } from '../../types';

interface RoleOption {
  role: UserRole;
  label: string;
  icon: typeof Shield;
  color: string;
  bgColor: string;
}

const allRoleOptions: RoleOption[] = [
  { role: 'branch_manager', label: 'Branch Manager', icon: Building2, color: 'text-secondary', bgColor: 'bg-secondary/5' },
  { role: 'staff', label: 'Staff', icon: UserCircle, color: 'text-blue-700', bgColor: 'bg-blue-50' },
  { role: 'driver', label: 'Driver', icon: Navigation, color: 'text-green-700', bgColor: 'bg-green-50' },
];

const roleIconMap: Record<UserRole, typeof Shield> = {
  super_admin: Shield,
  branch_manager: Building2,
  staff: UserCircle,
  driver: Navigation,
};

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const { data: users, isLoading } = useUsers();
  const { data: branches } = useBranches();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const toggleActive = useToggleUserActive();

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'staff' as UserRole,
    branch_id: '',
  });
  const [error, setError] = useState('');

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  // Determine which roles the current user can create
  const creatableRoles = currentUser?.role === 'super_admin'
    ? allRoleOptions
    : allRoleOptions.filter(r => r.role === 'staff' || r.role === 'driver');

  // Determine branch constraint
  const mustUseOwnBranch = currentUser?.role === 'branch_manager';
  const availableBranches = mustUseOwnBranch
    ? branches?.filter(b => b.id === currentUser.branchId) || []
    : branches || [];

  const openCreate = () => {
    setEditId(null);
    setError('');
    setForm({
      full_name: '',
      email: '',
      phone: '',
      password: '',
      role: 'staff',
      branch_id: mustUseOwnBranch ? (currentUser?.branchId || '') : '',
    });
    setShowModal(true);
  };

  const openEdit = (u: typeof users extends (infer T)[] ? T : never) => {
    setEditId(u.id);
    setError('');
    setForm({
      full_name: u.full_name,
      email: u.email,
      phone: u.phone || '',
      password: '',
      role: u.role,
      branch_id: u.branch_id || '',
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    setError('');
    if (editId) {
      updateUser.mutate(
        { id: editId, full_name: form.full_name, phone: form.phone || null, role: form.role as UserRole, branch_id: form.branch_id || null },
        { onSuccess: () => setShowModal(false), onError: (err) => setError(err.message) }
      );
    } else {
      if (!form.password || form.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      createUser.mutate(
        { full_name: form.full_name, email: form.email, password: form.password, phone: form.phone || undefined, role: form.role as UserRole, branch_id: form.branch_id || undefined },
        { onSuccess: () => setShowModal(false), onError: (err) => setError(err.message) }
      );
    }
  };

  const roleBadgeClass = (role: UserRole) => ROLE_COLORS[role];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">User Management</h2>
          <p className="font-body-md text-on-surface-variant">
            {currentUser?.role === 'super_admin'
              ? 'Create and manage branch managers, staff, and drivers across all branches.'
              : 'Create and manage staff and drivers for your branch.'}
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2 rounded-lg font-bold hover:opacity-90 shadow-lg shadow-primary/10 transition-all"
          onClick={openCreate}
        >
          <Plus size={18} />
          {currentUser?.role === 'super_admin' ? 'Add User' : 'Add Staff / Driver'}
        </button>
      </div>

      {/* Role Permissions Info */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 mb-6 shadow-sm">
        <h4 className="font-bold text-primary text-body-sm mb-3 flex items-center gap-2">
          <Shield size={16} className="text-secondary" />
          Your Permissions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-body-sm">
          {currentUser?.role === 'super_admin' ? (
            <>
              <div className="flex items-start gap-2"><span className="text-green-600 font-bold">+</span> <span className="text-on-surface-variant">Create Branch Managers, Staff, and Drivers for any branch</span></div>
              <div className="flex items-start gap-2"><span className="text-green-600 font-bold">+</span> <span className="text-on-surface-variant">Edit and manage all users across the system</span></div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2"><span className="text-green-600 font-bold">+</span> <span className="text-on-surface-variant">Create Staff and Drivers for <strong>{branches?.find(b => b.id === currentUser?.branchId)?.branch_name || 'your branch'}</strong></span></div>
              <div className="flex items-start gap-2"><span className="text-red-600 font-bold">-</span> <span className="text-on-surface-variant">Cannot create Branch Managers or users for other branches</span></div>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading users...</div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">User</th>
                  <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Role</th>
                  <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Branch</th>
                  <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="p-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Phone</th>
                  <th className="p-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {users?.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-on-surface-variant">No users found.</td></tr>
                )}
                {users?.map(u => {
                  const Icon = roleIconMap[u.role] || UserCircle;
                  const canEdit = currentUser?.role === 'super_admin' ||
                    (currentUser?.role === 'branch_manager' && u.branch_id === currentUser.branchId && u.role !== 'super_admin' && u.role !== 'branch_manager');
                  return (
                    <tr key={u.id} className="hover:bg-surface-container transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon size={18} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-primary text-body-sm">{u.full_name}</p>
                            <p className="text-[11px] text-on-surface-variant">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleBadgeClass(u.role)}`}>
                          {ROLE_LABELS[u.role]}
                        </span>
                      </td>
                      <td className="p-4 text-body-sm text-on-surface-variant">
                        {(u as any).branch?.branch_name || '-'}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => canEdit && toggleActive.mutate({ id: u.id, is_active: !u.is_active })}
                          className={`flex items-center gap-1 ${canEdit ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                          {u.is_active ? (
                            <ToggleRight size={22} className="text-green-600" />
                          ) : (
                            <ToggleLeft size={22} className="text-on-surface-variant" />
                          )}
                          <span className={`text-[11px] font-bold uppercase ${u.is_active ? 'text-green-700' : 'text-on-surface-variant'}`}>
                            {u.is_active ? 'Active' : 'Disabled'}
                          </span>
                        </button>
                      </td>
                      <td className="p-4 text-body-sm text-on-surface-variant">{u.phone || '-'}</td>
                      <td className="p-4 text-center">
                        {canEdit && (
                          <button
                            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
                            onClick={() => openEdit(u)}
                          >
                            <Edit2 size={16} className="text-on-surface-variant" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editId ? 'Edit User' : 'Create New User'}
        footer={
          <>
            <button className="flex-1 px-4 py-2 border border-outline-variant rounded-lg font-bold text-primary hover:bg-surface transition-colors" onClick={() => setShowModal(false)}>Cancel</button>
            <button
              className="flex-1 px-4 py-2 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-all"
              onClick={handleSubmit}
              disabled={createUser.isPending || updateUser.isPending}
            >
              {createUser.isPending || updateUser.isPending ? 'Saving...' : editId ? 'Update User' : 'Create User'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {error && (
            <div className="bg-error-container p-3 rounded-lg text-on-error-container text-body-sm font-medium">{error}</div>
          )}

          {/* Role Selection */}
          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant mb-3 block">Role</label>
            <div className="grid grid-cols-3 gap-3">
              {creatableRoles.map(opt => {
                const isSelected = form.role === opt.role;
                return (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => update('role', opt.role)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${isSelected ? `${opt.bgColor} ${opt.role === 'branch_manager' ? 'border-secondary' : opt.role === 'driver' ? 'border-green-400' : 'border-blue-400'}` : 'border-outline-variant hover:border-outline'}`}
                  >
                    <opt.icon size={20} className={`mx-auto mb-1 ${isSelected ? opt.color : 'text-on-surface-variant'}`} />
                    <span className={`text-[11px] font-bold ${isSelected ? opt.color : 'text-on-surface-variant'}`}>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Full Name</label>
            <input className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-sm" placeholder="Full name" value={form.full_name} onChange={e => update('full_name', e.target.value)} />
          </div>

          <div>
            <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Email</label>
            <input type="email" className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-sm" placeholder="user@wanzaexpress.com" value={form.email} onChange={e => update('email', e.target.value)} disabled={!!editId} />
          </div>

          <div>
            <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Phone</label>
            <input className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-sm" placeholder="+251 911 000 000" value={form.phone} onChange={e => update('phone', e.target.value)} />
          </div>

          {!editId && (
            <div>
              <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 pr-12 text-body-sm"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  minLength={6}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Branch</label>
            <select
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-sm"
              value={form.branch_id}
              onChange={e => update('branch_id', e.target.value)}
              disabled={mustUseOwnBranch}
            >
              <option value="">No Branch Assigned</option>
              {availableBranches.map(b => <option key={b.id} value={b.id}>{b.branch_name}</option>)}
            </select>
            {mustUseOwnBranch && (
              <p className="text-[11px] text-on-surface-variant mt-1 italic">Users are automatically assigned to your branch.</p>
            )}
          </div>

          {/* Role constraint info */}
          {currentUser?.role === 'branch_manager' && (
            <div className="bg-secondary/5 border border-secondary/20 p-3 rounded-lg flex items-start gap-2">
              <Shield size={16} className="text-secondary mt-0.5 flex-shrink-0" />
              <p className="text-body-sm text-on-secondary-container">
                As a Branch Manager, you can only create Staff and Driver accounts for <strong>{branches?.find(b => b.id === currentUser.branchId)?.branch_name || 'your branch'}</strong>.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
