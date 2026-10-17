import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Loader2, Mail, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { WhatsAppIcon } from './BrandIcons';
import { Reveal, SplitWords, ease } from './motion';

const BUDGETS = ['Under 150k', '150k – 300k', '300k – 500k', '500k – 800k', '800k +', 'Not sure yet'];

const encode = (data) =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k] ?? '')}`)
    .join('&');

const waLink = (number, text) =>
  `https://wa.me/${String(number || '').replace(/\D/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export default function Contact({ settings = {}, packages = [], currency = 'PKR', selectedPackage = '' }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    dateEnd: '',
    venue: '',
    package: '',
    budget: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  useEffect(() => {
    if (selectedPackage) setForm((f) => ({ ...f, package: selectedPackage }));
  }, [selectedPackage]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const summary = [
    `Hi ${settings.studioName || 'filmsbyusama'}! I'd love to check availability.`,
    form.name && `Name: ${form.name}`,
    form.date && `Date: ${form.date}${form.dateEnd ? ` → ${form.dateEnd}` : ''}`,
    form.venue && `Venue: ${form.venue}`,
    form.package && `Package: ${form.package}`,
    form.budget && `Budget: ${currency} ${form.budget}`,
    form.message && `\n${form.message}`,
  ]
    .filter(Boolean)
    .join('\n');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      // Netlify Forms (free) — submissions appear in Netlify → Forms and can be emailed to you
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'inquiry', ...form }),
      });
      if (!res.ok) throw new Error(res.statusText);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden bg-deep py-28 text-ondeep md:py-40">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-accentdeep/10 blur-[120px]" aria-hidden />
      <div className="relative mx-auto grid max-w-[1400px] gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-20 lg:px-12">
        {/* Left: invitation + direct contact */}
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow mb-5 flex items-center gap-4 !text-accentdeep">
              <span className="text-ondeep/40">06</span>
              <span className="h-px w-10 bg-accentdeep/60" />
              Contact &amp; Booking
            </p>
          </Reveal>
          <h2 className="display text-[2.8rem] sm:text-6xl lg:text-7xl">
            <SplitWords text="Let's tell your story" />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-md text-ondeep/65">
              We take a limited number of weddings each season so every couple gets our full attention. Share a few details and we'll reply within 24 hours.
            </p>
          </Reveal>

          <Reveal delay={0.25} className="mt-12 space-y-4">
            {settings.whatsapp && (
              <a
                href={waLink(settings.whatsapp, summary)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border border-white/15 p-5 transition-colors duration-500 hover:border-accentdeep"
              >
                <span className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
                    <WhatsAppIcon width={20} height={20} />
                  </span>
                  <span>
                    <span className="block text-xl">Chat on WhatsApp</span>
                    <span className="block text-[0.65rem] uppercase tracking-[0.24em] text-ondeep/50">Fastest reply</span>
                  </span>
                </span>
                <ArrowUpRight size={18} className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accentdeep" />
              </a>
            )}
            {settings.email && (
              <a
                href={`mailto:${settings.email}?subject=${encodeURIComponent('Wedding inquiry')}&body=${encodeURIComponent(summary)}`}
                className="group flex items-center justify-between border border-white/15 p-5 transition-colors duration-500 hover:border-accentdeep"
              >
                <span className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accentdeep/15 text-accentdeep">
                    <Mail size={18} strokeWidth={1.5} />
                  </span>
                  <span>
                    <span className="block text-xl">{settings.email}</span>
                    <span className="block text-[0.65rem] uppercase tracking-[0.24em] text-ondeep/50">Email us</span>
                  </span>
                </span>
                <ArrowUpRight size={18} className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accentdeep" />
              </a>
            )}
            {settings.location && (
              <p className="flex items-center gap-3 pt-4 text-sm text-ondeep/55">
                <MapPin size={15} strokeWidth={1.4} className="text-accentdeep" /> {settings.location}
              </p>
            )}
          </Reveal>
        </div>

        {/* Right: inquiry form */}
        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="relative rounded-sm border border-white/10 bg-white/[0.03] p-6 [color-scheme:dark] backdrop-blur-xl sm:p-10 [&_.field]:border-white/20 [&_.field]:text-ondeep [&_.field]:placeholder:text-ondeep/35 [&_.field-label]:text-ondeep/50 [&_option]:bg-deep">
            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <span className="text-6xl italic text-accentdeep">Thank you.</span>
                  <p className="mt-5 max-w-sm text-ondeep/65">
                    Your inquiry is with us. We'll be in touch within 24 hours — or continue on WhatsApp for a quicker reply.
                  </p>
                  {settings.whatsapp && (
                    <a href={waLink(settings.whatsapp, summary)} target="_blank" rel="noopener noreferrer" className="btn mt-8 bg-accentdeep text-deep hover:bg-ondeep">
                      Continue on WhatsApp
                    </a>
                  )}
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  name="inquiry"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  onSubmit={submit}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid gap-x-8 gap-y-7 sm:grid-cols-2"
                >
                  <input type="hidden" name="form-name" value="inquiry" />
                  <p className="hidden">
                    <label>
                      Don't fill this out: <input name="bot-field" />
                    </label>
                  </p>

                  <label className="sm:col-span-2">
                    <span className="field-label">Your names</span>
                    <input required name="name" value={form.name} onChange={set('name')} className="field" placeholder="Ayesha & Hamza" autoComplete="name" />
                  </label>
                  <label>
                    <span className="field-label">Email</span>
                    <input required type="email" name="email" value={form.email} onChange={set('email')} className="field" placeholder="you@email.com" autoComplete="email" />
                  </label>
                  <label>
                    <span className="field-label">Phone / WhatsApp</span>
                    <input type="tel" name="phone" value={form.phone} onChange={set('phone')} className="field" placeholder="+92 300 0000000" autoComplete="tel" />
                  </label>
                  <label>
                    <span className="field-label">First event date</span>
                    <input required type="date" name="date" value={form.date} onChange={set('date')} className="field" />
                  </label>
                  <label>
                    <span className="field-label">Last event date (optional)</span>
                    <input type="date" name="dateEnd" value={form.dateEnd} min={form.date || undefined} onChange={set('dateEnd')} className="field" />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="field-label">Venue / city</span>
                    <input name="venue" value={form.venue} onChange={set('venue')} className="field" placeholder="Pearl Continental, Rawalpindi" />
                  </label>
                  <label>
                    <span className="field-label">Package</span>
                    <select name="package" value={form.package} onChange={set('package')} className="field">
                      <option value="">Not sure yet</option>
                      {packages.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                      <option value="Custom">Something custom</option>
                    </select>
                  </label>
                  <label>
                    <span className="field-label">Budget ({currency})</span>
                    <select required name="budget" value={form.budget} onChange={set('budget')} className="field">
                      <option value="" disabled>
                        Select a range
                      </option>
                      {BUDGETS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="sm:col-span-2">
                    <span className="field-label">Tell us about your day</span>
                    <textarea name="message" rows={4} value={form.message} onChange={set('message')} className="field resize-none" placeholder="Events, guest count, the moments that matter most to you…" />
                  </label>

                  <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <button type="submit" disabled={status === 'sending'} className="btn bg-accentdeep text-deep hover:bg-ondeep disabled:opacity-60">
                      {status === 'sending' ? <Loader2 size={14} className="animate-spin" /> : null}
                      {status === 'sending' ? 'Sending' : 'Send inquiry'}
                    </button>
                    {status === 'error' && (
                      <p className="text-sm text-ondeep/70">
                        Couldn't send just now —{' '}
                        <a className="text-accentdeep underline underline-offset-4" href={waLink(settings.whatsapp, summary)} target="_blank" rel="noopener noreferrer">
                          send it on WhatsApp
                        </a>{' '}
                        instead.
                      </p>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
