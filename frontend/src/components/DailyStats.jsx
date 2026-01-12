import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Sun, Home, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-dark rounded-lg p-3 border border-gray-700">
        <p className="text-white font-semibold mb-1">{label}</p>
        <p className="text-gray-300">
          {payload[0].value.toFixed(2)} kWh
        </p>
      </div>
    );
  }
  return null;
};

export function DailyStats({ energyFlows }) {
  const data = energyFlows?.data || [];

  // Calculate totals from energy flows
  const stats = data.reduce((acc, day) => {
    const flowData = day.data || day;
    return {
      solar: acc.solar + (flowData.solar?.total || flowData.pv_to_home || 0) + (flowData.solar?.to_battery || flowData.pv_to_battery || 0) + (flowData.solar?.to_grid || flowData.pv_to_grid || 0),
      gridImport: acc.gridImport + (flowData.grid?.import || flowData.grid_to_home || 0) + (flowData.grid?.to_battery || flowData.grid_to_battery || 0),
      gridExport: acc.gridExport + (flowData.grid?.export || flowData.battery_to_grid || 0) + (flowData.pv_to_grid || 0),
      consumption: acc.consumption + (flowData.consumption?.total || flowData.pv_to_home || 0) + (flowData.battery_to_home || 0) + (flowData.grid_to_home || 0),
      batteryCharge: acc.batteryCharge + (flowData.battery?.charge || flowData.pv_to_battery || 0) + (flowData.grid_to_battery || 0),
      batteryDischarge: acc.batteryDischarge + (flowData.battery?.discharge || flowData.battery_to_home || 0) + (flowData.battery_to_grid || 0),
    };
  }, { solar: 0, gridImport: 0, gridExport: 0, consumption: 0, batteryCharge: 0, batteryDischarge: 0 });

  const chartData = [
    { name: 'Solar', value: stats.solar, color: '#fbbf24' },
    { name: 'Grid Import', value: stats.gridImport, color: '#a855f7' },
    { name: 'Grid Export', value: stats.gridExport, color: '#10b981' },
    { name: 'Consumption', value: stats.consumption, color: '#3b82f6' },
  ];

  const selfSufficiency = stats.consumption > 0
    ? Math.min(100, ((stats.solar + stats.batteryDischarge) / stats.consumption) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-6">7-Day Energy Summary</h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-solar-500/10 rounded-xl p-4">
          <div className="flex items-center gap-2 text-solar-400 mb-2">
            <Sun className="w-4 h-4" />
            <span className="text-sm">Solar Generated</span>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            {stats.solar.toFixed(1)} <span className="text-sm text-gray-400">kWh</span>
          </p>
        </div>

        <div className="bg-grid-500/10 rounded-xl p-4">
          <div className="flex items-center gap-2 text-grid-400 mb-2">
            <ArrowDownRight className="w-4 h-4" />
            <span className="text-sm">Grid Import</span>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            {stats.gridImport.toFixed(1)} <span className="text-sm text-gray-400">kWh</span>
          </p>
        </div>

        <div className="bg-energy-500/10 rounded-xl p-4">
          <div className="flex items-center gap-2 text-energy-400 mb-2">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm">Grid Export</span>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            {stats.gridExport.toFixed(1)} <span className="text-sm text-gray-400">kWh</span>
          </p>
        </div>

        <div className="bg-battery-500/10 rounded-xl p-4">
          <div className="flex items-center gap-2 text-battery-400 mb-2">
            <Home className="w-4 h-4" />
            <span className="text-sm">Consumption</span>
          </div>
          <p className="text-2xl font-bold text-white tabular-nums">
            {stats.consumption.toFixed(1)} <span className="text-sm text-gray-400">kWh</span>
          </p>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickFormatter={(v) => `${v}kWh`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Self-sufficiency meter */}
      <div className="mt-6 pt-6 border-t border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Self-Sufficiency</span>
          <span className="text-white font-bold">{selfSufficiency.toFixed(0)}%</span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${selfSufficiency}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-energy-500 to-solar-400"
            style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
