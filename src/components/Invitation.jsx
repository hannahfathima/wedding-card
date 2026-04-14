import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Sparkles } from 'lucide-react';
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

const Invitation = () => {
  const [showRSVP, setShowRSVP] = useState(false);

  return (
    <div className="min-h-screen bg-pinterest-cream text-pinterest-charcoal flex flex-col items-center justify-center p-4 md:p-8">
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
            className="flex justify-center text-pinterest-gold/40"
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">Bismillah-ir-Rahman-ir-Rahim</p>
          <p className="font-serif italic text-gray-500">With the blessings of Allah (SWT)</p>
        </header>

        {/* Names */}
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-serif italic text-pinterest-charcoal">
            Rishad & Hanna
          </h1>
          <p className="text-lg text-pinterest-gold font-serif italic opacity-80">
            Are getting married
          </p>
        </div>

        {/* Countdown */}
        <CountdownTimer targetDate="April 27, 2026 12:00:00" />

        {/* Details Grid - Compact */}
        <div className="flex flex-col items-center gap-4 py-8 border-y border-pinterest-gold/5 max-w-sm mx-auto w-full">
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full bg-pinterest-sand flex items-center justify-center text-pinterest-gold shrink-0 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Saturday, April 27, 2026</p>
              <p className="text-xs text-gray-400">12:00 PM onwards</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full bg-pinterest-sand flex items-center justify-center text-pinterest-gold shrink-0 group-hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Swagath auditorium</p>
              <p className="text-xs text-gray-400">Karinkallathani</p>
            </div>
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
                <RSVPForm onCancel={() => setShowRSVP(false)} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <footer className="pt-12 text-gray-300 text-[10px] tracking-widest uppercase">
          Nikah Invitation • 2026
        </footer>
      </motion.div>
    </div>
  );
};

export default Invitation;
