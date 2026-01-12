import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export function ErrorScreen({ error, onRetry }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-grid-pattern">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md mx-auto px-4"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/20 flex items-center justify-center"
        >
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-4">Connection Error</h2>
        <p className="text-gray-400 mb-6">{error || 'Unable to connect to the GivEnergy API. Please check your connection and try again.'}</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-solar-500 to-energy-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <RefreshCw className="w-5 h-5" />
          Retry Connection
        </motion.button>

        <div className="mt-8 p-4 bg-gray-800/50 rounded-xl text-left">
          <p className="text-sm text-gray-400 mb-2">Troubleshooting tips:</p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Check that the backend server is running</li>
            <li>• Verify your AUTH_TOKEN in .env is valid</li>
            <li>• Ensure you have an active internet connection</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
