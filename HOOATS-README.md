# 🚀 HOOATS Standalone API Server

Next.js 빌드 문제를 우회하여 실제 HOOATS (HyperIndex Optimized Automated Trading System)를 테스트하기 위한 독립 API 서버입니다.

## 📋 개요

- **목적**: Next.js 빌드 실패 문제 우회 후 HOOATS 시스템 테스트
- **방식**: 실제 lib 모듈들을 직접 사용하는 Express.js 서버
- **환경**: Docker 기반 격리된 환경
- **테스트**: 기존 `test-hooats-existing.js` 스크립트 사용

## 🏗️ 아키텍처

```
Docker Container
├── Redis (오더북 데이터)
├── HOOATS API Server (Express.js)
│   ├── HybridSmartRouterV2 (실제 모듈)
│   ├── ParallelMatchingEngine (실제 모듈) 
│   ├── UltraPerformanceOrderbook (실제 모듈)
│   └── AsyncDBWriter (실제 모듈)
└── PostgreSQL (Supabase - 외부)
```

## 🚀 빠른 시작

### 1. HOOATS 서버 시작
```bash
# Docker 환경에서 HOOATS 시작
npm run hooats:start

# 로그 확인
npm run hooats:logs
```

### 2. 헬스체크 확인
```bash
curl http://localhost:3000/api/health
```

### 3. HOOATS 테스트 실행
```bash
# 기존 테스트 스크립트 실행 (API 서버 대상)
npm run hooats:test
```

## 📡 API 엔드포인트

### 인증
모든 보호된 엔드포인트는 `Authorization: Bearer dev-token` 헤더가 필요합니다.

### 엔드포인트 목록

#### `GET /api/health`
시스템 헬스체크
```json
{
  "status": "healthy",
  "timestamp": "2025-08-19T...",
  "services": {
    "redis": { "status": "connected" },
    "orderbook": { "status": "active", "tps": 0 }
  }
}
```

#### `POST /api/trading/v2/orders` 🔑
V2 하이브리드 주문 처리 (실제 HybridSmartRouterV2 사용)
```bash
curl -X POST http://localhost:3000/api/trading/v2/orders \
  -H "Authorization: Bearer dev-token" \
  -H "Content-Type: application/json" \
  -d '{
    "pair": "HYPERINDEX-USDC",
    "side": "buy",
    "type": "market",
    "amount": "1000"
  }'
```

#### `GET /api/trading/v1/orderbook`
실제 오더북 조회 (ParallelMatchingEngine 사용)
```bash
curl "http://localhost:3000/api/trading/v1/orderbook?pair=HYPERINDEX-USDC&depth=20"
```

#### `GET /api/trading/v1/market` 🔑
시장 데이터 조회
```bash
curl -H "Authorization: Bearer dev-token" \
  "http://localhost:3000/api/trading/v1/market?pair=HYPERINDEX-USDC"
```

#### `GET /api/redis/status` 🔑
Redis 및 ParallelMatchingEngine 상태
```bash
curl -H "Authorization: Bearer dev-token" \
  http://localhost:3000/api/redis/status
```

## 🧪 테스트 시나리오

### 1. 기본 HOOATS 테스트
```bash
# 전체 HOOATS 시스템 테스트 (기존 스크립트)
npm run hooats:test
```

### 2. 개별 API 테스트
```bash
# 헬스체크
curl http://localhost:3000/api/health

# 오더북 조회
curl "http://localhost:3000/api/trading/v1/orderbook?pair=HYPERINDEX-USDC"

# 시장 주문 생성
curl -X POST http://localhost:3000/api/trading/v2/orders \
  -H "Authorization: Bearer dev-token" \
  -H "Content-Type: application/json" \
  -d '{"pair":"HYPERINDEX-USDC","side":"buy","type":"market","amount":"100"}'
```

### 3. 성능 테스트
```bash
# 연속 주문 테스트 (간단한 부하 테스트)
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/trading/v2/orders \
    -H "Authorization: Bearer dev-token" \
    -H "Content-Type: application/json" \
    -d "{\"pair\":\"HYPERINDEX-USDC\",\"side\":\"buy\",\"type\":\"market\",\"amount\":\"10\"}"
done
```

## 🐳 Docker 명령어

### 기본 운영
```bash
# 서비스 시작 (Redis + HOOATS API)
npm run hooats:start

# 서비스 중지
npm run hooats:stop

# 서비스 재시작
npm run hooats:restart

# 로그 확인 (실시간)
npm run hooats:logs

# Redis Commander 포함 시작 (GUI 도구)
docker-compose -f docker-compose.hooats.yml --profile tools up -d
```

