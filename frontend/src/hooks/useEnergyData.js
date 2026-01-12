import { useState, useEffect, useCallback } from "react";

export function useEnergyData(refreshInterval = 30000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return { data, loading, error, lastUpdated, refresh: fetchData };
}

// Parse system data for easier consumption
export function parseSystemData(systemData) {
  if (!systemData?.data) return null;

  const d = systemData.data;

  return {
    // Solar
    solar: {
      power: d.solar?.power || 0,
      arrays: d.solar?.arrays || [],
      todayGeneration: d.today?.solar || 0,
      totalGeneration: d.total?.solar || 0,
    },
    // Battery
    battery: {
      percent: d.battery?.percent || 0,
      power: d.battery?.power || 0,
      temperature: d.battery?.temperature || 0,
      todayCharge: d.today?.battery?.charge || 0,
      todayDischarge: d.today?.battery?.discharge || 0,
    },
    // Grid
    grid: {
      voltage: d.grid?.voltage || 0,
      current: d.grid?.current || 0,
      power: d.grid?.power || 0,
      frequency: d.grid?.frequency || 0,
      todayImport: d.today?.grid?.import || 0,
      todayExport: d.today?.grid?.export || 0,
    },
    // Consumption
    consumption: {
      power: d.consumption?.power || 0,
      todayTotal: d.today?.consumption || 0,
    },
    // Inverter
    inverter: {
      temperature: d.inverter?.temperature || 0,
      outputVoltage: d.inverter?.output_voltage || 0,
      outputFrequency: d.inverter?.output_frequency || 0,
      power: d.inverter?.power || 0,
    },
    // Timestamps
    timestamp: d.time,
  };
}
