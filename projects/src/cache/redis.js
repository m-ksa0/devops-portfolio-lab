const { createClient } = require('redis');
const env = require('../config/env');
const { addLog } = require('../monitoring/logStore');

const redisClient = createClient({
  url: `redis://${env.redis.host}:${env.redis.port}`,
});

redisClient.on('error', (err) => {
  addLog('redis', 'error', 'Redis client error', { error: err.message });
});

redisClient.on('connect', () => {
  addLog('redis', 'info', 'Redis client connecting');
});

redisClient.on('ready', () => {
  addLog('redis', 'info', 'Redis client ready');
});

redisClient.on('reconnecting', () => {
  addLog('redis', 'warn', 'Redis client reconnecting');
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    addLog('redis', 'info', 'Redis connection established');
  }
}

module.exports = {
  redisClient,
  connectRedis,
};
