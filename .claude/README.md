# 🤖 Claude Code Agents 사용 가이드

## 📋 Available Agents

### 1. doc-updater.md

**용도**: 프로젝트 문서 자동 업데이트
**실행**:

```bash
# Claude Code에서
cat .claude/agents/doc-updater.md
# 내용 복사해서 실행
```

**주기**: 주요 변경사항 있을 때마다 (주 1회 권장)

---

### 2. component-analyzer.md

**용도**: 컴포넌트 의존성/구조 분석
**실행**:

```
component-analyzer.md를 읽고, /components/trading/TradingPanel.tsx를 분석해주세요
```

**사용 시점**: 리팩토링 전, 버그 수정 전

---

### 3. migration-helper.md

**용도**: 프로젝트 간 컴포넌트 이식
**실행**:

```
migration-helper.md를 읽고,
HLH_hack의 /src/components/ConfirmLaunchModal.tsx를
Cryptoindex-V0의 /components/launch/로 이식해주세요
```

**사용 시점**: 다른 프로젝트 코드 가져올 때

---

## 🎯 Quick Start

1. **첫 실행**: doc-updater로 문서 동기화
2. **개발 중**: component-analyzer로 분석
3. **이식 시**: migration-helper로 자동화

## 💡 Tips

- Agent는 재사용 가능한 프롬프트 템플릿
- 필요에 따라 수정해서 사용
- 새로운 agent를 만들고 싶으면 기존 것을 복사해서 수정
