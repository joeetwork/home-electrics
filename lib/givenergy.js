const BASE_URL = 'https://api.givenergy.cloud/v1';

async function request(endpoint, authToken, method = 'GET', body = null) {
  if (!authToken) {
    throw new Error('No authentication token provided');
  }

  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    throw new Error(`GivEnergy API error: ${response.status}`);
  }

  return response.json();
}

export async function getDashboardData(authToken) {
  try {
    const devicesResponse = await request('/communication-device', authToken);
    const devices = devicesResponse.data || [];

    if (devices.length === 0) {
      throw new Error('No devices found');
    }

    const device = devices[0];
    const inverterSerial = device.inverter?.serial;

    if (!inverterSerial) {
      throw new Error('No inverter found');
    }

    // Fetch all data in parallel
    const [systemData, meterData, evChargers, events] = await Promise.all([
      request(`/inverter/${inverterSerial}/system-data/latest`, authToken).catch(e => ({ error: e.message })),
      request(`/inverter/${inverterSerial}/meter-data/latest`, authToken).catch(e => ({ error: e.message })),
      request('/ev-charger', authToken).catch(e => ({ data: [] })),
      request(`/inverter/${inverterSerial}/events?page=1&pageSize=50`, authToken).catch(e => ({ data: [] }))
    ]);

    const today = new Date().toISOString().split('T')[0];
    const dataPointsResponse = await request(`/inverter/${inverterSerial}/data-points/${today}?page=1&pageSize=288`, authToken).catch(e => ({ data: [] }));

    // Parse system data
    // API returns power in Watts (W) - convert to kW for display
    const d = systemData?.data || {};

    const solar = {
      power: (d.solar?.power || 0) / 1000, // W -> kW
      arrays: (d.solar?.arrays || []).map(arr => ({
        ...arr,
        power: (arr.power || 0) / 1000, // W -> kW
      })),
    };

    const battery = {
      percent: d.battery?.percent || 0,
      power: (d.battery?.power || 0) / 1000, // W -> kW
      temperature: d.battery?.temperature,
    };

    const grid = {
      power: (d.grid?.power || 0) / 1000, // W -> kW
      voltage: d.grid?.voltage || 0,
      frequency: d.grid?.frequency || 0,
    };

    // consumption is a number in system-data, not an object
    const consumption = {
      power: (typeof d.consumption === 'number' ? d.consumption : d.consumption?.power || 0) / 1000, // W -> kW
    };

    const inverter = {
      temperature: d.inverter?.temperature || 0,
      outputVoltage: d.inverter?.output_voltage || 0,
      outputFrequency: d.inverter?.output_frequency || 0,
      power: (d.inverter?.power || 0) / 1000, // W -> kW
    };

    // Get today stats from the last data point (already in kWh from API)
    const lastDataPoint = dataPointsResponse?.data?.slice(-1)[0];
    const todayData = lastDataPoint?.today || {};

    const todayStats = {
      solar: todayData.solar || 0, // Already in kWh
      consumption: todayData.consumption || 0, // Already in kWh
      import: todayData.grid?.import || 0, // Already in kWh
      export: todayData.grid?.export || 0, // Already in kWh
      batteryCharge: todayData.battery?.charge || 0, // Already in kWh
      batteryDischarge: todayData.battery?.discharge || 0, // Already in kWh
    };

    // Parse data points for chart - power values are nested under 'power' object
    const dataPoints = (dataPointsResponse?.data || []).map(point => ({
      time: point.time,
      solar: { power: (point.power?.solar?.power || 0) / 1000 }, // W -> kW
      consumption: { power: (point.power?.consumption?.power || 0) / 1000 }, // W -> kW
      battery: { power: (point.power?.battery?.power || 0) / 1000 }, // W -> kW
      grid: { power: (point.power?.grid?.power || 0) / 1000 }, // W -> kW
    }));

    return {
      solar,
      battery,
      grid,
      consumption,
      inverter,
      todayStats,
      dataPoints,
      device,
      inverterSerial,
      evChargers,
      events,
      systemData: { inverter },
      timestamp: d.time,
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    throw error;
  }
}

export function parseSystemData(systemData) {
  if (!systemData?.data) return null;

  const d = systemData.data;

  return {
    solar: {
      power: d.solar?.power || 0,
      arrays: d.solar?.arrays || [],
      todayGeneration: d.today?.solar || 0,
      totalGeneration: d.total?.solar || 0,
    },
    battery: {
      percent: d.battery?.percent || 0,
      power: d.battery?.power || 0,
      temperature: d.battery?.temperature || 0,
      todayCharge: d.today?.battery?.charge || 0,
      todayDischarge: d.today?.battery?.discharge || 0,
    },
    grid: {
      voltage: d.grid?.voltage || 0,
      current: d.grid?.current || 0,
      power: d.grid?.power || 0,
      frequency: d.grid?.frequency || 0,
      todayImport: d.today?.grid?.import || 0,
      todayExport: d.today?.grid?.export || 0,
    },
    consumption: {
      power: d.consumption?.power || 0,
      todayTotal: d.today?.consumption || 0,
    },
    inverter: {
      temperature: d.inverter?.temperature || 0,
      outputVoltage: d.inverter?.output_voltage || 0,
      outputFrequency: d.inverter?.output_frequency || 0,
      power: d.inverter?.power || 0,
    },
    timestamp: d.time,
  };
}
