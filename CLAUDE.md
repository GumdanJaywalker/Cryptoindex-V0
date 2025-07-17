# CLAUDE.md - CryptoIndex 지갑 UI 개발 프로젝트

> 🚀 **현재 상태**: Phase 4 완료 - 네트워크 전환 기능 구현 완료  
> 🎯 **목표**: Hyperliquid 수준의 지갑 UI 시스템 구축  
> 📅 **마지막 업데이트**: 2025-07-15

이 파일은 Claude Code와 팀 멤버들이 이 프로젝트에서 작업할 때 필요한 모든 정보를 제공합니다.

## 🎯 프로젝트 개요
**CryptoIndex** - Hyperliquid 수준의 지갑 UI를 가진 익명 P2P 암호화폐 거래 플랫폼

### 현재 개발 단계
- ✅ **Phase 1-2**: 프로젝트 분석 및 환경 설정 완료
- ✅ **Phase 3**: 지갑 연결 버튼 고도화 (MagicUI 효과 포함) 완료
- ✅ **Phase 4**: 네트워크 선택기 & 실시간 체인 전환 완료
- 🔄 **Next**: Phase 5 (지갑 정보 드롭다운) 또는 Phase 6 (실시간 잔액 조회)

## 🛠️ 기술 스택
- **Frontend**: Next.js 15.2.4, React 19, TypeScript
- **패키지 매니저**: pnpm (중요: npm 대신 pnpm 사용할 것!)
- **인증**: Privy (이메일 OTP + 지갑 연결)
- **데이터베이스**: Supabase (완전 설정됨)
- **UI 라이브러리**: 
  - Radix UI + shadcn/ui (50+ 컴포넌트)
  - MagicUI (Ripple, BorderBeam 등)
  - Aceternity UI
- **스타일링**: TailwindCSS + 커스텀 애니메이션
- **Web3**: viem + Privy (5개 체인 지원)
- **알림**: react-hot-toast (Toast 알림 시스템)

## 🚀 개발 명령어 (중요: pnpm 사용!)

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (포트 3000, 사용 중이면 3001)
pnpm run dev

# 프로덕션 빌드
pnpm run build

# 프로덕션 서버 시작
pnpm start

# 린팅 (현재 설정 생략됨)
pnpm run lint
```

### 🔧 개발 환경 첫 설정
```bash
# 1. 저장소 클론 후
cd Cryptoindex-V0

# 2. 의존성 설치
pnpm install

# 3. 환경변수 설정 (.env.local 파일 생성)
# 아래 "환경변수 설정" 섹션 참조

# 4. 개발 서버 실행
pnpm run dev

# 5. 테스트 페이지 확인
# http://localhost:3001/test-wallet-button (지갑 버튼 테스트)
# http://localhost:3001/test-utils (유틸리티 함수 테스트)
# http://localhost:3001/test-network-display (네트워크 전환 테스트)
# http://localhost:3001/test-wallet-connection (지갑 연결 상태 테스트)
```

## 📁 프로젝트 구조 (최신 상태)

```
/app                          # Next.js App Router
  /api                        # API routes (완전 구현됨)
    /auth                     # 인증 엔드포인트
      /logout                 # 로그아웃 처리
      /sync-user              # Privy-Supabase 동기화
    /user                     # 사용자 관리
      /profile                # 프로필 CRUD
    /health                   # 헬스체크
  /dashboard                  # 보호된 대시보드
  /privy-login               # 로그인 페이지
  /test-wallet-button        # 🆕 지갑 버튼 테스트 페이지
  /test-utils                # 🆕 유틸리티 함수 테스트
  /test-network-display      # 🆕 네트워크 전환 테스트 페이지
  /test-wallet-connection    # 🆕 지갑 연결 상태 테스트
  /test-wallets              # 지갑 디버깅 페이지

/components
  /auth                      # 인증 컴포넌트
    PrivyAuth.tsx            # 메인 인증 UI
  /wallet                    # 🆕 지갑 UI 시스템 (Phase 4 완료)
    WalletConnectButton.tsx  # 고급 지갑 연결 버튼
    NetworkDisplay.tsx       # 🆕 네트워크 선택기 & 전환 기능
    /hooks                   # 🆕 커스텀 훅들
      useNetworkSwitch.ts    # 네트워크 전환 로직
    types.ts                 # TypeScript 타입 정의
    constants.ts             # 체인 정보 & 상수
    utils.ts                 # 주소 포맷팅, 클립보드 등
    index.ts                 # 통합 export
  /providers                 # Context providers
    PrivyProvider.tsx        # Privy 설정 + Toast 통합
    ToastProvider.tsx        # 🆕 Toast 알림 시스템
  /ui                        # shadcn/ui (50+ 컴포넌트)
  /magicui                   # MagicUI 효과들
    ripple.tsx               # 리플 효과
    border-beam.tsx          # 테두리 애니메이션
  /dialogs                   # 모달 컴포넌트들

