import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserCircle, Package, Network, CreditCard, ArrowRight, CheckCircle, Info } from 'lucide-react';
import { useBranches, useCreateShipment } from '../../hooks/useApi';
import type { PaymentType } from '../../types';

const STEPS = ['Sender', 'Receiver', 'Package', 'Review'];

export function CreateShipment() {
  const navigate = useNavigate();
  const { data: branches } = useBranches();
  const createShipment = useCreateShipment();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    sender_name: '',
    sender_phone: '',
    sender_address: '',
    receiver_name: '',
    receiver_phone: '',
    receiver_address: '',
    origin_branch_id: '',
    destination_branch_id: '',
    weight_kg: 0,
    dimensions: '',
    package_description: '',
    payment_type: 'sender_pays' as PaymentType,
  });
  const [createdTracking, setCreatedTracking] = useState<string | null>(null);

  const update = (field: string, value: string | number) => setForm(f => ({ ...f, [field]: value }));

  const baseRate = 150;
  const perKg = 15;
  const shippingCost = baseRate + form.weight_kg * perKg;

  const handleSubmit = async () => {
    try {
      const result = await createShipment.mutateAsync({
        sender_name: form.sender_name,
        sender_phone: form.sender_phone,
        sender_address: form.sender_address || undefined,
        receiver_name: form.receiver_name,
        receiver_phone: form.receiver_phone,
        receiver_address: form.receiver_address || undefined,
        origin_branch_id: form.origin_branch_id,
        destination_branch_id: form.destination_branch_id,
        weight_kg: form.weight_kg,
        dimensions: form.dimensions || undefined,
        shipping_cost: shippingCost,
        payment_type: form.payment_type,
        package_description: form.package_description || undefined,
      });
      setCreatedTracking(result.tracking_number);
    } catch {
      // Error handled by mutation state
    }
  };

  if (createdTracking) {
    return (
      <div className="max-w-lg mx-auto text-center py-24 animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-700" />
        </div>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Shipment Created!</h2>
        <p className="text-on-surface-variant mb-6">Your tracking number is:</p>
        <div className="bg-surface-container-lowest border-2 border-primary rounded-xl p-6 mb-8">
          <p className="font-display-lg text-display-lg text-primary">{createdTracking}</p>
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate('/shipments')} className="px-6 py-3 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90">View Shipments</button>
          <button onClick={() => { setCreatedTracking(null); setStep(0); setForm({ sender_name: '', sender_phone: '', sender_address: '', receiver_name: '', receiver_phone: '', receiver_address: '', origin_branch_id: '', destination_branch_id: '', weight_kg: 0, dimensions: '', package_description: '', payment_type: 'sender_pays' }); }} className="px-6 py-3 border border-outline-variant text-primary rounded-lg font-bold hover:bg-surface-container-low">Create Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Create New Shipment</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Fill in the details below to dispatch a new package through the Wanza Express network.</p>
      </div>

      <div className="flex items-center justify-between mb-10 bg-surface-container-low p-6 rounded-xl border border-outline-variant">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
                i === step ? 'border-primary bg-primary text-on-primary' :
                i < step ? 'border-secondary-container bg-secondary-container text-on-primary' :
                'border-outline text-on-surface-variant'
              }`}>
                {i < step ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span className={`font-label-caps text-label-caps text-center ${i === step ? 'text-primary' : 'text-on-surface-variant'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className="h-0.5 bg-outline-variant flex-1 -mt-6" />}
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-8">
          {step === 0 && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <User size={22} className="text-secondary" />
                <h3 className="font-title-md text-title-md text-primary">Sender Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Full Name</label>
                  <input className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface" placeholder="e.g. Dawit Tsegaye" value={form.sender_name} onChange={e => update('sender_name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Phone Number</label>
                  <input className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface" placeholder="+251 911 00 00 00" value={form.sender_phone} onChange={e => update('sender_phone', e.target.value)} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Physical Address</label>
                  <textarea className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface" placeholder="Street name, Building, Office/House Number" rows={3} value={form.sender_address} onChange={e => update('sender_address', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <UserCircle size={22} className="text-secondary" />
                <h3 className="font-title-md text-title-md text-primary">Receiver Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Full Name</label>
                  <input className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface" placeholder="e.g. Martha Hailu" value={form.receiver_name} onChange={e => update('receiver_name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Phone Number</label>
                  <input className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface" placeholder="+251 922 00 00 00" value={form.receiver_phone} onChange={e => update('receiver_phone', e.target.value)} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Delivery Address</label>
                  <textarea className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface" placeholder="Destination City, Neighborhood, Landmarks" rows={3} value={form.receiver_address} onChange={e => update('receiver_address', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Package size={22} className="text-secondary" />
                  <h3 className="font-title-md text-title-md text-primary">Package Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">Weight (kg)</label>
                    <input type="number" min="0" step="0.1" className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface" placeholder="0.0" value={form.weight_kg || ''} onChange={e => update('weight_kg', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">Dimensions (cm)</label>
                    <input className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface" placeholder="L x W x H" value={form.dimensions} onChange={e => update('dimensions', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">Package Description</label>
                    <input className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface" placeholder="Electronics, Clothing, etc." value={form.package_description} onChange={e => update('package_description', e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-outline-variant space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Network size={22} className="text-secondary" />
                  <h3 className="font-title-md text-title-md text-primary">Branch Routing</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">Origin Branch</label>
                    <select className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface" value={form.origin_branch_id} onChange={e => update('origin_branch_id', e.target.value)}>
                      <option value="">Select Origin</option>
                      {branches?.map(b => <option key={b.id} value={b.id}>{b.branch_name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">Destination Branch</label>
                    <select className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface" value={form.destination_branch_id} onChange={e => update('destination_branch_id', e.target.value)}>
                      <option value="">Select Destination</option>
                      {branches?.map(b => <option key={b.id} value={b.id}>{b.branch_name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard size={22} className="text-secondary" />
                <h3 className="font-title-md text-title-md text-primary">Payment & Confirmation</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">Payment Type</label>
                    <div className="space-y-3">
                      <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-surface-container transition-colors ${form.payment_type === 'sender_pays' ? 'border-primary bg-primary/5' : 'border-outline-variant'}`}>
                        <input type="radio" name="paymentType" className="w-5 h-5 text-primary" checked={form.payment_type === 'sender_pays'} onChange={() => update('payment_type', 'sender_pays')} />
                        <span className="ml-3 font-body-md text-body-md">Sender Pays (Prepaid)</span>
                      </label>
                      <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-surface-container transition-colors ${form.payment_type === 'receiver_pays' ? 'border-primary bg-primary/5' : 'border-outline-variant'}`}>
                        <input type="radio" name="paymentType" className="w-5 h-5 text-primary" checked={form.payment_type === 'receiver_pays'} onChange={() => update('payment_type', 'receiver_pays')} />
                        <span className="ml-3 font-body-md text-body-md">Receiver Pays (Cash on Delivery)</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="bg-primary text-on-primary p-6 rounded-xl flex flex-col justify-between">
                  <div>
                    <h4 className="font-label-caps text-label-caps text-primary-fixed opacity-80 mb-4">Estimated Shipping Fee</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium">ETB</span>
                      <span className="text-4xl font-black">{shippingCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-primary-container border-opacity-30">
                    <p className="text-xs text-primary-fixed-dim leading-relaxed">
                      Fee calculated based on weight ({perKg} ETB/kg) and standard distance between selected branches. Base rate: ETB {baseRate}.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-high p-4 rounded-lg flex items-start gap-3">
                <Info size={18} className="text-primary mt-1 flex-shrink-0" />
                <p className="text-sm text-on-surface-variant italic">
                  By generating a tracking ID, you confirm that all entered information is accurate and that the package does not contain prohibited or hazardous materials as per Wanza Express policies.
                </p>
              </div>
            </div>
          )}

          <div className="mt-12 flex items-center justify-between border-t border-outline-variant pt-8">
            <button
              className={`px-6 py-3 rounded-lg font-bold border border-primary text-primary hover:bg-surface-container-low transition-all ${step === 0 ? 'invisible' : ''}`}
              onClick={() => setStep(s => s - 1)}
              type="button"
            >
              Back
            </button>
            <div className="flex gap-4">
              {step < STEPS.length - 1 && (
                <button className="px-8 py-3 rounded-lg font-bold bg-primary text-on-primary hover:opacity-90 transition-all flex items-center gap-2" onClick={() => setStep(s => s + 1)} type="button">
                  Next Step <ArrowRight size={16} />
                </button>
              )}
              {step === STEPS.length - 1 && (
                <button
                  className="px-8 py-3 rounded-lg font-bold bg-secondary-container text-on-secondary-container hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-secondary-container/20"
                  onClick={handleSubmit}
                  disabled={createShipment.isPending}
                  type="button"
                >
                  <CheckCircle size={18} />
                  {createShipment.isPending ? 'Creating...' : 'Generate Tracking ID & Save'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
