const { Pool } = require('pg');
const env = require('../config/env');
const { addLog } = require('../monitoring/logStore');

const pool = new Pool({
  host: env.postgres.host,
  port: env.postgres.port,
  database: env.postgres.database,
  user: env.postgres.user,
  password: env.postgres.password,
});

pool.on('error', (err) => {
  addLog('postgres', 'error', 'PostgreSQL pool error', { error: err.message });
});

async function testPostgresConnection() {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    addLog('postgres', 'info', 'PostgreSQL connectivity check passed');
    return true;
  } catch (err) {
    addLog('postgres', 'error', 'PostgreSQL connectivity check failed', {
      error: err.message,
    });
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  testPostgresConnection,
};
