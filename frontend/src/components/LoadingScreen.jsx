import { motion } from 'framer-motion';
import { Sun, Zap, Battery } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-grid-pattern">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Animated icons */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          >
            <Sun className="w-12 h-12 text-solar-400" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          >
            <Zap className="w-12 h-12 text-grid-400" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          >
            <Battery className="w-12 h-12 text-battery-400" />
          </motion.div>
        </div>

        {/* Loading text */}
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl font-bold text-white mb-4"
        >
          Loading Energy Data
        </motion.h2>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-solar-400 via-energy-400 to-battery-400 rounded-full"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: '50%' }}
          />
        </div>

        <p className="text-gray-500 mt-4 text-sm">Connecting to GivEnergy API...</p>
      </motion.div>
    </div>
  );
}