### 개발/디버깅
```bash
# 로컬에서 직접 실행 (Docker 없이)
npm run hooats:dev

# 컨테이너 내부 접속
docker exec -it hyperindex-hooats-api sh

# Redis CLI 접속
docker exec -it hyperindex-redis redis-cli -a hyperindex_secure_password
```

## 🔧 설정

### 환경 변수
HOOATS 서버는 다음 환경 변수들을 사용합니다:

#### Redis 설정
- `REDIS_HOST=redis` (Docker 내부)
- `REDIS_PORT=6379`
- `REDIS_PASSWORD=hyperindex_secure_password`

#### Supabase 설정
- `NEXT_PUBLIC_SUPABASE_URL=https://xozgwidnikzhdiommtwk.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY=...`

#### HyperEVM 설정
- `HYPERVM_TESTNET_RPC=https://rpc.hyperliquid-testnet.xyz/evm`
- `NEXT_PUBLIC_CHAIN_ID=998`

#### 컨트랙트 주소
- `NEXT_PUBLIC_ROUTER_ADDRESS=0xD70399962f491c4d38f4ACf7E6a9345B0B9a3A7A`
- `NEXT_PUBLIC_HYPERINDEX_ADDRESS=0x6065Ab1ec8334ab6099aF27aF145411902EAef40`
- `NEXT_PUBLIC_USDC_ADDRESS=0x53aE8e677f34BC709148085381Ce2D4b6ceA1Fc3`
- 기타...

## 📊 모니터링

### 헬스체크
```bash
# 시스템 상태 확인
curl http://localhost:3000/api/health

# Redis 상태 확인
curl -H "Authorization: Bearer dev-token" \
  http://localhost:3000/api/redis/status
```

### Redis 모니터링
```bash
# Redis Commander 접속 (웹 GUI)
open http://localhost:8081

# Redis CLI로 직접 확인
docker exec -it hyperindex-redis redis-cli -a hyperindex_secure_password
> INFO
> DBSIZE
> KEYS orderbook:*
```

### 로그 확인
```bash
# HOOATS API 로그
docker logs hyperindex-hooats-api -f

# Redis 로그
docker logs hyperindex-redis -f

# 모든 서비스 로그
npm run hooats:logs
```

## 🎯 성능 목표

### TPS 목표
- **목표**: 15,000-20,000 TPS
- **현재**: 13,000+ TPS 달성
- **측정**: UltraPerformanceOrderbook 메트릭

### 레이턴시 목표
- **P50**: < 10ms
- **P95**: < 50ms
- **P99**: < 100ms

## 🐛 트러블슈팅

### 일반적인 문제들

#### 1. Redis 연결 실패
```bash
# Redis 컨테이너 확인
docker ps | grep redis
docker logs hyperindex-redis

# Redis 재시작
docker restart hyperindex-redis
```

#### 2. 모듈 로딩 실패
```bash
# TypeScript 컴파일 확인
npx tsc --build --force

# 의존성 재설치
npm run hooats:stop
docker-compose -f docker-compose.hooats.yml build --no-cache
npm run hooats:start
```

#### 3. API 응답 없음
```bash
# 헬스체크
curl http://localhost:3000/api/health

# 컨테이너 상태 확인
docker ps
docker logs hyperindex-hooats-api
```

### 디버깅 팁
1. **로그 먼저 확인**: `npm run hooats:logs`
2. **헬스체크 실행**: `curl http://localhost:3000/api/health`
3. **Redis 상태 확인**: Redis Commander 또는 CLI 사용
4. **컨테이너 재시작**: `npm run hooats:restart`

## 📝 개발 노트

### 핵심 차이점
- **기존**: Next.js 빌드 → 실패
- **현재**: Express.js 직접 실행 → 성공
- **모듈**: 실제 HOOATS lib 사용 (Mock 아님)
- **데이터**: 실제 Redis + Supabase 연결

### 제한사항
- 프론트엔드 UI 없음 (API만 제공)
- 인증은 개발용 토큰만 지원
- Rate limiting 비활성화

### 향후 계획
1. Next.js 빌드 문제 근본 해결
2. 프로덕션용 인증 시스템 연결
3. 모니터링 시스템 구축
4. 성능 최적화 (20K TPS 달성)

---

## 🎉 시작하기

```bash
# 1. HOOATS 서버 시작
npm run hooats:start

# 2. 헬스체크 확인
curl http://localhost:3000/api/health

# 3. 기존 테스트 실행
npm run hooats:test

# 4. 결과 확인
npm run hooats:logs
```

**이제 실제 HOOATS 시스템을 테스트할 수 있습니다!** 🚀