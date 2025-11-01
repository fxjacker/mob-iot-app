// BLE 감지 훅 - Expo Go에서는 Mock 데이터, 실제 빌드 시 BLE 작동
import { useEffect } from "react";
import { Platform } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import { useTrafficStore } from "../store/useTrafficStore";

export default function useBleListener() {
    const addEvent = useTrafficStore((s) => s.addEvent);

    useEffect(() => {
        // 개발 중(Expo Go, Web, iOS 시뮬레이터)에서는 BLE 사용 불가 → Mock 데이터로 대체
        if (Platform.OS === "web" || __DEV__) {
            console.log("BLE 비활성화 상태 (개발 중 환경). Mock 데이터 사용 중...");

            const interval = setInterval(() => {
                const mockEvents = [
                    {
                        type: "사고",
                        description: "Mock BLE 감지: 강남대로 교통 사고",
                        locationText: "강남대로 역삼역 인근",
                        latitude: 37.5002,
                        longitude: 127.0365,
                        source: "ble" as const,
                    },
                    {
                        type: "공사",
                        description: "Mock BLE 감지: 도로 공사 중",
                        locationText: "서울역 사거리",
                        latitude: 37.5547,
                        longitude: 126.9708,
                        source: "ble" as const,
                    },
                ];

                const random = mockEvents[Math.floor(Math.random() * mockEvents.length)];
                addEvent(random);
                console.log("Mock BLE 이벤트 추가됨:", random);
            }, 10000); // 10초마다 Mock 이벤트 추가

            return () => clearInterval(interval);
        }

        // 실제 빌드 환경일 때만 BLE 작동
        const manager = new BleManager();

        const startScan = () => {
            manager.startDeviceScan(null, null, (error, device: Device | null) => {
                if (error) {
                    console.log("BLE 스캔 오류:", error);
                    return;
                }

                if (device?.name === "MOBIOT_BEACON") {
                    addEvent({
                        type: "사고",
                        description: "BLE 신호 감지: 강남대로 다중 추돌",
                        locationText: "강남대로 역삼역 인근",
                        latitude: 37.5001,
                        longitude: 127.0364,
                        source: "ble",
                    });
                }
            });
        };

        const subscription = manager.onStateChange((state) => {
            if (state === "PoweredOn") {
                console.log("BLE 전원 ON → 스캔 시작");
                startScan();
                subscription.remove();
            }
        }, true);

        return () => {
            console.log("BLE 스캔 종료");
            manager.stopDeviceScan();
            manager.destroy();
        };
    }, [addEvent]);
}