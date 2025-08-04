import { Redis } from 'ioredis';

let redisClient: Redis | null = null;

/**
 * Redis 클라이언트 싱글톤 인스턴스
 */
export function getRedisClient(): Redis {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const redisPassword = process.env.REDIS_PASSWORD;
    
    redisClient = new Redis(redisUrl, {
      password: redisPassword,
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          // Redis가 읽기 전용 모드일 때 재연결
          return true;
        }
        return false;
      },
      // 성능 최적화 옵션
      enableReadyCheck: true,
      enableOfflineQueue: true,
      lazyConnect: false,
      
      // 연결 풀 설정
      connectionName: 'hyperindex-trading',
      
      // 타임아웃 설정
      connectTimeout: 10000,
      commandTimeout: 5000,
      
      // 로깅 (개발 환경에서만)
      showFriendlyErrorStack: process.env.NODE_ENV !== 'production'
    });

    // 연결 이벤트 핸들러
    redisClient.on('connect', () => {
      console.log('📡 Redis connected');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis ready');
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis error:', err);
    });

    redisClient.on('close', () => {
      console.log('🔌 Redis connection closed');
    });

    redisClient.on('reconnecting', (delay) => {
      console.log(`🔄 Redis reconnecting in ${delay}ms`);
    });
  }

  return redisClient;
}

/**
 * Redis 연결 해제
 */
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log('✅ Redis connection closed gracefully');
  }
}

/**
 * Redis 헬스 체크
 */
export async function checkRedisHealth(): Promise<boolean> {
  try {
    const client = getRedisClient();
    const result = await client.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
}

/**
 * Redis 연결 정보 가져오기
 */
export async function getRedisInfo(): Promise<{
  connected: boolean;
  memory: string;
  clients: number;
  uptime: number;
} | null> {
  try {
    const client = getRedisClient();
    const info = await client.info();
    
    // 정보 파싱
    const lines = info.split('\r\n');
    const data: Record<string, string> = {};
    
    lines.forEach(line => {
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split(':');
        if (key && value) {
          data[key] = value;
        }
      }
    });

    return {
      connected: true,
      memory: data['used_memory_human'] || '0',
      clients: parseInt(data['connected_clients'] || '0'),
      uptime: parseInt(data['uptime_in_seconds'] || '0')
    };
  } catch (error) {
    console.error('Failed to get Redis info:', error);
    return null;
  }
}

/**
 * Redis 키 패턴으로 삭제 (개발용)
 */
export async function deleteKeysByPattern(pattern: string): Promise<number> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Pattern deletion not allowed in production');
  }

  const client = getRedisClient();
  let deletedCount = 0;
  let cursor = '0';

  do {
    const [newCursor, keys] = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
    cursor = newCursor;

    if (keys.length > 0) {
      deletedCount += keys.length;
      await client.del(...keys);
    }
  } while (cursor !== '0');

  return deletedCount;
}

/**
 * Redis 전체 초기화 (테스트용)
 */
export async function flushRedis(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Flush not allowed in production');
  }

  const client = getRedisClient();
  await client.flushdb();
  console.log('⚠️ Redis database flushed');
}

// Legacy exports for compatibility (deprecated - use getRedisClient() instead)
export const redis = getRedisClient;
export const redisPubSub = getRedisClient;