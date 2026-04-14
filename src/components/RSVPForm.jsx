import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import confetti from 'canvas-confetti';
import { CheckCircle, XCircle, Loader2, Plus, Minus, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { logError } from '../utils/logger';

const RSVPForm = ({ onCancel }) => {
  const [name, setName] = useState('');
  const [attending, setAttending] = useState(null); // null, true, false
  const [people, setPeople] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    
    const rsvpData = {
      name: name.trim() || 'Anonymous Guest',
      attending: attending,
      people: attending ? parseInt(people) : 0,
      createdAt: serverTimestamp(),
      source: 'web_invitation'
    };

    console.log('Attempting to submit RSVP:', rsvpData);

    try {
      const docRef = await addDoc(collection(db, 'rsvp'), rsvpData);
      console.log('RSVP submitted successfully with ID:', docRef.id);

      setSubmitted(true);
      if (attending) {
        console.log('Attending: true - Triggering celebration');
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#B8860B', '#D4AF37'] });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#B8860B', '#D4AF37'] });
        }, 250);
      }
    } catch (err) {
      console.error("CRITICAL ERROR adding RSVP to Firestore:", err);
      
      // Log to backend collection
      await logError(err, { 
        component: 'RSVPForm', 
        action: 'submitRSVP', 
        guestName: name.trim() 
      });

      setError(`Submission failed: ${err.message || 'Connection issue'}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="flex justify-center mb-6">
          {attending ? (
            <div className="bg-green-50 p-4 rounded-full shadow-inner">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-full shadow-inner">
              <Heart className="w-12 h-12 text-gray-300" />
            </div>
          )}
        </div>
        <h2 className="text-3xl font-serif italic mb-2">
          {attending ? 'JazakAllah Khair' : 'Thank You'}
        </h2>
        <p className="text-gray-500 font-serif italic">
          {attending 
            ? 'We are excited to see you there!' 
            : 'We will miss you, but thank you for letting us know.'}
        </p>
        <button onClick={onCancel} className="mt-8 text-xs uppercase tracking-widest text-gray-400 hover:text-pinterest-charcoal transition-colors">Close</button>
      </motion.div>
    );
  }

  const handleAttendingChoice = (isComing) => {
    setAttending(isComing);
    if (isComing) {
      confetti({
        particleCount: 40,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#B8860B', '#D4AF37']
      });
    }
  };

  return (
    <div className="space-y-8 min-h-[300px] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {attending === null ? (
          <motion.div 
            key="choice"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="font-serif italic text-2xl text-pinterest-charcoal">Will you join us?</h3>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Please enter your name</p>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="input-field"
                required
              />
            </div>

            <div className="flex flex-col gap-4">
              <button
                disabled={!name.trim()}
                onClick={() => handleAttendingChoice(true)}
                className="w-full py-5 rounded-2xl bg-pinterest-charcoal text-white font-semibold shadow-premium hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                I am coming
              </button>
              <button
                disabled={!name.trim()}
                onClick={() => setAttending(false)}
                className="w-full py-5 rounded-2xl bg-white border border-gray-200 text-gray-500 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle className="w-5 h-5" />
                Sorry, I am not coming
              </button>
            </div>
            <button onClick={onCancel} className="text-xs uppercase tracking-widest text-gray-300 hover:text-pinterest-charcoal transition-colors">Go Back</button>
          </motion.div>
        ) : attending === true ? (
          <motion.div 
            key="coming"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400">Number of Guests</p>
              <div className="flex items-center justify-center gap-8">
                <button 
                  onClick={() => setPeople(Math.max(1, people - 1))}
                  className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-pinterest-charcoal hover:border-pinterest-charcoal transition-all"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-5xl font-serif italic w-12">{people}</span>
                <button 
                  onClick={() => setPeople(Math.min(10, people + 1))}
                  className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-pinterest-charcoal hover:border-pinterest-charcoal transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="w-full py-5 rounded-2xl bg-pinterest-charcoal text-white font-semibold shadow-premium hover:bg-black transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5 fill-current" />}
                Confirm Presence
              </button>
              <button onClick={() => setAttending(null)} className="text-xs uppercase tracking-widest text-gray-300 hover:text-pinterest-charcoal transition-colors">Back to choice</button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="not-coming"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="py-8">
              <p className="font-serif italic text-xl text-gray-400">We'll miss you at the ceremony.</p>
            </div>
            <div className="flex flex-col gap-4">
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="w-full py-5 rounded-2xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm regrets'}
              </button>
              <button onClick={() => setAttending(null)} className="text-xs uppercase tracking-widest text-gray-300 hover:text-pinterest-charcoal transition-colors">Back to choice</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-red-500 text-sm mt-4">{error}</p>
      )}
    </div>
  );
};

export default RSVPForm;
