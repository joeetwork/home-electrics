import { motion } from 'framer-motion';
import { Home, TrendingUp, Zap, Sun, Battery, Activity } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

export function ConsumptionStats({ consumption, solar, battery, grid, energyFlows }) {
  if (!consumption) return null;

  // Calculate energy sources for today
  const solarToHome = solar?.todayGeneration ? solar.todayGeneration * 0.6 : 0; // Estimate 60% direct use
  const batteryToHome = battery?.todayDischarge || 0;
  const gridToHome = grid?.todayImport || 0;
  const totalConsumption = consumption.todayTotal || (solarToHome + batteryToHome + gridToHome);

  const sourceData = [
    { name: 'Solar Direct', value: solarToHome, color: '#fbbf24' },
    { name: 'Battery', value: batteryToHome, color: '#3b82f6' },
    { name: 'Grid', value: gridToHome, color: '#a855f7' },
  ].filter(d => d.value > 0);

  const selfPowered = totalConsumption > 0
    ? ((solarToHome + batteryToHome) / totalConsumption * 100)
    : 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-dark rounded-lg p-3 border border-gray-700">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-gray-300">{payload[0].value.toFixed(2)} kWh</p>
          <p className="text-gray-500 text-sm">
            {((payload[0].value / totalConsumption) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Home className="w-5 h-5 text-energy-400" />
          Consumption Analytics
        </h3>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-energy-500/20 text-energy-400 text-sm">
          <Activity className="w-4 h-4" />
          {consumption.power.toFixed(2)} kW
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Current & Today's Consumption */}
        <div className="space-y-4">
          <div className="bg-energy-500/10 rounded-xl p-6 text-center">
            <p className="text-energy-400 text-sm mb-2">Current Consumption</p>
            <motion.p
              key={consumption.power}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-5xl font-bold text-white tabular-nums"
            >
              {consumption.power.toFixed(2)}
              <span className="text-xl text-gray-400 ml-2">kW</span>
            </motion.p>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Today's Total</span>
              <span className="text-2xl font-bold text-white tabular-nums">
                {totalConsumption.toFixed(1)} kWh
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Estimated cost: £{(totalConsumption * 0.28).toFixed(2)}
            </div>
          </div>

          {/* Energy Sources Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-solar-500/20 flex items-center justify-center">
                <Sun className="w-4 h-4 text-solar-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Solar Direct</span>
                  <span className="text-white tabular-nums">{solarToHome.toFixed(1)} kWh</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(solarToHome / (totalConsumption || 1)) * 100}%` }}
                    className="h-full bg-solar-500 rounded-full"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-battery-500/20 flex items-center justify-center">
                <Battery className="w-4 h-4 text-battery-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Battery</span>
                  <span className="text-white tabular-nums">{batteryToHome.toFixed(1)} kWh</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(batteryToHome / (totalConsumption || 1)) * 100}%` }}
                    className="h-full bg-battery-500 rounded-full"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-grid-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-grid-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Grid</span>
                  <span className="text-white tabular-nums">{gridToHome.toFixed(1)} kWh</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(gridToHome / (totalConsumption || 1)) * 100}%` }}
                    className="h-full bg-grid-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => <span className="text-gray-400 text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Self-powered percentage */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-energy-500/10 to-solar-500/10 text-center">
            <p className="text-gray-400 text-sm mb-1">Self-Powered Today</p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold text-energy-400 tabular-nums"
            >
              {selfPowered.toFixed(0)}%
            </motion.p>
            <p className="text-gray-500 text-xs mt-1">
              Solar + Battery power
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
