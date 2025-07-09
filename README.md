# CryptoIndex - Privy 통합 인증 시스템 ✅

**완전한 Privy 기반 P2P 거래소 백엔드 인증 시스템**

## 🎯 **시스템 상태**

| 구성요소 | 상태 | 설명 |
|----------|------|------|
| **🔗 Supabase 연결** | ✅ 완료 | xozgwidnikzhdiommtwk.supabase.co |
| **🔐 RLS 정책** | ✅ 완료 | 15개 Privy 기반 정책 |
| **🔧 Privy 함수** | ✅ 완료 | `get_privy_user_id()` 활성 |
| **📋 데이터베이스** | ✅ 완료 | 5개 테이블, 깔끔한 상태 |
| **🛡 보안 미들웨어** | ✅ 완료 | Privy JWT + Rate Limiting |

## 🚀 **주요 기능**

### ✅ **완료된 기능**
- **🔐 Privy 기반 인증**: JWT 토큰 검증 및 사용자 식별
- **📧 이메일 OTP**: 6자리 코드, 15분 만료
- **🛡 RLS + Middleware**: 이중 보안 방어체계
- **🎫 세션 관리**: JWT 토큰 + 데이터베이스 세션
- **📊 Rate Limiting**: IP별 1000회/15분, 이메일 3회/5분
- **🧹 자동 정리**: 만료된 코드/세션 자동 삭제

### 🔄 **Dev 2 통합 준비완료**
- 지갑 연결 API 구조
- 2FA 시스템 베이스
- 다중 인증 방식 지원

## 📊 **데이터베이스 구조**

### 핵심 테이블
```sql
📧 users              - Privy 사용자 (이메일/지갑)
🔐 email_verification_codes - OTP 코드 관리  
🎫 user_sessions      - JWT 세션 토큰
💳 user_wallets       - 사용자 지갑 연결
🔒 user_2fa          - 2단계 인증 (Dev 2)
```

### 핵심 함수
```sql
🔧 get_privy_user_id()           - Privy JWT에서 사용자 ID 추출
🧹 cleanup_expired_verification_codes() - 만료 코드 정리
🧹 cleanup_expired_sessions()    - 만료 세션 정리
```

## 🔧 **설치 및 설정**

### 1. 빠른 시작
```bash
# 전체 설정 및 서버 실행
./setup.sh

# 또는 수동 실행
chmod +x start.sh
./start.sh
```

### 2. Privy 설정 (필수)
```bash
# .env 파일에서 Privy 정보 설정
PRIVY_APP_ID=your_privy_app_id_here
PRIVY_APP_SECRET=your_privy_app_secret_here
PRIVY_VERIFICATION_KEY=your_privy_verification_key_here
```

### 3. 환경변수 설정 완료
```bash
# Supabase (이미 설정됨)
SUPABASE_URL=https://xozgwidnikzhdiommtwk.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT 설정
JWT_SECRET=crypto_payback_super_secret_jwt_key_2024_dev

# 이메일 서비스
EMAIL_FROM=noreply@cryptopayback.com
# RESEND_API_KEY=your_resend_api_key (선택사항)

# 관리자
ADMIN_EMAILS=admin@cryptopayback.com
```

## 🧪 **테스트 방법**

### 자동 테스트
```bash
# 전체 시스템 테스트
./test-system.sh
```

### 수동 테스트
```bash
# 1. 시스템 상태 확인
curl http://localhost:3000/api/health

# 2. OTP 전송
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# 3. 개발환경에서 콘솔에서 OTP 확인
# 🔐 OTP sent to test@example.com: 123456

# 4. OTP 검증 및 로그인
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "code": "123456"}'
```

### 웹 브라우저 테스트
1. **http://localhost:3000** 방문
2. "로그인" 클릭
3. 이메일 입력
4. **서버 콘솔에서 OTP 확인**
5. OTP 입력하여 로그인
6. 대시보드 확인

