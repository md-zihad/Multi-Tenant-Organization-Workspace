import { AppDataSource } from '../config/db.js';
import logger from '../utils/logger.js';

export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: {
      status: 'healthy' | 'unhealthy';
      responseTime?: number;
      error?: string;
    };
    memory: {
      status: 'healthy' | 'unhealthy';
      usage: number;
      total: number;
      percentage: number;
    };
    disk: {
      status: 'healthy' | 'unhealthy';
      usage?: number;
      total?: number;
      percentage?: number;
    };
  };
  uptime: number;
}

export async function performHealthCheck(): Promise<HealthCheck> {
  const startTime = Date.now();
  const healthStatus: HealthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: {
        status: 'unhealthy'
      },
      memory: {
        status: 'healthy',
        usage: 0,
        total: 0,
        percentage: 0
      },
      disk: {
        status: 'healthy'
      }
    },
    uptime: process.uptime()
  };

  // Database health check
  try {
    const dbStartTime = Date.now();
    await AppDataSource.query('SELECT 1');
    const dbResponseTime = Date.now() - dbStartTime;
    
    healthStatus.services.database = {
      status: 'healthy',
      responseTime: dbResponseTime
    };
  } catch (error) {
    healthStatus.services.database = {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown database error'
    };
    healthStatus.status = 'unhealthy';
    logger.error('Database health check failed', { error });
  }

  // Memory health check
  const memUsage = process.memoryUsage();
  const totalMemory = require('os').totalmem();
  const freeMemory = require('os').freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryPercentage = (usedMemory / totalMemory) * 100;

  healthStatus.services.memory = {
    status: memoryPercentage > 90 ? 'unhealthy' : 'healthy',
    usage: memUsage.heapUsed,
    total: memUsage.heapTotal,
    percentage: memoryPercentage
  };

  if (memoryPercentage > 90) {
    healthStatus.status = 'unhealthy';
  }

  // Overall status determination
  const allServicesHealthy = Object.values(healthStatus.services).every(
    service => service.status === 'healthy'
  );

  if (allServicesHealthy && healthStatus.status === 'healthy') {
    logger.info('Health check passed', {
      responseTime: Date.now() - startTime,
      services: healthStatus.services
    });
  } else {
    logger.warn('Health check failed', {
      responseTime: Date.now() - startTime,
      services: healthStatus.services
    });
  }

  return healthStatus;
}

export async function readinessCheck(): Promise<{ ready: boolean; checks: any }> {
  const checks = {
    database: false,
    server: true
  };

  try {
    await AppDataSource.query('SELECT 1');
    checks.database = true;
  } catch (error) {
    logger.error('Readiness check - database failed', { error });
  }

  return {
    ready: checks.database && checks.server,
    checks
  };
}

export async function livenessCheck(): Promise<{ alive: boolean }> {
  return {
    alive: true // If we can respond, we're alive
  };
}
