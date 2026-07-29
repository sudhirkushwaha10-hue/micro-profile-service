const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const ProfileModel = require('../models/profile');

router.post('/api/profiles', requireAuth, async (req, res) => {
  const existing = await ProfileModel.findByUserId(req.userId);
  if (existing) {
    return res.status(400).json({ detail: 'Profile already exists' });
  }

  const profile = await ProfileModel.create(req.userId, req.body);
  res.status(200).json(profile);
});

router.get('/api/profiles/me', requireAuth, async (req, res) => {
  const profile = await ProfileModel.findByUserId(req.userId);
  if (!profile) {
    return res.status(404).json({ detail: 'Profile not found' });
  }
  res.json(profile);
});

router.put('/api/profiles/me', requireAuth, async (req, res) => {
  const profile = await ProfileModel.update(req.userId, req.body);
  if (!profile) {
    return res.status(404).json({ detail: 'Profile not found' });
  }
  res.json(profile);
});

router.delete('/api/profiles/me', requireAuth, async (req, res) => {
  const deleted = await ProfileModel.remove(req.userId);
  if (!deleted) {
    return res.status(404).json({ detail: 'Profile not found' });
  }
  res.json({ message: 'Profile deleted' });
});

router.get('/api/addresses', requireAuth, async (req, res) => {
  const addresses = await ProfileModel.listAddresses(req.userId);
  res.json(addresses);
});

router.post('/api/addresses', requireAuth, async (req, res) => {
  const { label, line, city, pincode } = req.body;
  if (!line) return res.status(400).json({ detail: 'Address line is required' });
  const address = await ProfileModel.addAddress(req.userId, { label: label || 'Home', line, city, pincode });
  res.status(200).json(address);
});

router.delete('/api/addresses/:id', requireAuth, async (req, res) => {
  const deleted = await ProfileModel.removeAddress(req.userId, req.params.id);
  if (!deleted) return res.status(404).json({ detail: 'Address not found' });
  res.json({ message: 'Address deleted' });
});

module.exports = router;