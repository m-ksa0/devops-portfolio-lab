const express = require('express');
const { pool } = require('../db/pool');
const { redisClient } = require('../cache/redis');
const { getLogs } = require('../monitoring/logStore');
const { getMetrics } = require('../monitoring/metricsStore');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    let postgresStatus = 'down';
    let redisStatus = 'down';
    let locationCount = 0;

    try {
      const dbResult = await pool.query('SELECT COUNT(*)::int AS count FROM locations');
      locationCount = dbResult.rows[0].count;
      postgresStatus = 'up';
    } catch (_) {}

    try {
      redisStatus = redisClient.isOpen ? 'up' : 'down';
    } catch (_) {}

    res.render('dashboard', {
      serviceName: 'devops-service-stack',
      uptimeSeconds: Math.floor(process.uptime()),
      postgresStatus,
      metrics: getMetrics(),
      redisStatus,
      locationCount,
      timestamp: new Date().toISOString(),
      logs: getLogs(50),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
