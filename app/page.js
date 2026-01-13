'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Battery, Zap, Home, TrendingUp, RefreshCw,
  LayoutDashboard, Car, Bell, Cpu, LogOut
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { EnergyFlow } from '../components/EnergyFlow';
import { EnergyChart } from '../components/EnergyChart';
import { BatteryGauge } from '../components/BatteryGauge';
import { SolarArrays } from '../components/SolarArrays';
import { BatteryDetails } from '../components/BatteryDetails';
import { GridMeter } from '../components/GridMeter';
import { ConsumptionStats } from '../components/ConsumptionStats';
import { DeviceInfo } from '../components/DeviceInfo';
import { EVCharger } from '../components/EVCharger';
import { EventsLog } from '../components/EventsLog';
import { useAuth } from '../contexts/AuthContext';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'solar', label: 'Solar', icon: Sun },
  { id: 'battery', label: 'Battery', icon: Battery },
  { id: 'grid', label: 'Grid', icon: Zap },
  { id: 'consumption', label: 'Consumption', icon: Home },
  { id: 'devices', label: 'Devices', icon: Cpu },
  { id: 'ev', label: 'EV Charger', icon: Car },
  { id: 'events', label: 'Events', icon: Bell },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard', { cache: 'no-store' });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
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
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, authLoading]);

  if (authLoading || loading) {
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

  const { solar, battery, grid, consumption, todayStats, dataPoints, device, inverter, evChargers, events, systemData } = data || {};

  const renderTabContent = () => {
    switch (activeTab) {
      case 'solar':
        return <SolarArrays solar={solar} todayStats={todayStats} />;
      case 'battery':
        return <BatteryDetails battery={battery} todayStats={todayStats} />;
      case 'grid':
        return <GridMeter grid={grid} todayStats={todayStats} />;
      case 'consumption':
        return <ConsumptionStats consumption={consumption} todayStats={todayStats} dataPoints={dataPoints} />;
      case 'devices':
        return <DeviceInfo device={device} inverter={inverter} systemData={systemData} />;
      case 'ev':
        return <EVCharger evChargers={evChargers} />;
      case 'events':
        return <EventsLog events={events} />;
      default:
        return (
          <>
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
                  <p className="text-3xl font-bold text-solar-400 tabular-nums">
                    {todayStats?.solar?.toFixed(1) || 0}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">kWh Generated</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-energy-400 tabular-nums">
                    {todayStats?.consumption?.toFixed(1) || 0}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">kWh Consumed</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-grid-400 tabular-nums">
                    {todayStats?.import?.toFixed(1) || 0}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">kWh Imported</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-battery-400 tabular-nums">
                    {todayStats?.export?.toFixed(1) || 0}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">kWh Exported</p>
                </div>
              </div>
            </motion.div>
          </>
        );
    }
  };

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
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors group"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="border-b border-white/10 bg-gray-900/30 sticky top-[73px] z-40 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 py-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
