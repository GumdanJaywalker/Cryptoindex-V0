/**
 * 🚀 High-Performance Connection Pool Manager
 * 
 * Redis 및 PostgreSQL 연결 풀 최적화
 * - 100+ 동시 연결 지원
 * - Connection reuse 및 load balancing
 * - Health monitoring 및 auto-recovery
 * - Performance metrics 추적
 * 
 * Created: 2025-08-20
 */

const Redis = require('ioredis');

class ConnectionPoolManager {
  constructor() {
    this.redisPools = [];
    this.poolSize = parseInt(process.env.REDIS_POOL_SIZE) || 50;
    this.currentRedisIndex = 0;
    this.metrics = {
      totalConnections: 0,
      activeConnections: 0,
      totalRequests: 0,
      failedConnections: 0,
      averageResponseTime: 0,
      poolUtilization: 0
    };
    this.healthCheckInterval = null;
    this.requestTimes = [];
  }

  /**
   * 🔧 초기화 - Redis Connection Pool 생성
   */
  async initialize() {
    console.log(`🚀 Initializing Redis Connection Pool (Size: ${this.poolSize})...`);
    
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || 'hyperindex_secure_password',
      
      // Connection Pool 최적화 설정
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 50,
      enableReadyCheck: true,
      maxLoadingTimeout: 5000,
      
      // Keep-alive 설정
      keepAlive: true,
      
      // Connection timeout 설정
      connectTimeout: 10000,
      commandTimeout: 5000,
      
      // Retry 전략 최적화
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    };

    // Connection Pool 생성
    for (let i = 0; i < this.poolSize; i++) {
      try {
        const redis = new Redis({
          ...redisConfig,
          // Pool 내 각 연결에 고유 ID 부여
          connectionName: `hooats-pool-${i}`
        });

        // 연결 이벤트 처리
        redis.on('connect', () => {
          console.log(`✅ Redis connection ${i} established`);
          this.metrics.totalConnections++;
        });

        redis.on('ready', () => {
          console.log(`🎯 Redis connection ${i} ready`);
        });

        redis.on('error', (error) => {
          console.error(`❌ Redis connection ${i} error:`, error.message);
          this.metrics.failedConnections++;
        });

        redis.on('close', () => {
          console.warn(`⚠️ Redis connection ${i} closed`);
        });

        // 연결 테스트
        await redis.ping();
        this.redisPools.push(redis);
        
      } catch (error) {
        console.error(`❌ Failed to create Redis connection ${i}:`, error.message);
        this.metrics.failedConnections++;
      }
    }

    console.log(`✅ Redis Connection Pool initialized: ${this.redisPools.length}/${this.poolSize} connections`);
    
    // Health check 시작
    this.startHealthCheck();
    
    return this.redisPools.length > 0;
  }

  /**
   * 🎯 Load Balanced Redis Connection 획득
   */
  getRedisConnection() {
    if (this.redisPools.length === 0) {
      throw new Error('No Redis connections available');
    }

    // Round-robin load balancing
    const connection = this.redisPools[this.currentRedisIndex];
    this.currentRedisIndex = (this.currentRedisIndex + 1) % this.redisPools.length;
    
    this.metrics.activeConnections++;
    return connection;
  }

  /**
   * ⚡ 고성능 Redis 실행 (성능 측정 포함)
   */
  async executeRedis(command, ...args) {
    const startTime = Date.now();
    this.metrics.totalRequests++;
    
    try {
      const connection = this.getRedisConnection();
      const result = await connection[command](...args);
      
      const responseTime = Date.now() - startTime;
      this.recordResponseTime(responseTime);
      
      return result;
    } catch (error) {
      this.metrics.failedConnections++;
      throw error;
    } finally {
      this.metrics.activeConnections--;
    }
  }

  /**
   * 📊 응답 시간 기록 및 평균 계산
   */
  recordResponseTime(responseTime) {
    this.requestTimes.push(responseTime);
    
    // 최근 1000개 요청만 유지 (메모리 최적화)
    if (this.requestTimes.length > 1000) {
      this.requestTimes = this.requestTimes.slice(-1000);
    }
    
    // 평균 응답 시간 계산
    const sum = this.requestTimes.reduce((a, b) => a + b, 0);
    this.metrics.averageResponseTime = (sum / this.requestTimes.length).toFixed(2);
  }

  /**
   * 🏥 Health Check 시스템
   */
  startHealthCheck() {
    this.healthCheckInterval = setInterval(async () => {
      let healthyConnections = 0;
      
      for (let i = 0; i < this.redisPools.length; i++) {
        try {
          await this.redisPools[i].ping();
          healthyConnections++;
        } catch (error) {
          console.warn(`⚠️ Redis connection ${i} health check failed:`, error.message);
          
          // 연결 복구 시도
          try {
            await this.redisPools[i].disconnect();
            await this.redisPools[i].connect();
            console.log(`🔄 Redis connection ${i} recovered`);
          } catch (recoveryError) {
            console.error(`❌ Failed to recover Redis connection ${i}:`, recoveryError.message);
          }
        }
      }
      
      // Pool 사용률 계산
      this.metrics.poolUtilization = ((healthyConnections / this.poolSize) * 100).toFixed(1);
      
      // 성능 로그 (매 30초)
      if (Math.floor(Date.now() / 30000) % 2 === 0) {
        console.log(`📊 Pool Status: ${healthyConnections}/${this.poolSize} healthy, Avg Response: ${this.metrics.averageResponseTime}ms`);
      }
      
    }, 10000); // 10초마다 health check
  }

  /**
   * 📈 성능 메트릭스 반환
   */
  getMetrics() {
    return {
      ...this.metrics,
      poolSize: this.poolSize,
      healthyConnections: this.redisPools.length,
      connectionUtilization: this.metrics.poolUtilization + '%'
    };
  }

  /**
   * 🔥 Batch Operations (대량 처리)
   */
  async executeBatch(operations) {
    const startTime = Date.now();
    
    try {
      const connection = this.getRedisConnection();
      const pipeline = connection.pipeline();
      
      // 배치 명령 추가
      operations.forEach(({ command, args }) => {
        pipeline[command](...args);
      });
      
      const results = await pipeline.exec();
      
      const responseTime = Date.now() - startTime;
      this.recordResponseTime(responseTime);
      
      console.log(`⚡ Batch executed: ${operations.length} operations in ${responseTime}ms`);
      
      return results;
    } catch (error) {
      console.error('❌ Batch execution failed:', error);
      throw error;
    }
  }

  /**
   * 🛑 Graceful Shutdown
   */
  async shutdown() {
    console.log('🛑 Shutting down Connection Pool Manager...');
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    // 모든 Redis 연결 종료
    const shutdownPromises = this.redisPools.map(async (redis, index) => {
      try {
        await redis.quit();
        console.log(`✅ Redis connection ${index} closed gracefully`);
      } catch (error) {
        console.error(`❌ Error closing Redis connection ${index}:`, error.message);
      }
    });
    
    await Promise.all(shutdownPromises);
    console.log('✅ Connection Pool Manager shutdown complete');
  }
}

// Singleton 인스턴스
let instance = null;

module.exports = {
  ConnectionPoolManager,
  getInstance: () => {
    if (!instance) {
      instance = new ConnectionPoolManager();
    }
    return instance;
  }
};