/lib
  /auth                      # JWT 검증 (수정됨)
    privy-jwt.ts             # Privy JWT 처리 (오류 해결됨)
  /middleware                # 인증 미들웨어
  /privy                     # Privy 설정
  /supabase                  # DB 클라이언트

/supabase                    # 데이터베이스
  schema.sql                 # DB 스키마 정의
```

### 🎯 핵심 구현 완료 파일들
- `components/wallet/WalletConnectButton.tsx` - MagicUI 효과 포함 고급 버튼
- `components/wallet/NetworkDisplay.tsx` - 🆕 네트워크 선택기 & 실시간 전환
- `components/wallet/hooks/useNetworkSwitch.ts` - 🆕 네트워크 전환 로직
- `components/wallet/utils.ts` - 완전한 유틸리티 함수 세트
- `components/providers/ToastProvider.tsx` - 🆕 Toast 알림 시스템
- `lib/auth/privy-jwt.ts` - JWT 검증 (오류 해결됨)
- `tailwind.config.ts` - 커스텀 애니메이션 추가됨
- `next.config.mjs` - 🆕 React 19 호환성 & 청크 로딩 최적화

## 🔑 환경변수 설정

`.env.local` 파일을 프로젝트 루트에 생성:
```env
# Supabase (완전 설정됨)
NEXT_PUBLIC_SUPABASE_URL=https://xozgwidnikzhdiommtwk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Privy (업데이트된 설정)
NEXT_PUBLIC_PRIVY_APP_ID=cmcvc4ho5009rky0nfr3cgnms
PRIVY_APP_SECRET=2VZtF6sgVr7KLQNR2ovhTruzQvz1U7SbP1CXMPHxxqwUf1h3DMQ72XwcoS8JkvnMVZArrDmEdptuergWjcr7vdBZ
PRIVY_VERIFICATION_KEY=your_privy_verification_key_here

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### ⚠️ 중요 참고사항
- **PRIVY_JWKS_ENDPOINT**는 자동 생성됨 (설정 불필요)
- JWT 검증 오류가 해결되어 모든 Privy 기능 정상 작동
- Supabase 키는 실제 운영 환경에서는 보안 처리 필요

## 🔐 인증 플로우 (완전 작동)

### 1. 이메일 로그인
- 사용자 이메일 입력 → Privy OTP 발송
- 검증 완료 시 임베디드 지갑 자동 생성
- Supabase에 `privy_user_id`로 동기화

### 2. 지갑 로그인
- MetaMask/WalletConnect 직접 연결
- 임베디드 지갑 생성 안됨
- 지갑 주소로 Supabase 동기화

### 3. 지원되는 네트워크
- **Ethereum Mainnet** (체인 ID: 1)
- **Arbitrum One** (체인 ID: 42161)
- **Polygon** (체인 ID: 137)
- **Base** (체인 ID: 8453)
- **Optimism** (체인 ID: 10)

## 🌐 API 엔드포인트 (완전 구현)

- `POST /api/auth/sync-user` - Privy 사용자 Supabase 동기화
- `POST /api/auth/logout` - 사용자 로그아웃 처리
- `GET /api/user/profile` - 사용자 프로필 조회 (보호됨)
- `PUT /api/user/profile` - 사용자 프로필 업데이트 (보호됨)
- `GET /api/health` - 헬스체크

## 💎 지갑 UI 시스템 (Phase 4 완료)

### WalletConnectButton 컴포넌트
```typescript
import { WalletConnectButton } from '@/components/wallet';

// 기본 사용법
<WalletConnectButton />

// 커스터마이징
<WalletConnectButton 
  size="lg" 
  variant="default" 
  className="w-full" 
/>
```

### 상태별 시각적 효과
- **연결 전**: 파란색-보라색 그라디언트 + 리플 효과
- **연결 중**: 커스텀 shimmer 애니메이션 + 스피너
- **연결 후**: 회색 배경 + BorderBeam 애니메이션
- **오류 상태**: 빨간색 그라디언트

### 🆕 NetworkDisplay 컴포넌트 (Phase 4)
```typescript
import { NetworkDisplay } from '@/components/wallet';

// 기본 사용법
<NetworkDisplay />

// 콜백과 함께 사용
<NetworkDisplay 
  showStatusIndicator={true}
  size="lg"
  onNetworkChange={(chain) => console.log('Selected:', chain)}
/>
```

### 네트워크 전환 기능
- **지원 네트워크**: Ethereum, Arbitrum, Polygon, Base, Optimism
- **실시간 전환**: 드롭다운에서 네트워크 선택 시 즉시 전환
- **상태 표시**: 연결, 미연결, 미지원 체인 상태 표시
- **지갑 연결 유도**: 미연결 시 자동으로 지갑 연결 프로세스 실행

