#!/bin/bash

echo "🧹 CryptoPayback 프로젝트 정리 중..."
echo ""

# 불필요한 개발 파일들 제거
echo "📁 불필요한 파일 제거 중..."

# 이전 프로젝트 파일들
rm -f hyperliquid-header.tsx
rm -f hyperliquid-platform.tsx

# 개발 중 생성된 테스트/마이그레이션 파일들
rm -f check-database.js
rm -f check-tables.js
rm -f migrate-privy.js
rm -f test-after-migration.js
rm -f verify-setup.js
rm -f final-privy-migration.sql
rm -f migrate-to-privy.sql

# 불필요한 패키지 파일들
rm -f package-lock.json

# 시스템 파일들
rm -f .DS_Store
find . -name ".DS_Store" -delete

# 빈 디렉토리 정리
rmdir docs 2>/dev/null || true
rmdir src 2>/dev/null || true
rmdir hooks 2>/dev/null || true
rmdir styles 2>/dev/null || true
rmdir tests 2>/dev/null || true

echo "✅ 불필요한 파일 제거 완료"
echo ""

# .gitignore 업데이트
echo "📝 .gitignore 업데이트 중..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Next.js
.next/
out/
dist/

# Production
build/

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

# Mac system files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Temporary files
*.tmp
*.temp

# Database
*.db
*.sqlite

# Supabase
.branches
.temp/
EOF

echo "✅ .gitignore 업데이트 완료"
echo ""

# 현재 파일 구조 표시
echo "📂 정리 후 프로젝트 구조:"
echo "├── 📋 설정 파일"
echo "│   ├── .env (Privy + Supabase 설정)"
echo "│   ├── .gitignore"
echo "│   ├── package.json"
echo "│   ├── next.config.mjs"
echo "│   ├── tailwind.config.ts"
echo "│   └── tsconfig.json"
echo "├── 🚀 실행 스크립트"
echo "│   ├── setup.sh (전체 설정 및 서버 실행)"
echo "│   ├── final-test.sh (종합 테스트)"
echo "│   ├── test-system.sh (기본 테스트)"
echo "│   ├── run-test.sh (테스트 선택 메뉴)"
echo "│   └── start.sh (권한 설정)"
echo "├── 🌐 애플리케이션"
echo "│   ├── app/ (Next.js 앱)"
echo "│   ├── components/ (UI 컴포넌트)"
echo "│   ├── lib/ (비즈니스 로직)"
echo "│   ├── middleware.ts (보안 미들웨어)"
echo "│   └── supabase/ (DB 스키마)"
echo "└── 📖 문서"
echo "    └── README.md (Privy 통합 가이드)"
echo ""

# 최종 파일 개수 확인
TOTAL_FILES=$(find . -type f -not -path './node_modules/*' -not -path './.git/*' | wc -l)
echo "📊 정리 후 총 파일 개수: $TOTAL_FILES"
echo ""

echo "✅ 프로젝트 정리 완료!"
echo "🚀 GitHub 업로드 준비 완료!"
