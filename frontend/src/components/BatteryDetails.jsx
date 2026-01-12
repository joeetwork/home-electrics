import { motion } from 'framer-motion';
import { Battery, BatteryCharging, Thermometer, Zap, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { InfoTooltip, METRIC_EXPLANATIONS } from './Tooltip';

export function BatteryDetails({ battery, inverterInfo, systemData }) {
  if (!battery) return null;

  const info = inverterInfo?.info?.battery || {};
  const isCharging = battery.power > 0;
  const isDischarging = battery.power < 0;

  const getBatteryColor = (pct) => {
    if (pct > 70) return { bg: 'bg-energy-500', text: 'text-energy-400', glow: 'rgba(16, 185, 129, 0.5)' };
    if (pct > 30) return { bg: 'bg-solar-500', text: 'text-solar-400', glow: 'rgba(251, 191, 36, 0.5)' };
    return { bg: 'bg-red-500', text: 'text-red-400', glow: 'rgba(239, 68, 68, 0.5)' };
  };

  const colors = getBatteryColor(battery.percent);

  // Calculate remaining capacity in kWh
  const totalCapacity = info.nominal_capacity ? info.nominal_capacity / 1000 : 0;
  const remainingCapacity = totalCapacity * (battery.percent / 100);

  // Estimate time remaining
  const hoursRemaining = battery.power < 0 && Math.abs(battery.power) > 0
    ? remainingCapacity / Math.abs(battery.power)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          {isCharging ? (
            <BatteryCharging className="w-5 h-5 text-energy-400" />
          ) : (
            <Battery className="w-5 h-5 text-battery-400" />
          )}
          Battery Details
        </h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          isCharging ? 'bg-energy-500/20 text-energy-400' :
          isDischarging ? 'bg-battery-500/20 text-battery-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {isCharging ? <TrendingUp className="w-4 h-4" /> : isDischarging ? <TrendingDown className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
          {isCharging ? 'Charging' : isDischarging ? 'Discharging' : 'Idle'}
        </div>
      </div>

      {/* Main Battery Display */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Battery Visual */}
        <div className="relative">
          <div className="relative w-full h-40 bg-gray-800/50 rounded-2xl border-2 border-gray-700 overflow-hidden">
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-5 h-12 bg-gray-700 rounded-r-lg" />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${battery.percent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`absolute inset-y-2 left-2 rounded-xl ${colors.bg}`}
              style={{ boxShadow: `0 0 30px ${colors.glow}` }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                key={battery.percent}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-bold text-white drop-shadow-lg tabular-nums"
              >
                {battery.percent}%
              </motion.span>
              <span className="text-gray-400 text-sm mt-1">
                {remainingCapacity.toFixed(2)} / {totalCapacity.toFixed(2)} kWh
              </span>
            </div>
            {isCharging && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>

          {/* Time estimate */}
          {hoursRemaining && hoursRemaining < 24 && (
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-gray-400 text-sm">Estimated time remaining</p>
                <InfoTooltip content={METRIC_EXPLANATIONS.timeRemaining} />
              </div>
              <p className={`text-2xl font-bold ${colors.text}`}>
                {hoursRemaining >= 1
                  ? `${Math.floor(hoursRemaining)}h ${Math.round((hoursRemaining % 1) * 60)}m`
                  : `${Math.round(hoursRemaining * 60)}m`
                }
              </p>
            </div>
          )}
        </div>

        {/* Battery Metrics */}
        <div className="space-y-4">
          {/* Power */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Power
                <InfoTooltip content={METRIC_EXPLANATIONS.batteryPower} />
              </span>
              <span className={`text-2xl font-bold tabular-nums ${
                isCharging ? 'text-energy-400' : isDischarging ? 'text-battery-400' : 'text-gray-400'
              }`}>
                {isCharging ? '+' : ''}{battery.power.toFixed(2)} kW
              </span>
            </div>
          </div>

          {/* Temperature */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Temperature
                <InfoTooltip content={METRIC_EXPLANATIONS.batteryTemperature} />
              </span>
              <span className={`text-2xl font-bold tabular-nums ${
                battery.temperature > 40 ? 'text-red-400' :
                battery.temperature > 30 ? 'text-solar-400' : 'text-energy-400'
              }`}>
                {battery.temperature}°C
              </span>
            </div>
          </div>

          {/* Today's Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-energy-500/10 rounded-xl p-3">
              <div className="flex items-center gap-1">
                <p className="text-energy-400 text-xs flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Today Charged
                </p>
                <InfoTooltip content={METRIC_EXPLANATIONS.batteryCharge} position="right" />
              </div>
              <p className="text-white font-bold text-lg tabular-nums">
                {battery.todayCharge?.toFixed(1) || '0.0'} kWh
              </p>
            </div>
            <div className="bg-battery-500/10 rounded-xl p-3">
              <div className="flex items-center gap-1">
                <p className="text-battery-400 text-xs flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  Today Discharged
                </p>
                <InfoTooltip content={METRIC_EXPLANATIONS.batteryDischarge} position="left" />
              </div>
              <p className="text-white font-bold text-lg tabular-nums">
                {battery.todayDischarge?.toFixed(1) || '0.0'} kWh
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Battery Specifications */}
      {info.nominal_capacity && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <p className="text-gray-400 text-xs mb-1">Nominal Capacity</p>
              <InfoTooltip content={METRIC_EXPLANATIONS.batteryCapacity} />
            </div>
            <p className="text-white font-semibold">{(info.nominal_capacity / 1000).toFixed(2)} kWh</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <p className="text-gray-400 text-xs mb-1">Nominal Voltage</p>
              <InfoTooltip content={METRIC_EXPLANATIONS.batteryVoltage} />
            </div>
            <p className="text-white font-semibold">{info.nominal_voltage} V</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <p className="text-gray-400 text-xs mb-1">Depth of Discharge</p>
              <InfoTooltip content={METRIC_EXPLANATIONS.depthOfDischarge} />
            </div>
            <p className="text-white font-semibold">{(info.depth_of_discharge * 100).toFixed(0)}%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">Usable Capacity</p>
            <p className="text-white font-semibold">{((info.nominal_capacity / 1000) * info.depth_of_discharge).toFixed(2)} kWh</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
