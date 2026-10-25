import { motion } from 'framer-motion';
import { Reveal, ease } from './motion';

// Shown if Site Settings → "What we cover" is empty
const DEFAULT_SERVICES = [
  { title: 'Nikkah', text: 'The vows, the quiet prayers and the first look.' },
  { title: 'Mehndi', text: 'Colour, dholki and the songs everyone knows.' },
  { title: 'Baraat', text: 'The arrival, the music, the grand entrance.' },
  { title: 'Walima', text: 'An elegant evening to celebrate as one.' },
  { title: 'Destination', text: 'From Hunza to abroad, we travel with you.' },
  { title: 'Pre-wedding', text: 'Engagements and portraits before the big day.' },
];

// A calm, editorial "what we cover" band that replaces the old scrolling strip.
// Responsive: 2 columns on phones, 3 on tablets, 6 on large screens.
export default function Services({ settings = {} }) {
  const items = Array.isArray(settings.services) && settings.services.length ? settings.services : DEFAULT_SERVICES;
  const heading = settings.servicesTitle || 'Every chapter, beautifully told';

  return (
    <section aria-labelledby="services-heading" className="relative border-b border-line/10 bg-bg">
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="eyebrow mb-4 flex items-center gap-4">
              <span className="h-px w-10 bg-accent/60" />
              What we cover
            </p>
            <h2 id="services-heading" className="display text-[2rem] sm:text-4xl lg:text-5xl">
              {heading}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href="#packages"
              className="group inline-flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.26em] text-muted transition-colors hover:text-accent"
            >
              See collections
              <span className="h-px w-8 bg-current transition-all duration-500 group-hover:w-12" />
            </a>
          </Reveal>
        </div>

        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-2 gap-px overflow-hidden border-y border-line/10 bg-line/10 sm:grid-cols-3 xl:grid-cols-6"
        >
          {items.map((s, i) => (
            <motion.li
              key={`${s.title}-${i}`}
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }}
              className="group relative bg-bg px-4 py-7 sm:px-6 sm:py-9"
            >
              <span className="block text-xs tabular-nums tracking-[0.2em] text-accent">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 text-2xl leading-tight text-ink sm:text-[1.7rem]">{s.title}</h3>
              {s.text && <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>}
              <span className="absolute left-0 top-0 h-px w-0 bg-accent transition-all duration-700 group-hover:w-full" aria-hidden />
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
