'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Key, ExternalLink, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const steps = [
  {
    number: 1,
    title: 'Go to GivEnergy Portal',
    description: 'Visit your GivEnergy account settings',
  },
  {
    number: 2,
    title: 'Navigate to API Tokens',
    description: 'Click on "API Tokens" in the menu',
  },
  {
    number: 3,
    title: 'Create a New Token',
    description: 'Click "Create Token" and give it a name',
  },
  {
    number: 4,
    title: 'Copy Your Token',
    description: 'Copy the token and paste it below',
  },
];

export default function LoginPage() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!apiKey.trim()) {
      setError('Please enter your API key');
      return;
    }

    setIsLoading(true);
    const result = await login(apiKey.trim());

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-solar-400 to-energy-500 flex items-center justify-center mx-auto mb-4"
          >
            <Sun className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">GivEnergy Dashboard</h1>
          <p className="text-gray-400">Connect your account to view your solar data</p>
        </div>

        {/* Main Card */}
        <div className="glass rounded-2xl p-8">
          {/* Instructions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-energy-400" />
              How to get your API Key
            </h2>

            <div className="space-y-3 mb-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-energy-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-energy-400">{step.number}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{step.title}</p>
                    <p className="text-gray-500 text-xs">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <a
              href="https://givenergy.cloud/account-settings/api-tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-energy-500/20 hover:bg-energy-500/30 text-energy-400 rounded-lg transition-colors text-sm font-medium"
            >
              Open GivEnergy Portal
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 my-6" />

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your API Key
            </label>
            <div className="relative mb-4">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your API key here..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-energy-500/50 focus:ring-1 focus:ring-energy-500/50 pr-12 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm mb-4 p-3 bg-red-500/10 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-energy-500 to-solar-500 text-white font-semibold rounded-xl hover:from-energy-600 hover:to-solar-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sun className="w-5 h-5" />
                  </motion.div>
                  Connecting...
                </>
              ) : (
                <>
                  Connect Dashboard
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 flex items-start gap-2 text-xs text-gray-500">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500/70" />
            <p>
              Your API key is stored securely and only used to fetch your GivEnergy data.
              You can revoke it anytime from the GivEnergy portal.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
