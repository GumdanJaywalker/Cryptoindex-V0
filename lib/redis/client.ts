import Redis from 'ioredis';

// Redis 클라이언트 설정
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || 'Qpdkfjb4749!',
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  lazyConnect: true,
  keepAlive: 30000,
  commandTimeout: 5000,
  connectTimeout: 10000,
};

// 메인 Redis 클라이언트 (읽기/쓰기)
export const redis = new Redis(redisConfig);

// Pub/Sub 전용 Redis 클라이언트
export const redisPubSub = new Redis({
  ...redisConfig,
  lazyConnect: false, // Pub/Sub는 즉시 연결
});

// Redis 연결 상태 모니터링
redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('ready', () => {
  console.log('🚀 Redis ready for commands');
});

redis.on('error', (error) => {
  console.error('❌ Redis connection error:', error);
});

redis.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});

redisPubSub.on('connect', () => {
  console.log('✅ Redis Pub/Sub connected successfully');
});

redisPubSub.on('error', (error) => {
  console.error('❌ Redis Pub/Sub error:', error);
});

// Redis 연결 헬스체크
export async function checkRedisHealth(): Promise<boolean> {
  try {
    const result = await redis.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
}

// Redis 연결 정리
export async function closeRedisConnections() {
  try {
    await redis.quit();
    await redisPubSub.quit();
    console.log('Redis connections closed successfully');
  } catch (error) {
    console.error('Error closing Redis connections:', error);
  }
}

// 프로세스 종료 시 Redis 연결 정리
process.on('SIGINT', closeRedisConnections);
process.on('SIGTERM', closeRedisConnections);

export default redis;