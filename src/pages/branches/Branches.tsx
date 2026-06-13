import { useState } from 'react';
import { Building2, Plus, Edit2, ToggleLeft, ToggleRight, Phone, MapPin } from 'lucide-react';
import { useAllBranches, useCreateBranch, useUpdateBranch } from '../../hooks/useApi';
import { Modal } from '../../components/ui/Modal';

export function Branches() {
  const { data: branches, isLoading } = useAllBranches();
  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ branch_name: '', city: '', address: '', phone: '' });

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const openCreate = () => {
    setEditingId(null);
    setForm({ branch_name: '', city: '', address: '', phone: '' });
    setShowModal(true);
  };

  const openEdit = (b: typeof branches extends (infer T)[] ? T : never) => {
    setEditingId(b.id);
    setForm({ branch_name: b.branch_name, city: b.city, address: b.address, phone: b.phone || '' });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateBranch.mutate({ id: editingId, ...form }, { onSuccess: () => setShowModal(false) });
    } else {
      createBranch.mutate(form, { onSuccess: () => setShowModal(false) });
    }
  };

  const toggleActive = (b: typeof branches extends (infer T)[] ? T : never) => {
    updateBranch.mutate({ id: b.id, is_active: !b.is_active });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Branch Management</h2>
          <p className="font-body-md text-on-surface-variant">Manage all Wanza Express logistics branches across Ethiopia.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2 rounded-lg font-bold hover:opacity-90 shadow-lg shadow-primary/10 transition-all" onClick={openCreate}>
          <Plus size={18} /> Add Branch
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading branches...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches?.map(b => (
            <div key={b.id} className={`bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-colors ${!b.is_active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                    <Building2 size={18} className="text-primary-fixed" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-body-md">{b.branch_name}</h3>
                    <p className="text-[11px] text-on-surface-variant uppercase font-bold">{b.city}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 hover:bg-surface-container-high rounded-lg transition-colors" onClick={() => openEdit(b)}>
                    <Edit2 size={14} className="text-on-surface-variant" />
                  </button>
                  <button className="p-1.5 hover:bg-surface-container-high rounded-lg transition-colors" onClick={() => toggleActive(b)}>
                    {b.is_active ? (
                      <ToggleRight size={20} className="text-green-600" />
                    ) : (
                      <ToggleLeft size={20} className="text-on-surface-variant" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-body-sm">
                  <MapPin size={14} className="text-on-surface-variant mt-0.5 flex-shrink-0" />
                  <span className="text-on-surface-variant">{b.address}</span>
                </div>
                {b.phone && (
                  <div className="flex items-center gap-2 text-body-sm">
                    <Phone size={14} className="text-on-surface-variant flex-shrink-0" />
                    <span className="text-on-surface-variant">{b.phone}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-outline-variant">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${b.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {b.is_active ? 'Active' : 'Disabled'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Branch' : 'Add New Branch'}
        footer={
          <>
            <button className="flex-1 px-4 py-2 border border-outline-variant rounded-lg font-bold text-primary hover:bg-surface transition-colors" onClick={() => setShowModal(false)}>Cancel</button>
            <button
              className="flex-1 px-4 py-2 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-all"
              onClick={handleSubmit}
              disabled={createBranch.isPending || updateBranch.isPending}
            >
              {createBranch.isPending || updateBranch.isPending ? 'Saving...' : editingId ? 'Update Branch' : 'Create Branch'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Branch Name</label>
            <input className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-sm" placeholder="e.g. Mekelle Branch" value={form.branch_name} onChange={e => update('branch_name', e.target.value)} />
          </div>
          <div>
            <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">City</label>
            <input className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-sm" placeholder="e.g. Mekelle" value={form.city} onChange={e => update('city', e.target.value)} />
          </div>
          <div>
            <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Address</label>
            <input className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-sm" placeholder="Street address" value={form.address} onChange={e => update('address', e.target.value)} />
          </div>
          <div>
            <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Phone</label>
            <input className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-body-sm" placeholder="+251 11 000 0000" value={form.phone} onChange={e => update('phone', e.target.value)} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
