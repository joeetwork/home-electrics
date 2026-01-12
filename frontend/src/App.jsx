import { useState } from 'react';
import { useEnergyData, parseSystemData } from './hooks/useEnergyData';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { SolarPanel } from './components/SolarPanel';
import { BatteryGauge } from './components/BatteryGauge';
import { GridStatus } from './components/GridStatus';
import { EnergyFlow } from './components/EnergyFlow';
import { EnergyChart } from './components/EnergyChart';
import { DailyStats } from './components/DailyStats';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorScreen } from './components/ErrorScreen';
import { DeviceInfo } from './components/DeviceInfo';
import { BatteryDetails } from './components/BatteryDetails';
import { SolarArrays } from './components/SolarArrays';
import { GridMeter } from './components/GridMeter';
import { ConsumptionStats } from './components/ConsumptionStats';
import { EVCharger } from './components/EVCharger';
import { EventsLog } from './components/EventsLog';
import { AccountSettings } from './components/AccountSettings';
import { EMSStatus } from './components/EMSStatus';
import { InfoTooltip, METRIC_EXPLANATIONS } from './components/Tooltip';
import { Sun, Battery, Zap, Home, Cpu, Car, Bell, User, LayoutDashboard, Activity, TrendingUp, Thermometer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'solar', label: 'Solar', icon: Sun },
  { id: 'battery', label: 'Battery', icon: Battery },
  { id: 'grid', label: 'Grid', icon: Zap },
  { id: 'consumption', label: 'Consumption', icon: Home },
  { id: 'devices', label: 'Devices', icon: Cpu },
  { id: 'ev', label: 'EV Charger', icon: Car },
  { id: 'events', label: 'Events', icon: Bell },
  { id: 'account', label: 'Account', icon: User },
];

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const { data, loading, error, lastUpdated, refresh } = useEnergyData(30000);

  // Show loading screen
  if (loading && !data) {
    return <LoadingScreen />;
  }

  // Show error screen
  if (error && !data) {
    return <ErrorScreen error={error} onRetry={refresh} />;
  }

  // Parse system data
  const systemData = parseSystemData(data?.systemData);
  const dataPoints = data?.dataPoints?.data || [];
  const energyFlows = data?.energyFlows;

  // Extract all data
  const solar = systemData?.solar || { power: 0, todayGeneration: 0, totalGeneration: 0, arrays: [] };
  const battery = systemData?.battery || { percent: 0, power: 0, temperature: 0, todayCharge: 0, todayDischarge: 0 };
  const grid = systemData?.grid || { power: 0, voltage: 0, frequency: 0, current: 0, todayImport: 0, todayExport: 0 };
  const consumption = systemData?.consumption || { power: 0, todayTotal: 0 };
  const inverter = systemData?.inverter || { temperature: 0 };

  const isConnected = !error && !!data;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Top Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Solar Power"
                value={solar.power}
                unit="kW"
                icon={Sun}
                color="solar"
                subtitle={`Today: ${solar.todayGeneration.toFixed(1)} kWh`}
                glowClass={solar.power > 0 ? 'glow-solar' : ''}
                tooltip={METRIC_EXPLANATIONS.solarPower}
              />
              <StatCard
                title="Battery Level"
                value={battery.percent}
                unit="%"
                icon={Battery}
                color="battery"
                subtitle={`${battery.power > 0 ? 'Charging' : battery.power < 0 ? 'Discharging' : 'Idle'}`}
                glowClass="glow-battery"
                tooltip={METRIC_EXPLANATIONS.batteryPercent}
              />
              <StatCard
                title="Consumption"
                value={consumption.power}
                unit="kW"
                icon={Home}
                color="energy"
                subtitle={`Today: ${consumption.todayTotal.toFixed(1)} kWh`}
                glowClass="glow-energy"
                tooltip={METRIC_EXPLANATIONS.consumptionPower}
              />
              <StatCard
                title="Grid"
                value={Math.abs(grid.power)}
                unit="kW"
                icon={Zap}
                color="grid"
                subtitle={grid.power > 0 ? 'Importing' : grid.power < 0 ? 'Exporting' : 'Idle'}
                glowClass={grid.power !== 0 ? 'glow-grid' : ''}
                tooltip={METRIC_EXPLANATIONS.gridPower}
              />
            </div>

            {/* Energy Flow */}
            <EnergyFlow
              solar={solar}
              battery={battery}
              grid={grid}
              consumption={consumption}
            />

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <EnergyChart data={dataPoints} title="Today's Power Generation" />
              <DailyStats energyFlows={energyFlows} />
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Self Sufficiency</span>
                  <InfoTooltip content={METRIC_EXPLANATIONS.selfSufficiency} />
                </div>
                <p className="text-3xl font-bold text-energy-400 tabular-nums">
                  {consumption.todayTotal > 0
                    ? ((solar.todayGeneration / consumption.todayTotal) * 100).toFixed(0)
                    : 0}%
                </p>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Thermometer className="w-4 h-4" />
                  <span className="text-sm">Inverter Temp</span>
                  <InfoTooltip content="Operating temperature of your inverter. Optimal range is typically 20-45°C." />
                </div>
                <p className="text-3xl font-bold text-white tabular-nums">{inverter.temperature}°C</p>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">Grid Frequency</span>
                  <InfoTooltip content={METRIC_EXPLANATIONS.gridFrequency} />
                </div>
                <p className="text-3xl font-bold text-white tabular-nums">{grid.frequency.toFixed(2)} Hz</p>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Cpu className="w-4 h-4" />
                  <span className="text-sm">Inverter</span>
                  <InfoTooltip content={METRIC_EXPLANATIONS.inverterSerial} />
                </div>
                <p className="text-lg font-mono text-white truncate">{data?.inverterSerial || 'N/A'}</p>
              </div>
            </div>
          </div>
        );

      case 'solar':
        return (
          <div className="space-y-6">
            <SolarArrays solar={solar} dataPoints={dataPoints} />
            <div className="grid lg:grid-cols-2 gap-6">
              <SolarPanel
                power={solar.power}
                todayGeneration={solar.todayGeneration}
                isGenerating={solar.power > 0}
              />
              <EnergyChart data={dataPoints} title="Solar Generation Today" />
            </div>
          </div>
        );

      case 'battery':
        return (
          <div className="space-y-6">
            <BatteryDetails
              battery={battery}
              inverterInfo={data?.inverterInfo}
              systemData={data?.systemData}
            />
            <div className="grid lg:grid-cols-2 gap-6">
              <BatteryGauge
                percent={battery.percent}
                power={battery.power}
                isCharging={battery.power > 0}
              />
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Battery Cycle Analysis</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Today's Cycles</span>
                    <span className="text-white font-bold">
                      {((battery.todayCharge + battery.todayDischarge) / ((data?.inverterInfo?.info?.battery?.nominal_capacity || 10000) / 1000)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Energy Throughput</span>
                    <span className="text-white font-bold">
                      {(battery.todayCharge + battery.todayDischarge).toFixed(1)} kWh
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Round-trip Efficiency</span>
                    <span className="text-energy-400 font-bold">~90%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'grid':
        return (
          <div className="space-y-6">
            <GridMeter grid={grid} meterData={data?.meterData} />
            <div className="grid lg:grid-cols-2 gap-6">
              <GridStatus grid={grid} />
              <EnergyChart data={dataPoints} title="Grid Power Today" />
            </div>
          </div>
        );

      case 'consumption':
        return (
          <div className="space-y-6">
            <ConsumptionStats
              consumption={consumption}
              solar={solar}
              battery={battery}
              grid={grid}
              energyFlows={energyFlows}
            />
            <EnergyChart data={dataPoints} title="Consumption Pattern Today" />
          </div>
        );

      case 'devices':
        return (
          <div className="space-y-6">
            <DeviceInfo device={data?.device} inverterInfo={data?.inverterInfo} />
            {data?.emsData && !data?.emsData?.error && (
              <EMSStatus emsData={data?.emsData} />
            )}
          </div>
        );

      case 'ev':
        return <EVCharger evChargers={data?.evChargers} />;

      case 'events':
        return <EventsLog events={data?.events} />;

      case 'account':
        return (
          <AccountSettings
            account={data?.account}
            settings={data?.settings}
            sites={data?.sites}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-grid-pattern">
      <Header
        lastUpdated={lastUpdated}
        onRefresh={refresh}
        isLoading={loading}
        isConnected={isConnected}
      />

      {/* Tab Navigation */}
      <div className="sticky top-16 z-40 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide py-2 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-solar-400' : ''}`} />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>GivEnergy Dashboard • Data refreshes every 30 seconds</p>
          <p className="mt-1">
            Last fetched: {data?.fetchedAt ? new Date(data.fetchedAt).toLocaleString() : 'N/A'}
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
