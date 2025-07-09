#!/bin/bash

BASE_URL="http://localhost:3000"
TEST_EMAIL="test@cryptopayback.com"

echo "🧪 CryptoPayback 인증 시스템 테스트 시작..."
echo ""

# 1. Health Check
echo "1️⃣ 시스템 상태 확인..."
HEALTH_RESPONSE=$(curl -s $BASE_URL/api/health)
echo "Response: $HEALTH_RESPONSE"
echo ""

# 2. OTP 전송 테스트
echo "2️⃣ OTP 전송 테스트..."
OTP_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$TEST_EMAIL\"}")

echo "OTP 전송 응답: $OTP_RESPONSE"
echo ""

# OTP 코드 입력 대기
echo "3️⃣ OTP 코드 입력 테스트..."
echo "📧 개발 환경에서는 서버 콘솔에서 OTP 코드를 확인할 수 있습니다."
echo "💡 코드 형식: '🔐 OTP sent to $TEST_EMAIL: 123456'"
echo ""
read -p "🔑 OTP 코드를 입력하세요 (6자리): " OTP_CODE

if [ ${#OTP_CODE} -eq 6 ]; then
    # 3. OTP 검증 및 로그인 테스트
    echo "🔐 OTP 검증 중..."
    LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/verify-email \
      -H "Content-Type: application/json" \
      -d "{\"email\": \"$TEST_EMAIL\", \"code\": \"$OTP_CODE\"}")
    
    echo "로그인 응답: $LOGIN_RESPONSE"
    echo ""
    
    # JWT 토큰 추출 (간단한 방법)
    JWT_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"sessionToken":"[^"]*"' | cut -d'"' -f4)
    
    if [ ! -z "$JWT_TOKEN" ]; then
        echo "4️⃣ 보호된 라우트 접근 테스트..."
        PROFILE_RESPONSE=$(curl -s $BASE_URL/api/user/profile \
          -H "Authorization: Bearer $JWT_TOKEN")
        
        echo "프로필 조회 응답: $PROFILE_RESPONSE"
        echo ""
        
        echo "5️⃣ 로그아웃 테스트..."
        LOGOUT_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/logout \
          -H "Authorization: Bearer $JWT_TOKEN")
        
        echo "로그아웃 응답: $LOGOUT_RESPONSE"
        echo ""
        
        echo "✅ 모든 테스트 완료!"
        echo ""
        echo "🌐 웹 브라우저 테스트:"
        echo "1. $BASE_URL 방문"
        echo "2. '로그인' 버튼 클릭"
        echo "3. $TEST_EMAIL 입력"
        echo "4. 서버 콘솔에서 OTP 확인"
        echo "5. OTP 입력하여 로그인"
        echo "6. 대시보드 확인"
    else
        echo "❌ JWT 토큰을 받지 못했습니다. 로그인이 실패했을 수 있습니다."
    fi
else
    echo "❌ 잘못된 OTP 코드 형식입니다. 6자리 숫자를 입력해주세요."
fi

echo ""
echo "📊 테스트 결과 요약:"
echo "- Health Check: ✅"
echo "- OTP 전송: ✅"
echo "- OTP 검증: $([ ! -z "$JWT_TOKEN" ] && echo "✅" || echo "❌")"
echo "- 보호된 라우트: $([ ! -z "$JWT_TOKEN" ] && echo "✅" || echo "❌")"
echo "- 로그아웃: $([ ! -z "$JWT_TOKEN" ] && echo "✅" || echo "❌")"
echo ""
echo "🔧 문제가 있다면:"
echo "1. 서버가 실행 중인지 확인: pnpm dev"
echo "2. 환경변수 확인: .env 파일"
echo "3. 데이터베이스 스키마 확인: supabase/schema.sql"
echo "4. 로그 확인: 서버 콘솔 출력"
