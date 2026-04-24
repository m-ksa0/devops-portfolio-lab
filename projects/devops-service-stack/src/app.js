const express = require('express');
const path = require('path');
const pinoHttp = require('pino-http');

const healthRoutes = require('./routes/health');
const locationsRoutes = require('./routes/locations');
const dashboardRoutes = require('./routes/dashboard');
const errorHandler = require('./middleware/errorHandler');
const { addLog } = require('./monitoring/logStore');
const { recordRequest } = require('./monitoring/metricsStore');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

app.use(
  pinoHttp({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  })
);

app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - start;

    recordRequest(res.statusCode, durationMs);

    addLog('api', 'info', `${req.method} ${req.originalUrl}`, {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
    });
  });

  next();
});

app.use('/health', healthRoutes);
app.use('/locations', locationsRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

app.use((req, res) => {
  addLog('api', 'warn', 'Route not found', {
    method: req.method,
    path: req.originalUrl,
  });

  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
