import client from 'prom-client';

// Create a Registry to register the metrics
const register = new client.Registry();

// Add a default label which can be used to identify metrics
register.setDefaultLabels({
  app: 'multi-tenant-organization-workspace'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

const databaseConnections = new client.Gauge({
  name: 'database_connections_active',
  help: 'Number of active database connections'
});

const jwtTokensIssued = new client.Counter({
  name: 'jwt_tokens_issued_total',
  help: 'Total number of JWT tokens issued'
});

const userRegistrations = new client.Counter({
  name: 'user_registrations_total',
  help: 'Total number of user registrations'
});

const organizationCreations = new client.Counter({
  name: 'organization_creations_total',
  help: 'Total number of organizations created'
});

// Register the custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeConnections);
register.registerMetric(databaseConnections);
register.registerMetric(jwtTokensIssued);
register.registerMetric(userRegistrations);
register.registerMetric(organizationCreations);

export {
  register,
  httpRequestDuration,
  httpRequestTotal,
  activeConnections,
  databaseConnections,
  jwtTokensIssued,
  userRegistrations,
  organizationCreations
};
