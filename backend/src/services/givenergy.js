import fetch from 'node-fetch';
import { config } from '../config.js';

class GivEnergyService {
  constructor() {
    this.baseUrl = config.givEnergyBaseUrl;
    this.headers = {
      'Authorization': `Bearer ${config.authToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async request(endpoint, method = 'GET', body = null) {
    const options = {
      method,
      headers: this.headers
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`GivEnergy API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // ==================== COMMUNICATION DEVICES ====================
  async getCommunicationDevices() {
    return this.request('/communication-device');
  }

  async getCommunicationDevice(serialNumber) {
    return this.request(`/communication-device/${serialNumber}`);
  }

  // ==================== INVERTER DATA ====================
  async getInverterSystemData(serialNumber) {
    return this.request(`/inverter/${serialNumber}/system-data/latest`);
  }

  async getInverterMeterDataLatest(serialNumber) {
    return this.request(`/inverter/${serialNumber}/meter-data/latest`);
  }

  async getInverterDataPoints(serialNumber, date, page = 1, pageSize = 288) {
    return this.request(`/inverter/${serialNumber}/data-points/${date}?page=${page}&pageSize=${pageSize}`);
  }

  async getInverterEvents(serialNumber, page = 1) {
    return this.request(`/inverter/${serialNumber}/events?page=${page}`);
  }

  async getInverterSettings(serialNumber) {
    return this.request(`/inverter/${serialNumber}/settings`);
  }

  async readInverterSetting(serialNumber, settingId) {
    return this.request(`/inverter/${serialNumber}/settings/${settingId}/read`, 'POST');
  }

  async getInverterPresets(serialNumber) {
    return this.request(`/inverter/${serialNumber}/presets`);
  }

  // ==================== EMS DATA ====================
  async getEMSSystemData(serialNumber) {
    return this.request(`/ems/${serialNumber}/system-data/latest`);
  }

  // ==================== ENERGY FLOWS ====================
  async getEnergyFlows(serialNumber, startDate, endDate, grouping = 'day') {
    return this.request(`/inverter/${serialNumber}/energy-flows`, 'POST', {
      start_date: startDate,
      end_date: endDate,
      grouping
    });
  }

  // ==================== SITE DATA ====================
  async getSites() {
    return this.request('/site');
  }

  async getSite(siteId) {
    return this.request(`/site/${siteId}`);
  }

  async getSiteEnergyDataLatest(siteId) {
    return this.request(`/site/${siteId}/energy-data-latest`);
  }

  async getSiteDataLatest(siteId) {
    return this.request(`/site/${siteId}/data-latest`);
  }

  async getSiteStatus(siteId) {
    return this.request(`/site/${siteId}/status`);
  }

  // ==================== ACCOUNT ====================
  async getAccount() {
    return this.request('/account');
  }

  // ==================== EV CHARGERS ====================
  async getEVChargers() {
    return this.request('/ev-charger');
  }

  async getEVCharger(uuid) {
    return this.request(`/ev-charger/${uuid}`);
  }

  async getEVChargerMeterData(uuid, page = 1) {
    return this.request(`/ev-charger/${uuid}/meter-data?page=${page}`);
  }

  async getEVChargerCommands(uuid) {
    return this.request(`/ev-charger/${uuid}/commands`);
  }

  async getEVChargerSessions(uuid, page = 1) {
    return this.request(`/ev-charger/${uuid}/charging-sessions?page=${page}`);
  }

  // ==================== SMART DEVICES ====================
  async getSmartDevices() {
    return this.request('/smart-device');
  }

  async getSmartDevice(uuid) {
    return this.request(`/smart-device/${uuid}`);
  }

  async getSmartDeviceData(uuid, page = 1) {
    return this.request(`/smart-device/${uuid}/data?page=${page}`);
  }

  // ==================== COMPREHENSIVE DASHBOARD DATA ====================
  async getDashboardData() {
    try {
      // Get all communication devices first
      const devicesResponse = await this.getCommunicationDevices();
      const devices = devicesResponse.data || [];

      if (devices.length === 0) {
        return { error: 'No devices found' };
      }

      // Get the first device and inverter
      const device = devices[0];
      const inverterSerial = device.inverter?.serial;
      const dongleSerial = device.serial_number;

      if (!inverterSerial) {
        return { error: 'No inverter found', devices };
      }

      // Get account info
      const account = await this.getAccount().catch(e => ({ error: e.message }));

      // Get all inverter data in parallel
      const [systemData, meterData, settings] = await Promise.all([
        this.getInverterSystemData(inverterSerial).catch(e => ({ error: e.message })),
        this.getInverterMeterDataLatest(inverterSerial).catch(e => ({ error: e.message })),
        this.getInverterSettings(inverterSerial).catch(e => ({ error: e.message }))
      ]);

      // Get EMS data if available
      const emsData = await this.getEMSSystemData(inverterSerial).catch(e => ({ error: e.message }));

      // Get today's date for data points
      const today = new Date().toISOString().split('T')[0];
      const dataPoints = await this.getInverterDataPoints(inverterSerial, today).catch(e => ({ error: e.message }));

      // Get events
      const events = await this.getInverterEvents(inverterSerial).catch(e => ({ error: e.message }));

      // Get energy flows for last 7 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const energyFlows = await this.getEnergyFlows(
        inverterSerial,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        'day'
      ).catch(e => ({ error: e.message }));

      // Get monthly energy flows
      const monthStart = new Date();
      monthStart.setDate(1);
      const monthlyFlows = await this.getEnergyFlows(
        inverterSerial,
        monthStart.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        'day'
      ).catch(e => ({ error: e.message }));

      // Get sites
      const sites = await this.getSites().catch(e => ({ error: e.message }));

      // Get EV chargers
      const evChargers = await this.getEVChargers().catch(e => ({ error: e.message }));

      // Get smart devices
      const smartDevices = await this.getSmartDevices().catch(e => ({ error: e.message }));

      return {
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
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  // Get detailed EV charger data
  async getEVChargerDetails(uuid) {
    try {
      const [charger, meterData, commands, sessions] = await Promise.all([
        this.getEVCharger(uuid).catch(e => ({ error: e.message })),
        this.getEVChargerMeterData(uuid).catch(e => ({ error: e.message })),
        this.getEVChargerCommands(uuid).catch(e => ({ error: e.message })),
        this.getEVChargerSessions(uuid).catch(e => ({ error: e.message }))
      ]);

      return { charger, meterData, commands, sessions };
    } catch (error) {
      return { error: error.message };
    }
  }
}

export const givEnergyService = new GivEnergyService();
