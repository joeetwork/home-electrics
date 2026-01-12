'use client';
import { motion } from 'framer-motion';
import { Cpu, Wifi, Thermometer, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { InfoTooltip } from './Tooltip';

export function DeviceInfo({ device, inverter, systemData }) {
  const inverterData = systemData?.inverter || {};

  return (
    <div className="space-y-6">
      {/* Inverter Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            Inverter
          </h3>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Online
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-gray-400 text-sm">Serial Number</p>
            <p className="text-white font-mono mt-1">{device?.inverter?.serial || 'N/A'}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-gray-400 text-sm">Model</p>
            <p className="text-white font-mono mt-1">{device?.inverter?.model || 'GivEnergy Hybrid'}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Temperature
              <InfoTooltip metricKey="inverterTemp" />
            </p>
            <p className={`font-semibold mt-1 ${
              (inverterData.temperature || 0) > 50 ? 'text-orange-400' : 'text-white'
            }`}>
              {inverterData.temperature || '--'}°C
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Power
              <InfoTooltip metricKey="inverterPower" />
            </p>
            <p className="text-white font-semibold mt-1">
              {(inverterData.power || 0).toFixed(2)} W
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Output Voltage
              <InfoTooltip metricKey="outputVoltage" />
            </p>
            <p className="text-white font-semibold mt-1">
              {(inverterData.outputVoltage || 0).toFixed(1)} V
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Output Frequency
              <InfoTooltip metricKey="outputFrequency" />
            </p>
            <p className="text-white font-semibold mt-1">
              {(inverterData.outputFrequency || 0).toFixed(2)} Hz
            </p>
          </div>
        </div>
      </motion.div>

      {/* Communication Device */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Wifi className="w-5 h-5 text-green-400" />
            Communication Device
          </h3>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
            device?.online ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {device?.online ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            {device?.online ? 'Connected' : 'Offline'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-gray-400 text-sm">Serial Number</p>
            <p className="text-white font-mono mt-1">{device?.serial_number || 'N/A'}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-gray-400 text-sm">Type</p>
            <p className="text-white mt-1">{device?.type || 'WiFi Dongle'}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-gray-400 text-sm">Firmware</p>
            <p className="text-white font-mono mt-1">{device?.firmware_version || 'N/A'}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-gray-400 text-sm">Last Seen</p>
            <p className="text-white mt-1">
              {device?.last_seen ? new Date(device.last_seen).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
