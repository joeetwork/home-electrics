const BASE_URL = 'https://api.givenergy.cloud/v1';

async function request(endpoint, method = 'GET', body = null) {
  const authToken = process.env.AUTH_TOKEN;

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
    throw new Error(`GivEnergy API error: ${response.status}`);
  }

  return response.json();
}

export async function getDashboardData() {
  try {
    const devicesResponse = await request('/communication-device');
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
      request(`/inverter/${inverterSerial}/system-data/latest`).catch(e => ({ error: e.message })),
      request(`/inverter/${inverterSerial}/meter-data/latest`).catch(e => ({ error: e.message })),
      request('/ev-charger').catch(e => ({ data: [] })),
      request(`/inverter/${inverterSerial}/events?page=1&pageSize=50`).catch(e => ({ data: [] }))
    ]);

    const today = new Date().toISOString().split('T')[0];
    const dataPointsResponse = await request(`/inverter/${inverterSerial}/data-points/${today}?page=1&pageSize=288`).catch(e => ({ data: [] }));

    // Parse system data
    const d = systemData?.data || {};

    const solar = {
      power: d.solar?.power || 0,
      arrays: d.solar?.arrays || [],
    };

    const battery = {
      percent: d.battery?.percent || 0,
      power: d.battery?.power || 0,
      temperature: d.battery?.temperature,
    };

    const grid = {
      power: d.grid?.power || 0,
      voltage: d.grid?.voltage || 0,
      frequency: d.grid?.frequency || 0,
    };

    const consumption = {
      power: d.consumption?.power || 0,
    };

    const inverter = {
      temperature: d.inverter?.temperature || 0,
      outputVoltage: d.inverter?.output_voltage || 0,
      outputFrequency: d.inverter?.output_frequency || 0,
      power: d.inverter?.power || 0,
    };

    const todayStats = {
      solar: d.today?.solar || 0,
      consumption: d.today?.consumption || 0,
      import: d.today?.grid?.import || 0,
      export: d.today?.grid?.export || 0,
      batteryCharge: d.today?.battery?.charge || 0,
      batteryDischarge: d.today?.battery?.discharge || 0,
    };

    // Parse data points for chart
    const dataPoints = (dataPointsResponse?.data || []).map(point => ({
      time: point.time,
      solar: { power: point.solar?.power || 0 },
      consumption: { power: point.consumption?.power || 0 },
      battery: { power: point.battery?.power || 0 },
      grid: { power: point.grid?.power || 0 },
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
