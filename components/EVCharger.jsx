'use client';
import { motion } from 'framer-motion';
import { Car, Zap, Battery, Clock } from 'lucide-react';
import { InfoTooltip } from './Tooltip';

export function EVCharger({ evChargers }) {
  const chargers = evChargers?.data || [];

  if (chargers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 text-center"
      >
        <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No EV Charger Found</h3>
        <p className="text-gray-400">
          No GivEnergy EV charger is connected to your account.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {chargers.map((charger, index) => (
        <motion.div
          key={charger.uuid || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-400" />
              {charger.alias || `EV Charger ${index + 1}`}
            </h3>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              charger.status === 'CHARGING' ? 'bg-green-500/20 text-green-400' :
              charger.status === 'AVAILABLE' ? 'bg-blue-500/20 text-blue-400' :
              charger.status === 'PLUGGED_IN' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-gray-700 text-gray-400'
            }`}>
              {charger.status || 'Unknown'}
              <InfoTooltip metricKey="evStatus" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-500/10 rounded-xl text-center">
              <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-400 tabular-nums">
                {(charger.power || 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
                Power (kW)
                <InfoTooltip metricKey="evPower" />
              </p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-xl text-center">
              <Battery className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-400 tabular-nums">
                {(charger.energy_total || 0).toFixed(1)}
              </p>
              <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
                Session (kWh)
                <InfoTooltip metricKey="evEnergy" />
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-xl text-center">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-400 tabular-nums">
                {charger.charging_time || '--'}
              </p>
              <p className="text-sm text-gray-400">Duration</p>
            </div>
            <div className="p-4 bg-orange-500/10 rounded-xl text-center">
              <p className="text-2xl font-bold text-orange-400 tabular-nums mt-4">
                {(charger.voltage || 0).toFixed(0)}V
              </p>
              <p className="text-sm text-gray-400 mt-2">Voltage</p>
            </div>
          </div>

          {charger.serial_number && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-gray-500">
                Serial: <span className="font-mono text-gray-400">{charger.serial_number}</span>
              </p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
