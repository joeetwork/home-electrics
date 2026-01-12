import { motion } from 'framer-motion';
import { Bell, AlertTriangle, CheckCircle, Info, Clock, ChevronRight } from 'lucide-react';

export function EventsLog({ events }) {
  const eventList = events?.data || [];

  const getEventIcon = (event) => {
    const type = event.type?.toLowerCase() || '';
    if (type.includes('error') || type.includes('fault')) {
      return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
    if (type.includes('warning')) {
      return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    }
    if (type.includes('success') || type.includes('complete')) {
      return <CheckCircle className="w-4 h-4 text-energy-400" />;
    }
    return <Info className="w-4 h-4 text-blue-400" />;
  };

  const getEventColor = (event) => {
    const type = event.type?.toLowerCase() || '';
    if (type.includes('error') || type.includes('fault')) {
      return 'border-red-500/30 bg-red-500/5';
    }
    if (type.includes('warning')) {
      return 'border-yellow-500/30 bg-yellow-500/5';
    }
    if (type.includes('success') || type.includes('complete')) {
      return 'border-energy-500/30 bg-energy-500/5';
    }
    return 'border-gray-700 bg-gray-800/30';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-400" />
          Events & Logs
        </h3>
        <span className="text-gray-400 text-sm">{eventList.length} recent events</span>
      </div>

      {eventList.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No recent events</p>
          <p className="text-sm mt-1">System events will appear here</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {eventList.slice(0, 20).map((event, index) => (
            <motion.div
              key={event.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-xl p-4 border ${getEventColor(event)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getEventIcon(event)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-white font-medium truncate">
                      {event.type || event.message || 'System Event'}
                    </h4>
                    <div className="flex items-center gap-1 text-gray-500 text-xs whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {event.time
                        ? new Date(event.time).toLocaleString()
                        : event.created_at
                        ? new Date(event.created_at).toLocaleString()
                        : 'Unknown time'}
                    </div>
                  </div>
                  {event.description && (
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  {event.code && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300 font-mono">
                      Code: {event.code}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
