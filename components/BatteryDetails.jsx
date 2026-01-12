'use client';
import { motion } from 'framer-motion';
import { Battery, Thermometer, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { InfoTooltip } from './Tooltip';

export function BatteryDetails({ battery, todayStats }) {
  const isCharging = battery?.power > 0;
  const isDischarging = battery?.power < 0;
  const percent = battery?.percent || 0;

  const getStatusColor = () => {
    if (percent > 80) return 'text-green-400';
    if (percent > 50) return 'text-green-500';
    if (percent > 30) return 'text-yellow-400';
    if (percent > 15) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Main Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Battery className="w-5 h-5 text-battery-400" />
            Battery Status
          </h3>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isCharging ? 'bg-green-500/20 text-green-400' :
            isDischarging ? 'bg-orange-500/20 text-orange-400' :
            'bg-gray-700 text-gray-400'
          }`}>
            {isCharging ? 'Charging' : isDischarging ? 'Discharging' : 'Idle'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-battery-500/10 rounded-xl">
            <p className={`text-4xl font-bold tabular-nums ${getStatusColor()}`}>
              {percent}%
            </p>
            <p className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1">
              Charge Level
              <InfoTooltip metricKey="batteryPercent" />
            </p>
          </div>
          <div className="text-center p-4 bg-battery-500/10 rounded-xl">
            <p className={`text-4xl font-bold tabular-nums ${
              isCharging ? 'text-green-400' : isDischarging ? 'text-orange-400' : 'text-gray-400'
            }`}>
              {isCharging ? '+' : ''}{(battery?.power || 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1">
              Power (kW)
              <InfoTooltip metricKey="batteryPower" />
            </p>
          </div>
          <div className="text-center p-4 bg-battery-500/10 rounded-xl">
            <p className="text-4xl font-bold text-orange-400 tabular-nums">
              {battery?.temperature || '--'}°
            </p>
            <p className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1">
              Temperature
              <InfoTooltip metricKey="batteryTemp" />
            </p>
          </div>
          <div className="text-center p-4 bg-battery-500/10 rounded-xl">
            <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 1 }}
                className={`h-full rounded-full ${
                  percent > 50 ? 'bg-green-500' : percent > 20 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              />
            </div>
            <p className="text-sm text-gray-400 mt-3">Capacity</p>
          </div>
        </div>
      </motion.div>

      {/* Today's Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Today&apos;s Activity</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 bg-green-500/10 rounded-xl">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400 tabular-nums">
                {(todayStats?.batteryCharge || 0).toFixed(2)} kWh
              </p>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                Energy Charged
                <InfoTooltip metricKey="batteryCharge" />
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-orange-500/10 rounded-xl">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <TrendingDown className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-400 tabular-nums">
                {(todayStats?.batteryDischarge || 0).toFixed(2)} kWh
              </p>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                Energy Discharged
                <InfoTooltip metricKey="batteryDischarge" />
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
