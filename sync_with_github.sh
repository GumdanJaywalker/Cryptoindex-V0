#!/bin/bash

# Cryptoindex-V0 리포지토리와 동기화 스크립트
echo "=== Cryptoindex-V0 리포지토리와 동기화 시작 ==="

# 현재 디렉토리 확인
echo "현재 디렉토리: $(pwd)"

# 1. 원격 저장소에서 모든 브랜치 정보 가져오기
echo "1. 원격 저장소에서 브랜치 정보 가져오는 중..."
git fetch origin

if [ $? -ne 0 ]; then
    echo "ERROR: 원격 저장소에서 브랜치 정보를 가져오는데 실패했습니다."
    echo "리포지토리 URL이 올바른지 확인하고, 접근 권한이 있는지 확인해주세요."
    exit 1
fi

# 2. back_dev1 브랜치가 원격에 존재하는지 확인
echo "2. back_dev1 브랜치 확인 중..."
git ls-remote --heads origin back_dev1

if [ $? -ne 0 ]; then
    echo "WARNING: back_dev1 브랜치가 원격에 존재하지 않습니다."
    echo "새로 생성하시겠습니까? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "새로운 back_dev1 브랜치를 생성합니다..."
        git checkout -b back_dev1
    else
        echo "작업을 중단합니다."
        exit 1
    fi
else
    echo "back_dev1 브랜치가 원격에 존재합니다."
    # 3. back_dev1 브랜치로 체크아웃 (원격 브랜치 기반으로)
    echo "3. back_dev1 브랜치로 체크아웃..."
    git checkout -b back_dev1 origin/back_dev1 2>/dev/null || git checkout back_dev1
fi

# 4. 현재 상태 확인
echo "4. 현재 Git 상태 확인..."
git status

# 5. 모든 변경사항을 스테이징
echo "5. 모든 파일을 스테이징..."
git add .

# 6. 변경사항이 있는지 확인
if git diff --staged --quiet; then
    echo "커밋할 변경사항이 없습니다."
else
    # 7. 커밋
    echo "6. 변경사항 커밋..."
    echo "커밋 메시지를 입력하세요 (기본값: 'Merge local changes with back_dev1 branch'):"
    read -r commit_message
    if [ -z "$commit_message" ]; then
        commit_message="Merge local changes with back_dev1 branch"
    fi
    
    git commit -m "$commit_message"
    
    # 8. 원격 저장소에 푸시
    echo "7. 원격 저장소에 푸시..."
    git push origin back_dev1
    
    if [ $? -eq 0 ]; then
        echo "=== 성공적으로 완료되었습니다! ==="
        echo "변경사항이 back_dev1 브랜치에 푸시되었습니다."
    else
        echo "ERROR: 푸시에 실패했습니다."
        exit 1
    fi
fi

echo "=== 작업 완료 ==="
