import { motion, useScroll, useSpring } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import About from './components/About';
import Contact from './components/Contact';
import Films from './components/Films';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Services from './components/Services';
import Navbar from './components/Navbar';
import Packages from './components/Packages';
import Photography from './components/Photography';
import Preloader from './components/Preloader';
import Testimonials from './components/Testimonials';
import VideoModal from './components/VideoModal';
import { useContent } from './lib/content';
import { useTheme } from './lib/theme';

export default function App() {
  const { theme, toggle } = useTheme();
  const content = useContent();
  const { settings, films, photos, packages, testimonials, ready } = content;

  const [video, setVideo] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [minTimeDone, setMinTimeDone] = useState(false);

  // Keep the intro on screen briefly so it reads as intentional, not a flash
  useEffect(() => {
    const t = setTimeout(() => setMinTimeDone(true), 1300);
    return () => clearTimeout(t);
  }, []);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  const filmItems = films.items || [];
  const playReel = useCallback(() => {
    if (settings.heroYoutube) {
      setVideo({ title: 'Showreel', couple: settings.studioName, youtube: settings.heroYoutube });
    } else {
      const pick = filmItems.find((f) => f.featured) || filmItems[0];
      if (pick) setVideo(pick);
      else document.getElementById('films')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [settings, filmItems]);

  const closeVideo = useCallback(() => setVideo(null), []);
  const brand = settings.studioName || 'filmsbyusama';

  return (
    <>
      <Preloader show={!(ready && minTimeDone)} brand={brand} />

      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent" aria-hidden />

      <Navbar theme={theme} toggle={toggle} brand={brand} ready={ready && minTimeDone} />

      {/* Sections mount once content has loaded, so the hero animation plays as the intro lifts */}
      {ready && minTimeDone && (
      <main>
        <Hero settings={settings} onPlayReel={playReel} />
        <Services settings={settings} />
        <Films films={filmItems} onPlay={setVideo} />
        <Photography photos={photos.items || []} />
        <About settings={settings} />
        <Packages data={packages} onSelect={setSelectedPackage} />
        <Testimonials items={testimonials.items || []} />
        <Contact
          settings={settings}
          packages={packages.items || []}
          currency={packages.currency || 'PKR'}
          selectedPackage={selectedPackage}
        />
      </main>
      )}

      {ready && minTimeDone && <Footer settings={settings} />}

      <VideoModal video={video} onClose={closeVideo} />
    </>
  );
}
