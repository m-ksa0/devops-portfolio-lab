const metrics = {
  totalRequests: 0,
  status2xx: 0,
  status4xx: 0,
  status5xx: 0,
  totalResponseTimeMs: 0,
  cacheHits: 0,
  cacheMisses: 0,
  locationsCreated: 0,
};

function recordRequest(statusCode, durationMs) {
  metrics.totalRequests += 1;
  metrics.totalResponseTimeMs += durationMs;

  if (statusCode >= 200 && statusCode < 300) metrics.status2xx += 1;
  else if (statusCode >= 400 && statusCode < 500) metrics.status4xx += 1;
  else if (statusCode >= 500) metrics.status5xx += 1;
}

function recordCacheHit() {
  metrics.cacheHits += 1;
}

function recordCacheMiss() {
  metrics.cacheMisses += 1;
}

function recordLocationCreated() {
  metrics.locationsCreated += 1;
}

function getMetrics() {
  const avgResponseTimeMs =
    metrics.totalRequests === 0
      ? 0
      : Math.round(metrics.totalResponseTimeMs / metrics.totalRequests);

  return {
    ...metrics,
    avgResponseTimeMs,
  };
}

module.exports = {
  recordRequest,
  recordCacheHit,
  recordCacheMiss,
  recordLocationCreated,
  getMetrics,
};
