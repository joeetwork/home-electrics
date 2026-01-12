'use client';
import { motion } from 'framer-motion';
import { Sun, Zap, Activity } from 'lucide-react';
import { InfoTooltip } from './Tooltip';

export function SolarArrays({ solar, todayStats }) {
  const arrays = solar?.arrays || [];

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sun className="w-5 h-5 text-solar-400" />
            Solar Generation
          </h3>
          <InfoTooltip metricKey="solarPower" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-solar-500/10 rounded-xl">
            <p className="text-4xl font-bold text-solar-400 tabular-nums">
              {(solar?.power || 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1">
              Current Power (kW)
              <InfoTooltip metricKey="solarPower" />
            </p>
          </div>
          <div className="text-center p-4 bg-solar-500/10 rounded-xl">
            <p className="text-4xl font-bold text-solar-400 tabular-nums">
              {(todayStats?.solar || 0).toFixed(1)}
            </p>
            <p className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1">
              Today (kWh)
              <InfoTooltip metricKey="solarToday" />
            </p>
          </div>
          <div className="text-center p-4 bg-solar-500/10 rounded-xl">
            <p className="text-4xl font-bold text-solar-400 tabular-nums">
              {arrays.length}
            </p>
            <p className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1">
              Active Arrays
              <InfoTooltip metricKey="solarArray" />
            </p>
          </div>
        </div>
      </motion.div>

      {/* Individual Arrays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {arrays.map((array, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-white">
                Array {array.array || index + 1}
              </h4>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                array.power > 0 ? 'bg-solar-500/20 text-solar-400' : 'bg-gray-700 text-gray-400'
              }`}>
                {array.power > 0 ? 'Generating' : 'Idle'}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Power
                  <InfoTooltip metricKey="solarPower" />
                </span>
                <span className="text-white font-semibold tabular-nums">
                  {(array.power || 0).toFixed(2)} kW
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  Voltage
                  <InfoTooltip metricKey="arrayVoltage" />
                </span>
                <span className="text-white font-semibold tabular-nums">
                  {(array.voltage || 0).toFixed(1)} V
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-1">
                  Current
                  <InfoTooltip metricKey="arrayCurrent" />
                </span>
                <span className="text-white font-semibold tabular-nums">
                  {(array.current || 0).toFixed(2)} A
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
