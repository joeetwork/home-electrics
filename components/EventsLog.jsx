'use client';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

export function EventsLog({ events }) {
  const eventList = events?.data || [];

  const getEventIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'error':
      case 'fault':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getEventColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'error':
      case 'fault':
        return 'border-red-500/30 bg-red-500/5';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/5';
      case 'success':
        return 'border-green-500/30 bg-green-500/5';
      default:
        return 'border-blue-500/30 bg-blue-500/5';
    }
  };

  if (eventList.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 text-center"
      >
        <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Recent Events</h3>
        <p className="text-gray-400">
          Your system is running smoothly with no recent events to report.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-400" />
          System Events
        </h3>
        <span className="text-sm text-gray-400">{eventList.length} events</span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {eventList.map((event, index) => (
          <motion.div
            key={event.id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl border ${getEventColor(event.type)}`}
          >
            <div className="flex items-start gap-3">
              {getEventIcon(event.type)}
              <div className="flex-1">
                <p className="text-white font-medium">{event.message || event.description || 'System Event'}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {event.time ? new Date(event.time).toLocaleString() : 'Unknown time'}
                </p>
              </div>
              {event.code && (
                <span className="text-xs font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded">
                  {event.code}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
