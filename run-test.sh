#!/bin/bash

echo "🚀 CryptoPayback 시스템 시작 중..."
echo ""

# 권한 설정
chmod +x final-test.sh
chmod +x test-system.sh
chmod +x setup.sh

# 환경변수 확인
echo "🔧 환경변수 확인:"
echo "  ├─ PRIVY_APP_ID: ${PRIVY_APP_ID:-'❌ 설정 필요'}"
echo "  ├─ SUPABASE_URL: ${SUPABASE_URL:-'❌ 설정 필요'}" 
echo "  └─ JWT_SECRET: ${JWT_SECRET:-'❌ 설정 필요'}"
echo ""

# 패키지 설치 확인
if [ ! -d "node_modules" ]; then
    echo "📦 패키지 설치 중..."
    pnpm install
else
    echo "✅ 패키지 이미 설치됨"
fi
echo ""

echo "🎯 다음 중 하나를 선택하세요:"
echo "  1. 전체 시스템 테스트 실행 (./final-test.sh)"
echo "  2. 개발 서버 시작 (pnpm dev)"
echo "  3. 웹 브라우저 테스트 가이드"
echo ""

read -p "선택 (1-3): " choice

case $choice in
    1)
        echo "🧪 전체 시스템 테스트 실행..."
        ./final-test.sh
        ;;
    2)
        echo "🌐 개발 서버 시작..."
        echo "  ├─ URL: http://localhost:3000"
        echo "  ├─ 로그인: http://localhost:3000/login"
        echo "  └─ Health: http://localhost:3000/api/health"
        echo ""
        pnpm dev
        ;;
    3)
        echo "🌐 웹 브라우저 테스트 가이드:"
        echo ""
        echo "1️⃣ 개발 서버 시작:"
        echo "   pnpm dev"
        echo ""
        echo "2️⃣ 브라우저에서 테스트:"
        echo "   ├─ http://localhost:3000 방문"
        echo "   ├─ '로그인' 버튼 클릭"
        echo "   ├─ 이메일 입력 (예: test@cryptopayback.com)"
        echo "   ├─ 서버 콘솔에서 OTP 코드 확인"
        echo "   │   🔐 OTP sent to email: XXXXXX"
        echo "   ├─ OTP 코드 입력"
        echo "   └─ 대시보드 페이지 확인"
        echo ""
        echo "3️⃣ API 직접 테스트:"
        echo "   curl http://localhost:3000/api/health"
        echo ""
        ;;
    *)
        echo "❌ 잘못된 선택입니다."
        ;;
esac
