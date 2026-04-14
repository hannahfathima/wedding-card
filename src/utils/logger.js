import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Logs an error to Firestore for admin review
 * @param {Error} error The error object
 * @param {Object} context Additional context (e.g. { component: 'RSVPForm', userName: '...' })
 */
export const logError = async (error, context = {}) => {
  try {
    const logData = {
      message: error.message || 'Unknown error',
      code: error.code || 'N/A',
      stack: error.stack || 'No stack trace',
      context: {
        ...context,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      },
      severity: 'error',
      createdAt: serverTimestamp()
    };

    console.error('Logging backend error to Firestore:', logData);
    await addDoc(collection(db, 'error_logs'), logData);
  } catch (loggingErr) {
    // If logging itself fails, we just log to console to avoid infinite loops
    console.error('Failed to log error to Firestore:', loggingErr);
  }
};
