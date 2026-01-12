import { motion } from 'framer-motion';
import { Battery, BatteryCharging, Zap } from 'lucide-react';
import { InfoTooltip, METRIC_EXPLANATIONS } from './Tooltip';

export function BatteryGauge({ percent, power, isCharging }) {
  const getBatteryColor = (pct) => {
    if (pct > 70) return '#10b981';
    if (pct > 30) return '#fbbf24';
    return '#ef4444';
  };

  const color = getBatteryColor(percent);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-6 glow-battery"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          {isCharging ? (
            <BatteryCharging className="w-5 h-5 text-energy-400" />
          ) : (
            <Battery className="w-5 h-5 text-battery-400" />
          )}
          Battery Status
          <InfoTooltip content={METRIC_EXPLANATIONS.batteryPercent} />
        </h3>
        {power !== 0 && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
            power > 0 ? 'bg-energy-500/20 text-energy-400' : 'bg-red-500/20 text-red-400'
          }`}>
            <Zap className="w-3 h-3" />
            {Math.abs(power).toFixed(1)} kW
            <span className="text-xs opacity-70">
              {power > 0 ? 'charging' : 'discharging'}
            </span>
          </div>
        )}
      </div>

      {/* Battery visual */}
      <div className="relative">
        {/* Battery outline */}
        <div className="relative w-full h-32 bg-gray-800/50 rounded-2xl border-2 border-gray-700 overflow-hidden">
          {/* Battery tip */}
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-10 bg-gray-700 rounded-r-lg" />

          {/* Battery level */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-y-2 left-2 rounded-xl"
            style={{
              background: `linear-gradient(90deg, ${color}40, ${color})`,
              boxShadow: `0 0 20px ${color}60`,
            }}
          />

          {/* Percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              key={percent}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-bold text-white drop-shadow-lg tabular-nums"
            >
              {percent}
              <span className="text-2xl text-gray-400">%</span>
            </motion.span>
          </div>

          {/* Charging animation */}
          {isCharging && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>

        {/* Battery segments indicator */}
        <div className="flex justify-between mt-4 px-2">
          {[0, 25, 50, 75, 100].map((mark) => (
            <div key={mark} className="text-center">
              <div className={`w-0.5 h-2 mx-auto mb-1 ${percent >= mark ? 'bg-gray-400' : 'bg-gray-700'}`} />
              <span className={`text-xs ${percent >= mark ? 'text-gray-400' : 'text-gray-600'}`}>
                {mark}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
