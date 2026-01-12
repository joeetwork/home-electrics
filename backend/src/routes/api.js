import { Router } from 'express';
import { givEnergyService } from '../services/givenergy.js';

const router = Router();

// ==================== DASHBOARD ====================
router.get('/dashboard', async (req, res) => {
  try {
    const data = await givEnergyService.getDashboardData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== COMMUNICATION DEVICES ====================
router.get('/devices', async (req, res) => {
  try {
    const data = await givEnergyService.getCommunicationDevices();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/devices/:serial', async (req, res) => {
  try {
    const data = await givEnergyService.getCommunicationDevice(req.params.serial);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== INVERTER ====================
router.get('/inverter/:serial/system-data', async (req, res) => {
  try {
    const data = await givEnergyService.getInverterSystemData(req.params.serial);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/inverter/:serial/meter-data', async (req, res) => {
  try {
    const data = await givEnergyService.getInverterMeterDataLatest(req.params.serial);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/inverter/:serial/data-points/:date', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 288;
    const data = await givEnergyService.getInverterDataPoints(req.params.serial, req.params.date, page, pageSize);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/inverter/:serial/events', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const data = await givEnergyService.getInverterEvents(req.params.serial, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/inverter/:serial/settings', async (req, res) => {
  try {
    const data = await givEnergyService.getInverterSettings(req.params.serial);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/inverter/:serial/settings/:id/read', async (req, res) => {
  try {
    const data = await givEnergyService.readInverterSetting(req.params.serial, req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/inverter/:serial/presets', async (req, res) => {
  try {
    const data = await givEnergyService.getInverterPresets(req.params.serial);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== EMS ====================
router.get('/ems/:serial/system-data', async (req, res) => {
  try {
    const data = await givEnergyService.getEMSSystemData(req.params.serial);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ENERGY FLOWS ====================
router.post('/inverter/:serial/energy-flows', async (req, res) => {
  try {
    const { start_date, end_date, grouping = 'day' } = req.body;
    const data = await givEnergyService.getEnergyFlows(req.params.serial, start_date, end_date, grouping);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SITES ====================
router.get('/sites', async (req, res) => {
  try {
    const data = await givEnergyService.getSites();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/sites/:id', async (req, res) => {
  try {
    const data = await givEnergyService.getSite(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/sites/:id/energy-data', async (req, res) => {
  try {
    const data = await givEnergyService.getSiteEnergyDataLatest(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/sites/:id/data-latest', async (req, res) => {
  try {
    const data = await givEnergyService.getSiteDataLatest(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/sites/:id/status', async (req, res) => {
  try {
    const data = await givEnergyService.getSiteStatus(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ACCOUNT ====================
router.get('/account', async (req, res) => {
  try {
    const data = await givEnergyService.getAccount();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== EV CHARGERS ====================
router.get('/ev-chargers', async (req, res) => {
  try {
    const data = await givEnergyService.getEVChargers();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ev-chargers/:uuid', async (req, res) => {
  try {
    const data = await givEnergyService.getEVChargerDetails(req.params.uuid);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ev-chargers/:uuid/meter-data', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const data = await givEnergyService.getEVChargerMeterData(req.params.uuid, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ev-chargers/:uuid/sessions', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const data = await givEnergyService.getEVChargerSessions(req.params.uuid, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SMART DEVICES ====================
router.get('/smart-devices', async (req, res) => {
  try {
    const data = await givEnergyService.getSmartDevices();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/smart-devices/:uuid', async (req, res) => {
  try {
    const data = await givEnergyService.getSmartDevice(req.params.uuid);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/smart-devices/:uuid/data', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const data = await givEnergyService.getSmartDeviceData(req.params.uuid, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
