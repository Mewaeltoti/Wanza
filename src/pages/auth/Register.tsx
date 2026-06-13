import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, Shield, Building2, Users, Navigation, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { UserRole } from '../../types';

interface RoleOption {
  role: UserRole;
  label: string;
  description: string;
  icon: typeof Shield;
  color: string;
  bgColor: string;
  borderColor: string;
}

const roleOptions: RoleOption[] = [
  { role: 'super_admin', label: 'Super Admin', description: 'Full system access', icon: Shield, color: 'text-primary', bgColor: 'bg-primary/5', borderColor: 'border-primary' },
  { role: 'branch_manager', label: 'Branch Manager', description: 'Branch operations', icon: Building2, color: 'text-secondary', bgColor: 'bg-secondary/5', borderColor: 'border-secondary' },
  { role: 'staff', label: 'Staff', description: 'Daily operations', icon: Users, color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-400' },
  { role: 'driver', label: 'Delivery Driver', description: 'Delivery tasks', icon: Navigation, color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-400' },
];

export function Register() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('staff');
  const [form, setForm] = useState({ email: '', password: '', fullName: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.fullName, role: selectedRole } },
      });
      if (authError) throw authError;

      if (authData.user) {
        await supabase.from('users').insert({
          id: authData.user.id,
          full_name: form.fullName,
          email: form.email,
          phone: form.phone || null,
          role: selectedRole,
        });
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const currentOpt = roleOptions.find(r => r.role === selectedRole)!;

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
            <Truck size={28} className="text-on-primary" />
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">Create Account</h1>
          <p className="text-on-surface-variant text-body-sm mt-1">Join the Wanza Express logistics network</p>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant shadow-sm">
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="bg-error-container p-4 rounded-lg text-on-error-container text-body-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-3 block">Select Your Role</label>
              <div className="grid grid-cols-2 gap-3">
                {roleOptions.map(opt => {
                  const isSelected = selectedRole === opt.role;
                  return (
                    <button
                      key={opt.role}
                      type="button"
                      onClick={() => setSelectedRole(opt.role)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        isSelected ? `${opt.borderColor} ${opt.bgColor}` : 'border-outline-variant hover:border-outline'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <opt.icon size={16} className={isSelected ? opt.color : 'text-on-surface-variant'} />
                        <span className={`font-bold text-xs ${isSelected ? opt.color : 'text-primary'}`}>{opt.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant">Full Name</label>
              <input className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface text-body-sm" placeholder="Abebe Kebede" value={form.fullName} onChange={e => update('fullName', e.target.value)} required />
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant">Email</label>
              <input type="email" className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface text-body-sm" placeholder="you@wanzaexpress.com" value={form.email} onChange={e => update('email', e.target.value)} required />
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant">Phone</label>
              <input className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface text-body-sm" placeholder="+251 911 000 000" value={form.phone} onChange={e => update('phone', e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-outline-variant bg-surface text-body-sm"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  required
                  minLength={6}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? 'Creating...' : (
                <>
                  Create {currentOpt.label} Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-outline-variant text-center">
            <p className="text-body-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
