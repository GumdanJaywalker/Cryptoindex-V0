#!/bin/bash

echo "🚀 CryptoPayback 백엔드 인증 시스템 설정 중..."

# 패키지 설치
echo "📦 패키지 설치 중..."
pnpm install

# 권한 설정
echo "🔒 스크립트 권한 설정 중..."
chmod +x install-packages.sh
chmod +x test-system.sh

# 개발 서버 실행
echo "🌟 개발 서버 시작 중..."
echo ""
echo "✅ 설정 완료!"
echo ""
echo "📋 다음 단계:"
echo "1. Supabase 대시보드에서 supabase/schema.sql 실행"
echo "2. 환경변수 확인 (.env 파일)"
echo "3. pnpm dev 실행하여 개발 서버 시작"
echo "4. http://localhost:3000 에서 테스트"
echo ""
echo "🧪 시스템 테스트: ./test-system.sh"
echo "📖 문서: README.md 참조"
echo ""

pnpm dev
