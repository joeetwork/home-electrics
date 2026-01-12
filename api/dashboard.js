const BASE_URL = 'https://api.givenergy.cloud/v1';

async function request(endpoint, authToken, method = 'GET', body = null) {
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
    throw new Error(`GivEnergy API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authToken = process.env.AUTH_TOKEN;

  if (!authToken) {
    return res.status(500).json({ error: 'AUTH_TOKEN not configured' });
  }

  try {
    // Get all communication devices first
    const devicesResponse = await request('/communication-device', authToken);
    const devices = devicesResponse.data || [];

    if (devices.length === 0) {
      return res.status(200).json({ error: 'No devices found' });
    }

    // Get the first device and inverter
    const device = devices[0];
    const inverterSerial = device.inverter?.serial;
    const dongleSerial = device.serial_number;

    if (!inverterSerial) {
      return res.status(200).json({ error: 'No inverter found', devices });
    }

    // Get account info
    const account = await request('/account', authToken).catch(e => ({ error: e.message }));

    // Get all inverter data in parallel
    const [systemData, meterData, settings] = await Promise.all([
      request(`/inverter/${inverterSerial}/system-data/latest`, authToken).catch(e => ({ error: e.message })),
      request(`/inverter/${inverterSerial}/meter-data/latest`, authToken).catch(e => ({ error: e.message })),
      request(`/inverter/${inverterSerial}/settings`, authToken).catch(e => ({ error: e.message }))
    ]);

    // Get EMS data if available
    const emsData = await request(`/ems/${inverterSerial}/system-data/latest`, authToken).catch(e => ({ error: e.message }));

    // Get today's date for data points
    const today = new Date().toISOString().split('T')[0];
    const dataPoints = await request(`/inverter/${inverterSerial}/data-points/${today}?page=1&pageSize=288`, authToken).catch(e => ({ error: e.message }));

    // Get events
    const events = await request(`/inverter/${inverterSerial}/events?page=1`, authToken).catch(e => ({ error: e.message }));

    // Get energy flows for last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const energyFlows = await request(`/inverter/${inverterSerial}/energy-flows`, authToken, 'POST', {
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      grouping: 'day'
    }).catch(e => ({ error: e.message }));

    // Get monthly energy flows
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthlyFlows = await request(`/inverter/${inverterSerial}/energy-flows`, authToken, 'POST', {
      start_date: monthStart.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      grouping: 'day'
    }).catch(e => ({ error: e.message }));

    // Get sites
    const sites = await request('/site', authToken).catch(e => ({ error: e.message }));

    // Get EV chargers
    const evChargers = await request('/ev-charger', authToken).catch(e => ({ error: e.message }));

    // Get smart devices
    const smartDevices = await request('/smart-device', authToken).catch(e => ({ error: e.message }));

    return res.status(200).json({
      // Device info
      devices,
      device,
      dongleSerial,
      inverterSerial,
      inverterInfo: device.inverter,

      // Real-time data
      systemData,
      meterData,
      emsData,

      // Historical data
      dataPoints,
      energyFlows,
      monthlyFlows,
      events,

      // Configuration
      settings,

      // Sites & Account
      sites,
      account,

      // Additional devices
      evChargers,
      smartDevices,

      // Timestamp
      fetchedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
