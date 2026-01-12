import { motion } from 'framer-motion';
import { Zap, ArrowDownRight, ArrowUpRight, Activity } from 'lucide-react';

export function GridStatus({ grid }) {
  const isExporting = grid.power < 0;
  const isImporting = grid.power > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-6 glow-grid"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-grid-400" />
          Grid Status
        </h3>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
          isExporting ? 'bg-energy-500/20 text-energy-400' :
          isImporting ? 'bg-grid-500/20 text-grid-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {isExporting ? (
            <>
              <ArrowUpRight className="w-3 h-3" />
              Exporting
            </>
          ) : isImporting ? (
            <>
              <ArrowDownRight className="w-3 h-3" />
              Importing
            </>
          ) : (
            'Idle'
          )}
        </div>
      </div>

      {/* Power display */}
      <div className="text-center py-4">
        <motion.div
          key={grid.power}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-5xl font-bold tabular-nums ${
            isExporting ? 'text-energy-400' : isImporting ? 'text-grid-400' : 'text-gray-400'
          }`}
        >
          {isExporting ? '-' : ''}{Math.abs(grid.power).toFixed(2)}
          <span className="text-xl text-gray-400 ml-2">kW</span>
        </motion.div>
        <p className="text-gray-500 mt-1">
          {isExporting ? 'Selling to grid' : isImporting ? 'Buying from grid' : 'No grid exchange'}
        </p>
      </div>

      {/* Grid metrics */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700/50">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <Activity className="w-3 h-3" />
            <span className="text-xs">Voltage</span>
          </div>
          <p className="text-lg font-semibold text-white tabular-nums">
            {grid.voltage.toFixed(0)} <span className="text-xs text-gray-400">V</span>
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <Zap className="w-3 h-3" />
            <span className="text-xs">Frequency</span>
          </div>
          <p className="text-lg font-semibold text-white tabular-nums">
            {grid.frequency.toFixed(1)} <span className="text-xs text-gray-400">Hz</span>
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <Activity className="w-3 h-3" />
            <span className="text-xs">Current</span>
          </div>
          <p className="text-lg font-semibold text-white tabular-nums">
            {Math.abs(grid.current).toFixed(1)} <span className="text-xs text-gray-400">A</span>
          </p>
        </div>
      </div>

      {/* Today's totals */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-700/50">
        <div className="bg-grid-500/10 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-grid-400 mb-1">
            <ArrowDownRight className="w-3 h-3" />
            <span className="text-xs">Today Import</span>
          </div>
          <p className="text-xl font-bold text-white tabular-nums">
            {grid.todayImport.toFixed(1)} <span className="text-xs text-gray-400">kWh</span>
          </p>
        </div>
        <div className="bg-energy-500/10 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-energy-400 mb-1">
            <ArrowUpRight className="w-3 h-3" />
            <span className="text-xs">Today Export</span>
          </div>
          <p className="text-xl font-bold text-white tabular-nums">
            {grid.todayExport.toFixed(1)} <span className="text-xs text-gray-400">kWh</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
