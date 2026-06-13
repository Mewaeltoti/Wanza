import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle, Truck, Building2, MapPin, Route, Phone, Mail, HelpCircle, Headset } from 'lucide-react';
import { useShipmentByTracking, useStatusHistory } from '../../hooks/useApi';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { STATUS_FLOW, STATUS_LABELS, maskName } from '../../types';
import type { ShipmentStatus } from '../../types';

const statusIcons: Record<string, typeof CheckCircle> = {
  received: CheckCircle,
  processing: Truck,
  in_transit: Truck,
  arrived_at_destination: Building2,
  out_for_delivery: Truck,
  delivered: CheckCircle,
  cancelled: CheckCircle,
};

function TrackingTimeline({ status, history }: { status: ShipmentStatus; history: { new_status: ShipmentStatus; notes: string | null; branch?: { branch_name: string } | null; created_at: string }[] }) {
  const currentIdx = STATUS_FLOW.indexOf(status);

  return (
    <div className="relative pb-12">
      <div className="absolute top-6 left-0 w-full h-1 bg-surface-container-high rounded-full">
        <div
          className="absolute h-full bg-secondary rounded-full transition-all"
          style={{ width: `${(currentIdx / (STATUS_FLOW.length - 1)) * 100}%` }}
        />
      </div>
      <div className="relative flex justify-between">
        {STATUS_FLOW.map((s, i) => {
          const Icon = statusIcons[s] || CheckCircle;
          const isCurrent = i === currentIdx;
          const isCompleted = i < currentIdx;
          const isPending = i > currentIdx;
          const historyEntry = history.find(h => h.new_status === s);

          return (
            <div key={s} className={`flex flex-col items-center text-center gap-4 ${isPending ? 'opacity-40' : ''}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                isCurrent ? 'bg-secondary text-on-primary ring-8 ring-secondary/10' :
                isCompleted ? 'bg-primary text-on-primary' :
                'bg-surface-container-highest text-on-surface-variant'
              }`}>
                <Icon size={20} />
              </div>
              <div>
                <p className={`font-bold text-body-sm ${isCurrent ? 'text-secondary' : isCompleted ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {STATUS_LABELS[s]}
                </p>
                {historyEntry?.branch?.branch_name && (
                  <p className={`text-[10px] uppercase ${isCurrent ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}>
                    {historyEntry.branch.branch_name}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [searched, setSearched] = useState('');

  const { data: shipment, error: shipmentError } = useShipmentByTracking(searched);
  const { data: history } = useStatusHistory(searched && shipment ? shipment.id : '');

  const handleSearch = () => {
    if (trackingNumber.trim()) {
      setSearched(trackingNumber.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background">
      <header className="sticky top-0 flex justify-between items-center w-full px-4 md:px-6 h-16 z-50 bg-surface border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <Truck size={24} className="text-primary" />
          <span className="font-headline-lg-mobile text-headline-lg-mobile font-black text-primary">Wanza Express</span>
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          <a className="text-primary font-bold border-b-2 border-primary py-2 font-body-md">Track</a>
          <a className="text-on-surface-variant hover:bg-surface-container transition-colors px-3 py-2 rounded-lg font-body-md">Services</a>
          <a className="text-on-surface-variant hover:bg-surface-container transition-colors px-3 py-2 rounded-lg font-body-md">About</a>
          <a className="text-on-surface-variant hover:bg-surface-container transition-colors px-3 py-2 rounded-lg font-body-md">Contact</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-all text-body-sm hidden md:block">Login</Link>
        </div>
      </header>

      <section className="relative py-24 md:py-32 px-4 md:px-6 bg-primary-container text-white overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="font-display-lg text-display-lg mb-6 tracking-tight text-on-primary-container">Real-Time Global Logistics Visibility</h1>
          <p className="font-body-md text-on-primary-container mb-12 max-w-2xl mx-auto">
            Track your shipment across continents with precision and speed. Wanza Express ensures your cargo is monitored every step of the way.
          </p>
          <div className="bg-surface-container-lowest p-2 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl mx-auto">
            <div className="flex-1 flex items-center px-4 gap-3">
              <Truck size={20} className="text-outline" />
              <input
                className="w-full border-none focus:ring-0 text-primary font-title-md py-3 placeholder:text-outline-variant bg-transparent"
                placeholder="Enter Tracking Number (e.g., WZA-8921102)"
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button className="bg-secondary text-on-primary px-8 py-4 rounded-lg font-bold text-title-md hover:opacity-95 transition-all flex items-center justify-center gap-2" onClick={handleSearch}>
              <Search size={20} />
              Track Now
            </button>
          </div>
          <div className="mt-4 flex justify-center gap-6 text-body-sm text-on-primary-container">
            <span className="flex items-center gap-1"><CheckCircle size={14} /> 24/7 Support</span>
            <span className="flex items-center gap-1"><CheckCircle size={14} /> Global Network</span>
            <span className="flex items-center gap-1"><CheckCircle size={14} /> Secure Delivery</span>
          </div>
        </div>
      </section>

      {searched && shipmentError && (
        <section className="py-16 px-4 md:px-6 max-w-6xl mx-auto text-center">
          <div className="bg-error-container p-8 rounded-xl border border-error">
            <h3 className="font-title-md text-error mb-2">Shipment Not Found</h3>
            <p className="text-on-error-container">No shipment found with tracking number "{searched}". Please check and try again.</p>
          </div>
        </section>
      )}

      {searched && shipment && (
        <section className="py-16 px-4 md:px-6 bg-surface max-w-6xl mx-auto animate-fade-in">
          <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h2 className="font-label-caps text-label-caps text-secondary uppercase mb-2">Shipment Identified</h2>
              <div className="flex items-center gap-4">
                <h3 className="font-headline-lg text-headline-lg text-primary">{shipment.tracking_number}</h3>
                <StatusBadge status={shipment.status} size="md" />
              </div>
            </div>
            <div className="text-right">
              <p className="text-on-surface-variant font-body-sm mb-1">Last Updated</p>
              <p className="font-bold text-primary font-body-md">{new Date(shipment.updated_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant">
              <h4 className="font-title-md text-title-md text-primary mb-12 flex items-center gap-2">
                <Route size={20} /> Delivery Timeline
              </h4>
              <TrackingTimeline status={shipment.status} history={history || []} />
              <div className="mt-8 pt-8 border-t border-outline-variant">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant font-body-sm">Estimated Delivery:</span>
                  <span className="text-primary font-bold font-title-md">Within 2-3 business days</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
                <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase tracking-widest">Route Information</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center">
                      <MapPin size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-on-surface-variant">Origin</p>
                      <p className="font-bold text-primary">{shipment.origin_branch?.branch_name}, ET</p>
                    </div>
                  </div>
                  <div className="ml-4 h-6 border-l-2 border-dotted border-outline-variant" />
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center">
                      <MapPin size={14} className="text-secondary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-on-surface-variant">Destination</p>
                      <p className="font-bold text-primary">{shipment.destination_branch?.branch_name}, ET</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant">
                <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase tracking-widest">Package Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Sender</p>
                    <p className="font-bold text-primary">{maskName(shipment.sender_name)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Receiver</p>
                    <p className="font-bold text-primary">{maskName(shipment.receiver_name)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Weight</p>
                    <p className="font-bold text-primary">{shipment.weight_kg} kg</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Service</p>
                    <p className="font-bold text-primary">Express</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-24 px-4 md:px-6 bg-surface-container-lowest border-t border-outline-variant">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Need help with your delivery?</h2>
          <p className="text-on-surface-variant mb-10 max-w-xl mx-auto">Our dedicated customer support team is available 24/7 to assist you with any questions regarding your shipment status or delivery options.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Headset, title: 'Live Support', desc: 'Chat with our agents now' },
              { icon: Mail, title: 'Email Us', desc: 'support@wanzaexpress.com' },
              { icon: HelpCircle, title: 'Help Center', desc: 'Browse our FAQ portal' },
            ].map(item => (
              <div key={item.title} className="p-8 rounded-xl bg-surface-container border border-outline-variant hover:border-secondary transition-colors group cursor-pointer">
                <item.icon size={32} className="text-secondary mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-primary mb-2">{item.title}</h4>
                <p className="text-body-sm text-on-surface-variant">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="w-full py-12 px-4 md:px-6 flex flex-col md:flex-row justify-between items-center bg-surface-container-lowest border-t border-outline-variant">
        <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
          <span className="font-label-caps font-bold text-primary mb-2">WANZA EXPRESS</span>
          <p className="font-body-sm text-on-surface-variant max-w-xs text-center md:text-left">
            Precision logistics. Global reach. Trusting Wanza to deliver what matters most.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mb-8 md:mb-0">
          <a className="text-on-surface-variant hover:text-primary transition-colors font-body-sm" href="#">Privacy Policy</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-body-sm" href="#">Terms of Service</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors font-body-sm" href="#">Contact Support</a>
        </div>
        <p className="font-body-sm text-on-surface-variant">&copy; 2024 Wanza Express Logistics. All rights reserved.</p>
      </footer>
    </div>
  );
}
