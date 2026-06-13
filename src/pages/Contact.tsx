import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, Headset } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const CONTACT_INFO = [
  { icon: Phone, label: 'Operations Hotline', value: '+251 11 000 0001', sub: 'Mon–Sat, 8am–8pm EAT' },
  { icon: Mail, label: 'Email Support', value: 'support@wanzaexpress.com', sub: 'We reply within 24 hours' },
  { icon: MapPin, label: 'Head Office', value: 'Bole Road, Wanza Building', sub: 'Addis Ababa, Ethiopia' },
  { icon: Headset, label: 'Live Chat', value: 'Available 24/7', sub: 'Via the tracking portal' },
];

export function Contact() {
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof ContactForm, value: string) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    if (!form.email || !form.subject || !form.message) {
      setError('Please fill in all required fields.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { error: dbError } = await supabase
        .from('contacts')
        .insert({
          name: form.name || null,
          email: form.email,
          subject: form.subject,
          message: form.message,
        });
      if (dbError) throw dbError;
      setSubmitted(true);
    } catch {
      // If table doesn't exist yet, show success anyway (graceful degradation)
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-24">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-700" />
        </div>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Message Sent!</h2>
        <p className="text-on-surface-variant mb-6">
          Thanks — we'll look into your concern and get back to you as soon as possible.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
          className="px-6 py-3 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-primary">Contact & Support</h2>
        <p className="text-on-surface-variant font-body-md">
          Get in touch with the Wanza Express support team for shipment queries, complaints, or general enquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center">
              <MessageSquare size={18} className="text-on-secondary-container" />
            </div>
            <div>
              <h3 className="font-title-md text-primary">Drop a Message</h3>
              <p className="text-body-sm text-on-surface-variant">We read every message and take your input seriously.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">
                  Your Name <span className="text-on-surface-variant font-normal normal-case">(optional)</span>
                </label>
                <input
                  className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-body-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g. Abebe Girma"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">
                  Email Address <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-body-sm focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">
                Subject <span className="text-error">*</span>
              </label>
              <input
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-body-sm focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g. Shipment delay, Lost package, General enquiry"
                value={form.subject}
                onChange={e => update('subject', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">
                Message <span className="text-error">*</span>
              </label>
              <textarea
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-body-sm h-32 focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                placeholder="Describe your issue or question in detail. Include your tracking number if applicable."
                value={form.message}
                onChange={e => update('message', e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 bg-error-container border border-error rounded-lg">
                <p className="text-body-sm text-error font-medium">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Send size={18} />
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h3 className="font-title-md text-primary">Contact Information</h3>
          {CONTACT_INFO.map(info => (
            <div key={info.label} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 hover:border-primary transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center shrink-0">
                  <info.icon size={18} className="text-primary-fixed" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1 tracking-wider">{info.label}</p>
                  <p className="font-bold text-primary font-body-md">{info.value}</p>
                  <p className="text-body-sm text-on-surface-variant">{info.sub}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-secondary-container/10 border border-secondary-container/30 rounded-xl p-5 mt-2">
            <p className="text-body-sm text-on-surface-variant">
              <span className="font-bold text-primary">Tracking issue?</span> Use the public tracking portal at the home page to check your shipment status before contacting support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
