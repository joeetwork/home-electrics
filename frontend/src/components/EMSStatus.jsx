import { motion } from 'framer-motion';
import { Server, Activity, AlertTriangle, CheckCircle, Zap, Battery, Thermometer } from 'lucide-react';

export function EMSStatus({ emsData }) {
  const data = emsData?.data || emsData || {};

  if (!data || data.error) {
    return null; // Don't render if no EMS data
  }

  const inverters = data.inverters || [];
  const meters = data.meters || [];
  const hasError = data.error_code && data.error_code !== '0' && data.error_code !== 0;
  const hasWarning = data.warning_code && data.warning_code !== '0' && data.warning_code !== 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-cyan-400" />
          EMS System Status
        </h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          hasError ? 'bg-red-500/20 text-red-400' :
          hasWarning ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-energy-500/20 text-energy-400'
        }`}>
          {hasError ? <AlertTriangle className="w-4 h-4" /> :
           hasWarning ? <AlertTriangle className="w-4 h-4" /> :
           <CheckCircle className="w-4 h-4" />}
          {data.status || (hasError ? 'Error' : hasWarning ? 'Warning' : 'Normal')}
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm">Grid Power</span>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            {((data.grid_power || 0) / 1000).toFixed(2)}
            <span className="text-sm text-gray-400 ml-1">kW</span>
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-2">
            <Battery className="w-4 h-4" />
            <span className="text-sm">Battery Power</span>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            {((data.battery_power || 0) / 1000).toFixed(2)}
            <span className="text-sm text-gray-400 ml-1">kW</span>
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Load Power</span>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            {((data.calculated_load_power || data.measured_load_power || 0) / 1000).toFixed(2)}
            <span className="text-sm text-gray-400 ml-1">kW</span>
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm">Total Gen</span>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            {((data.total_generation || 0) / 1000).toFixed(1)}
            <span className="text-sm text-gray-400 ml-1">kWh</span>
          </p>
        </div>
      </div>

      {/* Inverters */}
      {inverters.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Inverters</h4>
          <div className="grid md:grid-cols-2 gap-3">
            {inverters.map((inv, index) => (
              <div key={inv.serial_number || index} className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-white font-medium">Inverter {inv.number || index + 1}</span>
                    <p className="text-gray-500 text-xs font-mono">{inv.serial_number}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    inv.status === 'NORMAL' || inv.status === 'ONLINE'
                      ? 'bg-energy-500/20 text-energy-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {inv.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Power</p>
                    <p className="text-white font-medium tabular-nums">
                      {((inv.active_power || 0) / 1000).toFixed(2)} kW
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">SOC</p>
                    <p className="text-white font-medium tabular-nums">{inv.soc || 0}%</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-gray-500" />
                    <p className="text-white font-medium tabular-nums">{inv.temperature || 0}°C</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meters */}
      {meters.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Meters</h4>
          <div className="grid md:grid-cols-3 gap-3">
            {meters.map((meter, index) => (
              <div key={meter.number || index} className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">
                    {meter.type || `Meter ${meter.number || index + 1}`}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    meter.status === 'NORMAL' ? 'bg-energy-500/20 text-energy-400' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {meter.status}
                  </span>
                </div>
                <p className="text-xl font-bold text-white mt-2 tabular-nums">
                  {((meter.active_power || 0) / 1000).toFixed(2)}
                  <span className="text-sm text-gray-400 ml-1">kW</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error/Warning Codes */}
      {(hasError || hasWarning) && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              {hasError && <p className="text-red-400 text-sm">Error Code: {data.error_code}</p>}
              {hasWarning && <p className="text-yellow-400 text-sm">Warning Code: {data.warning_code}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Timestamp */}
      {data.time && (
        <div className="mt-4 text-center text-gray-500 text-xs">
          Last updated: {new Date(data.time).toLocaleString()}
        </div>
      )}
    </motion.div>
  );
}
