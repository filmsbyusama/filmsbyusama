import { motion } from 'framer-motion';
import { Expand } from 'lucide-react';
import { useState } from 'react';
import Lightbox from './Lightbox';
import { SectionHeading, SmartImage, TiltCard, ease } from './motion';

export default function Photography({ photos = [] }) {
  const [index, setIndex] = useState(null);

  return (
    <section id="photography" className="relative scroll-mt-20 bg-surface/60 py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeading index="02" eyebrow="Photography" title="Light, honestly kept">
          Editorial portraits and unposed candids — the textures, glances and in-between seconds that make your day yours.
        </SectionHeading>

        {photos.length === 0 ? (
          <p className="py-20 text-center text-muted">Photos will appear here once they're added in the admin panel.</p>
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 lg:gap-6">
            {photos.map((p, i) => (
              <motion.div
                key={`${p.image}-${i}`}
                initial={{ opacity: 0, y: 70, rotateX: 16, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 1.1, ease, delay: (i % 3) * 0.12 }}
                style={{ transformPerspective: 1200 }}
                className="mb-5 break-inside-avoid lg:mb-6"
              >
                <TiltCard max={6}>
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    className="group relative block w-full overflow-hidden bg-bg"
                    aria-label={`Open photo${p.caption ? `: ${p.caption}` : ''}`}
                  >
                    <SmartImage
                      src={p.image}
                      alt={p.caption || `Wedding photograph ${i + 1}`}
                      label={p.couple}
                      className={`w-full object-cover transition-transform duration-[1.6s] ease-cinematic group-hover:scale-105 ${
                        i % 4 === 1 ? 'aspect-[4/5]' : i % 4 === 2 ? 'aspect-[3/4]' : 'aspect-auto min-h-[200px]'
                      }`}
                    />
                    <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/70 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                      <div className="translate-y-3 text-left text-ondeep transition-transform duration-700 group-hover:translate-y-0">
                        {p.caption && <p className="text-xl leading-tight">{p.caption}</p>}
                        {p.couple && <p className="text-[0.62rem] uppercase tracking-[0.3em] text-accentdeep">{p.couple}</p>}
                      </div>
                      <Expand size={16} strokeWidth={1.4} className="text-ondeep" />
                    </div>
                  </button>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Lightbox photos={photos} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
    </section>
  );
}
