import { useState } from 'react';
import { User, Mail, Phone, Shield, Building2, Edit2, Save, X } from 'lucide-react';

// Mock profile — in a real integration this would come from Supabase auth + users table
const MOCK_PROFILE = {
  full_name: 'Admin User',
  email: 'admin@wanzaexpress.com',
  phone: '+251 911 000 000',
  role: 'super_admin' as const,
  branch: 'Addis Ababa – HQ',
  joined: '2024-01-15',
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  branch_manager: 'Branch Manager',
  staff: 'Staff',
  driver: 'Driver',
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-800',
  branch_manager: 'bg-blue-100 text-blue-800',
  staff: 'bg-green-100 text-green-800',
  driver: 'bg-orange-100 text-orange-800',
};

export function Profile() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [draft, setDraft] = useState(profile);

  const handleSave = () => {
    setProfile(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-primary">My Profile</h2>
        <p className="text-on-surface-variant font-body-md">View and manage your account information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-8 flex flex-col items-center text-center shadow-sm">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4 shadow-lg">
            <User size={44} className="text-on-primary" />
          </div>
          <h3 className="font-bold text-primary text-title-md mb-1">{profile.full_name}</h3>
          <span className={`text-xs font-bold px-3 py-1 rounded-full mb-4 ${ROLE_COLORS[profile.role] || 'bg-surface-container text-on-surface-variant'}`}>
            {ROLE_LABELS[profile.role] || profile.role}
          </span>
          <p className="text-body-sm text-on-surface-variant mb-2 flex items-center gap-1">
            <Building2 size={13} /> {profile.branch}
          </p>
          <p className="text-body-sm text-on-surface-variant">
            Member since {new Date(profile.joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-title-md text-primary">Account Information</h3>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-body-sm font-bold text-primary hover:bg-surface-container transition-colors"
              >
                <Edit2 size={15} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-body-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  <X size={15} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-bold hover:opacity-90 transition-all"
                >
                  <Save size={15} /> Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="pb-5 border-b border-outline-variant">
              <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-2 tracking-widest flex items-center gap-1.5">
                <User size={12} /> Full Name
              </p>
              {editing ? (
                <input
                  className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-body-md focus:ring-2 focus:ring-primary"
                  value={draft.full_name}
                  onChange={e => setDraft(d => ({ ...d, full_name: e.target.value }))}
                />
              ) : (
                <p className="font-bold text-primary text-body-md">{profile.full_name}</p>
              )}
            </div>

            <div className="pb-5 border-b border-outline-variant">
              <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-2 tracking-widest flex items-center gap-1.5">
                <Mail size={12} /> Email Address
              </p>
              {editing ? (
                <input
                  type="email"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-body-md focus:ring-2 focus:ring-primary"
                  value={draft.email}
                  onChange={e => setDraft(d => ({ ...d, email: e.target.value }))}
                />
              ) : (
                <p className="font-bold text-primary text-body-md">{profile.email}</p>
              )}
            </div>

            <div className="pb-5 border-b border-outline-variant">
              <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-2 tracking-widest flex items-center gap-1.5">
                <Phone size={12} /> Phone Number
              </p>
              {editing ? (
                <input
                  className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-body-md focus:ring-2 focus:ring-primary"
                  value={draft.phone}
                  onChange={e => setDraft(d => ({ ...d, phone: e.target.value }))}
                />
              ) : (
                <p className="font-bold text-primary text-body-md">{profile.phone}</p>
              )}
            </div>

            <div className="pb-5 border-b border-outline-variant">
              <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-2 tracking-widest flex items-center gap-1.5">
                <Shield size={12} /> Role & Access
              </p>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${ROLE_COLORS[profile.role] || ''}`}>
                  {ROLE_LABELS[profile.role]}
                </span>
                <p className="text-body-sm text-on-surface-variant">Role changes require Super Admin approval.</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-2 tracking-widest flex items-center gap-1.5">
                <Building2 size={12} /> Assigned Branch
              </p>
              <p className="font-bold text-primary text-body-md">{profile.branch}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="mt-6 bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
        <h3 className="font-title-md text-primary mb-1">Security</h3>
        <p className="text-body-sm text-on-surface-variant mb-4">Manage your password and account security settings.</p>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 border border-outline-variant rounded-lg text-body-sm font-bold text-primary hover:bg-surface-container transition-colors">
            Change Password
          </button>
          <button className="px-4 py-2 border border-outline-variant rounded-lg text-body-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors">
            Two-Factor Authentication
          </button>
          <button className="px-4 py-2 border border-error/30 rounded-lg text-body-sm font-bold text-error hover:bg-error-container/20 transition-colors">
            Deactivate Account
          </button>
        </div>
      </div>
    </div>
  );
}
