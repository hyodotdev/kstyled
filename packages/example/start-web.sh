#!/bin/bash
# Web 브라우저 열기 스크립트 (기존 Metro 사용)

echo "🌐 Web 브라우저 열기..."
echo ""

# Metro 서버 확인
echo "1️⃣ Metro 번들러 확인 중..."
METRO_STATUS=$(curl -s http://localhost:8081/status 2>/dev/null)

if [[ "$METRO_STATUS" == *"packager"*"running"* ]]; then
    echo "   ✓ Metro가 실행 중입니다 (포트 8081)"
    echo ""

    echo "2️⃣ 웹 브라우저 열기..."
    open "http://localhost:8081"

    echo ""
    echo "✅ 웹 브라우저가 열렸습니다!"
    echo "   URL: http://localhost:8081"
    echo ""
    echo "💡 팁:"
    echo "   - Metro가 계속 실행 중이어야 합니다"
    echo "   - Hot Reload가 Android/iOS와 함께 작동합니다"
    echo "   - 브라우저 개발자 도구(F12)로 디버깅 가능"
else
    echo "   ✗ Metro가 실행되지 않았습니다"
    echo ""
    echo "❌ Metro를 먼저 시작해주세요:"
    echo "   pnpm --filter example dev"
    echo ""
    echo "또는 VSCode에서:"
    echo "   1. Cmd+Shift+D"
    echo "   2. 'Run Android' 또는 'Run iOS' 실행"
    echo "   3. Metro가 시작되면 'Run Web' 실행"
    exit 1
fi
