#!/bin/bash

# Privy 관련 패키지
pnpm add @privy-io/react-auth @privy-io/server-auth

# Supabase 클라이언트
pnpm add @supabase/supabase-js

# 인증 및 보안 관련
pnpm add jose jsonwebtoken bcryptjs
pnpm add @types/jsonwebtoken @types/bcryptjs --save-dev

# 이메일 전송
pnpm add resend

# 유틸리티
pnpm add crypto-js nanoid

echo "✅ 패키지 설치 완료!"
