const express = require('express');
const { getProfileByUserId, updateProfile } = require('../../db/controllers/profileController');
const router = express.Router();

// Get profile by user ID
router.get('/:userId', async (req, res) => {
  const profile = await getProfileByUserId(Number(req.params.userId));
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  res.json(profile);
});

// Update profile
router.put('/:userId', async (req, res) => {
  const updated = await updateProfile(Number(req.params.userId), req.body);
  if (!updated) return res.status(404).json({ message: 'Profile not found' });
  res.json(updated);
});

module.exports = router;