### 🆕 useNetworkSwitch 훅
```typescript
import { useNetworkSwitch } from '@/components/wallet';

const { switchNetwork, isLoading, error } = useNetworkSwitch();

// 네트워크 전환
await switchNetwork(SUPPORTED_CHAINS[1]); // Ethereum
```

### Toast 알림 시스템
- **성공**: "Network switched successfully"
- **로딩**: "Switching to Ethereum..."
- **오류**: "Failed to switch network: [상세 메시지]"
- **미연결**: "Please connect your wallet to switch networks"

### 유틸리티 함수들
```typescript
import { 
  formatAddress, 
  copyToClipboard, 
  validateAddress,
  formatBalance 
} from '@/components/wallet/utils';

// 주소 포맷팅
formatAddress('0x1234...', 6) // "0x123456...567890"

// 클립보드 복사
await copyToClipboard(address) // Promise<boolean>

// 주소 검증
validateAddress(address) // boolean

// 잔액 포맷팅
formatBalance('123.456', 2, 'ETH') // "123.46 ETH"
```

## 🗄️ 데이터베이스 스키마 (Supabase)

### Users 테이블
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  auth_type TEXT, -- 'email' or 'wallet'
  email TEXT,
  wallet_address TEXT,
  privy_user_id TEXT UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### User_wallets 테이블
```sql
CREATE TABLE user_wallets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  privy_user_id TEXT,
  embedded_wallet_address TEXT,
  encrypted_private_key TEXT,
  network_id INTEGER,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP
);
```

## 🧪 테스트 페이지들

### 1. 지갑 버튼 테스트
```
http://localhost:3001/test-wallet-button
```
- 모든 버튼 변형 테스트
- 실제 Privy 연결 테스트
- MagicUI 효과 확인

### 2. 유틸리티 함수 테스트
```
http://localhost:3001/test-utils
```
- 주소 포맷팅 테스트
- 클립보드 복사 테스트
- 주소 검증 테스트
- 잔액 포맷팅 테스트

### 3. 🆕 네트워크 전환 테스트
```
http://localhost:3001/test-network-display
```
- 네트워크 선택기 테스트
- 실시간 체인 전환 테스트
- Toast 알림 확인
- 로딩 상태 테스트

### 4. 🆕 지갑 연결 상태 테스트
```
http://localhost:3001/test-wallet-connection
```
- 지갑 연결 상태 실시간 모니터링
- 인증 플로우 테스트
- 에러 핸들링 테스트

### 5. 지갑 디버깅
```
http://localhost:3001/test-wallets
```
- 지갑 상태 분석
- Privy 연결 디버깅
- 데이터베이스 동기화 테스트

## Authentication Middleware

Protected routes use the Privy JWT verification middleware:
```typescript
// Usage in API routes
import { verifyPrivyAuth } from '@/lib/middleware/privy-auth';

export async function GET(request: Request) {
  const authResult = await verifyPrivyAuth(request);
  if (!authResult.isAuthenticated) {
    return authResult.response;
  }
  // Access authResult.user for authenticated user data
}
```

## Security Features

- **JWT Verification**: All protected routes verify Privy JWT tokens
- **Row Level Security**: Supabase RLS policies based on privy_user_id
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Admin Routes**: Special protection for admin endpoints
- **Development Mode**: Shortcuts available in development

## Common Development Tasks

### Add a New Protected API Route
1. Create route file in `/app/api/your-route/route.ts`
2. Import and use `verifyPrivyAuth` middleware
3. Access user data from `authResult.user`

### Update User Profile in Database
```typescript
const { data, error } = await supabase
  .from('users')
  .update({ field: value })
  .eq('privy_user_id', privyUserId);
```

### Work with Privy Client
```typescript
import { usePrivy } from '@privy-io/react-auth';

const { ready, authenticated, user, login, logout } = usePrivy();
```

## Important Notes

- **No Backend Directory**: Unlike initial plans, this uses Next.js API routes
- **No Testing Setup**: Tests need to be configured (Jest/Vitest recommended)
- **ESLint/TypeScript Errors Ignored**: Build warnings are suppressed in next.config.mjs
- **Privy Handles Complexity**: Wallet creation, encryption, and MFA are managed by Privy
- **Development Shortcuts**: In dev mode, you can use Bearer token "dev-token" to bypass auth

## Troubleshooting

1. **"Privy client not configured"**: Ensure all Privy env vars are set
2. **"User not found in database"**: User needs to be synced via /api/auth/sync-user
3. **CORS errors**: Check CORS configuration matches your domain
4. **Rate limit exceeded**: Wait or use different IP in development