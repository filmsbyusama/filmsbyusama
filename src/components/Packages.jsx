import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Plus } from 'lucide-react';
import { useState } from 'react';
import { Reveal, SectionHeading, TiltCard, ease, staggerChild, staggerParent } from './motion';

function Faq({ faqs }) {
  const [open, setOpen] = useState(0);
  if (!faqs?.length) return null;
  return (
    <div className="mt-28 grid gap-10 lg:grid-cols-12">
      <Reveal className="lg:col-span-4">
        <p className="eyebrow mb-4">Good to know</p>
        <h3 className="text-4xl leading-tight sm:text-5xl">Booking, delivery &amp; the details</h3>
      </Reveal>
      <div className="border-t border-line/10 lg:col-span-8">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="border-b border-line/10">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className={`text-2xl transition-colors duration-300 sm:text-[1.7rem] ${isOpen ? 'text-gold' : 'group-hover:text-gold'}`}>{f.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line/20"
                >
                  <Plus size={16} strokeWidth={1.4} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl pb-7 text-muted">{f.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Packages({ data = {}, onSelect }) {
  const items = data.items || [];
  return (
    <section id="packages" className="relative scroll-mt-20 bg-surface/60 py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeading index="04" eyebrow="Investment" title="Collections, made to measure">
          {data.note}
        </SectionHeading>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className={`grid gap-6 ${items.length >= 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'}`}
          style={{ perspective: 1400 }}
        >
          {items.map((p) => (
            <motion.div key={p.name} variants={staggerChild} className={p.featured ? 'lg:-my-6' : ''}>
              <TiltCard max={5} className="h-full">
                <article
                  className={`relative flex h-full flex-col p-8 transition-colors duration-700 sm:p-10 ${
                    p.featured
                      ? 'bg-[#0D0D0D] text-[#F0F0F0] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)] dark:bg-[#1A1813] dark:ring-1 dark:ring-gold/40'
                      : 'border border-line/10 bg-bg'
                  }`}
                >
                  {p.featured && (
                    <span className="absolute right-6 top-6 rounded-full bg-gold px-3 py-1 text-[0.58rem] uppercase tracking-[0.24em] text-[#0D0D0D]">
                      Most loved
                    </span>
                  )}
                  <p className={`text-[0.68rem] uppercase tracking-[0.3em] ${p.featured ? 'pr-24 text-[#E5C158]' : 'text-gold'}`}>{p.tagline}</p>
                  <h3 className="mt-4 text-5xl">{p.name}</h3>
                  <div className={`mt-6 flex items-baseline gap-2 border-b pb-8 ${p.featured ? 'border-white/10' : 'border-line/10'}`}>
                    <span className={`text-xs uppercase tracking-[0.2em] ${p.featured ? 'text-[#F0F0F0]/50' : 'text-muted'}`}>
                      from {data.currency}
                    </span>
                    <span className="text-4xl">{p.price}</span>
                  </div>
                  <ul className="mt-8 flex-1 space-y-3.5">
                    {(p.includes || []).map((inc, i) => (
                      <li key={i} className={`flex gap-3 ${p.featured ? 'text-[#F0F0F0]/80' : 'text-muted'}`}>
                        <Check size={15} strokeWidth={1.6} className={`mt-[0.35rem] shrink-0 ${p.featured ? 'text-[#E5C158]' : 'text-gold'}`} />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    onClick={() => onSelect?.(p.name)}
                    className={`btn mt-10 w-full ${
                      p.featured ? 'bg-[#E5C158] text-[#0D0D0D] hover:bg-[#F0F0F0]' : 'border border-ink/20 text-ink hover:border-gold hover:bg-gold hover:text-[#0D0D0D]'
                    }`}
                  >
                    Enquire about {p.name} <ArrowUpRight size={14} />
                  </a>
                </article>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

        <Faq faqs={data.faqs} />
      </div>
    </section>
  );
}
