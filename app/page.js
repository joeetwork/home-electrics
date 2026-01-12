'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Battery, Zap, Home, TrendingUp, RefreshCw } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { EnergyFlow } from '../components/EnergyFlow';
import { EnergyChart } from '../components/EnergyChart';
import { BatteryGauge } from '../components/BatteryGauge';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch data');
      const result = await res.json();
      setData(result);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Sun className="w-16 h-16 text-solar-400" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Error: {error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-energy-500 text-white rounded-xl hover:bg-energy-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { solar, battery, grid, consumption, todayStats, dataPoints } = data || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-gray-900/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-solar-400 to-energy-500 flex items-center justify-center">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">GivEnergy</h1>
                <p className="text-xs text-gray-400">Solar Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <span className="text-xs text-gray-500">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={fetchData}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Solar Generation"
            value={solar?.power || 0}
            unit="kW"
            icon={Sun}
            color="solar"
            glowClass="glow-solar"
            subtitle={`Today: ${todayStats?.solar?.toFixed(1) || 0} kWh`}
          />
          <StatCard
            title="Battery"
            value={battery?.percent || 0}
            unit="%"
            icon={Battery}
            color="battery"
            glowClass="glow-battery"
            subtitle={`${battery?.power > 0 ? 'Charging' : battery?.power < 0 ? 'Discharging' : 'Idle'}: ${Math.abs(battery?.power || 0).toFixed(1)} kW`}
          />
          <StatCard
            title="Grid"
            value={Math.abs(grid?.power || 0)}
            unit="kW"
            icon={Zap}
            color="grid"
            glowClass="glow-grid"
            subtitle={grid?.power < 0 ? 'Exporting' : grid?.power > 0 ? 'Importing' : 'Idle'}
          />
          <StatCard
            title="Home Consumption"
            value={consumption?.power || 0}
            unit="kW"
            icon={Home}
            color="energy"
            glowClass="glow-energy"
            subtitle={`Today: ${todayStats?.consumption?.toFixed(1) || 0} kWh`}
          />
        </div>

        {/* Energy Flow & Battery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <EnergyFlow
              solar={solar || { power: 0 }}
              battery={battery || { power: 0, percent: 0 }}
              grid={grid || { power: 0 }}
              consumption={consumption || { power: 0 }}
            />
          </div>
          <BatteryGauge
            percent={battery?.percent || 0}
            power={battery?.power || 0}
            temperature={battery?.temperature}
          />
        </div>

        {/* Chart */}
        <div className="mb-8">
          <EnergyChart data={dataPoints} title="Today's Energy Flow" />
        </div>

        {/* Daily Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-energy-400" />
            Today&apos;s Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-solar-400">
                {todayStats?.solar?.toFixed(1) || 0}
              </p>
              <p className="text-sm text-gray-400 mt-1">kWh Generated</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-energy-400">
                {todayStats?.consumption?.toFixed(1) || 0}
              </p>
              <p className="text-sm text-gray-400 mt-1">kWh Consumed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-grid-400">
                {todayStats?.import?.toFixed(1) || 0}
              </p>
              <p className="text-sm text-gray-400 mt-1">kWh Imported</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-battery-400">
                {todayStats?.export?.toFixed(1) || 0}
              </p>
              <p className="text-sm text-gray-400 mt-1">kWh Exported</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
