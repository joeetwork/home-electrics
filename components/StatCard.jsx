'use client';
import { motion } from 'framer-motion';

export function StatCard({ title, value, unit, icon: Icon, color, subtitle, glowClass, tooltip, precision }) {
  const colorClasses = {
    solar: 'from-solar-500 to-solar-600 text-solar-400',
    battery: 'from-battery-500 to-battery-600 text-battery-400',
    grid: 'from-grid-500 to-grid-600 text-grid-400',
    energy: 'from-energy-500 to-energy-600 text-energy-400',
  };

  const bgClasses = {
    solar: 'bg-solar-500/10',
    battery: 'bg-battery-500/10',
    grid: 'bg-grid-500/10',
    energy: 'bg-energy-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className={`glass rounded-2xl p-6 relative overflow-hidden ${glowClass || ''}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-5`} />
      <div className={`absolute top-4 right-4 ${bgClasses[color]} p-3 rounded-xl`}>
        <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[2]}`} />
      </div>
      <div className="relative z-10">
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white tabular-nums"
          >
            {typeof value === 'number' ? value.toLocaleString('en-GB', {
              minimumFractionDigits: precision ?? (unit === '%' ? 0 : 2),
              maximumFractionDigits: precision ?? (unit === '%' ? 0 : 2)
            }) : value}
          </motion.span>
          <span className="text-gray-400 text-lg">{unit}</span>
        </div>
        {subtitle && <p className="text-gray-500 text-sm mt-2">{subtitle}</p>}
      </div>
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full ${bgClasses[color]} blur-2xl`} />
    </motion.div>
  );
}
