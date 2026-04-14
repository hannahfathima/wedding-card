import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Users, ClipboardList, Lock, LogOut, Search, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Admin = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('guests'); // 'guests', 'logs'
  const [errorLogs, setErrorLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'Nikah2026') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const q = query(collection(db, 'rsvp'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(`Admin Data Received: ${snapshot.docs.length} records`);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRsvps(data);
      setLoading(false);
    }, (err) => {
      console.error("Firestore Listen Error:", err);
      setError('Error fetching data. Check Firebase rules.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || activeTab !== 'logs') return;

    setLogsLoading(true);
    const q = query(collection(db, 'error_logs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setErrorLogs(data);
      setLogsLoading(false);
    }, (err) => {
      console.error("System logs fetch error:", err);
      setLogsLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated, activeTab]);

  const filteredRsvps = rsvps.filter(rsvp => 
    rsvp.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPeople = rsvps.reduce((sum, item) => sum + (item.attending ? (item.people || 0) : 0), 0);
  const totalResponses = rsvps.length;
  const totalAttending = rsvps.filter(r => r.attending).length;
  const totalRegrets = rsvps.length - totalAttending;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-pinterest-cream flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full pinterest-card"
        >
          <div className="flex justify-center mb-10">
            <div className="p-5 bg-gray-50 rounded-full">
              <Lock className="text-pinterest-gold w-8 h-8" />
            </div>
          </div>
          <h2 className="text-3xl font-serif text-center italic mb-8">Admin Portal</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <input
                type="password"
                className="input-field text-center"
                placeholder="Dashboard Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-xs mb-6 text-center animate-bounce">{error}</p>}
            <button type="submit" className="btn-primary w-full">Enter Dashboard</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pinterest-cream text-pinterest-charcoal p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif italic mb-2">Guest Overview</h1>
            <p className="text-gray-400 text-sm tracking-wide uppercase">Rishad & Hanna Wedding</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-white rounded-full p-1 shadow-sm border border-gray-100">
              <button 
                onClick={() => setActiveTab('guests')}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'guests' ? 'bg-pinterest-charcoal text-white' : 'text-gray-400 hover:text-pinterest-charcoal'
                }`}
              >
                Guests
              </button>
              <button 
                onClick={() => setActiveTab('logs')}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'logs' ? 'bg-pinterest-charcoal text-white' : 'text-gray-400 hover:text-pinterest-charcoal'
                }`}
              >
                Logs
              </button>
            </div>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-2 text-gray-400 hover:text-pinterest-charcoal transition-colors px-4 py-2 hover:bg-white rounded-full"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Log out</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div 
            whileHover={{ y: -4 }}
            className="pinterest-card flex items-center gap-4 !p-6"
          >
            <div className="p-3 bg-pinterest-sage/10 rounded-xl">
              <Users className="text-pinterest-sage w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Guests Coming</p>
              <h2 className="text-3xl font-serif italic">{loading ? '...' : totalPeople}</h2>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="pinterest-card flex items-center gap-4 !p-6"
          >
            <div className="p-3 bg-pinterest-gold/10 rounded-xl">
              <ClipboardList className="text-pinterest-gold w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Total Responses</p>
              <h2 className="text-3xl font-serif italic">{loading ? '...' : totalResponses}</h2>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="pinterest-card flex items-center gap-4 !p-6"
          >
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="text-green-500 w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Coming</p>
              <h2 className="text-3xl font-serif italic">{loading ? '...' : totalAttending}</h2>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="pinterest-card flex items-center gap-4 !p-6"
          >
            <div className="p-3 bg-gray-50 rounded-xl">
              <XCircle className="text-gray-400 w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Regrets</p>
              <h2 className="text-3xl font-serif italic">{loading ? '...' : totalRegrets}</h2>
            </div>
          </motion.div>
        </div>

        {activeTab === 'guests' ? (
          <>
            {/* Entries Control */}
            <div className="pinterest-card !p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                <input 
                  type="text"
                  placeholder="Search guests..."
                  className="bg-gray-50 border-none rounded-full pl-12 pr-6 py-3 w-full text-sm focus:ring-2 focus:ring-pinterest-gold/10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="ml-auto flex gap-2">
                <span className="text-xs text-gray-400 italic">Auto-refreshing live data</span>
              </div>
            </div>

            {/* Entries List */}
            <div className="pinterest-card !p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      <th className="px-8 py-5 text-left">Guest Name</th>
                      <th className="px-8 py-5 text-center">Status</th>
                      <th className="px-8 py-5 text-center">Group Size</th>
                      <th className="px-8 py-5 text-right">Time Received</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredRsvps.map((rsvp) => (
                      <tr key={rsvp.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <p className="font-serif text-lg">{rsvp.name}</p>
                          {rsvp.source && <p className="text-[8px] text-gray-300 uppercase tracking-tighter">{rsvp.source}</p>}
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            rsvp.attending 
                            ? 'bg-green-50 text-green-600 border-green-100' 
                            : 'bg-gray-50 text-gray-400 border-gray-100'
                          }`}>
                            {rsvp.attending ? 'Attending' : 'Regret'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="bg-pinterest-gold/5 text-pinterest-gold px-3 py-1 rounded-full text-sm font-bold border border-pinterest-gold/10">
                            {rsvp.attending ? rsvp.people : 0}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right text-sm text-gray-400 italic">
                          {rsvp.createdAt ? (
                            <>
                              {rsvp.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              <span className="mx-2 opacity-30">|</span>
                              {rsvp.createdAt.toDate().toLocaleDateString()}
                            </>
                          ) : (
                            <span className="text-gray-200 animate-pulse">Syncing...</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {!loading && filteredRsvps.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-8 py-20 text-center text-gray-400 italic font-serif">
                          No matching records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="pinterest-card !p-0 overflow-hidden bg-white border border-red-50">
              <div className="p-6 border-b border-gray-50">
                <h3 className="text-lg font-serif italic text-red-900 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Recent System Errors
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      <th className="px-8 py-5">Error Message</th>
                      <th className="px-8 py-5">Context</th>
                      <th className="px-8 py-5 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {errorLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-red-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <p className="text-red-700 font-medium text-sm mb-1">{log.message}</p>
                          <p className="text-[10px] text-gray-400 font-mono">Code: {log.code}</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-xs text-gray-500">{log.context?.component} • {log.context?.action}</p>
                          <p className="text-[10px] text-gray-400">Guest: {log.context?.guestName || 'Unknown'}</p>
                        </td>
                        <td className="px-8 py-6 text-right text-xs text-gray-400 italic">
                          {log.createdAt?.toDate().toLocaleString() || 'Syncing...'}
                        </td>
                      </tr>
                    ))}
                    {!logsLoading && errorLogs.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-8 py-20 text-center text-gray-400 italic font-serif">
                          No system errors recorded. Everything is running smoothly!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
