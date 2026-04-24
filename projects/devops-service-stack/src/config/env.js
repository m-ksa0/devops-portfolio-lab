const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT || 5432),
    database: process.env.POSTGRES_DB || 'devops_app',
    user: process.env.POSTGRES_USER || 'devops_user',
    password: process.env.POSTGRES_PASSWORD || 'devops_pass',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT || 6379),
    ttlSeconds: Number(process.env.REDIS_TTL_SECONDS || 60),
  },
};
