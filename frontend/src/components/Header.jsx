import { motion } from 'framer-motion';
import { Sun, RefreshCw, Wifi, WifiOff } from 'lucide-react';

export function Header({ lastUpdated, onRefresh, isLoading, isConnected }) {
  return (
    <header className="glass sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-solar-400 to-solar-600 flex items-center justify-center"
                style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.4)' }}
              >
                <Sun className="w-6 h-6 text-white" />
              </motion.div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">GivEnergy</h1>
              <p className="text-xs text-gray-400">Dashboard</p>
            </div>
          </motion.div>

          {/* Status & Actions */}
          <div className="flex items-center gap-4">
            {/* Connection status */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
              isConnected ? 'bg-energy-500/20 text-energy-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4" />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  <span>Offline</span>
                </>
              )}
            </div>

            {/* Last updated */}
            {lastUpdated && (
              <div className="hidden sm:block text-sm text-gray-400">
                Updated: {lastUpdated.toLocaleTimeString('en-GB')}
              </div>
            )}

            {/* Refresh button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
