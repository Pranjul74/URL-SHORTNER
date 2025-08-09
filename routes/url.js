const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const { nanoid } = require('nanoid');
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// Create short URL
router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) return res.status(400).json({ error: 'Long URL is required' });

  try {
    // Check if URL already exists
    let url = await Url.findOne({ longUrl });
    if (url) {
      return res.json(url);
    }

    // Create shortId
    const shortId = nanoid(7);
    const shortUrl = `${BASE_URL}/${shortId}`;

    url = new Url({ longUrl, shortId });
    await url.save();

    res.json({ longUrl, shortUrl, shortId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Redirect short URL to long URL
router.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;

  try {
    const url = await Url.findOne({ shortId });

    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json({ error: 'URL not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all URLs (for user dashboard or testing)
router.get('', async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
