import { motion } from 'framer-motion';
import { Cpu, Wifi, Calendar, Shield, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export function DeviceInfo({ device, inverterInfo }) {
  if (!device) return null;

  const inv = inverterInfo || device.inverter || {};
  const info = inv.info || {};
  const warranty = inv.warranty || {};
  const firmware = inv.firmware_version || {};
  const connections = inv.connections || {};

  const isOnline = inv.status === 'NORMAL' || inv.status === 'ONLINE';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400" />
          Device & Inverter
        </h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          isOnline ? 'bg-energy-500/20 text-energy-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {isOnline ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {inv.status || 'Unknown'}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Communication Device */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Communication Device</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-gray-400 flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                Serial Number
              </span>
              <span className="text-white font-mono text-sm">{device.serial_number}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Type</span>
              <span className="text-white">{device.type}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Firmware</span>
              <span className="text-white">v{device.firmware_version}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Commissioned
              </span>
              <span className="text-white">{new Date(device.commission_date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Inverter */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Inverter</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-gray-400 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                Serial Number
              </span>
              <span className="text-white font-mono text-sm">{inv.serial}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Model</span>
              <span className="text-white">{info.model || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-gray-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Last Online
              </span>
              <span className="text-white text-sm">{inv.last_online ? new Date(inv.last_online).toLocaleString() : 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Last Updated</span>
              <span className="text-white text-sm">{inv.last_updated ? new Date(inv.last_updated).toLocaleString() : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Firmware & Warranty Row */}
      <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700/50">
        {/* Firmware Versions */}
        <div className="bg-blue-500/10 rounded-xl p-4">
          <h5 className="text-blue-400 text-sm font-medium mb-2">Firmware</h5>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">ARM</span>
              <span className="text-white">{firmware.ARM || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">DSP</span>
              <span className="text-white">{firmware.DSP || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Warranty */}
        <div className="bg-energy-500/10 rounded-xl p-4">
          <h5 className="text-energy-400 text-sm font-medium mb-2 flex items-center gap-1">
            <Shield className="w-4 h-4" />
            Warranty
          </h5>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Type</span>
              <span className="text-white">{warranty.type || 'Standard'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Expires</span>
              <span className="text-white">{warranty.expiry_date ? new Date(warranty.expiry_date).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Connections */}
        <div className="bg-purple-500/10 rounded-xl p-4">
          <h5 className="text-purple-400 text-sm font-medium mb-2">Connections</h5>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Batteries</span>
              <span className="text-white">{connections.batteries?.length || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Meters</span>
              <span className="text-white">{connections.meters?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Battery Info */}
      {info.battery && (
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Battery Specifications</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-battery-500/10 rounded-xl p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">Capacity</p>
              <p className="text-white font-bold">{info.battery.nominal_capacity} Wh</p>
            </div>
            <div className="bg-battery-500/10 rounded-xl p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">Voltage</p>
              <p className="text-white font-bold">{info.battery.nominal_voltage} V</p>
            </div>
            <div className="bg-battery-500/10 rounded-xl p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">Max Charge</p>
              <p className="text-white font-bold">{(info.max_charge_rate / 1000).toFixed(1)} kW</p>
            </div>
            <div className="bg-battery-500/10 rounded-xl p-3 text-center">
              <p className="text-gray-400 text-xs mb-1">Max Discharge</p>
              <p className="text-white font-bold">{(info.max_discharge_rate / 1000).toFixed(1)} kW</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
