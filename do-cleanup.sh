#!/bin/bash

# 실행 권한 부여
chmod +x cleanup.sh

# 정리 실행
./cleanup.sh

echo ""
echo "🎯 다음 단계를 진행하세요:"
echo ""
echo "1️⃣ 시스템 테스트:"
echo "   chmod +x run-test.sh"
echo "   ./run-test.sh"
echo ""
echo "2️⃣ GitHub 업로드:"
echo "   git add ."
echo "   git commit -m \"✅ Privy 통합 완료 - 이메일 OTP 인증 시스템\""
echo "   git push origin back_dev1"
echo ""
echo "3️⃣ 최종 확인:"
echo "   - README.md 문서 검토"
echo "   - 환경변수 설정 확인 (.env)"
echo "   - 테스트 결과 검증"
echo ""
