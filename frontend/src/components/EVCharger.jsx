import { motion } from 'framer-motion';
import { Car, Zap, Clock, Activity, CheckCircle, XCircle, Plug } from 'lucide-react';

export function EVCharger({ evChargers }) {
  const chargers = evChargers?.data || [];

  if (chargers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Car className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">EV Charger</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Car className="w-16 h-16 mx-auto mb-3 opacity-30" />
          <p>No EV chargers connected</p>
          <p className="text-sm mt-1">Connect a GivEnergy EV charger to see data here</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Car className="w-5 h-5 text-blue-400" />
          EV Chargers
        </h3>
        <span className="text-gray-400 text-sm">{chargers.length} device(s)</span>
      </div>

      <div className="space-y-4">
        {chargers.map((charger, index) => {
          const isOnline = charger.online;
          const status = charger.status || 'Unknown';
          const isCharging = status === 'CHARGING';

          return (
            <motion.div
              key={charger.uuid || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl p-4 border ${
                isCharging ? 'bg-blue-500/10 border-blue-500/30' :
                isOnline ? 'bg-energy-500/10 border-energy-500/30' :
                'bg-gray-800/50 border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isCharging ? 'bg-blue-500/20' :
                    isOnline ? 'bg-energy-500/20' :
                    'bg-gray-700'
                  }`}>
                    {isCharging ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Zap className="w-6 h-6 text-blue-400" />
                      </motion.div>
                    ) : (
                      <Car className={`w-6 h-6 ${isOnline ? 'text-energy-400' : 'text-gray-500'}`} />
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{charger.alias || `Charger ${index + 1}`}</h4>
                    <p className="text-gray-500 text-sm font-mono">{charger.serial_number}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  isCharging ? 'bg-blue-500/20 text-blue-400' :
                  isOnline ? 'bg-energy-500/20 text-energy-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {isOnline ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {isCharging ? 'Charging' : isOnline ? 'Online' : 'Offline'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                    <Plug className="w-3 h-3" />
                    <span className="text-xs">Type</span>
                  </div>
                  <p className="text-white font-medium">{charger.type || 'Type 2'}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                    <Activity className="w-3 h-3" />
                    <span className="text-xs">Status</span>
                  </div>
                  <p className="text-white font-medium">{status}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">Last Seen</span>
                  </div>
                  <p className="text-white font-medium text-sm">
                    {charger.went_offline_at
                      ? new Date(charger.went_offline_at).toLocaleTimeString()
                      : 'Now'}
                  </p>
                </div>
              </div>

              {isCharging && (
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Charging Progress</span>
                    <span className="text-blue-400 font-medium">7.4 kW</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
