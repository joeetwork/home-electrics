import { motion } from 'framer-motion';
import { Sun, Sunrise, TrendingUp } from 'lucide-react';

export function SolarPanel({ power, todayGeneration, isGenerating }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-6 relative overflow-hidden glow-solar"
    >
      {/* Animated sun rays background */}
      {isGenerating && (
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-32 bg-gradient-to-b from-solar-400/30 to-transparent origin-bottom"
              style={{ transform: `rotate(${i * 30}deg)` }}
            />
          ))}
        </motion.div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sun className="w-5 h-5 text-solar-400" />
            Solar Generation
          </h3>
          {isGenerating && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-solar-500/20 text-solar-400 text-sm"
            >
              <Sun className="w-3 h-3" />
              Generating
            </motion.div>
          )}
        </div>

        {/* Main power display */}
        <div className="text-center py-8">
          <motion.div
            animate={isGenerating ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sun
              className={`w-20 h-20 mx-auto mb-4 ${isGenerating ? 'text-solar-400' : 'text-gray-600'}`}
              style={isGenerating ? { filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.5))' } : {}}
            />
          </motion.div>
          <motion.div
            key={power}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl font-bold text-white tabular-nums"
          >
            {power.toFixed(2)}
            <span className="text-2xl text-gray-400 ml-2">kW</span>
          </motion.div>
          <p className="text-gray-500 mt-2">Current Output</p>
        </div>

        {/* Today's stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-700/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-solar-400 mb-1">
              <Sunrise className="w-4 h-4" />
              <span className="text-sm">Today</span>
            </div>
            <p className="text-2xl font-bold text-white tabular-nums">
              {todayGeneration.toFixed(1)} <span className="text-sm text-gray-400">kWh</span>
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-energy-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Peak</span>
            </div>
            <p className="text-2xl font-bold text-white tabular-nums">
              {(power * 1.2).toFixed(1)} <span className="text-sm text-gray-400">kW</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
