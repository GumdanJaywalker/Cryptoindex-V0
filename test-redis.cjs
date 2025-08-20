#!/usr/bin/env node

const Redis = require('ioredis');

async function testRedis() {
  console.log('🔄 Testing Redis connection...');
  
  const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || 'hyperindex_secure_password',
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true
  };

  console.log('🔧 Redis config:', { ...redisConfig, password: '***' });
  
  const redisClient = new Redis(redisConfig);
  
  try {
    console.log('🔍 Testing Redis ping...');
    const result = await redisClient.ping();
    console.log('✅ Redis connection established, ping result:', result);
    
    // 간단한 set/get 테스트
    await redisClient.set('test:connection', 'success');
    const value = await redisClient.get('test:connection');
    console.log('✅ Redis set/get test:', value);
    
    await redisClient.quit();
    console.log('✅ Redis connection closed');
    
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    console.error('❌ Error details:', error);
  }
}

testRedis();