## 📋 **API 엔드포인트**

### 인증 API
| 메서드 | 엔드포인트 | 설명 | Rate Limit |
|--------|------------|------|------------|
| `POST` | `/api/auth/send-otp` | OTP 전송 | 5회/5분 |
| `POST` | `/api/auth/verify-email` | 이메일 인증 & 로그인 | 10회/5분 |
| `POST` | `/api/auth/logout` | 로그아웃 | - |

### 사용자 API
| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|------------|------|------|
| `GET` | `/api/user/profile` | 사용자 프로필 조회 | ✅ |
| `PUT` | `/api/user/profile` | 사용자 프로필 업데이트 | ✅ |

### 시스템 API
| 메서드 | 엔드포인트 | 설명 |
|--------|------------|------|
| `GET` | `/api/health` | 시스템 상태 확인 |

## 🛡 **보안 특징**

### Privy 기반 인증
- **JWT 검증**: Privy에서 발급한 토큰만 허용
- **사용자 식별**: `privy_user_id` 기반 RLS
- **자동 만료**: 토큰 만료시 자동 로그아웃

### 이중 보안 방어
- **Middleware**: 요청 단계에서 1차 검증
- **RLS**: 데이터베이스 행별 2차 검증

### Rate Limiting
- **IP별**: 15분간 1000회
- **이메일 전송**: 5분간 3회
- **OTP 검증**: 5분간 10회

## 🔧 **문제 해결**

### 일반적인 이슈

**1. Privy 토큰 오류**
```bash
# Privy 설정 확인
echo $PRIVY_APP_ID
echo $PRIVY_APP_SECRET
```

**2. 데이터베이스 연결 실패**
```bash
# Supabase 연결 테스트
curl http://localhost:3000/api/health
```

**3. OTP 수신 안됨**
```bash
# 개발환경에서는 서버 콘솔 확인
LOG_LEVEL=debug pnpm dev
# 🔐 OTP sent to email: 123456
```

**4. RLS 정책 오류**
```sql
-- Supabase SQL Editor에서 확인
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### 로그 확인
```bash
# 상세 로그
LOG_LEVEL=debug pnpm dev

# 에러만 확인
LOG_LEVEL=error pnpm dev
```

## 🔄 **Dev 2 통합 가이드**

### 준비된 인터페이스
```typescript
// 지갑 연결 준비
interface WalletAuthUser {
  privyUserId: string
  walletAddress: string
  walletType: 'metamask' | 'phantom' | 'keplr' | 'coinbase' | 'okx'
}

// 2FA 시스템 준비
interface User2FA {
  userId: string
  secretKey: string
  backupCodes: string[]
  enabled: boolean
}
```

### 통합 체크리스트
- [ ] Privy SDK 설정
- [ ] 지갑 서명 검증
- [ ] 2FA TOTP 구현
- [ ] 다중 지갑 지원
- [ ] 통합 테스트

## 📞 **지원 및 문서**

- **Privy 문서**: https://docs.privy.io
- **Supabase 문서**: https://supabase.com/docs
- **프로젝트 이슈**: GitHub Issues

## 🎉 **완성 현황**

| 기능 | Dev 1 | Dev 2 | 상태 |
|------|-------|-------|------|
| **📧 이메일 OTP** | ✅ | - | 완료 |
| **🔐 RLS 보안** | ✅ | - | 완료 |
| **🛡 미들웨어** | ✅ | - | 완료 |
| **👤 사용자 관리** | ✅ | - | 완료 |
| **💳 지갑 연결** | 🔧 | 🔄 | 준비됨 |
| **🔒 2FA 시스템** | 🔧 | 🔄 | 준비됨 |

---

**🚀 안전하고 확장 가능한 P2P 거래소 인증 시스템이 완성되었습니다!**

*Created by Dev 1 Team - Privy 통합 완료*
