/**
 * 🚀 Ultra Performance Dashboard
 * Real-time monitoring for HOOATS 15K+ TPS system
 * Tracks all ultra components and performance metrics
 */

import { EventEmitter } from 'events';
import Redis from 'ioredis';

interface PerformanceMetrics {
  // System-wide metrics
  systemTPS: number;
  peakTPS: number;
  averageLatency: number;
  uptime: number;
  
  // Component metrics
  components: {
    hybridRouter: ComponentMetrics;
    orderbook: ComponentMetrics;
    settlementQueue: ComponentMetrics;
    security: ComponentMetrics;
    database: ComponentMetrics;
    redis: ComponentMetrics;
  };
  
  // Business metrics
  business: {
    totalOrders: number;
    totalTrades: number;
    totalVolume: number;
    successRate: number;
    errorRate: number;
  };
  
  // Real-time data
  realtime: {
    activeOrders: number;
    queuedSettlements: number;
    connectedUsers: number;
    memoryUsage: number;
    cpuUsage: number;
  };
  
  // Performance targets
  targets: {
    tpsTarget: number;
    latencyTarget: number;
    uptimeTarget: number;
    errorRateTarget: number;
  };
  
  timestamp: number;
}

interface ComponentMetrics {
  tps: number;
  latency: number;
  errorRate: number;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  uptime: number;
  lastError?: string;
  customMetrics?: Record<string, any>;
}

interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  lastTriggered?: number;
  actions: string[];
}

export class PerformanceDashboard extends EventEmitter {
  private static instance: PerformanceDashboard;
  private redis: Redis;
  private isMonitoring = false;
  private monitoringInterval?: NodeJS.Timer;
  private metricsHistory: PerformanceMetrics[] = [];
  private alertRules: AlertRule[] = [];
  private startTime = Date.now();
  
  private currentMetrics: PerformanceMetrics = {
    systemTPS: 0,
    peakTPS: 0,
    averageLatency: 0,
    uptime: 0,
    components: {
      hybridRouter: this.createDefaultComponentMetrics(),
      orderbook: this.createDefaultComponentMetrics(),
      settlementQueue: this.createDefaultComponentMetrics(),
      security: this.createDefaultComponentMetrics(),
      database: this.createDefaultComponentMetrics(),
      redis: this.createDefaultComponentMetrics()
    },
    business: {
      totalOrders: 0,
      totalTrades: 0,
      totalVolume: 0,
      successRate: 100,
      errorRate: 0
    },
    realtime: {
      activeOrders: 0,
      queuedSettlements: 0,
      connectedUsers: 0,
      memoryUsage: 0,
      cpuUsage: 0
    },
    targets: {
      tpsTarget: 15000,
      latencyTarget: 50, // ms
      uptimeTarget: 99.9, // %
      errorRateTarget: 0.1 // %
    },
    timestamp: Date.now()
  };

  private constructor() {
    super();
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.setupDefaultAlerts();
  }

  static getInstance(): PerformanceDashboard {
    if (!PerformanceDashboard.instance) {
      PerformanceDashboard.instance = new PerformanceDashboard();
    }
    return PerformanceDashboard.instance;
  }

