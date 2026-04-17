import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Sparkles } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import RSVPForm from './RSVPForm';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex justify-center gap-6 py-4">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <span className="text-3xl font-serif italic text-pinterest-charcoal">{value}</span>
          <span className="text-[10px] uppercase tracking-widest text-gray-400">{unit}</span>
        </div>
      ))}
    </div>
  );
};

const SIDE_CONFIG = {
  hanna: {
    date: "April 27, 2026 12:00:00",
    displayDate: "Saturday, April 27, 2026",
    venue: "Swagath auditorium",
    location: "Karinkallathani",
    mapLink: "https://maps.app.goo.gl/qoSaHfnXno5AS8Et5",
    theme: "text-pinterest-gold",
    bg: "bg-pinterest-cream",
    accent: "bg-pinterest-sand"
  },
  rishad: {
    date: "April 30, 2026 12:00:00",
    displayDate: "Thursday, April 30, 2026",
    venue: "BONA DEA EVENT CENTRE",
    location: "Bona Dea",
    mapLink: "https://maps.app.goo.gl/wiHiaAMfJBgc5yuB7",
    theme: "text-gray-500",
    bg: "bg-slate-50",
    accent: "bg-slate-200"
  }
};

const Invitation = () => {
  const [searchParams] = useSearchParams();
  const sideParam = searchParams.get('side');
  
  const [selectedSide, setSelectedSide] = useState(() => {
    if (sideParam === 'hanna' || sideParam === 'rishad') return sideParam;
    return null;
  });
  const [showRSVP, setShowRSVP] = useState(false);

  const config = selectedSide ? SIDE_CONFIG[selectedSide] : null;

  return (
    <div className={`min-h-screen ${config?.bg || 'bg-pinterest-cream'} text-pinterest-charcoal flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-1000`}>
      <AnimatePresence>
        {!selectedSide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-md w-full space-y-12"
            >
              <div className="space-y-4">
                <Sparkles className="w-8 h-8 text-pinterest-gold mx-auto animate-pulse" />
                <h2 className="text-4xl font-serif italic">Welcome</h2>
                <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">Who are you joining?</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => setSelectedSide('hanna')}
                  className="group relative overflow-hidden py-8 px-6 rounded-[2rem] border border-gray-100 bg-white shadow-premium hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <span className="relative z-10 text-2xl font-serif italic text-pinterest-gold">Hanna's Side</span>
                  <div className="absolute inset-0 bg-pinterest-sand/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                </button>
                
                <button 
                  onClick={() => setSelectedSide('rishad')}
                  className="group relative overflow-hidden py-8 px-6 rounded-[2rem] border border-gray-100 bg-white shadow-premium hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <span className="relative z-10 text-2xl font-serif italic text-gray-500">Rishad's Side</span>
                  <div className="absolute inset-0 bg-slate-100 translate-y-full group-hover:translate-y-0 transition-transform" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedSide && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-lg w-full text-center space-y-6"
        >
          {/* Header */}
          <header className="space-y-4">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className={`flex justify-center ${config.theme} opacity-40`}
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">Bismillah-ir-Rahman-ir-Rahim</p>
            <p className="font-serif italic text-gray-500">With the blessings of Allah (SWT)</p>
          </header>

          <div className="space-y-2 overflow-hidden px-4">
            <h1 className="text-[35px] font-serif italic text-pinterest-charcoal whitespace-nowrap">
              Rishad & Hanna
            </h1>
            <p className={`text-lg ${config.theme} font-serif italic opacity-80`}>
              Are getting married
            </p>
          </div>

          {/* Countdown */}
          <CountdownTimer targetDate={config.date} />

          {/* Details Grid - Compact */}
          <div className="flex flex-col items-center gap-2 py-8 border-y border-pinterest-gold/5 max-w-sm mx-auto w-full">
            <div className="w-fit">
              <div className="flex items-center gap-4 group py-2">
                <div className={`w-10 h-10 rounded-full ${config.accent} flex items-center justify-center ${config.theme} shrink-0 group-hover:scale-110 transition-transform`}>
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">{config.displayDate}</p>
                  <p className="text-xs text-gray-400">12:00 PM onwards</p>
                </div>
              </div>

              <a 
                href={config.mapLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 group hover:bg-white/50 p-2 -m-2 rounded-2xl transition-all cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-full ${config.accent} flex items-center justify-center ${config.theme} shrink-0 group-hover:scale-110 transition-transform`}>
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">{config.venue}</p>
                  <p className="text-xs text-gray-400">{config.location}</p>
                </div>
              </a>
            </div>
          </div>

          {/* RSVP Section */}
          <div className="pt-4">
            {!showRSVP ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRSVP(true)}
                className="px-12 py-4 bg-pinterest-charcoal text-white rounded-full font-medium shadow-premium hover:bg-black transition-all"
              >
                Confirm Presence
              </motion.button>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="pinterest-card !p-8"
                >
                  <RSVPForm onCancel={() => setShowRSVP(false)} selectedSide={selectedSide} />
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Footer */}
          <footer className="pt-12 text-gray-300 text-[10px] tracking-widest uppercase">
            Nikah Invitation • 2026 {selectedSide === 'hanna' ? '(Bride Side)' : '(Groom Side)'}
          </footer>
        </motion.div>
      )}
    </div>
  );
};

export default Invitation;
