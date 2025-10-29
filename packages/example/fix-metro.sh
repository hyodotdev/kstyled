#!/bin/bash
# Metro WebSocket 연결 문제 자동 수정 스크립트

echo "🔧 Metro WebSocket 연결 문제 해결 중..."
echo ""

# 1. adb reverse 포트 포워딩 설정
echo "1️⃣ Android 포트 포워딩 설정 중..."
adb reverse tcp:8081 tcp:8081
if [ $? -eq 0 ]; then
    echo "   ✓ 포트 포워딩 성공: localhost:8081"
else
    echo "   ✗ 포트 포워딩 실패 (기기가 연결되어 있는지 확인하세요)"
fi
echo ""

# 2. Metro 상태 확인
echo "2️⃣ Metro 번들러 상태 확인 중..."
METRO_STATUS=$(curl -s http://localhost:8081/status 2>/dev/null)
if [[ "$METRO_STATUS" == *"packager"*"running"* ]]; then
    echo "   ✓ Metro 번들러가 실행 중입니다"
else
    echo "   ⚠️  Metro 번들러가 실행되지 않았습니다"
    echo "   다음 명령어로 Metro를 시작하세요: pnpm --filter example dev"
fi
echo ""

# 3. 연결된 Android 기기/에뮬레이터 확인
echo "3️⃣ 연결된 Android 기기 확인 중..."
DEVICES=$(adb devices | grep -v "List" | grep "device$" | wc -l)
if [ "$DEVICES" -gt 0 ]; then
    echo "   ✓ $DEVICES 개의 기기가 연결되어 있습니다"
    adb devices | grep "device$"
else
    echo "   ✗ 연결된 기기가 없습니다"
    echo "   에뮬레이터를 시작하거나 USB로 기기를 연결하세요"
fi
echo ""

# 4. 추가 adb reverse 설정 (다른 포트들)
echo "4️⃣ 추가 개발 포트 설정 중..."
adb reverse tcp:8097 tcp:8097  # Expo Dev Client
adb reverse tcp:19000 tcp:19000  # Expo
adb reverse tcp:19001 tcp:19001  # Expo
if [ $? -eq 0 ]; then
    echo "   ✓ 추가 포트 설정 완료"
fi
echo ""

# 5. 앱 재시작 옵션 제공
echo "5️⃣ 다음 단계:"
echo "   - Android 앱을 재시작하세요"
echo "   - 또는 앱에서 개발자 메뉴(기기 흔들기)를 열고 'Reload'를 선택하세요"
echo ""

echo "✅ 문제 해결 완료!"
echo ""
echo "추가 도움말:"
echo "  - Metro 재시작: pnpm --filter example dev -- --reset-cache"
echo "  - 앱 재빌드: pnpm --filter example android"
echo "  - 로그 확인: adb logcat | grep -E 'ReactNative|Metro'"
