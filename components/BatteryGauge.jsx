'use client';
import { motion } from 'framer-motion';
import { Battery, Zap, ThermometerSun } from 'lucide-react';

export function BatteryGauge({ percent, power, temperature }) {
  const isCharging = power > 0;
  const isDischarging = power < 0;

  const getColor = () => {
    if (percent > 80) return '#10b981';
    if (percent > 50) return '#22c55e';
    if (percent > 30) return '#eab308';
    if (percent > 15) return '#f97316';
    return '#ef4444';
  };

  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 flex flex-col items-center justify-center"
    >
      <h3 className="text-lg font-semibold text-white mb-6">Battery Status</h3>

      <div className="relative">
        <svg width="200" height="200" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="16"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            stroke={getColor()}
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              filter: `drop-shadow(0 0 10px ${getColor()})`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            animate={isCharging || isDischarging ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Battery className={`w-10 h-10 ${isCharging ? 'text-energy-400' : isDischarging ? 'text-battery-400' : 'text-gray-400'}`} />
          </motion.div>
          <span className="text-4xl font-bold text-white mt-2 tabular-nums">
            {percent}%
          </span>
        </div>
      </div>

      {/* Status info */}
      <div className="flex items-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <Zap className={`w-5 h-5 ${isCharging ? 'text-energy-400' : isDischarging ? 'text-battery-400' : 'text-gray-500'}`} />
          <span className="text-gray-300">
            {isCharging ? '+' : ''}{power.toFixed(1)} kW
          </span>
        </div>
        {temperature !== undefined && (
          <div className="flex items-center gap-2">
            <ThermometerSun className="w-5 h-5 text-orange-400" />
            <span className="text-gray-300">{temperature}°C</span>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 mt-3">
        {isCharging ? 'Charging' : isDischarging ? 'Discharging' : 'Idle'}
      </p>
    </motion.div>
  );
}
