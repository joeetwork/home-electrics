import { motion } from 'framer-motion';
import { User, Settings, MapPin, Mail, Phone, Building, Globe, Clock } from 'lucide-react';

export function AccountSettings({ account, settings, sites }) {
  const acc = account?.data || account || {};
  const siteList = sites?.data || [];
  const settingsList = settings?.data || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-400" />
          Account & Settings
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Account Info */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Account Details</h4>

          {acc.first_name || acc.name ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <User className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-gray-400 text-xs">Name</p>
                  <p className="text-white">{acc.first_name} {acc.surname || acc.name}</p>
                </div>
              </div>

              {acc.email && (
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-gray-400 text-xs">Email</p>
                    <p className="text-white">{acc.email}</p>
                  </div>
                </div>
              )}

              {acc.telephone_number && (
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <Phone className="w-5 h-5 text-energy-400" />
                  <div>
                    <p className="text-gray-400 text-xs">Phone</p>
                    <p className="text-white">{acc.telephone_number}</p>
                  </div>
                </div>
              )}

              {acc.address && (
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <MapPin className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-gray-400 text-xs">Address</p>
                    <p className="text-white text-sm">{acc.address}, {acc.postcode}</p>
                  </div>
                </div>
              )}

              {acc.company && (
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <Building className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-gray-400 text-xs">Company</p>
                    <p className="text-white">{acc.company}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <Globe className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-gray-400 text-xs">Country</p>
                  <p className="text-white">{acc.country || 'United Kingdom'}</p>
                </div>
              </div>

              {acc.timezone && (
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <Clock className="w-5 h-5 text-solar-400" />
                  <div>
                    <p className="text-gray-400 text-xs">Timezone</p>
                    <p className="text-white">{acc.timezone}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Account details unavailable</p>
            </div>
          )}
        </div>

        {/* Sites & Settings */}
        <div className="space-y-6">
          {/* Sites */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Sites</h4>
            {siteList.length > 0 ? (
              <div className="space-y-2">
                {siteList.map((site, index) => (
                  <div key={site.id || index} className="p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-energy-400" />
                        <span className="text-white">{site.name || `Site ${index + 1}`}</span>
                      </div>
                      <span className="text-gray-500 text-sm">{site.postcode}</span>
                    </div>
                    {site.timezone && (
                      <p className="text-gray-500 text-xs mt-1 ml-6">{site.timezone}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 bg-white/5 rounded-xl">
                <p className="text-sm">No sites configured</p>
              </div>
            )}
          </div>

          {/* Inverter Settings Preview */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Inverter Settings
            </h4>
            {settingsList.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {settingsList.slice(0, 10).map((setting, index) => (
                  <div key={setting.id || index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg text-sm">
                    <span className="text-gray-400 truncate flex-1">{setting.name || `Setting ${setting.id}`}</span>
                    <span className="text-white font-mono ml-2">
                      {setting.value !== undefined ? String(setting.value) : 'N/A'}
                    </span>
                  </div>
                ))}
                {settingsList.length > 10 && (
                  <p className="text-center text-gray-500 text-sm py-2">
                    +{settingsList.length - 10} more settings
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 bg-white/5 rounded-xl">
                <p className="text-sm">Settings data unavailable</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Role */}
      {acc.role && (
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Account Role</span>
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-medium">
              {acc.role}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
