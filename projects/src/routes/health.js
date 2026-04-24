const express = require('express');
const { testPostgresConnection } = require('../db/pool');
const { redisClient } = require('../cache/redis');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    let postgres = 'down';
    let redis = 'down';

    try {
      await testPostgresConnection();
      postgres = 'up';
    } catch (_) {}

    try {
      redis = redisClient.isOpen ? 'up' : 'down';
    } catch (_) {}

    const overall = postgres === 'up' && redis === 'up' ? 'ok' : 'degraded';

    res.json({
      status: overall,
      service: 'devops-service-stack',
      dependencies: {
        postgres,
        redis,
      },
      uptimeSeconds: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
