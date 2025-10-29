#!/bin/bash
# Metro 개발 서버 시작 스크립트 (포트 충돌 자동 해결)

echo "🚀 React Native 개발 환경 시작 중..."
echo ""

# 포트 8081 확인 및 정리
echo "1️⃣ 포트 8081 확인 중..."
PORT_PID=$(lsof -ti:8081)
if [ ! -z "$PORT_PID" ]; then
    echo "   ⚠️  포트 8081이 이미 사용 중입니다 (PID: $PORT_PID)"
    PORT_INFO=$(lsof -i:8081 | grep LISTEN)
    echo "   $PORT_INFO"

    read -p "   종료하고 계속하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kill -9 $PORT_PID
        echo "   ✓ 포트 8081 정리 완료"
        sleep 1
    else
        echo "   ✗ 취소됨"
        exit 1
    fi
else
    echo "   ✓ 포트 8081 사용 가능"
fi
echo ""

# adb reverse 설정
echo "2️⃣ Android 포트 포워딩 설정 중..."
if command -v adb &> /dev/null; then
    adb reverse tcp:8081 tcp:8081 2>/dev/null && echo "   ✓ 포트 포워딩 완료" || echo "   ⚠️  기기가 연결되지 않음 (무시 가능)"
else
    echo "   ⚠️  adb를 찾을 수 없습니다"
fi
echo ""

# Metro 시작
echo "3️⃣ Metro 번들러 시작 중..."
echo "   (Ctrl+C를 눌러 중지)"
echo ""
echo "═══════════════════════════════════════════════════════"
echo ""

# Metro 실행
pnpm dev