  /**
   * Start performance monitoring
   */
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      console.log('📊 Performance monitoring already running');
      return;
    }

    console.log('🚀 Starting Ultra Performance Dashboard...');
    this.isMonitoring = true;
    this.startTime = Date.now();

    // Collect metrics every 1 second for real-time monitoring
    this.monitoringInterval = setInterval(async () => {
      await this.collectMetrics();
      await this.checkAlerts();
      this.emit('metrics_updated', this.currentMetrics);
    }, 1000);

    // Store metrics history every 10 seconds
    setInterval(async () => {
      await this.storeMetricsHistory();
    }, 10000);

    // Cleanup old metrics every hour
    setInterval(async () => {
      await this.cleanupOldMetrics();
    }, 3600000);

    console.log('✅ Ultra Performance Dashboard started');
    console.log(`🎯 Monitoring for ${this.currentMetrics.targets.tpsTarget.toLocaleString()} TPS target`);
  }

  /**
   * Stop performance monitoring
   */
  async stopMonitoring(): Promise<void> {
    console.log('🛑 Stopping Performance Dashboard...');
    
    this.isMonitoring = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }

    console.log('✅ Performance Dashboard stopped');
  }

  /**
   * Collect real-time metrics from all components
   */
  private async collectMetrics(): Promise<void> {
    try {
      const now = Date.now();
      this.currentMetrics.timestamp = now;
      this.currentMetrics.uptime = now - this.startTime;

      // Collect system metrics
      await this.collectSystemMetrics();
      
      // Collect component metrics
      await this.collectComponentMetrics();
      
      // Collect business metrics
      await this.collectBusinessMetrics();
      
      // Collect real-time metrics
      await this.collectRealtimeMetrics();

      // Update peak TPS
      if (this.currentMetrics.systemTPS > this.currentMetrics.peakTPS) {
        this.currentMetrics.peakTPS = this.currentMetrics.systemTPS;
      }

      // Store in metrics history (keep last 100 entries)
      this.metricsHistory.push({ ...this.currentMetrics });
      if (this.metricsHistory.length > 100) {
        this.metricsHistory.shift();
      }

    } catch (error) {
      console.error('❌ Error collecting metrics:', error);
    }
  }

  private async collectSystemMetrics(): Promise<void> {
    // Calculate system TPS from recent metrics
    const recentMetrics = this.metricsHistory.slice(-10);
    if (recentMetrics.length > 1) {
      const totalOrders = recentMetrics[recentMetrics.length - 1].business.totalOrders - recentMetrics[0].business.totalOrders;
      const timeDiff = (recentMetrics[recentMetrics.length - 1].timestamp - recentMetrics[0].timestamp) / 1000;
      this.currentMetrics.systemTPS = timeDiff > 0 ? Math.floor(totalOrders / timeDiff) : 0;
    }

    // Calculate average latency across components
    const componentLatencies = Object.values(this.currentMetrics.components).map(c => c.latency).filter(l => l > 0);
    this.currentMetrics.averageLatency = componentLatencies.length > 0 
      ? Math.round(componentLatencies.reduce((sum, lat) => sum + lat, 0) / componentLatencies.length)
      : 0;
  }

  private async collectComponentMetrics(): Promise<void> {
    // Hybrid Router metrics
    try {
      const routerMetrics = await this.redis.hgetall('metrics:hybrid_router');
      if (routerMetrics) {
        this.currentMetrics.components.hybridRouter = {
          tps: parseInt(routerMetrics.tps) || 0,
          latency: parseFloat(routerMetrics.latency) || 0,
          errorRate: parseFloat(routerMetrics.errorRate) || 0,
          status: routerMetrics.status as ComponentMetrics['status'] || 'offline',
          uptime: parseInt(routerMetrics.uptime) || 0
        };
      }
    } catch (error) {
      this.currentMetrics.components.hybridRouter.status = 'critical';
    }

    // Orderbook metrics
    try {
      const orderbookMetrics = await this.redis.hgetall('metrics:orderbook');
      if (orderbookMetrics) {
        this.currentMetrics.components.orderbook = {
          tps: parseInt(orderbookMetrics.tps) || 0,
          latency: parseFloat(orderbookMetrics.latency) || 0,
          errorRate: parseFloat(orderbookMetrics.errorRate) || 0,
          status: orderbookMetrics.status as ComponentMetrics['status'] || 'offline',
          uptime: parseInt(orderbookMetrics.uptime) || 0,
          customMetrics: {
            activeOrders: parseInt(orderbookMetrics.activeOrders) || 0,
            memoryUsage: parseFloat(orderbookMetrics.memoryUsage) || 0
          }
        };
      }
    } catch (error) {
      this.currentMetrics.components.orderbook.status = 'critical';
    }

    // Settlement Queue metrics
    try {
      const settlementMetrics = await this.redis.hgetall('metrics:settlement_queue');
      if (settlementMetrics) {
        this.currentMetrics.components.settlementQueue = {
          tps: parseInt(settlementMetrics.tps) || 0,
          latency: parseFloat(settlementMetrics.latency) || 0,
          errorRate: parseFloat(settlementMetrics.errorRate) || 0,
          status: settlementMetrics.status as ComponentMetrics['status'] || 'offline',
          uptime: parseInt(settlementMetrics.uptime) || 0,
          customMetrics: {
            queueSize: parseInt(settlementMetrics.queueSize) || 0,
            completed: parseInt(settlementMetrics.completed) || 0,
            failed: parseInt(settlementMetrics.failed) || 0
          }
        };
      }
    } catch (error) {
      this.currentMetrics.components.settlementQueue.status = 'critical';
    }

    // Security metrics
    try {
      const securityMetrics = await this.redis.hgetall('metrics:security');
      if (securityMetrics) {
        this.currentMetrics.components.security = {
          tps: parseInt(securityMetrics.tps) || 0,
          latency: parseFloat(securityMetrics.latency) || 0,
          errorRate: parseFloat(securityMetrics.errorRate) || 0,
          status: securityMetrics.status as ComponentMetrics['status'] || 'offline',
          uptime: parseInt(securityMetrics.uptime) || 0,
          customMetrics: {
            threatsBlocked: parseInt(securityMetrics.threatsBlocked) || 0,
            riskScore: parseFloat(securityMetrics.riskScore) || 0
          }
        };
      }
    } catch (error) {
      this.currentMetrics.components.security.status = 'critical';
    }

    // Database metrics
    try {
      const dbMetrics = await this.redis.hgetall('metrics:database');
      if (dbMetrics) {
        this.currentMetrics.components.database = {
          tps: parseInt(dbMetrics.tps) || 0,
          latency: parseFloat(dbMetrics.latency) || 0,
          errorRate: parseFloat(dbMetrics.errorRate) || 0,
          status: dbMetrics.status as ComponentMetrics['status'] || 'offline',
          uptime: parseInt(dbMetrics.uptime) || 0,
          customMetrics: {
            connections: parseInt(dbMetrics.connections) || 0,
            queryTime: parseFloat(dbMetrics.queryTime) || 0
          }
        };
      }
    } catch (error) {
      this.currentMetrics.components.database.status = 'critical';
    }

    // Redis metrics
    try {
      const info = await this.redis.info('memory');
      const redisMemory = this.parseRedisInfo(info);
      
      this.currentMetrics.components.redis = {
        tps: 0, // Redis doesn't have TPS metric directly
        latency: 0, // Will be measured separately
        errorRate: 0,
        status: 'healthy',
        uptime: parseInt(redisMemory.uptime_in_seconds) || 0,
        customMetrics: {
          memoryUsage: parseInt(redisMemory.used_memory) || 0,
          connectedClients: parseInt(redisMemory.connected_clients) || 0,
          totalKeys: await this.redis.dbsize()
        }
      };
    } catch (error) {
      this.currentMetrics.components.redis.status = 'critical';
    }
  }

  private async collectBusinessMetrics(): Promise<void> {
    try {
      // Get business metrics from Redis
      const businessData = await this.redis.hgetall('metrics:business');
      
      if (businessData) {
        this.currentMetrics.business = {
          totalOrders: parseInt(businessData.totalOrders) || 0,
          totalTrades: parseInt(businessData.totalTrades) || 0,
          totalVolume: parseFloat(businessData.totalVolume) || 0,
          successRate: parseFloat(businessData.successRate) || 100,
          errorRate: parseFloat(businessData.errorRate) || 0
        };
      }
    } catch (error) {
      console.error('❌ Error collecting business metrics:', error);
    }
  }

  private async collectRealtimeMetrics(): Promise<void> {
    try {
      // Memory and CPU usage
      const memoryUsage = process.memoryUsage();
      this.currentMetrics.realtime.memoryUsage = Math.round(memoryUsage.heapUsed / 1024 / 1024); // MB

      // CPU usage (simplified)
      const cpuUsage = process.cpuUsage();
      this.currentMetrics.realtime.cpuUsage = Math.round((cpuUsage.user + cpuUsage.system) / 1000000); // %

      // Active orders from orderbook
      this.currentMetrics.realtime.activeOrders = this.currentMetrics.components.orderbook.customMetrics?.activeOrders || 0;

      // Queued settlements
      this.currentMetrics.realtime.queuedSettlements = this.currentMetrics.components.settlementQueue.customMetrics?.queueSize || 0;

      // Connected users (mock for now)
      this.currentMetrics.realtime.connectedUsers = await this.redis.scard('connected_users') || 0;

    } catch (error) {
      console.error('❌ Error collecting realtime metrics:', error);
    }
  }

  /**
   * Store metrics history to Redis
   */
  private async storeMetricsHistory(): Promise<void> {
    try {
      const metricsKey = `metrics:history:${Math.floor(Date.now() / 10000)}`; // 10-second buckets
      await this.redis.setex(metricsKey, 3600, JSON.stringify(this.currentMetrics)); // Store for 1 hour
    } catch (error) {
      console.error('❌ Error storing metrics history:', error);
    }
  }

  /**
   * Setup default alert rules
   */
  private setupDefaultAlerts(): void {
    this.alertRules = [
      {
        id: 'low_tps',
        name: 'Low TPS Performance',
        condition: 'systemTPS < threshold',
        threshold: 5000,
        severity: 'high',
        enabled: true,
        actions: ['log', 'notification']
      },
      {
        id: 'high_latency',
        name: 'High System Latency',
        condition: 'averageLatency > threshold',
        threshold: 100,
        severity: 'medium',
        enabled: true,
        actions: ['log']
      },
      {
        id: 'component_offline',
        name: 'Component Offline',
        condition: 'component.status == offline',
        threshold: 1,
        severity: 'critical',
        enabled: true,
        actions: ['log', 'notification', 'restart']
      },
      {
        id: 'high_error_rate',
        name: 'High Error Rate',
        condition: 'errorRate > threshold',
        threshold: 5.0,
        severity: 'high',
        enabled: true,
        actions: ['log', 'notification']
      },
      {
        id: 'settlement_queue_backlog',
        name: 'Settlement Queue Backlog',
        condition: 'queuedSettlements > threshold',
        threshold: 1000,
        severity: 'medium',
        enabled: true,
        actions: ['log']
      }
    ];
  }

  /**
   * Check alert conditions
   */
  private async checkAlerts(): Promise<void> {
    for (const rule of this.alertRules) {
      if (!rule.enabled) continue;

      let triggered = false;

      // Check rule conditions
      switch (rule.condition) {
        case 'systemTPS < threshold':
          triggered = this.currentMetrics.systemTPS < rule.threshold;
          break;
        case 'averageLatency > threshold':
          triggered = this.currentMetrics.averageLatency > rule.threshold;
          break;
        case 'errorRate > threshold':
          triggered = this.currentMetrics.business.errorRate > rule.threshold;
          break;
        case 'queuedSettlements > threshold':
          triggered = this.currentMetrics.realtime.queuedSettlements > rule.threshold;
          break;
        case 'component.status == offline':
          triggered = Object.values(this.currentMetrics.components).some(c => c.status === 'offline');
          break;
      }

      if (triggered) {
        const now = Date.now();
        
        // Avoid spam (don't trigger same alert within 1 minute)
        if (rule.lastTriggered && (now - rule.lastTriggered) < 60000) {
          continue;
        }

        rule.lastTriggered = now;
        
        await this.handleAlert(rule);
      }
    }
  }

  /**
   * Handle triggered alert
   */
  private async handleAlert(rule: AlertRule): Promise<void> {
    console.log(`🚨 ALERT: ${rule.name} (${rule.severity.toUpperCase()})`);
    
    const alertData = {
      rule,
      metrics: this.currentMetrics,
      timestamp: Date.now()
    };

    // Execute alert actions
    for (const action of rule.actions) {
      switch (action) {
        case 'log':
          console.log(`📝 Alert logged: ${rule.name}`);
          break;
        case 'notification':
          this.emit('alert', alertData);
          break;
        case 'restart':
          console.log(`🔄 Component restart requested for: ${rule.name}`);
          break;
      }
    }

    // Store alert in Redis
    await this.redis.lpush('alerts:recent', JSON.stringify(alertData));
    await this.redis.ltrim('alerts:recent', 0, 99); // Keep last 100 alerts
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.currentMetrics };
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(limit: number = 50): PerformanceMetrics[] {
    return this.metricsHistory.slice(-limit);
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const uptime = (Date.now() - this.startTime) / 1000;
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    
    return {
      // Performance status
      status: this.getOverallStatus(),
      
      // Key metrics
      metrics: {
        systemTPS: this.currentMetrics.systemTPS,
        peakTPS: this.currentMetrics.peakTPS,
        averageLatency: this.currentMetrics.averageLatency,
        uptime: `${uptimeHours}h ${uptimeMinutes}m`,
        successRate: this.currentMetrics.business.successRate
      },
      
      // Target achievement
      targets: {
        tpsAchievement: Math.round((this.currentMetrics.systemTPS / this.currentMetrics.targets.tpsTarget) * 100),
        latencyAchievement: this.currentMetrics.averageLatency <= this.currentMetrics.targets.latencyTarget,
        uptimeAchievement: true, // Simplified
        errorRateAchievement: this.currentMetrics.business.errorRate <= this.currentMetrics.targets.errorRateTarget
      },
      
      // Component health
      componentHealth: Object.entries(this.currentMetrics.components).map(([name, metrics]) => ({
        name,
        status: metrics.status,
        tps: metrics.tps,
        latency: metrics.latency
      }))
    };
  }

  /**
   * Get overall system status
   */
  private getOverallStatus(): 'healthy' | 'warning' | 'critical' {
    const componentStatuses = Object.values(this.currentMetrics.components).map(c => c.status);
    
    if (componentStatuses.some(s => s === 'critical')) {
      return 'critical';
    }
    
    if (componentStatuses.some(s => s === 'warning') || 
        this.currentMetrics.systemTPS < this.currentMetrics.targets.tpsTarget * 0.5) {
      return 'warning';
    }
    
    return 'healthy';
  }

  /**
   * Cleanup old metrics
   */
  private async cleanupOldMetrics(): Promise<void> {
    try {
      const pattern = 'metrics:history:*';
      const keys = await this.redis.keys(pattern);
      
      // Remove metrics older than 24 hours
      const cutoff = Date.now() - (24 * 60 * 60 * 1000);
      
      for (const key of keys) {
        const timestamp = parseInt(key.split(':')[2]) * 10000;
        if (timestamp < cutoff) {
          await this.redis.del(key);
        }
      }
      
      console.log(`🧹 Cleaned up ${keys.length} old metric entries`);
    } catch (error) {
      console.error('❌ Error cleaning up metrics:', error);
    }
  }

  private createDefaultComponentMetrics(): ComponentMetrics {
    return {
      tps: 0,
      latency: 0,
      errorRate: 0,
      status: 'offline',
      uptime: 0
    };
  }

  private parseRedisInfo(info: string): Record<string, string> {
    const result: Record<string, string> = {};
    const lines = info.split('\r\n');
    
    for (const line of lines) {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        result[key] = value;
      }
    }
    
    return result;
  }
}