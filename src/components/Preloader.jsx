import { AnimatePresence, motion } from 'framer-motion';
import { ease } from './motion';

export default function Preloader({ show, brand = 'filmsbyusama' }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-deep"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 1.1, ease }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease }}
            className="text-4xl text-ondeep sm:text-5xl"
          >
            {brand}
            <span className="text-accentdeep">.</span>
          </motion.p>
          <div className="mt-6 h-px w-40 overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-accentdeep"
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 1.1, ease }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
