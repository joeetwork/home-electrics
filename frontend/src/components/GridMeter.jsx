import { motion } from 'framer-motion';
import { Zap, ArrowDownRight, ArrowUpRight, Activity, Gauge, Radio } from 'lucide-react';
import { InfoTooltip, METRIC_EXPLANATIONS } from './Tooltip';

export function GridMeter({ grid, meterData }) {
  if (!grid) return null;

  const isExporting = grid.power < 0;
  const isImporting = grid.power > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-grid-400" />
          Grid & Meter
          <InfoTooltip content={METRIC_EXPLANATIONS.gridPower} />
        </h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          isExporting ? 'bg-energy-500/20 text-energy-400' :
          isImporting ? 'bg-grid-500/20 text-grid-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {isExporting ? <ArrowUpRight className="w-4 h-4" /> : isImporting ? <ArrowDownRight className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
          {isExporting ? 'Exporting' : isImporting ? 'Importing' : 'Idle'}
        </div>
      </div>

      {/* Power Display */}
      <div className="text-center py-6 mb-6 rounded-xl bg-gradient-to-br from-grid-500/10 to-purple-500/10">
        <motion.div
          key={grid.power}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-5xl font-bold tabular-nums ${
            isExporting ? 'text-energy-400' : isImporting ? 'text-grid-400' : 'text-gray-400'
          }`}
        >
          {isExporting ? '-' : '+'}{Math.abs(grid.power).toFixed(2)}
          <span className="text-2xl text-gray-400 ml-2">kW</span>
        </motion.div>
        <p className="text-gray-500 mt-2">
          {isExporting ? 'Selling to grid' : isImporting ? 'Buying from grid' : 'No exchange'}
        </p>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-2">
            <Gauge className="w-4 h-4" />
            <span className="text-sm">Voltage</span>
            <InfoTooltip content={METRIC_EXPLANATIONS.gridVoltage} />
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">{grid.voltage.toFixed(1)}</p>
          <p className="text-gray-500 text-sm">V</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Current</span>
            <InfoTooltip content={METRIC_EXPLANATIONS.gridCurrent} />
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">{Math.abs(grid.current).toFixed(2)}</p>
          <p className="text-gray-500 text-sm">A</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-2">
            <Radio className="w-4 h-4" />
            <span className="text-sm">Frequency</span>
            <InfoTooltip content={METRIC_EXPLANATIONS.gridFrequency} />
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">{grid.frequency.toFixed(2)}</p>
          <p className="text-gray-500 text-sm">Hz</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm">Power Factor</span>
            <InfoTooltip content={METRIC_EXPLANATIONS.powerFactor} />
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            {grid.voltage && grid.current && grid.power
              ? (Math.abs(grid.power * 1000) / (grid.voltage * Math.abs(grid.current) || 1)).toFixed(2)
              : '1.00'}
          </p>
          <p className="text-gray-500 text-sm">PF</p>
        </div>
      </div>

      {/* Today's Import/Export */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-grid-500/10 rounded-xl p-4">
          <div className="flex items-center gap-2 text-grid-400 mb-2">
            <ArrowDownRight className="w-4 h-4" />
            <span className="text-sm font-medium">Today's Import</span>
            <InfoTooltip content={METRIC_EXPLANATIONS.gridImport} />
          </div>
          <p className="text-3xl font-bold text-white tabular-nums">
            {grid.todayImport.toFixed(2)}
            <span className="text-lg text-gray-400 ml-1">kWh</span>
          </p>
          {grid.todayImport > 0 && (
            <p className="text-gray-500 text-sm mt-1">
              ~£{(grid.todayImport * 0.28).toFixed(2)} @ 28p/kWh
            </p>
          )}
        </div>
        <div className="bg-energy-500/10 rounded-xl p-4">
          <div className="flex items-center gap-2 text-energy-400 mb-2">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm font-medium">Today's Export</span>
            <InfoTooltip content={METRIC_EXPLANATIONS.gridExport} />
          </div>
          <p className="text-3xl font-bold text-white tabular-nums">
            {grid.todayExport.toFixed(2)}
            <span className="text-lg text-gray-400 ml-1">kWh</span>
          </p>
          {grid.todayExport > 0 && (
            <p className="text-gray-500 text-sm mt-1">
              ~£{(grid.todayExport * 0.15).toFixed(2)} @ 15p/kWh
            </p>
          )}
        </div>
      </div>

      {/* Net Grid Position */}
      <div className="mt-4 p-4 rounded-xl bg-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-gray-400">Net Grid Position Today</span>
            <InfoTooltip content={METRIC_EXPLANATIONS.netGridPosition} />
          </div>
          <span className={`text-xl font-bold tabular-nums ${
            grid.todayExport > grid.todayImport ? 'text-energy-400' : 'text-grid-400'
          }`}>
            {grid.todayExport > grid.todayImport ? '+' : '-'}
            {Math.abs(grid.todayExport - grid.todayImport).toFixed(2)} kWh
          </span>
        </div>
        <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(grid.todayExport / (grid.todayImport + grid.todayExport + 0.1)) * 100}%` }}
              className="bg-energy-500 rounded-l-full"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(grid.todayImport / (grid.todayImport + grid.todayExport + 0.1)) * 100}%` }}
              className="bg-grid-500 rounded-r-full"
            />
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Export</span>
          <span>Import</span>
        </div>
      </div>
    </motion.div>
  );
}
