const express = require('express');
const { pool } = require('../db/pool');
const { redisClient } = require('../cache/redis');
const env = require('../config/env');
const { addLog } = require('../monitoring/logStore');
const {
  recordCacheHit,
  recordCacheMiss,
  recordLocationCreated,
} = require('../monitoring/metricsStore');

const router = express.Router();
const CACHE_KEY = 'locations:all';

router.get('/', async (req, res, next) => {
  try {
    const cached = await redisClient.get(CACHE_KEY);

    if (cached) {

      recordCacheHit();
      addLog('redis', 'info', 'Cache hit for locations list', {
        cacheKey: CACHE_KEY,
      });

      return res.json({
        source: 'cache',
        data: JSON.parse(cached),
      });
    }

    recordCacheMiss();
    addLog('redis', 'info', 'Cache miss for locations list', {
      cacheKey: CACHE_KEY,
    });

    const result = await pool.query(
      'SELECT id, name, latitude, longitude, description, created_at FROM locations ORDER BY id ASC'
    );

    await redisClient.setEx(
      CACHE_KEY,
      env.redis.ttlSeconds,
      JSON.stringify(result.rows)
    );

    addLog('redis', 'info', 'Cache refreshed for locations list', {
      cacheKey: CACHE_KEY,
      ttlSeconds: env.redis.ttlSeconds,
    });

    res.json({
      source: 'database',
      data: result.rows,
    });
  } catch (err) {

    addLog('api', 'error', 'Failed to fetch locations', { error: err.message });
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, latitude, longitude, description, created_at FROM locations WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {

      addLog('api', 'warn', 'Location not found', { id: req.params.id });
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {

    addLog('api', 'error', 'Failed to fetch location by id', {
      id: req.params.id,
      error: err.message,
    });
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, latitude, longitude, description } = req.body;

    if (
      !name ||
      typeof latitude !== 'number' ||
      typeof longitude !== 'number'
    ) {

      addLog('api', 'warn', 'Invalid location payload', { body: req.body });
      return res.status(400).json({
        error: 'name, latitude, and longitude are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO locations (name, latitude, longitude, description)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, latitude, longitude, description, created_at`,
      [name, latitude, longitude, description || null]
    );

    await redisClient.del(CACHE_KEY);

    addLog('redis', 'info', 'Cache invalidated after location creation', {
      cacheKey: CACHE_KEY,
    });

    addLog('api', 'info', 'Location created', {
      locationId: result.rows[0].id,
      name: result.rows[0].name,
    });
    recordLocationCreated();

    res.status(201).json(result.rows[0]);
  } catch (err) {
    addLog('api', 'error', 'Failed to create location', { error: err.message });
    next(err);
  }
});

module.exports = router;
