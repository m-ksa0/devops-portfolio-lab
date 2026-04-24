const MAX_LOGS = 200;

const logs = [];

function addLog(source, level, message, meta = {}) {
  logs.unshift({
    timestamp: new Date().toISOString(),
    source,
    level,
    message,
    meta,
  });

  if (logs.length > MAX_LOGS) {
    logs.length = MAX_LOGS;
  }
}

function getLogs(limit = 50) {
  return logs.slice(0, limit);
}

module.exports = {
  addLog,
  getLogs,
};
