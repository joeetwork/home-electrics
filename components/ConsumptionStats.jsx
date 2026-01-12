'use client';
import { motion } from 'framer-motion';
import { Home, Zap, TrendingUp } from 'lucide-react';
import { InfoTooltip } from './Tooltip';

export function ConsumptionStats({ consumption, todayStats, dataPoints }) {
  // Calculate peak consumption from data points
  const peakConsumption = dataPoints?.reduce((max, point) =>
    Math.max(max, point.consumption?.power || 0), 0) || 0;

  // Calculate average consumption
  const avgConsumption = dataPoints?.length > 0
    ? dataPoints.reduce((sum, point) => sum + (point.consumption?.power || 0), 0) / dataPoints.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Current Consumption */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Home className="w-5 h-5 text-energy-400" />
            Home Consumption
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-energy-500/10 rounded-xl">
            <p className="text-4xl font-bold text-energy-400 tabular-nums">
              {(consumption?.power || 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1">
              Current (kW)
              <InfoTooltip metricKey="consumptionPower" />
            </p>
          </div>
          <div className="text-center p-4 bg-energy-500/10 rounded-xl">
            <p className="text-4xl font-bold text-energy-400 tabular-nums">
              {(todayStats?.consumption || 0).toFixed(1)}
            </p>
            <p className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1">
              Today (kWh)
              <InfoTooltip metricKey="consumptionToday" />
            </p>
          </div>
          <div className="text-center p-4 bg-orange-500/10 rounded-xl">
            <p className="text-4xl font-bold text-orange-400 tabular-nums">
              {peakConsumption.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400 mt-1">Peak Today (kW)</p>
          </div>
          <div className="text-center p-4 bg-blue-500/10 rounded-xl">
            <p className="text-4xl font-bold text-blue-400 tabular-nums">
              {avgConsumption.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400 mt-1">Average (kW)</p>
          </div>
        </div>
      </motion.div>

      {/* Energy Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Energy Sources Today</h3>

        <div className="space-y-4">
          {/* Solar contribution */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Solar</span>
              <span className="text-solar-400 font-semibold">
                {(todayStats?.solar || 0).toFixed(1)} kWh
              </span>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(100, ((todayStats?.solar || 0) / Math.max(todayStats?.consumption || 1, 1)) * 100)}%`
                }}
                transition={{ duration: 1 }}
                className="h-full bg-solar-500 rounded-full"
              />
            </div>
          </div>

          {/* Battery contribution */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Battery</span>
              <span className="text-battery-400 font-semibold">
                {(todayStats?.batteryDischarge || 0).toFixed(1)} kWh
              </span>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(100, ((todayStats?.batteryDischarge || 0) / Math.max(todayStats?.consumption || 1, 1)) * 100)}%`
                }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-battery-500 rounded-full"
              />
            </div>
          </div>

          {/* Grid contribution */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Grid</span>
              <span className="text-grid-400 font-semibold">
                {(todayStats?.import || 0).toFixed(1)} kWh
              </span>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(100, ((todayStats?.import || 0) / Math.max(todayStats?.consumption || 1, 1)) * 100)}%`
                }}
                transition={{ duration: 1, delay: 0.4 }}
                className="h-full bg-grid-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
