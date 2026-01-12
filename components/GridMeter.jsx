'use client';
import { motion } from 'framer-motion';
import { Zap, ArrowDownToLine, ArrowUpFromLine, Activity } from 'lucide-react';
import { InfoTooltip } from './Tooltip';

export function GridMeter({ grid, todayStats }) {
  const isExporting = grid?.power < 0;
  const isImporting = grid?.power > 0;

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-grid-400" />
            Grid Connection
          </h3>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isExporting ? 'bg-green-500/20 text-green-400' :
            isImporting ? 'bg-red-500/20 text-red-400' :
            'bg-gray-700 text-gray-400'
          }`}>
            {isExporting ? 'Exporting' : isImporting ? 'Importing' : 'Idle'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-grid-500/10 rounded-xl">
            <p className={`text-4xl font-bold tabular-nums ${
              isExporting ? 'text-green-400' : isImporting ? 'text-red-400' : 'text-gray-400'
            }`}>
              {isExporting ? '-' : ''}{Math.abs(grid?.power || 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1">
              Power (W)
              <InfoTooltip metricKey="gridPower" />
            </p>
          </div>
          <div className="text-center p-4 bg-grid-500/10 rounded-xl">
            <p className="text-4xl font-bold text-grid-400 tabular-nums">
              {(grid?.voltage || 0).toFixed(1)}
            </p>
            <p className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1">
              Voltage (V)
              <InfoTooltip metricKey="gridVoltage" />
            </p>
          </div>
          <div className="text-center p-4 bg-grid-500/10 rounded-xl">
            <p className="text-4xl font-bold text-grid-400 tabular-nums">
              {(grid?.frequency || 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1">
              Frequency (Hz)
              <InfoTooltip metricKey="gridFrequency" />
            </p>
          </div>
        </div>
      </motion.div>

      {/* Import/Export Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Today&apos;s Grid Usage</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 bg-red-500/10 rounded-xl">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <ArrowDownToLine className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400 tabular-nums">
                {(todayStats?.import || 0).toFixed(2)} kWh
              </p>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                Imported from Grid
                <InfoTooltip metricKey="gridImport" />
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-green-500/10 rounded-xl">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <ArrowUpFromLine className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400 tabular-nums">
                {(todayStats?.export || 0).toFixed(2)} kWh
              </p>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                Exported to Grid
                <InfoTooltip metricKey="gridExport" />
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
