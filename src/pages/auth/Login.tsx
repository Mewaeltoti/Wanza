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
  email: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const roleOptions: RoleOption[] = [
  {
    role: 'super_admin',
    label: 'Super Admin',
    description: 'Full system access, analytics, user management, all branches',
    icon: Shield,
    email: 'admin@wanzaexpress.com',
    color: 'text-primary',
    bgColor: 'bg-primary/5',
    borderColor: 'border-primary',
  },
  {
    role: 'branch_manager',
    label: 'Branch Manager',
    description: 'Branch operations, staff oversight, shipment management',
    icon: Building2,
    email: 'manager@wanzaexpress.com',
    color: 'text-secondary',
    bgColor: 'bg-secondary/5',
    borderColor: 'border-secondary',
  },
  {
    role: 'staff',
    label: 'Staff',
    description: 'Create shipments, update statuses, daily operations',
    icon: Users,
    email: 'staff@wanzaexpress.com',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-400',
  },
  {
    role: 'driver',
    label: 'Delivery Driver',
    description: 'View assigned deliveries, update delivery status, navigation',
    icon: Navigation,
    email: 'driver@wanzaexpress.com',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-400',
  },
];

export function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectRole = (opt: RoleOption) => {
    setSelectedRole(opt.role);
    setEmail(opt.email);
    setPassword('');
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-64 h-64 border border-on-primary rounded-full" />
          <div className="absolute bottom-40 left-10 w-96 h-96 border border-on-primary rounded-full" />
          <div className="absolute top-1/2 right-1/3 w-48 h-48 border border-on-primary rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-on-primary rounded-xl flex items-center justify-center">
              <Truck size={24} className="text-primary" />
            </div>
            <span className="font-headline-lg text-headline-lg text-on-primary font-black">Wanza Express</span>
          </div>
          <p className="text-on-primary/60 font-body-md ml-15">Logistics Control Portal</p>
        </div>

        <div className="relative z-10 space-y-8">
          <h2 className="font-display-lg text-display-lg text-on-primary leading-tight">
            Manage Your<br />Logistics Network
          </h2>
          <div className="space-y-4">
            {[
              'Real-time shipment tracking across all branches',
              'Role-based access for admins, managers & drivers',
              'Complete logistics workflow from dispatch to delivery',
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-on-primary text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-on-primary/80 font-body-md">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-on-primary/40 font-body-sm">&copy; 2024 Wanza Express Logistics. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
              <Truck size={28} className="text-on-primary" />
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">Wanza Express</h1>
            <p className="text-on-surface-variant text-body-sm mt-1">Logistics Portal</p>
          </div>

          <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Sign In</h2>
          <p className="text-on-surface-variant font-body-md mb-8">Select your role and enter your credentials.</p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {roleOptions.map(opt => {
              const isSelected = selectedRole === opt.role;
              return (
                <button
                  key={opt.role}
                  onClick={() => selectRole(opt)}
                  className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                    isSelected
                      ? `${opt.borderColor} ${opt.bgColor} shadow-sm`
                      : 'border-outline-variant bg-surface-container-lowest hover:border-outline'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${isSelected ? opt.color : 'text-on-surface-variant'} ${isSelected ? opt.bgColor : 'bg-surface-container'}`}>
                    <opt.icon size={20} />
                  </div>
                  <h3 className={`font-bold text-body-sm mb-1 ${isSelected ? opt.color : 'text-primary'}`}>
                    {opt.label}
                  </h3>
                  <p className="text-[11px] text-on-surface-variant leading-tight line-clamp-2">{opt.description}</p>
                </button>
              );
            })}
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-error-container p-4 rounded-lg text-on-error-container text-body-sm font-medium flex items-start gap-2">
                <span className="font-bold">!</span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-body-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="Select a role above or enter email"
                value={email}
                onChange={e => { setEmail(e.target.value); setSelectedRole(null); }}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-outline-variant bg-surface-container-lowest text-body-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {selectedRole && (
              <div className={`p-3 rounded-lg ${roleOptions.find(r => r.role === selectedRole)?.bgColor} border ${roleOptions.find(r => r.role === selectedRole)?.borderColor} flex items-center gap-2`}>
                <span className={`font-bold text-xs ${roleOptions.find(r => r.role === selectedRole)?.color}`}>
                  {roleOptions.find(r => r.role === selectedRole)?.label}
                </span>
                <span className="text-on-surface-variant text-xs">Demo password: password123</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              disabled={loading || !email}
            >
              {loading ? 'Signing in...' : (
                <>
                  Sign In as {selectedRole ? roleOptions.find(r => r.role === selectedRole)?.label : 'User'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-outline-variant">
            <div className="flex justify-between items-center">
              <p className="text-body-sm text-on-surface-variant">
                New user?{' '}
                <Link to="/register" className="text-primary font-bold hover:underline">Create account</Link>
              </p>
              <Link to="/" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">
                Track a shipment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
