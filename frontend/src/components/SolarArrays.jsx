import { motion } from 'framer-motion';
import { Sun, TrendingUp } from 'lucide-react';
import { InfoTooltip, METRIC_EXPLANATIONS } from './Tooltip';

export function SolarArrays({ solar, dataPoints }) {
  if (!solar) return null;

  const arrays = solar.arrays || [];
  const isGenerating = solar.power > 0;

  // Calculate peak power from data points
  const peakPower = dataPoints?.length > 0
    ? Math.max(...dataPoints.map(d => d.solar?.power || 0))
    : solar.power;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sun className="w-5 h-5 text-solar-400" />
          Solar Generation
          <InfoTooltip content={METRIC_EXPLANATIONS.solarPower} />
        </h3>
        {isGenerating && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-solar-500/20 text-solar-400 text-sm"
          >
            <Sun className="w-4 h-4" />
            Generating
          </motion.div>
        )}
      </div>

      {/* Main Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-solar-500/10 rounded-xl p-4 text-center glow-solar">
          <div className="flex items-center justify-center gap-1">
            <p className="text-solar-400 text-sm mb-1">Current Power</p>
            <InfoTooltip content={METRIC_EXPLANATIONS.solarPower} />
          </div>
          <motion.p
            key={solar.power}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-white tabular-nums"
          >
            {solar.power.toFixed(2)} <span className="text-lg text-gray-400">kW</span>
          </motion.p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <p className="text-gray-400 text-sm mb-1">Today's Generation</p>
            <InfoTooltip content={METRIC_EXPLANATIONS.solarToday} />
          </div>
          <p className="text-3xl font-bold text-white tabular-nums">
            {solar.todayGeneration.toFixed(1)} <span className="text-lg text-gray-400">kWh</span>
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <p className="text-gray-400 text-sm mb-1">Peak Today</p>
            <InfoTooltip content={METRIC_EXPLANATIONS.peakPower} />
          </div>
          <p className="text-3xl font-bold text-energy-400 tabular-nums">
            {peakPower.toFixed(2)} <span className="text-lg text-gray-400">kW</span>
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <p className="text-gray-400 text-sm mb-1">Total Generation</p>
            <InfoTooltip content={METRIC_EXPLANATIONS.solarTotal} />
          </div>
          <p className="text-3xl font-bold text-white tabular-nums">
            {(solar.totalGeneration / 1000).toFixed(1)} <span className="text-lg text-gray-400">MWh</span>
          </p>
        </div>
      </div>

      {/* Solar Arrays */}
      {arrays.length > 0 ? (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Solar Arrays</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {arrays.map((array, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl p-4 border ${
                  array.power > 0 ? 'bg-solar-500/10 border-solar-500/30' : 'bg-gray-800/50 border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-white font-medium flex items-center gap-2">
                    <Sun className={`w-4 h-4 ${array.power > 0 ? 'text-solar-400' : 'text-gray-500'}`} />
                    Array {index + 1}
                  </h5>
                  <span className={`text-lg font-bold tabular-nums ${array.power > 0 ? 'text-solar-400' : 'text-gray-500'}`}>
                    {array.power?.toFixed(2) || '0.00'} kW
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-gray-500">Voltage</p>
                      <InfoTooltip content={METRIC_EXPLANATIONS.solarArrayVoltage} position="bottom" />
                    </div>
                    <p className="text-white font-medium tabular-nums">{array.voltage?.toFixed(1) || '0.0'} V</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-gray-500">Current</p>
                      <InfoTooltip content={METRIC_EXPLANATIONS.solarArrayCurrent} position="bottom" />
                    </div>
                    <p className="text-white font-medium tabular-nums">{array.current?.toFixed(2) || '0.00'} A</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Efficiency</p>
                    <p className="text-white font-medium tabular-nums">
                      {array.voltage && array.current && array.power
                        ? ((array.power * 1000) / (array.voltage * array.current) * 100).toFixed(0)
                        : '0'}%
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Sun className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>No array data available</p>
        </div>
      )}

      {/* Generation Progress Bar */}
      <div className="mt-6 pt-6 border-t border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Daily Target Progress</span>
          <span className="text-white font-medium">{((solar.todayGeneration / 30) * 100).toFixed(0)}% of 30 kWh</span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (solar.todayGeneration / 30) * 100)}%` }}
            transition={{ duration: 1 }}
            className="h-full rounded-full bg-gradient-to-r from-solar-600 to-solar-400"
            style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
