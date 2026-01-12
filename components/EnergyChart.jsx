'use client';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800/90 border border-gray-700 rounded-lg px-3 py-2 text-sm">
        <p className="text-gray-400 text-sm mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-300 text-sm">{entry.name}:</span>
            <span className="text-white font-semibold text-sm">
              {entry.value.toFixed(2)} W
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function EnergyChart({ data, title }) {
  const chartData = data?.map((point, index) => ({
    time: point.time?.split(' ')[1]?.substring(0, 5) || `${index}:00`,
    solar: point.solar?.power || 0,
    consumption: point.consumption?.power || 0,
    battery: Math.abs(point.battery?.power || 0),
    grid: Math.abs(point.grid?.power || 0),
  })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-6">{title || "Today's Energy Flow"}</h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} tickFormatter={(v) => `${v}W`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(value) => <span className="text-gray-400 text-sm">{value}</span>} />
            <Area type="monotone" dataKey="solar" name="Solar" stroke="#fbbf24" strokeWidth={2} fillOpacity={1} fill="url(#colorSolar)" />
            <Area type="monotone" dataKey="consumption" name="Consumption" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorConsumption)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
