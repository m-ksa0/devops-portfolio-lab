const app = require('./app');
const env = require('./config/env');
const { testPostgresConnection } = require('./db/pool');
const { connectRedis } = require('./cache/redis');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForPostgres(maxAttempts = 15, delayMs = 3000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await testPostgresConnection();
      console.log(`PostgreSQL connected on attempt ${attempt}`);
      return;
    } catch (err) {
      console.log(
        `PostgreSQL not ready yet (attempt ${attempt}/${maxAttempts}): ${err.message}`
      );
      if (attempt === maxAttempts) {
        throw err;
      }
      await sleep(delayMs);
    }
  }
}

async function waitForRedis(maxAttempts = 15, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await connectRedis();
      console.log(`Redis connected on attempt ${attempt}`);
      return;
    } catch (err) {
      console.log(
        `Redis not ready yet (attempt ${attempt}/${maxAttempts}): ${err.message}`
      );
      if (attempt === maxAttempts) {
        throw err;
      }
      await sleep(delayMs);
    }
  }
}

async function startServer() {
  try {
    await waitForPostgres();
    await waitForRedis();

    app.listen(env.port, () => {
      console.log(`Server listening on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error('Startup failed:', err.message);
    process.exit(1);
  }
}

startServer();
