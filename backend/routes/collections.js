const express = require('express');
const router = express.Router();
const NetflixTitle = require('../models/collections');

// GET /api/netflix - Retrieve all netflix_titles entries
router.get('/', async (req, res) => {
  try {
    const entries = await NetflixTitle.find();
    res.json({ entries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
