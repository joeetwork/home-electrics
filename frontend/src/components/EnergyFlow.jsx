import { motion } from 'framer-motion';
import { Sun, Battery, Home, Zap, ArrowRight, ArrowDown, ArrowUp } from 'lucide-react';

export function EnergyFlow({ solar, battery, grid, consumption }) {
  const isExporting = grid.power < 0;
  const isImporting = grid.power > 0;
  const isCharging = battery.power > 0;
  const isDischarging = battery.power < 0;
  const isSolarActive = solar.power > 0;

  const FlowLine = ({ active, direction, color }) => (
    <div className={`relative h-1 w-full rounded-full overflow-hidden ${active ? 'bg-gray-700' : 'bg-gray-800'}`}>
      {active && (
        <motion.div
          className="absolute inset-y-0 w-8 rounded-full"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
          animate={{ x: direction === 'right' ? ['-100%', '400%'] : ['400%', '-100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass rounded-2xl p-8"
    >
      <h3 className="text-lg font-semibold text-white mb-8 text-center">Live Energy Flow</h3>

      <div className="grid grid-cols-3 gap-8 items-center">
        {/* Solar */}
        <motion.div
          animate={isSolarActive ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center ${
            isSolarActive ? 'bg-solar-500/20 glow-solar' : 'bg-gray-800/50'
          }`}>
            <Sun className={`w-10 h-10 ${isSolarActive ? 'text-solar-400' : 'text-gray-600'}`} />
          </div>
          <p className="mt-3 text-sm text-gray-400">Solar</p>
          <p className={`text-2xl font-bold tabular-nums ${isSolarActive ? 'text-solar-400' : 'text-gray-600'}`}>
            {solar.power.toFixed(1)} kW
          </p>
        </motion.div>

        {/* Center - House with flows */}
        <div className="relative">
          {/* Flow to/from solar (top) */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-1 h-10">
            {isSolarActive && (
              <motion.div
                className="w-full h-2 bg-solar-400 rounded-full"
                animate={{ y: ['-100%', '400%'], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)' }}
              />
            )}
          </div>

          {/* Flow to/from battery (left) */}
          <div className="absolute top-1/2 -left-12 -translate-y-1/2 w-10 h-1">
            {(isCharging || isDischarging) && (
              <motion.div
                className={`h-full w-2 rounded-full ${isCharging ? 'bg-energy-400' : 'bg-battery-400'}`}
                animate={{
                  x: isCharging ? ['400%', '-100%'] : ['-100%', '400%'],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ boxShadow: `0 0 10px ${isCharging ? 'rgba(16, 185, 129, 0.5)' : 'rgba(59, 130, 246, 0.5)'}` }}
              />
            )}
          </div>

          {/* Flow to/from grid (right) */}
          <div className="absolute top-1/2 -right-12 -translate-y-1/2 w-10 h-1">
            {(isImporting || isExporting) && (
              <motion.div
                className={`h-full w-2 rounded-full ${isExporting ? 'bg-energy-400' : 'bg-grid-400'}`}
                animate={{
                  x: isExporting ? ['-100%', '400%'] : ['400%', '-100%'],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ boxShadow: `0 0 10px ${isExporting ? 'rgba(16, 185, 129, 0.5)' : 'rgba(168, 85, 247, 0.5)'}` }}
              />
            )}
          </div>

          {/* House icon */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-24 h-24 mx-auto rounded-2xl bg-energy-500/20 flex items-center justify-center glow-energy"
          >
            <Home className="w-12 h-12 text-energy-400" />
          </motion.div>
          <p className="mt-3 text-sm text-gray-400 text-center">Home</p>
          <p className="text-2xl font-bold text-energy-400 text-center tabular-nums">
            {consumption.power.toFixed(1)} kW
          </p>
        </div>

        {/* Grid */}
        <div className="text-center">
          <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center ${
            isImporting || isExporting ? 'bg-grid-500/20 glow-grid' : 'bg-gray-800/50'
          }`}>
            <Zap className={`w-10 h-10 ${isImporting || isExporting ? 'text-grid-400' : 'text-gray-600'}`} />
          </div>
          <p className="mt-3 text-sm text-gray-400">Grid</p>
          <p className={`text-2xl font-bold tabular-nums ${
            isExporting ? 'text-energy-400' : isImporting ? 'text-grid-400' : 'text-gray-600'
          }`}>
            {isExporting ? '-' : ''}{Math.abs(grid.power).toFixed(1)} kW
          </p>
          <p className="text-xs text-gray-500">
            {isExporting ? 'Exporting' : isImporting ? 'Importing' : 'Idle'}
          </p>
        </div>
      </div>

      {/* Battery below */}
      <div className="flex justify-center mt-8">
        <motion.div
          animate={(isCharging || isDischarging) ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center ${
            isCharging || isDischarging ? 'bg-battery-500/20 glow-battery' : 'bg-gray-800/50'
          }`}>
            <Battery className={`w-10 h-10 ${isCharging || isDischarging ? 'text-battery-400' : 'text-gray-600'}`} />
          </div>
          <p className="mt-3 text-sm text-gray-400">Battery</p>
          <p className={`text-2xl font-bold tabular-nums ${
            isCharging ? 'text-energy-400' : isDischarging ? 'text-battery-400' : 'text-gray-600'
          }`}>
            {battery.percent}%
          </p>
          <p className="text-xs text-gray-500">
            {isCharging ? `+${battery.power.toFixed(1)} kW` : isDischarging ? `${battery.power.toFixed(1)} kW` : 'Idle'}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
