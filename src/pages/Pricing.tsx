import { Package, Truck, Zap, Building2, CheckCircle } from 'lucide-react';

const PRICING_TIERS = [
  { range: '0 – 1 kg', price: 120, description: 'Documents, letters, small items' },
  { range: '1 – 2 kg', price: 200, description: 'Small parcels, books, gifts' },
  { range: '2 – 4 kg', price: 250, description: 'Medium boxes, electronics' },
  { range: '4 – 5 kg', price: 300, description: 'Clothing, tools, equipment' },
  { range: '5 – 7 kg', price: 400, description: 'Larger parcels, bulk items' },
  { range: '7+ kg', price: 500, description: 'Heavy cargo, contact for custom rates' },
];

const SERVICES = [
  { icon: Zap, name: 'Express Delivery', desc: '1–2 business days', badge: 'Fastest', badgeColor: 'bg-secondary text-on-primary' },
  { icon: Truck, name: 'Standard Delivery', desc: '3–5 business days', badge: 'Popular', badgeColor: 'bg-primary text-on-primary' },
  { icon: Building2, name: 'Branch Pickup', desc: 'Collect at destination branch', badge: 'Free', badgeColor: 'bg-green-600 text-white' },
];

const PAYMENT_OPTIONS = [
  { method: 'TeleBirr', detail: '+251 911 000 000' },
  { method: 'CBE Birr', detail: '1000123456789' },
  { method: 'Awash Bank', detail: 'Wanza Express PLC' },
  { method: 'Cash at Branch', detail: 'All Wanza branch offices' },
];

export function Pricing() {
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Pricing & Rates</h2>
          <p className="text-on-surface-variant font-body-md">Transparent weight-based shipping rates across the Wanza Express network.</p>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                <Package size={18} className="text-primary-fixed" />
              </div>
              <div>
                <h3 className="font-title-md text-primary">Weight-Based Rates</h3>
                <p className="text-body-sm text-on-surface-variant">All prices in Ethiopian Birr (ETB)</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Weight Range</th>
                    <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Base Price (ETB)</th>
                    <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Package Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {PRICING_TIERS.map((tier, i) => (
                    <tr key={tier.range} className={`hover:bg-surface-container transition-colors ${i === 0 ? '' : ''}`}>
                      <td className="px-6 py-4">
                        <span className="font-bold text-primary font-table-data">{tier.range}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-secondary text-title-md">ETB {tier.price}</span>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant font-body-sm">{tier.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-surface-container border-t border-outline-variant">
              <p className="text-body-sm text-on-surface-variant flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600 shrink-0" />
                All rates include standard packaging, tracking, and door-to-branch delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Service Tiers */}
        <div className="flex flex-col gap-4">
          <h3 className="font-title-md text-primary">Service Options</h3>
          {SERVICES.map(svc => (
            <div key={svc.name} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 hover:border-primary transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                  <svc.icon size={18} className="text-primary-fixed" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${svc.badgeColor}`}>{svc.badge}</span>
              </div>
              <h4 className="font-bold text-primary mb-1">{svc.name}</h4>
              <p className="text-body-sm text-on-surface-variant">{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 mb-8">
        <h3 className="font-title-md text-primary mb-1">Payment Methods</h3>
        <p className="text-body-sm text-on-surface-variant mb-6">Pay the shipping cost via any of the following methods before dispatch.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PAYMENT_OPTIONS.map(opt => (
            <div key={opt.method} className="p-4 bg-surface-container rounded-xl border border-outline-variant">
              <p className="font-bold text-primary mb-1">{opt.method}</p>
              <p className="text-body-sm text-on-surface-variant font-medium">{opt.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-secondary-container/10 border border-secondary-container/30 rounded-xl p-6">
          <h4 className="font-bold text-primary mb-3">How pricing works</h4>
          <ul className="space-y-2 text-body-sm text-on-surface-variant">
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-secondary mt-0.5 shrink-0" /> Prices are based on actual package weight at time of dispatch.</li>
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-secondary mt-0.5 shrink-0" /> Volumetric weight may apply for oversized packages.</li>
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-secondary mt-0.5 shrink-0" /> Payment can be made by sender or receiver (configured at time of booking).</li>
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-secondary mt-0.5 shrink-0" /> Bulk discounts available for businesses — contact HQ for details.</li>
          </ul>
        </div>
        <div className="bg-primary-container/10 border border-primary/20 rounded-xl p-6">
          <h4 className="font-bold text-primary mb-3">Need a custom quote?</h4>
          <p className="text-body-sm text-on-surface-variant mb-4">
            For cargo exceeding 7 kg, fragile items, or high-volume business accounts, contact our operations team for a personalized rate.
          </p>
          <div className="space-y-2 text-body-sm">
            <p className="text-primary font-bold">📞 +251 11 000 0001</p>
            <p className="text-primary font-bold">✉ ops@wanzaexpress.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
